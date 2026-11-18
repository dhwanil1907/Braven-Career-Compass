import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { groupByRecency } from '../lib/chat/history';
import type { ChatConversation } from '../lib/chat/history';

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600';
const confirmButtons = `inline-flex min-h-10 items-center rounded-full px-3 text-sm font-semibold
  transition ${focusRing}`;

interface ConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function InlineConfirm({ message, onConfirm, onCancel }: ConfirmProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onCancel();
    }
  };

  return (
    <div
      role="group"
      aria-label={message}
      onKeyDown={handleKeyDown}
      className="rounded-xl border border-coral-600 bg-surface px-3 py-2"
    >
      <p className="text-sm text-navy-900">{message}</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          autoFocus
          onClick={onConfirm}
          className={`${confirmButtons} bg-coral-600 text-white hover:bg-coral-700`}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`${confirmButtons} border border-slate-300 text-navy-900 hover:border-coral-600`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
}: ChatSidebarProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const groups = groupByRecency(conversations);

  return (
    <nav aria-label="Saved chats" className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className="text-sm font-semibold text-navy-900">Chats</h2>
      </div>
      <button
        type="button"
        onClick={onNew}
        className={`mb-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full
          bg-coral-600 px-4 text-sm font-semibold text-white transition hover:bg-coral-700 ${focusRing}`}
      >
        <SquarePen className="h-4 w-4" aria-hidden="true" />
        New chat
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {groups.length === 0 ? (
          <p className="px-2 py-4 text-sm text-slate-600">Your chats will appear here.</p>
        ) : (
          groups.map((group) => (
            <section key={group.label} aria-label={group.label} className="mb-3">
              <h3 className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {group.label}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((conversation) => {
                  const active = conversation.id === activeId;
                  if (pendingDeleteId === conversation.id) {
                    return (
                      <li key={conversation.id}>
                        <InlineConfirm
                          message="Delete this chat?"
                          onCancel={() => setPendingDeleteId(null)}
                          onConfirm={() => {
                            setPendingDeleteId(null);
                            onDelete(conversation.id);
                          }}
                        />
                      </li>
                    );
                  }
                  return (
                    <li
                      key={conversation.id}
                      className={`group relative flex items-center rounded-xl border-l-4 transition
                        ${active ? 'border-coral-600 bg-slate-100' : 'border-transparent hover:bg-slate-50'}`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(conversation.id)}
                        aria-current={active ? 'true' : undefined}
                        title={conversation.title}
                        className={`min-h-10 min-w-0 flex-1 rounded-xl py-2 pl-2 pr-12 text-left text-sm
                          text-navy-900 ${focusRing}`}
                      >
                        <span className="block truncate">{conversation.title}</span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete chat: ${conversation.title}`}
                        onClick={() => setPendingDeleteId(conversation.id)}
                        className={`absolute right-1 inline-flex h-10 w-10 items-center justify-center
                          rounded-full text-slate-600 transition hover:text-coral-ink
                          opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100
                          ${focusRing}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      {conversations.length > 0 && (
        <div className="border-t border-slate-200 pt-2">
          {confirmingClear ? (
            <InlineConfirm
              message="Delete all chats?"
              onCancel={() => setConfirmingClear(false)}
              onConfirm={() => {
                setConfirmingClear(false);
                onClearAll();
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              className={`min-h-10 rounded-full px-3 text-sm text-slate-600 transition
                hover:text-coral-ink ${focusRing}`}
            >
              Clear all chats
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
