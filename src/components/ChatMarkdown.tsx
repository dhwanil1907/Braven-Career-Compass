import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: Components = {
  p: ({ children }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h3 className="mb-2 mt-4 text-lg font-semibold">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-1 mt-3 text-base font-semibold">{children}</h4>,
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-3 text-sm text-navy-900">{children}</pre>
  ),
  code: ({ className, children }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-slate-200 px-1.5 py-0.5 text-[0.9em] text-navy-900">{children}</code>
    ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 rounded-lg bg-slate-200 px-3 py-2 text-slate-700">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-slate-300">
      <table className="w-full min-w-max border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-slate-300 bg-slate-100 px-3 py-2 font-semibold text-navy-900">{children}</th>
  ),
  td: ({ children }) => <td className="border border-slate-300 px-3 py-2">{children}</td>,
  hr: () => <hr className="my-4 border-slate-300" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words text-coral-ink underline underline-offset-2 hover:no-underline
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {children}
    </a>
  ),
};

const remarkPlugins = [remarkGfm];

/** Renders assistant markdown. Raw HTML is not enabled, so model output cannot inject markup. */
export const ChatMarkdown = memo(function ChatMarkdown({ text }: { text: string }) {
  return (
    <div className="max-w-[70ch] break-words">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
});
