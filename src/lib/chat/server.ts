import { events } from '../../data/events';
import { resources } from '../../data/resources';
import type { CareerEvent, Resource } from '../../types';
import type {
  ChatFailure,
  ChatMessage,
  ChatProfile,
  ChatSource,
  ChatStreamEvent,
  ChatSuccess,
} from './types';

export interface ChatOptions {
  apiKey?: string;
  model?: string;
  fetchFn?: typeof fetch;
  clientId?: string;
  now?: number;
  signal?: AbortSignal;
}

export type StreamChatResult =
  | { status: number; body: ChatFailure }
  | { status: 200; events: AsyncGenerator<ChatStreamEvent> };

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
const MAX_MESSAGES = 20;
const MAX_TOKENS = 1200;
const MAX_CONTENT = 800;
const MAX_ASSISTANT_CONTENT = 3000;
const MAX_INTERESTS = 8;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 25_000;
const STREAM_TIMEOUT_MS = 60_000;

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
    'You are "Career Compass Assistant", a warm, direct and knowledgeable career coach for SJSU students, built into a student capstone project site.',
    'Talk like a modern chat assistant: conversational, natural sentences, no stiff template. Remember the whole conversation and build on it. When it genuinely helps, ask one brief follow-up question.',
    '',
    'What you help with:',
    '- Braven, the nonprofit program. Only state Braven facts that appear in the context below; otherwise say you are not sure and suggest asking Braven staff.',
    '- This website. Pages: My journey, Internships (internships and entry-level jobs from LinkedIn and the SJSU Career Center, with an "I applied" button and an application tracker), Resources, Events, Alumni, Assistant.',
    "- Companies: answer from your general knowledge and be specific and useful: what the company does, typical intern and entry-level roles, the skills they value, and how to prepare. Add one short note that details can be out of date and are worth confirming on the company's careers page.",
    '- Anything in a student\'s career life: resumes, cover letters, LinkedIn and outreach messages, interview practice (you may run a mock interview, asking one question at a time), internship and job search strategy, networking, choosing a path, skills to learn, and offers and negotiation basics.',
    '- You may write and improve resume bullets, cover letters and outreach emails.',
    '',
    'Rules:',
    '- Politely decline unrelated requests (homework answers, unrelated code, medical, legal or financial advice, anything harmful) in one friendly sentence, then steer back to careers.',
    '- Never invent listings, deadlines, links or Braven facts.',
    '- Recommend a listing only from the context below, and mention its exact title.',
    '- Use the student profile to personalize answers.',
    '',
    'Formatting: Markdown is rendered, so use it naturally. Short paragraphs, **bold** for key terms, bullet or numbered lists, a heading only for long answers, code blocks only for code. No emoji unless the student uses them. Match length to the question: short for simple questions, thorough for planning or writing tasks, never padded. Do not repeat disclaimers; mention that you are an AI and can be wrong only once in a while, when stating company or career facts, not in every reply.',
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

interface PreparedRequest {
  messages: ChatMessage[];
  context: ChatContext;
  systemPrompt: string;
}

function prepareRequest(input: unknown, options: ChatOptions): PreparedRequest | ChatResult {
  const valid = validate(input);
  if ('error' in valid) return fail(400, valid.error);

  if (!options.apiKey) return fail(503, 'The assistant is not set up yet.');

  const now = options.now ?? Date.now();
  if (isRateLimited(options.clientId ?? 'anon', now)) {
    return fail(429, 'Too many questions. Please wait a few minutes.');
  }

  const lastQuestion = valid.messages[valid.messages.length - 1].content;
  const context = retrieveContext(lastQuestion, valid.profile, now);
  return { messages: valid.messages, context, systemPrompt: buildSystemPrompt(valid.profile, context) };
}

function upstreamInit(
  options: ChatOptions,
  prepared: PreparedRequest,
  stream: boolean,
  signal: AbortSignal,
): RequestInit {
  return {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model ?? DEFAULT_MODEL,
      messages: [{ role: 'system', content: prepared.systemPrompt }, ...prepared.messages],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: MAX_TOKENS,
      stream,
      chat_template_kwargs: { enable_thinking: false },
    }),
    signal,
  };
}

