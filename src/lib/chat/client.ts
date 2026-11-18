import type { ChatMessage, ChatProfile, ChatSource } from './types';

export type SendChatResult =
  | { ok: true; reply: string; sources: ChatSource[] }
  | { ok: false; error: string };

export const MAX_HISTORY_MESSAGES = 10;
const UNAVAILABLE = 'The assistant is not available right now.';
const GENERIC_FAILURE = 'Something went wrong. Please try again.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseSources(value: unknown): ChatSource[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is ChatSource =>
      isRecord(item) &&
      typeof item.title === 'string' &&
      typeof item.url === 'string' &&
      (item.kind === 'resource' || item.kind === 'event'),
  );
}

export async function sendChat(
  messages: ChatMessage[],
  profile: ChatProfile | undefined,
  fetchFn: typeof fetch = fetch,
): Promise<SendChatResult> {
  const body = { messages: messages.slice(-MAX_HISTORY_MESSAGES), profile };

  let response: Response;
  try {
    response = await fetchFn('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: UNAVAILABLE };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: UNAVAILABLE };
  }

  if (!response.ok) {
    const error = isRecord(data) && typeof data.error === 'string' ? data.error : '';
    return { ok: false, error: error || GENERIC_FAILURE };
  }

  if (!isRecord(data) || typeof data.reply !== 'string' || !data.reply.trim()) {
    return { ok: false, error: GENERIC_FAILURE };
  }
  return { ok: true, reply: data.reply, sources: parseSources(data.sources) };
}
