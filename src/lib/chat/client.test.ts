import { describe, expect, it, vi } from 'vitest';
import { sendChat, streamChat } from './client';
import type { ChatMessage } from './types';

const question: ChatMessage[] = [{ role: 'user', content: 'Hi' }];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function fakeFetch(response: Response | Error) {
  return vi.fn(async () => {
    if (response instanceof Error) throw response;
    return response;
  }) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

describe('sendChat', () => {
  it('returns the reply and sources on success', async () => {
    const sources = [{ title: 'NVIDIA', url: 'https://example.com', kind: 'resource' }];
    const fetchFn = fakeFetch(jsonResponse({ reply: 'Hello', sources }));
    const result = await sendChat(question, undefined, fetchFn);
    expect(result).toEqual({ ok: true, reply: 'Hello', sources });
    expect(fetchFn).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('passes the server error text through on 429', async () => {
    const fetchFn = fakeFetch(jsonResponse({ error: 'Too many questions, slow down.' }, 429));
    expect(await sendChat(question, undefined, fetchFn)).toEqual({
      ok: false,
      error: 'Too many questions, slow down.',
    });
  });

  it('returns the server error on 503', async () => {
    const fetchFn = fakeFetch(jsonResponse({ error: 'Assistant is not set up.' }, 503));
    expect(await sendChat(question, undefined, fetchFn)).toEqual({
      ok: false,
      error: 'Assistant is not set up.',
    });
  });

  it('returns a friendly message on network failure', async () => {
    const result = await sendChat(question, undefined, fakeFetch(new TypeError('offline')));
    expect(result).toEqual({ ok: false, error: 'The assistant is not available right now.' });
  });

  it('returns a friendly message for a non-JSON body', async () => {
    const result = await sendChat(question, undefined, fakeFetch(new Response('<html>', { status: 200 })));
    expect(result).toEqual({ ok: false, error: 'The assistant is not available right now.' });
  });

  it('falls back to a generic error when a failure has no error text', async () => {
    const result = await sendChat(question, undefined, fakeFetch(jsonResponse({}, 502)));
    expect(result.ok).toBe(false);
  });

  it('sends only the last 10 messages and the profile', async () => {
    const many: ChatMessage[] = Array.from({ length: 14 }, (_, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content: `m${index}`,
    }));
    const profile = { major: 'Biology', interests: ['Healthcare'], year: null, goal: null };
    const fetchFn = fakeFetch(jsonResponse({ reply: 'ok', sources: [] }));
    await sendChat(many, profile, fetchFn);
    const init = (fetchFn as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    const sent = JSON.parse(init.body as string);
    expect(sent.messages).toHaveLength(10);
    expect(sent.messages[0].content).toBe('m4');
    expect(sent.profile).toEqual(profile);
  });
});

function ndjsonResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
  return new Response(stream, { status: 200, headers: { 'Content-Type': 'application/x-ndjson' } });
}

describe('streamChat', () => {
  const sources = [{ title: 'NVIDIA', url: 'https://example.com', kind: 'resource' }];

  it('streams deltas split across chunks and returns sources', async () => {
    const lines = [
      JSON.stringify({ type: 'delta', text: 'Hel' }),
      JSON.stringify({ type: 'delta', text: 'lo' }),
      JSON.stringify({ type: 'done', sources }),
    ];
    const payload = lines.join('\n');
    const cut = lines[0].length + 8;
    const fetchFn = fakeFetch(ndjsonResponse([payload.slice(0, cut), payload.slice(cut)]));
    const deltas: string[] = [];
    const result = await streamChat(question, undefined, { onDelta: (t) => deltas.push(t) }, { fetchFn });
    expect(deltas.join('')).toBe('Hello');
    expect(result).toEqual({ ok: true, sources });
    const init = (fetchFn as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string).stream).toBe(true);
  });

  it('returns the error from an error event', async () => {
    const fetchFn = fakeFetch(
      ndjsonResponse([
        JSON.stringify({ type: 'delta', text: 'Hi' }) + '\n',
        JSON.stringify({ type: 'error', error: 'Model failed.' }) + '\n',
      ]),
    );
    const result = await streamChat(question, undefined, { onDelta: () => undefined }, { fetchFn });
    expect(result).toEqual({ ok: false, error: 'Model failed.' });
  });

  it('passes through a JSON error on 429', async () => {
    const fetchFn = fakeFetch(jsonResponse({ error: 'Slow down.' }, 429));
    const result = await streamChat(question, undefined, { onDelta: () => undefined }, { fetchFn });
    expect(result).toEqual({ ok: false, error: 'Slow down.' });
  });

  it('returns a friendly message on network failure', async () => {
    const fetchFn = fakeFetch(new TypeError('offline'));
    const result = await streamChat(question, undefined, { onDelta: () => undefined }, { fetchFn });
    expect(result).toEqual({ ok: false, error: 'The assistant is not available right now.' });
  });

  it('reports an abort without an error message', async () => {
    const controller = new AbortController();
    const fetchFn = vi.fn(async () => {
      controller.abort();
      throw new DOMException('Aborted', 'AbortError');
    }) as unknown as typeof fetch;
    const result = await streamChat(
      question,
      undefined,
      { onDelta: () => undefined },
      { fetchFn, signal: controller.signal },
    );
    expect(result).toEqual({ ok: false, error: '', aborted: true });
  });
});
