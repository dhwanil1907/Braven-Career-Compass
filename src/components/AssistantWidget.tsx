import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, MessageCircle, Send, X } from 'lucide-react';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { answerQuestion } from '../lib/assistant';
import type { AssistantReply } from '../lib/assistant';
import { formatDate } from '../lib/dates';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  reply?: AssistantReply;
}

const SUGGESTIONS = [
  'How can I find my first internship without experience?',
  'Help me prepare for interviews',
  'What events can I go to this month?',
];

export function AssistantWidget() {
  const { profile } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const reply = answerQuestion(trimmed, profile, resources, events);
    setMessages((previous) => [
      ...previous,
      { id: nextId.current++, role: 'user', text: trimmed },
      { id: nextId.current++, role: 'assistant', text: reply.summary, reply },
    ]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 sm:bottom-6 sm:left-6">
      {open && (
        <section
          role="dialog"
          aria-label="Career assistant (demo)"
          className="mb-3 flex h-[32rem] max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden
            rounded-2xl border border-slate-200 bg-surface shadow-card-hover"
        >
          <header className="flex items-start justify-between gap-3 bg-deep px-4 py-3 text-white">
            <div>
              <h2 className="font-display text-lg font-semibold">Career assistant</h2>
              <p className="text-xs text-[#dfe5ef]/80">Demo mode: not a live AI</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
            <p className="flex items-start gap-2 rounded-xl bg-navy-50 p-3 text-xs text-slate-600">
              <Info className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
              Answers are assembled by rules from the Career Compass catalog and only link to items
              in it. General tips are labeled as such. Always confirm details on the source site.
            </p>

            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy-900">Try asking:</p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => ask(suggestion)}
                    className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm
                      text-slate-700 transition hover:border-teal-400 hover:bg-teal-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message) =>
              message.role === 'user' ? (
                <p
                  key={message.id}
                  className="ml-8 rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-sm text-on-ink"
                >
                  {message.text}
                </p>
              ) : (
                <div key={message.id} className="mr-4 space-y-3 text-sm text-slate-700">
                  <p>{message.text}</p>
                  {message.reply && message.reply.steps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        General advice
                      </p>
                      <ol className="mt-1 list-decimal space-y-1 pl-5">
                        {message.reply.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {message.reply && message.reply.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        From the catalog
                      </p>
                      <ul className="mt-1 space-y-1.5">
                        {message.reply.resources.map((resource) => (
                          <li key={resource.id}>
                            <Link
                              to={`/resources/${resource.id}`}
                              onClick={() => setOpen(false)}
                              className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                            >
                              {resource.title}
                            </Link>
                            <span className="text-slate-500"> · {resource.resourceType}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.reply && message.reply.events.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Upcoming events
                      </p>
                      <ul className="mt-1 space-y-1.5">
                        {message.reply.events.map((event) => (
                          <li key={event.id}>
                            <Link
                              to={`/events?event=${event.id}`}
                              onClick={() => setOpen(false)}
                              className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                            >
                              {event.title}
                            </Link>
                            <span className="text-slate-500"> · {formatDate(event.start)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>

          <form
            onSubmit={(submitEvent) => {
              submitEvent.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(changeEvent) => setInput(changeEvent.target.value)}
              placeholder="Ask about internships, resumes, events…"
              aria-label="Ask the career assistant"
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-transparent px-4 py-2
                text-sm text-navy-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-coral-600
                text-white transition hover:bg-deep disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-deep px-5 text-sm font-semibold
          text-white shadow-card-hover transition hover:bg-deep-2"
      >
        <MessageCircle className="h-5 w-5 text-teal-300" aria-hidden="true" />
        Ask Compass
      </button>
    </div>
  );
}
