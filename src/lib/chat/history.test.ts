import { describe, expect, it, vi } from 'vitest';
import {
  MAX_CONVERSATIONS,
  MAX_MESSAGES,
  STORAGE_KEY,
  clearConversations,
  groupByRecency,
  loadConversations,
  newConversationId,
  removeConversation,
  saveConversations,
  titleFromMessages,
  upsertConversation,
  type ChatConversation,
  type ChatStorage,
} from './history';

function fakeStorage(initial: Record<string, string> = {}, limit = Infinity) {
  const data = new Map(Object.entries(initial));
  const storage: ChatStorage & { data: Map<string, string>; calls: number } = {
    data,
    calls: 0,
    getItem: (key) => data.get(key) ?? null,
    setItem(key, value) {
      storage.calls += 1;
      if (value.length > limit) throw new DOMException('full', 'QuotaExceededError');
      data.set(key, value);
    },
    removeItem: (key) => void data.delete(key),
  };
  return storage;
}

function chat(id: string, updatedAt: number, messageCount = 1): ChatConversation {
  return {
    id,
    title: id,
    createdAt: updatedAt,
    updatedAt,
    messages: Array.from({ length: messageCount }, (_, index) => ({
      role: index % 2 === 0 ? ('user' as const) : ('assistant' as const),
      content: `m${index}`,
    })),
  };
}

describe('loadConversations', () => {
  it('returns [] for empty, corrupt or non-array data', () => {
    expect(loadConversations(fakeStorage())).toEqual([]);
    expect(loadConversations(fakeStorage({ [STORAGE_KEY]: '{oops' }))).toEqual([]);
    expect(loadConversations(fakeStorage({ [STORAGE_KEY]: '{"a":1}' }))).toEqual([]);
  });

  it('drops invalid entries and messages, and sorts newest first', () => {
    const raw = JSON.stringify([
      chat('old', 1),
      { id: 'bad', title: 'x' },
      null,
      { ...chat('mixed', 5), messages: [{ role: 'user', content: 'hi' }, { role: 'bot', content: 'x' }, 7] },
      chat('old', 9),
    ]);
    const result = loadConversations(fakeStorage({ [STORAGE_KEY]: raw }));
    expect(result.map((item) => item.id)).toEqual(['mixed', 'old']);
    expect(result[0].messages).toEqual([{ role: 'user', content: 'hi' }]);
  });

  it('does not throw when storage throws', () => {
    const broken: ChatStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(loadConversations(broken)).toEqual([]);
  });
});

describe('saveConversations', () => {
  it('caps conversations and messages, keeping the newest', () => {
    const storage = fakeStorage();
    const list = Array.from({ length: MAX_CONVERSATIONS + 5 }, (_, index) =>
      chat(`c${index}`, index, MAX_MESSAGES + 10),
    );
    saveConversations(list, storage);
    const saved = JSON.parse(storage.data.get(STORAGE_KEY) ?? '[]') as ChatConversation[];
    expect(saved).toHaveLength(MAX_CONVERSATIONS);
    expect(saved[0].id).toBe(`c${MAX_CONVERSATIONS + 4}`);
    expect(saved[0].messages).toHaveLength(MAX_MESSAGES);
    expect(saved[0].messages.at(-1)?.content).toBe(`m${MAX_MESSAGES + 9}`);
  });

  it('drops the oldest conversations and retries once on a quota error', () => {
    const list = [chat('a', 4), chat('b', 3), chat('c', 2), chat('d', 1)];
    const full = JSON.stringify(list).length;
    const storage = fakeStorage({}, full - 1);
    saveConversations(list, storage);
    expect(storage.calls).toBe(2);
    const saved = JSON.parse(storage.data.get(STORAGE_KEY) ?? '[]') as ChatConversation[];
    expect(saved.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('never throws when the retry also fails', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const storage = fakeStorage({}, 0);
    expect(() => saveConversations([chat('a', 2), chat('b', 1)], storage)).not.toThrow();
    expect(storage.calls).toBe(2);
  });
});

describe('upsert, remove and clear', () => {
  it('replaces by id and returns a new list sorted by recency', () => {
    const list = [chat('a', 2), chat('b', 1)];
    const next = upsertConversation(list, { ...chat('b', 5), title: 'renamed' });
    expect(next.map((item) => item.id)).toEqual(['b', 'a']);
    expect(next[0].title).toBe('renamed');
    expect(list.map((item) => item.id)).toEqual(['a', 'b']);
    expect(upsertConversation(list, chat('c', 9))).toHaveLength(3);
  });

  it('removes by id', () => {
    expect(removeConversation([chat('a', 2), chat('b', 1)], 'a').map((item) => item.id)).toEqual(['b']);
  });

  it('clears the stored key', () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '[]' });
    clearConversations(storage);
    expect(storage.data.has(STORAGE_KEY)).toBe(false);
  });
});

describe('titleFromMessages', () => {
  it('uses the first user message with whitespace collapsed', () => {
    expect(
      titleFromMessages([
        { role: 'assistant', content: 'hello' },
        { role: 'user', content: '  find   me\n internships ' },
      ]),
    ).toBe('find me internships');
  });

  it('truncates to 48 characters with an ellipsis', () => {
    const title = titleFromMessages([{ role: 'user', content: 'x'.repeat(100) }]);
    expect(title).toHaveLength(48);
    expect(title.endsWith('…')).toBe(true);
  });

  it('keeps exactly 48 characters intact and falls back to New chat', () => {
    expect(titleFromMessages([{ role: 'user', content: 'y'.repeat(48) }])).toBe('y'.repeat(48));
    expect(titleFromMessages([])).toBe('New chat');
    expect(titleFromMessages([{ role: 'user', content: '   ' }])).toBe('New chat');
  });
});

describe('newConversationId', () => {
  it('returns distinct non-empty ids', () => {
    expect(newConversationId()).not.toBe(newConversationId());
  });
});

describe('groupByRecency', () => {
  const now = new Date(2026, 10, 18, 0, 30).getTime();
  const at = (day: number, hour = 12) => new Date(2026, 10, day, hour).getTime();

  it('groups by local calendar day across the midnight boundary', () => {
    const groups = groupByRecency(
      [
        chat('late-yesterday', new Date(2026, 10, 17, 23, 59).getTime()),
        chat('today', at(18, 0)),
        chat('week', at(11, 0)),
        chat('older', new Date(2026, 10, 10, 23, 59).getTime()),
      ],
      now,
    );
    expect(groups.map((group) => [group.label, group.items.map((item) => item.id)])).toEqual([
      ['Today', ['today']],
      ['Yesterday', ['late-yesterday']],
      ['Previous 7 days', ['week']],
      ['Older', ['older']],
    ]);
  });

  it('omits empty groups', () => {
    const groups = groupByRecency([chat('a', at(1)), chat('b', at(2))], now);
    expect(groups.map((group) => group.label)).toEqual(['Older']);
    expect(groupByRecency([], now)).toEqual([]);
  });
});
