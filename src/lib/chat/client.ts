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

export type StreamChatResult =
  | { ok: true; sources: ChatSource[] }
  | { ok: false; error: string; aborted?: boolean };

export interface StreamHandlers {
  onDelta(text: string): void;
}

export interface StreamOptions {
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
}

const ABORTED: StreamChatResult = { ok: false, error: '', aborted: true };

export async function streamChat(
  messages: ChatMessage[],
  profile: ChatProfile | undefined,
  handlers: StreamHandlers,
  options: StreamOptions = {},
): Promise<StreamChatResult> {
  const { signal, fetchFn = fetch } = options;
  const body = { messages: messages.slice(-MAX_HISTORY_MESSAGES), profile, stream: true };

  let response: Response;
  try {
    response = await fetchFn('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    return signal?.aborted ? ABORTED : { ok: false, error: UNAVAILABLE };
  }

  if (!response.ok) {
    try {
      const data: unknown = await response.json();
      const error = isRecord(data) && typeof data.error === 'string' ? data.error : '';
      return { ok: false, error: error || GENERIC_FAILURE };
    } catch {
      return signal?.aborted ? ABORTED : { ok: false, error: UNAVAILABLE };
    }
  }
  if (!response.body) return { ok: false, error: UNAVAILABLE };

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let outcome: StreamChatResult | null = null;

  const handleLine = (line: string): void => {
    if (outcome || !line.trim()) return;
    let event: unknown;
    try {
      event = JSON.parse(line);
    } catch {
      return;
    }
    if (!isRecord(event)) return;
    if (event.type === 'delta' && typeof event.text === 'string') {
      handlers.onDelta(event.text);
    } else if (event.type === 'done') {
      outcome = { ok: true, sources: parseSources(event.sources) };
    } else if (event.type === 'error') {
      outcome = {
        ok: false,
        error: typeof event.error === 'string' && event.error ? event.error : GENERIC_FAILURE,
      };
    }
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      lines.forEach(handleLine);
      if (outcome) break;
    }
    buffer += decoder.decode();
    handleLine(buffer);
  } catch {
    return signal?.aborted ? ABORTED : { ok: false, error: UNAVAILABLE };
  } finally {
    reader.cancel().catch(() => undefined);
  }

  if (signal?.aborted) return ABORTED;
  // A stream that ends without a done event was cut off.
  return outcome ?? { ok: false, error: UNAVAILABLE };
}
