import type { ChatSource } from './types';

export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
}

export type ChatStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface ConversationGroup {
  label: 'Today' | 'Yesterday' | 'Previous 7 days' | 'Older';
  items: ChatConversation[];
}

export const STORAGE_KEY = 'bcc:chats:v1';
const LEGACY_SESSION_KEY = 'bcc:chat';
export const MAX_CONVERSATIONS = 50;
export const MAX_MESSAGES = 100;
const TITLE_MAX_LENGTH = 48;
const DEFAULT_TITLE = 'New chat';

function defaultStorage(): ChatStorage | null {
  try {
    return localStorage;
  } catch {
    return null;
  }
}

function isSource(value: unknown): value is ChatSource {
  if (typeof value !== 'object' || value === null) return false;
  const source = value as Record<string, unknown>;
  return (
    typeof source.title === 'string' &&
    typeof source.url === 'string' &&
    (source.kind === 'resource' || source.kind === 'event')
  );
}

function parseMessage(value: unknown): StoredMessage | null {
  if (typeof value !== 'object' || value === null) return null;
  const item = value as Record<string, unknown>;
  if (item.role !== 'user' && item.role !== 'assistant') return null;
  if (typeof item.content !== 'string') return null;
  const message: StoredMessage = { role: item.role, content: item.content };
  if (Array.isArray(item.sources)) {
    const sources = item.sources.filter(isSource);
    if (sources.length > 0) message.sources = sources;
  }
  return message;
}

function parseConversation(value: unknown): ChatConversation | null {
  if (typeof value !== 'object' || value === null) return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !item.id) return null;
  if (typeof item.title !== 'string') return null;
  if (!Number.isFinite(item.createdAt) || !Number.isFinite(item.updatedAt)) return null;
  if (!Array.isArray(item.messages)) return null;
  const messages = item.messages
    .map(parseMessage)
    .filter((message): message is StoredMessage => message !== null);
  return {
    id: item.id,
    title: item.title || DEFAULT_TITLE,
    createdAt: item.createdAt as number,
    updatedAt: item.updatedAt as number,
    messages,
  };
}

function sortNewestFirst(list: ChatConversation[]): ChatConversation[] {
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadConversations(storage: ChatStorage | null = defaultStorage()): ChatConversation[] {
  if (!storage) return [];
  try {
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    // Old single-chat key lives in sessionStorage; cleanup is best effort.
  }
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const list = parsed
      .map(parseConversation)
      .filter((conversation): conversation is ChatConversation => {
        if (!conversation || seen.has(conversation.id)) return false;
        seen.add(conversation.id);
        return true;
      });
    return sortNewestFirst(list);
  } catch (error) {
    console.warn('Could not read saved chats', error);
    return [];
  }
}

export function saveConversations(
  list: ChatConversation[],
  storage: ChatStorage | null = defaultStorage(),
): void {
  if (!storage) return;
  let capped = sortNewestFirst(list)
    .slice(0, MAX_CONVERSATIONS)
    .map((conversation) => ({
      ...conversation,
      messages: conversation.messages.slice(-MAX_MESSAGES),
    }));

  // On a quota error drop the oldest half once and retry.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(capped));
      return;
    } catch (error) {
      if (attempt === 1 || capped.length <= 1) {
        console.warn('Could not save chats', error);
        return;
      }
      capped = capped.slice(0, Math.ceil(capped.length / 2));
    }
  }
}

export function upsertConversation(
  list: ChatConversation[],
  conversation: ChatConversation,
): ChatConversation[] {
  const rest = list.filter((item) => item.id !== conversation.id);
  return sortNewestFirst([conversation, ...rest]);
}

export function removeConversation(list: ChatConversation[], id: string): ChatConversation[] {
  return list.filter((item) => item.id !== id);
}

export function clearConversations(storage: ChatStorage | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear saved chats', error);
  }
}

export function titleFromMessages(messages: StoredMessage[]): string {
  const first = messages.find((message) => message.role === 'user');
  const text = first?.content.replace(/\s+/g, ' ').trim() ?? '';
  if (!text) return DEFAULT_TITLE;
  return text.length > TITLE_MAX_LENGTH ? `${text.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…` : text;
}

export function newConversationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function startOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function groupByRecency(
  conversations: ChatConversation[],
  now: number = Date.now(),
): ConversationGroup[] {
  const today = new Date(startOfLocalDay(now));
  const dayStart = (daysAgo: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo).getTime();
  const todayStart = dayStart(0);
  const yesterdayStart = dayStart(1);
  const weekStart = dayStart(7);

  const groups: ConversationGroup[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Previous 7 days', items: [] },
    { label: 'Older', items: [] },
  ];
  for (const conversation of sortNewestFirst(conversations)) {
    const stamp = conversation.updatedAt;
    if (stamp >= todayStart) groups[0].items.push(conversation);
    else if (stamp >= yesterdayStart) groups[1].items.push(conversation);
    else if (stamp >= weekStart) groups[2].items.push(conversation);
    else groups[3].items.push(conversation);
  }
  return groups.filter((group) => group.items.length > 0);
}
