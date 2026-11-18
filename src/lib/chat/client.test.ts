import { describe, expect, it, vi } from 'vitest';
import { sendChat } from './client';
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
