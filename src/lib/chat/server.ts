import { events } from '../../data/events';
import { resources } from '../../data/resources';
import type { CareerEvent, Resource } from '../../types';
import type {
  ChatFailure,
  ChatMessage,
  ChatProfile,
  ChatSource,
  ChatSuccess,
} from './types';

export interface ChatOptions {
  apiKey?: string;
  model?: string;
  fetchFn?: typeof fetch;
  clientId?: string;
  now?: number;
}

export interface ChatResult {
  status: number;
  body: ChatSuccess | ChatFailure;
}

export interface ChatContext {
  resources: Resource[];
  events: CareerEvent[];
}

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/nemotron-3.5-lightning-30b-a3b';
const MAX_MESSAGES = 10;
const MAX_CONTENT = 800;
const MAX_ASSISTANT_CONTENT = 3000;
const MAX_INTERESTS = 8;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 25_000;

const UPSTREAM_ERROR = 'The assistant could not answer right now. Please try again.';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our',
  'out', 'has', 'him', 'his', 'how', 'its', 'who', 'did', 'get', 'may', 'new', 'now', 'see',
  'way', 'what', 'when', 'where', 'which', 'with', 'would', 'about', 'any', 'does', 'have',
  'that', 'this', 'there', 'their', 'they', 'them', 'then', 'than', 'from', 'into', 'some',
  'tell', 'give', 'want', 'need', 'looking', 'find', 'help', 'should', 'could', 'like', 'just',
  'me', 'please', 'know', 'more', 'much', 'many', 'your', 'i', 'am', 'is',
]);

const BRAVEN_TRIGGERS = ['braven', 'coach', 'mentor', 'contact', 'staff'];

const requestLog = new Map<string, number[]>();

export function resetRateLimits(): void {
  requestLog.clear();
}

function isRateLimited(clientId: string, now: number): boolean {
  const recent = (requestLog.get(clientId) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    requestLog.set(clientId, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(clientId, recent);
  return false;
}

function fail(status: number, error: string): ChatResult {
  return { status, body: { error } };
}

interface ValidInput {
  messages: ChatMessage[];
  profile?: ChatProfile;
}

function parseProfile(raw: unknown): ChatProfile | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const { major, interests, year, goal } = raw as Record<string, unknown>;
  const text = (value: unknown): string | null =>
    typeof value === 'string' && value.trim() ? value.trim().slice(0, 100) : null;
  const list = Array.isArray(interests)
    ? interests
        .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
        .map((item) => item.trim().slice(0, 100))
        .slice(0, MAX_INTERESTS)
    : [];
  return { major: text(major), interests: list, year: text(year), goal: text(goal) };
}

function validate(input: unknown): ValidInput | ChatFailure {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Please send a question.' };
  }
  const { messages, profile } = input as Record<string, unknown>;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    return { error: `Please send between 1 and ${MAX_MESSAGES} messages.` };
  }
  const cleaned: ChatMessage[] = [];
  for (const item of messages) {
    if (typeof item !== 'object' || item === null) return { error: 'Each message must be an object.' };
    const { role, content } = item as Record<string, unknown>;
    if (role !== 'user' && role !== 'assistant') return { error: 'Each message needs a valid role.' };
    if (typeof content !== 'string' || content.trim() === '') {
      return { error: 'Messages cannot be empty.' };
    }
    const trimmed = content.trim();
    if (role === 'user' && trimmed.length > MAX_CONTENT) {
      return { error: `Messages must be ${MAX_CONTENT} characters or fewer.` };
    }
    // Earlier answers can be long; bound the history instead of rejecting the follow-up.
    cleaned.push({ role, content: role === 'assistant' ? trimmed.slice(0, MAX_ASSISTANT_CONTENT) : trimmed });
  }
  if (cleaned[cleaned.length - 1].role !== 'user') {
    return { error: 'The last message must be from you.' };
  }
  return { messages: cleaned, profile: parseProfile(profile) };
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (word) => word.length >= 3 && !STOPWORDS.has(word),
  );
}

function countMatches(tokens: string[], text: string): number {
  const haystack = new Set(tokenize(text));
  return tokens.filter((token) => haystack.has(token)).length;
}

function profileBoost(
  item: { majors: string[]; interests: string[] },
  profile?: ChatProfile,
): number {
  if (!profile) return 0;
  let boost = 0;
  if (profile.major && item.majors.includes(profile.major)) boost += 1;
  if (item.interests.some((interest) => profile.interests.includes(interest))) boost += 1;
  return boost;
}

function scoreResource(tokens: string[], item: Resource): number {
  return (
    countMatches(tokens, item.title) * 3 +
    countMatches(tokens, `${item.tags.join(' ')} ${item.source}`) * 2 +
    countMatches(tokens, item.summary)
  );
}

function scoreEvent(tokens: string[], item: CareerEvent): number {
  return (
    countMatches(tokens, item.title) * 3 +
    countMatches(tokens, `${item.tags.join(' ')} ${item.host}`) * 2 +
    countMatches(tokens, item.description)
  );
}

