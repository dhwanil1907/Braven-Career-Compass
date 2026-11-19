import { useCallback, useEffect, useRef, useState } from 'react';
import { History } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { ChatPanel } from '../components/ChatPanel';
import { ChatSidebar } from '../components/ChatSidebar';
import {
  clearConversations,
  loadConversations,
  newConversationId,
  removeConversation,
  saveConversations,
  titleFromMessages,
  upsertConversation,
} from '../lib/chat/history';
import type { ChatConversation, StoredMessage } from '../lib/chat/history';

const ACTIVE_KEY = 'bcc:chatActive';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

function readActiveId(): string | null {
  try {
    return sessionStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

function writeActiveId(id: string): void {
  try {
    sessionStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // Session storage can be blocked; the chat still works without remembering the tab.
  }
}

function initialState(): { conversations: ChatConversation[]; activeId: string } {
  const conversations = loadConversations();
  const stored = readActiveId();
  const activeId =
    stored && conversations.some((conversation) => conversation.id === stored)
      ? stored
      : newConversationId();
  return { conversations, activeId };
}

export function AssistantPage() {
  usePageTitle('Assistant');
  const [initial] = useState(initialState);
  const [conversations, setConversations] = useState(initial.conversations);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const conversationsRef = useRef(conversations);
  // A reply still streaming in a deleted chat settles after deletion and must not bring it back.
  const deletedIdsRef = useRef(new Set<string>());
  const drawerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const commit = useCallback((next: ChatConversation[]) => {
    conversationsRef.current = next;
    setConversations(next);
    saveConversations(next);
  }, []);

  useEffect(() => {
    writeActiveId(activeId);
  }, [activeId]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    drawerButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    drawerRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  const persist = useCallback(
    (id: string, messages: StoredMessage[]) => {
      if (messages.length === 0 || deletedIdsRef.current.has(id)) return;
      const existing = conversationsRef.current.find((conversation) => conversation.id === id);
      const now = Date.now();
      commit(
        upsertConversation(conversationsRef.current, {
          id,
          title: existing?.title ?? titleFromMessages(messages),
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
          messages,
        }),
      );
    },
    [commit],
  );

  const select = (id: string) => {
    setActiveId(id);
    setDrawerOpen(false);
    drawerButtonRef.current?.focus();
  };

  const startNew = () => {
    setActiveId(newConversationId());
    setDrawerOpen(false);
    drawerButtonRef.current?.focus();
  };

  const remove = (id: string) => {
    deletedIdsRef.current.add(id);
    commit(removeConversation(conversationsRef.current, id));
    if (id === activeId) setActiveId(newConversationId());
  };

  const clearAll = () => {
    for (const conversation of conversationsRef.current) {
      deletedIdsRef.current.add(conversation.id);
    }
    deletedIdsRef.current.add(activeId);
    conversationsRef.current = [];
    setConversations([]);
    clearConversations();
    setActiveId(newConversationId());
  };

  const sidebarProps = {
    conversations,
    activeId,
    onSelect: select,
    onNew: startNew,
    onDelete: remove,
    onClearAll: clearAll,
  };
  const activeConversation = conversations.find((conversation) => conversation.id === activeId);

  return (
    <div className="mx-auto flex h-[calc(100dvh-5rem)] min-h-[32rem] w-full max-w-none gap-6 px-4 sm:px-6">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 pb-3 pr-4 lg:block">
        <ChatSidebar {...sidebarProps} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-12 items-center gap-2 py-2">
          <button
            ref={drawerButtonRef}
            type="button"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-400 px-4
              text-sm font-semibold text-navy-900 transition hover:bg-slate-100 lg:hidden ${focusRing}`}
          >
            <History className="h-4 w-4" aria-hidden="true" />
            Chats
          </button>
          <h1 className="text-base font-semibold text-navy-900">Career Compass Assistant</h1>
          <span className="rounded-full bg-coral-600 px-2 py-0.5 text-[0.65rem] font-bold text-white">
            AI
          </span>
        </div>
        <div className="min-h-0 flex-1">
          <ChatPanel
            key={activeId}
            conversationId={activeId}
            initialMessages={activeConversation?.messages ?? []}
            onPersist={(messages) => persist(activeId, messages)}
          />
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close chats"
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Saved chats"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-card outline-none"
          >
            <ChatSidebar {...sidebarProps} />
          </div>
        </div>
      )}
    </div>
  );
}
