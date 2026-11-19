import { CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../context/useApp';

const COPY = {
  attended: { off: 'I attended', on: 'Attended' },
  applied: { off: 'I applied', on: 'Applied' },
} as const;

/** Lets a student record that they went to an event or applied to a resource. */
export function ProgressToggle({
  kind,
  id,
  compact = false,
  className = '',
}: {
  kind: 'attended' | 'applied';
  id: string;
  compact?: boolean;
  className?: string;
}) {
  const { isEventAttended, isResourceApplied, toggleAttended, toggleApplied } = useApp();
  const done = kind === 'attended' ? isEventAttended(id) : isResourceApplied(id);
  const Icon = done ? CheckCircle2 : Circle;

  return (
    <button
      type="button"
      onClick={() => (kind === 'attended' ? toggleAttended(id) : toggleApplied(id))}
      aria-pressed={done}
      aria-label={compact ? COPY[kind].off : undefined}
      title={compact ? (done ? COPY[kind].on : COPY[kind].off) : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full border text-sm
        font-semibold transition ${compact ? 'h-11 w-11 md:h-9 md:w-9' : 'h-11 px-4 md:h-10'} ${
          done
            ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100'
            : 'border-slate-300 bg-surface text-navy-900 hover:bg-navy-50'
        } ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {!compact && (done ? COPY[kind].on : COPY[kind].off)}
    </button>
  );
}
