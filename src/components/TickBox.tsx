/**
 * Visual-only checkbox mark: the box fills and the tick draws itself when `checked` turns on.
 * Put it inside a real <input type="checkbox"> label or a toggle button; it carries no semantics.
 */
export function TickBox({
  checked,
  round = false,
  size = 'h-5 w-5',
}: {
  checked: boolean;
  round?: boolean;
  size?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center border-2 transition-colors
        duration-200 ${size} ${round ? 'rounded-full' : 'rounded-md'} ${
          checked ? 'border-ink bg-ink text-on-ink' : 'border-slate-400 bg-surface text-transparent'
        }`}
    >
      <svg viewBox="0 0 16 16" className="h-3/4 w-3/4" fill="none">
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 16,
            strokeDashoffset: checked ? 0 : 16,
            transition: 'stroke-dashoffset 0.25s ease-out 0.05s',
          }}
        />
      </svg>
    </span>
  );
}
