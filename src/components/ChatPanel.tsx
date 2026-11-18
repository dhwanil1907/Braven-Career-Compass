import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { ExternalLink, RotateCcw, Send } from 'lucide-react';
import { useApp } from '../context/useApp';
import { sendChat } from '../lib/chat/client';
import type { ChatMessage, ChatProfile, ChatSource } from '../lib/chat/types';

interface DisplayMessage extends ChatMessage {
  sources?: ChatSource[];
}

const MAX_INPUT_LENGTH = 800;
const STORAGE_KEY = 'bcc:chat';
const STARTERS = [
  'Internships for my major',
  'How do I contact Braven?',
  'What does a company like NVIDIA look for in interns?',
  'How do I prepare for an interview?',
];
const URL_PATTERN = /(https?:\/\/[^\s<>"]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600';

function loadStoredMessages(): DisplayMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const messages = parsed.filter(
      (item): item is DisplayMessage =>
        typeof item === 'object' &&
        item !== null &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string',
    );
    // A trailing question means the answer never arrived; drop it instead of showing it unanswered.
    return messages.at(-1)?.role === 'user' ? messages.slice(0, -1) : messages;
  } catch {
    return [];
  }
}

function storeMessages(messages: DisplayMessage[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage can be blocked (private mode); the chat still works in memory.
  }
}

function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_PATTERN).map((part, index) => {
        if (index % 2 === 0) return part;
        const trailing = part.match(TRAILING_PUNCTUATION)?.[0] ?? '';
        const url = trailing ? part.slice(0, -trailing.length) : part;
        return (
          <span key={index}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all font-semibold underline underline-offset-2 hover:text-coral-ink
                ${focusRing}`}
            >
              {url}
            </a>
            {trailing}
          </span>
        );
      })}
    </>
  );
}

/** The conversation itself: message list, starter questions and the input. */
export function ChatPanel() {
  const { profile } = useApp();
  const [messages, setMessages] = useState<DisplayMessage[]>(loadStoredMessages);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const chatProfile = useMemo<ChatProfile | undefined>(
    () =>
      profile.onboarded
        ? {
            major: profile.major,
            interests: profile.interests,
            year: profile.year,
            goal: profile.goal,
          }
        : undefined,
    [profile],
  );

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    storeMessages(messages);
  }, [messages]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, loading, error]);

  const requestReply = useCallback(
    async (history: DisplayMessage[]) => {
      setLoading(true);
      setError(null);
      const result = await sendChat(
        history.map(({ role, content }) => ({ role, content })),
        chatProfile,
      );
      setLoading(false);
      if (result.ok) {
        setMessages([...history, { role: 'assistant', content: result.reply, sources: result.sources }]);
      } else {
        setError(result.error);
      }
    },
    [chatProfile],
  );

  const ask = (question: string) => {
    const content = question.trim();
    if (!content || loading) return;
    const history: DisplayMessage[] = [...messages, { role: 'user', content }];
    setMessages(history);
    setDraft('');
    void requestReply(history);
  };

  const startOver = () => {
    setMessages([]);
    setError(null);
    setDraft('');
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      ask(draft);
    }
  };

  return (
    <div
      className="flex h-[min(72vh,46rem)] min-h-[28rem] flex-col overflow-hidden rounded-2xl border
        border-slate-200 bg-surface shadow-card"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <p className="text-xs text-slate-600">
          AI assistant. It can make mistakes, so check listings and company details yourself.
          {chatProfile ? ' Your major, interests, year and goal are sent to answer you better.' : ''}
        </p>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={startOver}
            className={`inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs
              font-semibold text-coral-ink hover:underline ${focusRing}`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            New conversation
          </button>
        )}
      </div>

      <div
        ref={listRef}
        aria-live="polite"
        className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-4"
      >
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Ask about Braven, this site, companies, or anything in your career search.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => ask(starter)}
                  className={`min-h-10 rounded-lg border border-slate-300 px-3 py-2 text-left text-sm
                    text-navy-900 transition hover:border-coral-600 hover:text-coral-ink ${focusRing}`}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1.5 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm ${
                message.role === 'user' ? 'bg-coral-600 text-white' : 'bg-slate-100 text-navy-900'
              }`}
            >
              {message.role === 'assistant' ? <Linkified text={message.content} /> : message.content}
            </div>
            {message.sources && message.sources.length > 0 && (
              <ul className="flex max-w-[88%] flex-wrap gap-1.5">
                {message.sources.map((source) => (
                  <li key={`${source.kind}-${source.url}`}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex min-h-8 items-center gap-1 rounded-full border
                        border-slate-300 px-2.5 py-1 text-xs text-navy-900 hover:border-coral-600
                        hover:text-coral-ink ${focusRing}`}
                    >
                      <span className="truncate">{source.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-600">
              <span className="sr-only">The assistant is typing</span>
              <span aria-hidden="true" className="flex gap-1">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    style={{ animationDelay: `${dot * 150}ms` }}
                    className="h-1.5 w-1.5 rounded-full bg-slate-400 motion-safe:animate-pulse"
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div role="alert" className="flex flex-col items-start gap-1.5">
            <div className="max-w-[88%] rounded-2xl border border-coral-600 bg-surface px-3.5 py-2.5 text-sm text-navy-900">
              {error}
            </div>
            <button
              type="button"
              onClick={() => void requestReply(messages)}
              className={`min-h-10 rounded-full px-3 text-sm font-semibold text-coral-ink underline
                underline-offset-2 ${focusRing}`}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-slate-200 p-3">
        <label htmlFor="chat-input" className="sr-only">
          Ask the assistant
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          rows={1}
          value={draft}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question"
          className={`max-h-32 min-h-10 flex-1 resize-none rounded-lg border border-slate-300 bg-surface
            px-3 py-2 text-sm text-navy-900 ${focusRing}`}
        />
        <button
          type="submit"
          disabled={loading || !draft.trim()}
          className={`inline-flex h-10 items-center gap-1.5 rounded-full bg-coral-600 px-4 text-sm
            font-semibold text-white transition hover:bg-navy-950 disabled:cursor-not-allowed
            disabled:opacity-50 ${focusRing}`}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Send
        </button>
      </form>
    </div>
  );
}
