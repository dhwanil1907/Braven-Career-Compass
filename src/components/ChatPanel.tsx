import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Compass,
  Copy,
  ExternalLink,
  RefreshCw,
  Square,
  SquarePen,
} from 'lucide-react';
import { useApp } from '../context/useApp';
import { streamChat } from '../lib/chat/client';
import type { ChatProfile, ChatMessage, ChatSource } from '../lib/chat/types';
import { ChatMarkdown } from './ChatMarkdown';

interface DisplayMessage extends ChatMessage {
  sources?: ChatSource[];
}

const MAX_INPUT_LENGTH = 800;
const MAX_INPUT_HEIGHT_PX = 192;
const STICK_TO_BOTTOM_PX = 80;
const COPIED_RESET_MS = 2000;
const STORAGE_KEY = 'bcc:chat';
const BASE_STARTERS = [
  'How do I contact Braven?',
  'Help me improve my resume bullets',
  'Run a mock interview with me',
];

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600';
const iconButton = `inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600
  transition hover:bg-slate-100 hover:text-navy-900 ${focusRing}`;

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

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function AssistantAvatar() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral-600 text-white"
    >
      <Compass className="h-4 w-4" />
    </span>
  );
}

function TypingDots() {
  return (
    <div className="flex h-8 items-center">
      <span className="sr-only">The assistant is typing</span>
      <span aria-hidden="true" className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{ animationDelay: `${dot * 150}ms` }}
            className="h-2 w-2 rounded-full bg-slate-400 motion-safe:animate-pulse"
          />
        ))}
      </span>
    </div>
  );
}

/** The conversation itself: header row, message list, starter questions and the composer. */
export function ChatPanel() {
  const { profile } = useApp();
  const [messages, setMessages] = useState<DisplayMessage[]>(loadStoredMessages);
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

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  // Persist only settled messages; partial streaming text is saved once the stream ends or stops.
  useEffect(() => {
    if (streaming) return;
    storeMessages(messages.filter((message) => message.role === 'user' || message.content));
  }, [messages, streaming]);

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
      setStreaming(false);

      const sources = result.ok ? result.sources : undefined;
      if (text) {
        setMessages([...history, { role: 'assistant', content: text, sources }]);
      } else {
        setMessages(history);
      }
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

  const startOver = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStreaming(false);
    setFinished(false);
    setMessages([]);
    setError(null);
    setDraft('');
    inputRef.current?.focus({ preventScroll: true });
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
  const statusText = streaming ? 'Assistant is responding' : finished ? 'Response complete' : '';

  return (
    <div className="flex h-[calc(100dvh-5rem)] min-h-[32rem] flex-col">
      <div className="flex min-h-12 items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-navy-900">Career Compass Assistant</h1>
          <span className="rounded-full bg-coral-600 px-2 py-0.5 text-[0.65rem] font-bold text-white">
            AI
          </span>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={startOver}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-300
              px-3 text-sm font-semibold text-navy-900 transition hover:border-coral-600 ${focusRing}`}
          >
            <SquarePen className="h-4 w-4" aria-hidden="true" />
            New chat
          </button>
        )}
      </div>

      <p role="status" className="sr-only">
        {statusText}
      </p>

      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          role="log"
          aria-label="Conversation"
          aria-live={streaming ? 'off' : 'polite'}
          onScroll={handleScroll}
          className="h-full overflow-y-auto overflow-x-hidden py-4"
        >
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center gap-8 px-1 py-6">
              <h2 className="text-center text-2xl font-semibold text-navy-900 sm:text-3xl">
                How can I help with your career today?
              </h2>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    disabled={streaming}
                    onClick={() => ask(starter)}
                    className={`min-h-14 rounded-2xl border border-slate-300 bg-surface px-4 py-3
                      text-left text-sm text-navy-900 transition hover:border-coral-600
                      hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => {
                if (message.role === 'user') {
                  return (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl bg-slate-100 px-4 py-2.5 text-navy-900">
                        {message.content}
                      </div>
                    </div>
                  );
                }
                const isPending = streaming && index === messages.length - 1;
                const isLast = index === lastAssistantIndex;
                return (
                  <div key={index} className="flex gap-3">
                    <AssistantAvatar />
                    <div className="min-w-0 flex-1 text-navy-900">
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
                                className={`inline-flex min-h-8 items-center gap-1 rounded-full border
                                  border-slate-300 px-2.5 py-1 text-xs text-navy-900
                                  hover:border-coral-600 hover:text-coral-ink ${focusRing}`}
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
                        <div className="-ml-2 mt-1 flex items-center gap-0.5">
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
                <div role="alert" className="flex gap-3">
                  <AssistantAvatar />
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                    <p className="rounded-2xl border border-coral-600 bg-surface px-3.5 py-2.5 text-sm text-navy-900">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={retry}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full bg-coral-600 px-4
                        text-sm font-semibold text-white transition hover:bg-coral-700 ${focusRing}`}
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
              transition hover:border-coral-600 ${focusRing}`}
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Scroll to latest message</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="pb-2 pt-2">
        <div
          className="flex items-end gap-2 rounded-3xl border border-slate-300 bg-surface py-2 pl-4 pr-2
            shadow-card focus-within:border-coral-600"
        >
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
            placeholder="Ask anything about your career search"
            className="max-h-48 min-h-10 flex-1 resize-none self-center bg-transparent py-2 text-base
              leading-6 text-navy-900 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!streaming && !draft.trim()}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full
              bg-coral-600 text-white transition hover:bg-coral-700 disabled:cursor-not-allowed
              disabled:opacity-40 ${focusRing}`}
          >
            {streaming ? (
              <Square className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">{streaming ? 'Stop generating' : 'Send message'}</span>
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-600">
          AI can make mistakes. Check listings and company details.
          {chatProfile ? ' Your major, interests, year and goal are sent with each question.' : ''}
        </p>
      </form>
    </div>
  );
}
