import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildSystemPrompt,
  handleChatRequest,
  resetRateLimits,
  retrieveContext,
  streamChatRequest,
} from './server';
import type { ChatFailure, ChatStreamEvent, ChatSuccess } from './types';

const validInput = { messages: [{ role: 'user', content: 'marketing internship tips' }] };

function fakeFetch(content: string | null, ok = true) {
  return vi.fn(async () => ({
    ok,
    status: ok ? 200 : 500,
    json: async () => ({ choices: [{ message: { content } }] }),
  })) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

beforeEach(() => resetRateLimits());

describe('validation', () => {
  const cases: [string, unknown][] = [
    ['non-object', 'hello'],
    ['null', null],
    ['missing messages', {}],
    ['empty messages', { messages: [] }],
    ['too many messages', { messages: Array.from({ length: 21 }, () => ({ role: 'user', content: 'hi' })) }],
    ['bad role', { messages: [{ role: 'system', content: 'hi' }] }],
    ['empty content', { messages: [{ role: 'user', content: '   ' }] }],
    ['too long', { messages: [{ role: 'user', content: 'a'.repeat(801) }] }],
    ['last not user', { messages: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'yo' }] }],
  ];

  it.each(cases)('rejects %s with 400', async (_name, input) => {
    const fetchFn = fakeFetch('ok');
    const result = await handleChatRequest(input, { apiKey: 'k', fetchFn });
    expect(result.status).toBe(400);
    expect((result.body as ChatFailure).error).toBeTruthy();
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('ignores an invalid profile instead of failing', async () => {
    const result = await handleChatRequest(
      { ...validInput, profile: 'nope' },
      { apiKey: 'k', fetchFn: fakeFetch('Hello') },
    );
    expect(result.status).toBe(200);
  });

  it('caps interests at 8 in the prompt profile', async () => {
    const fetchFn = fakeFetch('Hello');
    const interests = Array.from({ length: 12 }, (_v, index) => `interest${index}`);
    await handleChatRequest(
      { ...validInput, profile: { major: null, interests, year: null, goal: null } },
      { apiKey: 'k', fetchFn },
    );
    const body = JSON.parse((fetchFn.mock.calls[0][1] as RequestInit).body as string);
    expect(body.messages[0].content).toContain('interest7');
    expect(body.messages[0].content).not.toContain('interest8');
  });
});

describe('configuration and rate limiting', () => {
  it('returns 503 without an api key and makes no request', async () => {
    const fetchFn = fakeFetch('ok');
    const result = await handleChatRequest(validInput, { apiKey: '', fetchFn });
    expect(result).toEqual({ status: 503, body: { error: 'The assistant is not set up yet.' } });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('returns 429 after 20 requests in the window, then recovers after reset', async () => {
    const options = { apiKey: 'k', fetchFn: fakeFetch('Hi'), clientId: 'a', now: 1_000 };
    for (let count = 0; count < 20; count += 1) {
      expect((await handleChatRequest(validInput, options)).status).toBe(200);
    }
    const blocked = await handleChatRequest(validInput, options);
    expect(blocked.status).toBe(429);
    expect((blocked.body as ChatFailure).error).toBe('Too many questions. Please wait a few minutes.');
    expect((await handleChatRequest(validInput, { ...options, clientId: 'b' })).status).toBe(200);
    expect((await handleChatRequest(validInput, { ...options, now: 1_000 + 10 * 60 * 1000 + 1 })).status).toBe(200);
    resetRateLimits();
    expect((await handleChatRequest(validInput, options)).status).toBe(200);
  });
});

describe('retrieveContext', () => {
  it('returns bounded, relevant resources for a marketing internship query', () => {
    const context = retrieveContext('marketing internship');
    expect(context.resources.length).toBeGreaterThan(0);
    expect(context.resources.length).toBeLessThanOrEqual(6);
    expect(context.events.length).toBeLessThanOrEqual(4);
    const top = context.resources[0];
    const text = `${top.title} ${top.tags.join(' ')} ${top.summary} ${top.source}`.toLowerCase();
    expect(text).toMatch(/marketing|internship/);
  });

  it('drops events that already ended', () => {
    const farFuture = new Date('2100-01-01').getTime();
    expect(retrieveContext('career fair workshop networking', undefined, farFuture).events).toEqual([]);
  });

  it('returns no events or at most 3 resources when the query has no useful words', () => {
    const context = retrieveContext('the and of');
    expect(context.events).toEqual([]);
    expect(context.resources.length).toBeLessThanOrEqual(3);
  });

  it('includes Braven resources when the query mentions braven', () => {
    const context = retrieveContext('how do I contact my braven coach');
    const hasBraven = context.resources.some(
      (item) => item.source.toLowerCase().includes('braven') || item.title.toLowerCase().includes('braven'),
    );
    expect(hasBraven).toBe(true);
  });
});

describe('handleChatRequest upstream call', () => {
  it('sends the right url, auth, model and a system prompt with context', async () => {
    const fetchFn = fakeFetch('Sure.');
    await handleChatRequest(validInput, { apiKey: 'secret-key', model: 'test-model', fetchFn });
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.perplexity.ai/chat/completions');
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer secret-key');
    expect(headers['Content-Type']).toBe('application/json');
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe('test-model');
    expect(body.stream).toBe(false);
    expect(body.max_tokens).toBe(1200);
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[0].content).toContain('Wayfinder');
    const first = retrieveContext('marketing internship tips').resources[0];
    expect(body.messages[0].content).toContain(first.title);
    expect(body.messages[1]).toEqual({ role: 'user', content: 'marketing internship tips' });
  });

  it('uses the default model when none is given', async () => {
    const fetchFn = fakeFetch('Sure.');
    await handleChatRequest(validInput, { apiKey: 'k', fetchFn });
    const body = JSON.parse((fetchFn.mock.calls[0][1] as RequestInit).body as string);
    expect(body.model).toBe('sonar');
  });

  it('strips <think> blocks from the reply', async () => {
    const result = await handleChatRequest(validInput, {
      apiKey: 'k',
      fetchFn: fakeFetch('<think>secret\nreasoning</think>\n  Answer here.  '),
    });
    expect((result.body as ChatSuccess).reply).toBe('Answer here.');
  });

  it('accepts a follow-up after a long assistant answer, but still limits what the user types', async () => {
    const history = [
      { role: 'user', content: 'Which marketing internships fit me?' },
      { role: 'assistant', content: 'Here is a long answer. '.repeat(120) },
      { role: 'user', content: 'What skills should I learn for data science?' },
    ];
    const ok = await handleChatRequest({ messages: history }, { apiKey: 'k', fetchFn: fakeFetch('Sure.') });
    expect(ok.status).toBe(200);

    const tooLong = await handleChatRequest(
      { messages: [{ role: 'user', content: 'x'.repeat(900) }] },
      { apiKey: 'k', fetchFn: fakeFetch('Sure.') },
    );
    expect(tooLong.status).toBe(400);
  });

  it('keeps markdown in the reply and accepts up to 20 messages', async () => {
    const result = await handleChatRequest(
      {
        messages: Array.from({ length: 19 }, (_v, index) => ({
          role: index % 2 === 0 ? 'user' : 'assistant',
          content: 'hi',
        })).concat([{ role: 'user', content: 'marketing tips' }]),
      },
      { apiKey: 'k', fetchFn: fakeFetch('## Options\n- **Marketing Intern**') },
    );
    expect((result.body as ChatSuccess).reply).toBe('## Options\n- **Marketing Intern**');
  });

  it('returns 502 on upstream failure, network error and empty content', async () => {
    const message = 'The assistant could not answer right now. Please try again.';
    const failing = await handleChatRequest(validInput, { apiKey: 'k', fetchFn: fakeFetch('x', false) });
    expect(failing).toEqual({ status: 502, body: { error: message } });

    const throwing = vi.fn(async () => {
      throw new Error('boom secret-key');
    }) as unknown as typeof fetch;
    const network = await handleChatRequest(validInput, { apiKey: 'k', fetchFn: throwing });
    expect(network).toEqual({ status: 502, body: { error: message } });

    const empty = await handleChatRequest(validInput, { apiKey: 'k', fetchFn: fakeFetch('<think>x</think>') });
    expect(empty.status).toBe(502);
  });

  it('only lists sources whose titles appear in the reply', async () => {
    const context = retrieveContext('marketing internship tips');
    const mentioned = context.resources[0];
    const result = await handleChatRequest(validInput, {
      apiKey: 'k',
      fetchFn: fakeFetch(`Try ${mentioned.title.toUpperCase()} for this.`),
    });
    const body = result.body as ChatSuccess;
    expect(body.sources).toContainEqual({ title: mentioned.title, url: mentioned.url, kind: 'resource' });
    expect(body.sources.every((source) => body.reply.toLowerCase().includes(source.title.toLowerCase()))).toBe(true);
    expect(body.sources.length).toBeLessThanOrEqual(4);

    const none = await handleChatRequest(validInput, { apiKey: 'k', fetchFn: fakeFetch('No listing fits.') });
    expect((none.body as ChatSuccess).sources).toEqual([]);
  });
});

describe('buildSystemPrompt', () => {
  it('includes profile details and handles empty context', () => {
    const prompt = buildSystemPrompt(
      { major: 'Computer Science', interests: ['Software'], year: 'Third year', goal: null },
      { resources: [], events: [] },
    );
    expect(prompt).toContain('Computer Science');
    expect(prompt).toContain('None found');
  });
});

function sseFetch(chunks: string[], ok = true) {
  const encoder = new TextEncoder();
  return vi.fn(async (_url: string, _init?: RequestInit) => ({
    ok,
    status: ok ? 200 : 500,
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    }),
  })) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

const sse = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;

async function collect(input: unknown, options: Parameters<typeof streamChatRequest>[1]) {
  const result = await streamChatRequest(input, options);
  if (!('events' in result)) return { result, events: [] as ChatStreamEvent[] };
  const events: ChatStreamEvent[] = [];
  for await (const event of result.events) events.push(event);
  return { result, events };
}

const streamError = 'The assistant could not answer right now. Please try again.';

describe('streamChatRequest', () => {
  it('yields deltas then done, tolerating split lines, think tags and junk', async () => {
    const title = retrieveContext('marketing internship tips').resources[0].title;
    const first = sse('<think>hidden');
    const second = sse(' reasoning</th');
    const third = sse('ink>Hello ');
    const fourth = sse(`try ${title} now`);
    const split = fourth.length - 10;
    const fetchFn = sseFetch([
      ': keepalive\n\n',
      'data: not json\n\n',
      first,
      second,
      `${third}data: ${JSON.stringify({ choices: [{ delta: { reasoning_content: 'x' } }] })}\n\n`,
      fourth.slice(0, split),
      `${fourth.slice(split)}data: [DONE]\n\n`,
    ]);
    const { result, events } = await collect(
      { ...validInput, stream: true },
      { apiKey: 'k', fetchFn },
    );
    expect(result.status).toBe(200);
    const last = events[events.length - 1];
    expect(last.type).toBe('done');
    const deltas = events.slice(0, -1);
    expect(deltas.every((event) => event.type === 'delta')).toBe(true);
    const text = deltas.map((event) => (event as { text: string }).text).join('');
    expect(text).toBe(`Hello try ${title} now`);
    expect((last as { sources: unknown[] }).sources).toHaveLength(1);
    const body = JSON.parse((fetchFn.mock.calls[0][1] as RequestInit).body as string);
    expect(body.stream).toBe(true);
    expect(body.max_tokens).toBe(1200);
  });

  it('gives no sources when no title is mentioned', async () => {
    const { events } = await collect(
      validInput,
      { apiKey: 'k', fetchFn: sseFetch([sse('No '), sse('match.'), 'data: [DONE]\n\n']) },
    );
    expect(events).toEqual([
      { type: 'delta', text: 'No ' },
      { type: 'delta', text: 'match.' },
      { type: 'done', sources: [] },
    ]);
  });

  it('yields a single error event on upstream failure, thrown fetch or empty output', async () => {
    const failing = await collect(validInput, { apiKey: 'k', fetchFn: sseFetch([], false) });
    expect(failing.events).toEqual([{ type: 'error', error: streamError }]);

    const throwing = vi.fn(async () => {
      throw new Error('boom secret-key');
    }) as unknown as typeof fetch;
    const thrown = await collect(validInput, { apiKey: 'k', fetchFn: throwing });
    expect(thrown.events).toEqual([{ type: 'error', error: streamError }]);

    const empty = await collect(validInput, {
      apiKey: 'k',
      fetchFn: sseFetch([sse('<think>x</think>'), 'data: [DONE]\n\n']),
    });
    expect(empty.events).toEqual([{ type: 'error', error: streamError }]);
  });

  it('yields error after partial text when the stream breaks', async () => {
    const encoder = new TextEncoder();
    let sent = false;
    const fetchFn = vi.fn(async () => ({
      ok: true,
      status: 200,
      body: new ReadableStream<Uint8Array>({
        pull(controller) {
          if (sent) {
            controller.error(new Error('reset'));
            return;
          }
          sent = true;
          controller.enqueue(encoder.encode(sse('Partial ')));
        },
      }),
    })) as unknown as typeof fetch;
    const { events } = await collect(validInput, { apiKey: 'k', fetchFn });
    expect(events[0]).toEqual({ type: 'delta', text: 'Partial ' });
    expect(events[events.length - 1]).toEqual({ type: 'error', error: streamError });
  });

  it('returns pre-stream failures as plain results', async () => {
    const fetchFn = sseFetch([]);
    expect(await streamChatRequest({ messages: [] }, { apiKey: 'k', fetchFn })).toEqual({
      status: 400,
      body: { error: 'Please send between 1 and 20 messages.' },
    });
    expect(await streamChatRequest(validInput, { apiKey: '', fetchFn })).toEqual({
      status: 503,
      body: { error: 'The assistant is not set up yet.' },
    });
    const options = { apiKey: 'k', fetchFn, clientId: 'z', now: 5 };
    for (let count = 0; count < 20; count += 1) await streamChatRequest(validInput, options);
    const blocked = await streamChatRequest(validInput, options);
    expect(blocked).toEqual({ status: 429, body: { error: 'Too many questions. Please wait a few minutes.' } });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('forwards a client abort to the upstream request', async () => {
    const fetchFn = sseFetch([sse('Hi'), 'data: [DONE]\n\n']);
    const client = new AbortController();
    const result = await streamChatRequest(validInput, { apiKey: 'k', fetchFn, signal: client.signal });
    if (!('events' in result)) throw new Error('expected a stream');
    const next = result.events.next();
    await next;
    const upstreamSignal = (fetchFn.mock.calls[0][1] as RequestInit).signal as AbortSignal;
    expect(upstreamSignal.aborted).toBe(false);
    client.abort();
    expect(upstreamSignal.aborted).toBe(true);
    await result.events.return(undefined);
  });
});
