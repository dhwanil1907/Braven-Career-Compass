import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Square,
} from 'lucide-react';
import { useApp } from '../context/useApp';
import { streamChat } from '../lib/chat/client';
import type { StoredMessage } from '../lib/chat/history';
import type { ChatProfile, ChatMessage, ChatSource } from '../lib/chat/types';
import { ChatMarkdown } from './ChatMarkdown';

interface DisplayMessage extends ChatMessage {
  sources?: ChatSource[];
}

const MAX_INPUT_LENGTH = 800;
const MAX_INPUT_HEIGHT_PX = 192;
const STICK_TO_BOTTOM_PX = 80;
const COPIED_RESET_MS = 2000;
const BASE_STARTERS = [
  'How do I contact Braven?',
  'Help me improve my resume bullets',
  'Run a mock interview with me',
];

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const iconButton = `inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600
  transition hover:bg-slate-100 hover:text-navy-900 ${focusRing}`;

function settleInitialMessages(messages: StoredMessage[]): DisplayMessage[] {
  // A trailing question means the answer never arrived; drop it instead of showing it unanswered.
  return messages.at(-1)?.role === 'user' ? messages.slice(0, -1) : messages;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function TypingDots() {
  return (
    <div className="flex h-8 items-center">
      <span className="sr-only">The assistant is typing</span>
      <span aria-hidden="true" className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{ animationDelay: `${dot * 160}ms` }}
            className="h-2 w-2 rounded-full bg-slate-500 motion-safe:animate-dot"
          />
        ))}
      </span>
    </div>
  );
}

interface ChatPanelProps {
  conversationId: string;
  initialMessages: StoredMessage[];
  /** Called when a turn settles (finished, stopped or failed), never per streamed token. */
  onPersist: (messages: StoredMessage[]) => void;
}