export async function handleChatRequest(input: unknown, options: ChatOptions): Promise<ChatResult> {
  const prepared = prepareRequest(input, options);
  if ('status' in prepared) return prepared;

  const fetchFn = options.fetchFn ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchFn(NVIDIA_URL, upstreamInit(options, prepared, false, controller.signal));
    if (!response.ok) return fail(502, UPSTREAM_ERROR);
    const reply = stripThinking(extractContent(await response.json()));
    if (!reply) return fail(502, UPSTREAM_ERROR);
    return { status: 200, body: { reply, sources: buildSources(prepared.context, reply) } };
  } catch {
    // Upstream details are deliberately not logged or returned: they could echo the key or prompt.
    return fail(502, UPSTREAM_ERROR);
  } finally {
    clearTimeout(timer);
  }
}

const THINK_OPEN = '<think>';
const THINK_CLOSE = '</think>';

/** Length of the longest suffix of `text` that is a proper prefix of `tag` (a tag split across chunks). */
function partialTagLength(text: string, tag: string): number {
  const lower = text.toLowerCase();
  for (let length = Math.min(tag.length - 1, lower.length); length > 0; length -= 1) {
    if (tag.startsWith(lower.slice(lower.length - length))) return length;
  }
  return 0;
}

/** Removes <think>...</think> from streamed text, holding back text that might be a split tag. */
function createThinkFilter() {
  let pending = '';
  let inThink = false;
  let started = false;

  const emit = (text: string): string => {
    const visible = started ? text : text.trimStart();
    if (visible) started = true;
    return visible;
  };

  return {
    push(chunk: string): string {
      pending += chunk;
      let out = '';
      for (;;) {
        const lower = pending.toLowerCase();
        const tag = inThink ? THINK_CLOSE : THINK_OPEN;
        const index = lower.indexOf(tag);
        if (index >= 0) {
          if (!inThink) out += pending.slice(0, index);
          pending = pending.slice(index + tag.length);
          inThink = !inThink;
          continue;
        }
        const keep = partialTagLength(pending, tag);
        if (!inThink) out += pending.slice(0, pending.length - keep);
        pending = pending.slice(pending.length - keep);
        break;
      }
      return emit(out);
    },
    flush(): string {
      const rest = inThink ? '' : pending;
      pending = '';
      return emit(rest);
    },
  };
}

function parseSseContent(line: string): { done: boolean; content: string } {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) return { done: false, content: '' };
  const payload = trimmed.slice(5).trim();
  if (payload === '[DONE]') return { done: true, content: '' };
  try {
    const choices = (JSON.parse(payload) as { choices?: unknown })?.choices;
    if (!Array.isArray(choices)) return { done: false, content: '' };
    const content = (choices[0] as { delta?: { content?: unknown } } | undefined)?.delta?.content;
    return { done: false, content: typeof content === 'string' ? content : '' };
  } catch {
    return { done: false, content: '' };
  }
}

async function* runStream(
  options: ChatOptions,
  prepared: PreparedRequest,
): AsyncGenerator<ChatStreamEvent> {
  const fetchFn = options.fetchFn ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);
  const onClientAbort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener('abort', onClientAbort);

  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await fetchFn(NVIDIA_URL, upstreamInit(options, prepared, true, controller.signal));
    if (!response.ok || !response.body) {
      yield { type: 'error', error: UPSTREAM_ERROR };
      return;
    }
    reader = response.body.getReader();
    const decoder = new TextDecoder();
    const filter = createThinkFilter();
    let buffer = '';
    let reply = '';
    let finished = false;

    const consume = (line: string): string => {
      const parsed = parseSseContent(line);
      if (parsed.done) finished = true;
      return parsed.content ? filter.push(parsed.content) : '';
    };

    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const text = consume(line);
        if (text) {
          reply += text;
          yield { type: 'delta', text };
        }
        if (finished) break;
      }
    }
    if (!finished && buffer) {
      const text = consume(buffer);
      if (text) {
        reply += text;
        yield { type: 'delta', text };
      }
    }
    const tail = filter.flush();
    if (tail) {
      reply += tail;
      yield { type: 'delta', text: tail };
    }
    if (!reply.trim()) {
      yield { type: 'error', error: UPSTREAM_ERROR };
      return;
    }
    yield { type: 'done', sources: buildSources(prepared.context, reply) };
  } catch {
    // Upstream details are deliberately not logged or returned: they could echo the key or prompt.
    yield { type: 'error', error: UPSTREAM_ERROR };
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onClientAbort);
    controller.abort();
    reader?.cancel().catch(() => undefined);
  }
}

export async function streamChatRequest(input: unknown, options: ChatOptions): Promise<StreamChatResult> {
  const prepared = prepareRequest(input, options);
  if ('status' in prepared) return { status: prepared.status, body: prepared.body as ChatFailure };
  return { status: 200, events: runStream(options, prepared) };
}