function topScored<T>(items: T[], score: (item: T) => number, limit: number): T[] {
  return items
    .map((item) => ({ item, score: score(item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function retrieveContext(query: string, profile?: ChatProfile, now = Date.now()): ChatContext {
  const tokens = tokenize(query);
  const upcoming = events.filter((event) => {
    const end = new Date(event.end).getTime();
    return Number.isNaN(end) || end >= now;
  });

  if (tokens.length === 0) {
    const byFit = topScored(resources, (item) => profileBoost(item, profile), 3);
    return { resources: byFit, events: [] };
  }

  const picked = topScored(
    resources,
    (item) => {
      const base = scoreResource(tokens, item);
      return base > 0 ? base + profileBoost(item, profile) : 0;
    },
    6,
  );

  if (tokens.some((token) => BRAVEN_TRIGGERS.includes(token))) {
    const chosen = new Set(picked.map((item) => item.id));
    for (const item of resources) {
      const mentionsBraven =
        item.source.toLowerCase().includes('braven') || item.title.toLowerCase().includes('braven');
      if (mentionsBraven && !chosen.has(item.id)) {
        picked.push(item);
        chosen.add(item.id);
      }
    }
  }

  const pickedEvents = topScored(
    upcoming,
    (item) => {
      const base = scoreEvent(tokens, item);
      return base > 0 ? base + profileBoost(item, profile) : 0;
    },
    4,
  );

  return { resources: picked, events: pickedEvents };
}

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function buildSystemPrompt(profile: ChatProfile | undefined, context: ChatContext): string {
  const resourceLines = context.resources.map(
    (item) => `- ${item.title} (${item.resourceType}, ${item.location}) ${item.url}`,
  );
  const eventLines = context.events.map(
    (item) =>
      `- ${item.title} (event: ${item.eventType}, ${item.format}, ${formatDate(item.start)}) ${item.url}`,
  );
  const contextLines = [...resourceLines, ...eventLines];

  const profileLines: string[] = [];
  if (profile?.major) profileLines.push(`Major: ${profile.major}`);
  if (profile?.interests.length) profileLines.push(`Interests: ${profile.interests.join(', ')}`);
  if (profile?.year) profileLines.push(`Year: ${profile.year}`);
  if (profile?.goal) profileLines.push(`Goal: ${profile.goal}`);

  return [
    'You are "Career Compass Assistant", a helper for SJSU students on a student capstone project site.',
    'You can answer questions about:',
    '- Braven, the nonprofit program. Only state Braven facts that appear in the context below; otherwise say you are not sure and suggest asking Braven staff.',
    '- This website. Pages: My journey, Internships (internships and entry-level jobs from LinkedIn and the SJSU Career Center, with an "I applied" button and an application tracker), Resources, Events, Alumni.',
    "- Companies: answer from your general knowledge: what the company does, typical intern and entry-level roles and projects, the skills and tools they usually value, and how to prepare. Be specific and useful, not vague. Add one short note that company details can be out of date and should be confirmed on the company's careers page. Only say you do not know when you truly have no knowledge of the company.",
    '- Careers: resumes, interviews, internships, networking, choosing a path.',
    'Rules:',
    '- Stay on those topics. Politely decline unrelated requests such as homework answers, code unrelated to careers, medical, legal or financial advice, or anything harmful.',
    '- Never invent listings, deadlines, links or Braven facts.',
    '- When recommending a listing, use ONLY items from the context below and mention its title.',
    '- Be concise (under 180 words unless asked for more) and friendly. Use plain text with short hyphen lists. Do not use markdown formatting such as ** or #.',
    '- You may use the student profile to personalize answers.',
    '- Remind the student that you are an AI assistant and can be wrong when giving company or career facts.',
    '',
    'Student profile:',
    profileLines.length ? profileLines.join('\n') : 'Not provided.',
    '',
    'Context items:',
    contextLines.length ? contextLines.join('\n') : 'None found for this question.',
  ].join('\n');
}

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

/** The chat panel shows plain text, so models' habitual **bold** and # headings are removed. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/^#{1,6}\s+/gm, '');
}

function buildSources(context: ChatContext, reply: string): ChatSource[] {
  const lowerReply = reply.toLowerCase();
  const all: ChatSource[] = [
    ...context.resources.map((item): ChatSource => ({ title: item.title, url: item.url, kind: 'resource' })),
    ...context.events.map((item): ChatSource => ({ title: item.title, url: item.url, kind: 'event' })),
  ];
  return all.filter((source) => lowerReply.includes(source.title.toLowerCase())).slice(0, 4);
}

function extractContent(data: unknown): string {
  const choices = (data as { choices?: unknown })?.choices;
  if (!Array.isArray(choices)) return '';
  const content = (choices[0] as { message?: { content?: unknown } } | undefined)?.message?.content;
  return typeof content === 'string' ? content : '';
}

export async function handleChatRequest(input: unknown, options: ChatOptions): Promise<ChatResult> {
  const valid = validate(input);
  if ('error' in valid) return fail(400, valid.error);

  if (!options.apiKey) return fail(503, 'The assistant is not set up yet.');

  const now = options.now ?? Date.now();
  if (isRateLimited(options.clientId ?? 'anon', now)) {
    return fail(429, 'Too many questions. Please wait a few minutes.');
  }

  const lastQuestion = valid.messages[valid.messages.length - 1].content;
  const context = retrieveContext(lastQuestion, valid.profile, now);
  const systemPrompt = buildSystemPrompt(valid.profile, context);

  const fetchFn = options.fetchFn ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchFn(NVIDIA_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model ?? DEFAULT_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...valid.messages],
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 700,
        stream: false,
        chat_template_kwargs: { enable_thinking: false },
      }),
      signal: controller.signal,
    });
    if (!response.ok) return fail(502, UPSTREAM_ERROR);
    const reply = stripMarkdown(stripThinking(extractContent(await response.json())));
    if (!reply) return fail(502, UPSTREAM_ERROR);
    return { status: 200, body: { reply, sources: buildSources(context, reply) } };
  } catch {
    // Upstream details are deliberately not logged or returned: they could echo the key or prompt.
    return fail(502, UPSTREAM_ERROR);
  } finally {
    clearTimeout(timer);
  }
}