/** The conversation itself: message list, starter questions and the composer. */
export function ChatPanel({ conversationId, initialMessages, onPersist }: ChatPanelProps) {
  const { profile } = useApp();
  const [messages, setMessages] = useState<DisplayMessage[]>(() =>
    settleInitialMessages(initialMessages),
  );
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showJump, setShowJump] = useState(false);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const stickRef = useRef(true);
  const frameRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const onPersistRef = useRef(onPersist);
  onPersistRef.current = onPersist;

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

  const starters = useMemo(
    () => [
      profile.onboarded && profile.major
        ? `Find ${profile.major} internships for me`
        : 'Find internships for my major',
      ...BASE_STARTERS,
    ],
    [profile.onboarded, profile.major],
  );

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Pressing "/" anywhere on the page jumps to the message box, unless the student is typing.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const { target } = event;
      const typing =
        target instanceof HTMLElement &&
        target.matches('input, textarea, select, [contenteditable="true"]');
      if (typing) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // The aborted request still settles and persists its partial text without touching state.
      controllerRef.current?.abort();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT_PX)}px`;
  }, [draft]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list && stickRef.current) list.scrollTop = list.scrollHeight;
  }, [messages, error, streaming]);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight;
    stickRef.current = distance <= STICK_TO_BOTTOM_PX;
    setShowJump(!stickRef.current);
  };

  const scrollToLatest = () => {
    const list = listRef.current;
    if (!list) return;
    stickRef.current = true;
    setShowJump(false);
    list.scrollTo({
      top: list.scrollHeight,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const requestReply = useCallback(
    async (history: DisplayMessage[]) => {
      const controller = new AbortController();
      controllerRef.current = controller;
      stickRef.current = true;
      setStreaming(true);
      setFinished(false);
      setError(null);
      setMessages([...history, { role: 'assistant', content: '' }]);

      let text = '';
      const flush = () => {
        frameRef.current = null;
        setMessages((current) => [...current.slice(0, -1), { role: 'assistant', content: text }]);
      };
      const cancelFrame = () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      };

      const result = await streamChat(
        history.map(({ role, content }) => ({ role, content })),
        chatProfile,
        {
          onDelta: (delta) => {
            text += delta;
            frameRef.current ??= requestAnimationFrame(flush);
          },
        },
        { signal: controller.signal },
      );

      cancelFrame();
      if (controllerRef.current !== controller) return;
      controllerRef.current = null;

      const sources = result.ok ? result.sources : undefined;
      const settled: DisplayMessage[] = text
        ? [...history, { role: 'assistant', content: text, sources }]
        : history;
      onPersistRef.current(settled);
      if (!mountedRef.current) return;

      setStreaming(false);
      setMessages(settled);
      if (result.ok) {
        setFinished(true);
      } else if (result.aborted) {
        setFinished(true);
        if (!text) setError('Response stopped.');
      } else {
        setError(result.error);
      }
    },
    [chatProfile],
  );

  const ask = (question: string) => {
    const content = question.trim();
    if (!content || streaming) return;
    setDraft('');
    void requestReply([...messages, { role: 'user', content }]);
  };

  const stop = () => controllerRef.current?.abort();

  const regenerate = () => {
    if (streaming) return;
    const lastUser = messages.findLastIndex((message) => message.role === 'user');
    if (lastUser >= 0) void requestReply(messages.slice(0, lastUser + 1));
  };

  const retry = () => {
    if (!streaming && messages.at(-1)?.role === 'user') void requestReply(messages);
  };

  const copy = async (index: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (copyError) {
      console.warn('Could not copy the reply to the clipboard', copyError);
      return;
    }
    setCopiedIndex(index);
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopiedIndex(null), COPIED_RESET_MS);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (streaming) stop();
    else ask(draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      ask(draft);
    }
  };

  const lastAssistantIndex = messages.findLastIndex((message) => message.role === 'assistant');
  const lastMessage = messages.at(-1);
  const awaitingFirstToken = streaming && lastMessage?.role === 'assistant' && !lastMessage.content;
  const statusText = streaming ? 'Wayfinder is responding' : finished ? 'Response complete' : '';

  const empty = messages.length === 0;

  const composer = (
      <form onSubmit={handleSubmit} className="pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div
          className="focus-host group flex cursor-text items-end gap-2 rounded-full border
            border-slate-400 bg-slate-100 py-0.5 pl-3 pr-0.5 transition hover:border-slate-500
            focus-within:border-transparent focus-within:bg-white dark:focus-within:bg-surface"
        >
          <label htmlFor="chat-input" className="sr-only">
            Ask Wayfinder
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_INPUT_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about internships, events, resumes…"
            className="max-h-40 min-h-6 flex-1 resize-none self-center bg-transparent py-0 text-[0.8125rem]
              leading-5 text-navy-900 outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!streaming && !draft.trim()}
            className={`relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full
              bg-ink text-on-ink transition hover:opacity-85 disabled:cursor-not-allowed
              disabled:bg-slate-300 disabled:text-slate-600 disabled:opacity-100
              before:absolute before:-inset-2 before:content-[''] ${focusRing}`}
          >
            {streaming ? (
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
            ) : (
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            )}
            <span className="sr-only">{streaming ? 'Stop generating' : 'Send message'}</span>
          </button>
        </div>
      </form>
  );

  return (
    <div data-conversation-id={conversationId} className="flex h-full min-h-0 flex-col">
      <p role="status" className="sr-only">
        {statusText}
      </p>

      {empty ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-1 pb-10">
          <h2 className="text-center font-display text-3xl font-semibold tracking-[-0.03em] text-navy-900 sm:text-4xl">
            What are we working on today?
          </h2>
          <div className="w-full max-w-3xl">{composer}</div>
          <ul className="w-full max-w-3xl">
            {starters.map((starter) => (
              <li key={starter}>
                <button
                  type="button"
                  disabled={streaming}
                  onClick={() => ask(starter)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-base
                    text-slate-700 transition hover:bg-slate-100 hover:text-navy-900
                    disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-100 ${focusRing}`}
                >
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                  {starter}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          role="log"
          aria-label="Conversation"
          aria-live={streaming ? 'off' : 'polite'}
          onScroll={handleScroll}
          className="h-full overflow-y-auto overflow-x-hidden px-2 py-4"
        >
          {messages.length > 0 && (
            <div className="mx-auto max-w-3xl space-y-8">
              {messages.map((message, index) => {
                if (message.role === 'user') {
                  return (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl bg-slate-100 px-5 py-3 leading-relaxed text-navy-900 dark:bg-surface">
                        {message.content}
                      </div>
                    </div>
                  );
                }
                const isPending = streaming && index === messages.length - 1;
                const isLast = index === lastAssistantIndex;
                return (
                  <div key={index}>
                    <div className="min-w-0 text-navy-900">
                      {isPending && awaitingFirstToken ? (
                        <TypingDots />
                      ) : (
                        <ChatMarkdown text={message.content} />
                      )}
                      {message.sources && message.sources.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {message.sources.map((source) => (
                            <li key={`${source.kind}-${source.url}`}>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex min-h-8 items-center gap-1 rounded-full bg-slate-100 px-3
                                  py-1 text-xs text-navy-900 hover:bg-slate-200 dark:bg-surface
                                  dark:hover:bg-raised ${focusRing}`}
                              >
                                <span className="truncate">{source.title}</span>
                                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                                <span className="sr-only">(opens in a new tab)</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                      {!isPending && message.content && (
                        <div className="-ml-3 mt-1 flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => void copy(index, message.content)}
                            className={iconButton}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Copy className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {copiedIndex === index ? 'Copied' : 'Copy reply'}
                            </span>
                          </button>
                          {copiedIndex === index && (
                            <span aria-hidden="true" className="pr-2 text-xs text-slate-600">
                              Copied
                            </span>
                          )}
                          {isLast && (
                            <button
                              type="button"
                              disabled={streaming}
                              onClick={regenerate}
                              className={`${iconButton} disabled:opacity-50`}
                            >
                              <RefreshCw className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">Regenerate reply</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {error && !streaming && (
                <div role="alert">
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <p className="text-base text-coral-ink">{error}</p>
                    <button
                      type="button"
                      onClick={retry}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-300
                        px-4 text-sm font-semibold text-navy-900 transition hover:bg-slate-100
                        dark:hover:bg-surface ${focusRing}`}
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showJump && (
          <button
            type="button"
            onClick={scrollToLatest}
            className={`absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center
              justify-center rounded-full border border-slate-300 bg-surface text-navy-900 shadow-card
              transition hover:border-slate-400 ${focusRing}`}
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Scroll to latest message</span>
          </button>
        )}
      </div>

          <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </>
      )}
      <p className="pb-1 pt-2 text-center text-[0.8125rem] leading-snug text-slate-600">
          Wayfinder is AI and can make mistakes. Check listings before you apply.      </p>
    </div>
  );
}
