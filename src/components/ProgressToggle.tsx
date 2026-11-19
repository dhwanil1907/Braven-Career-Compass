import { useApp } from '../context/useApp';
import { showToast } from '../lib/toast';
import { TickBox } from './TickBox';

const COPY = {
  attended: { off: 'I attended', on: 'Attended' },
  applied: { off: 'I applied', on: 'Applied' },
} as const;

const TOAST = {
  attended: { on: 'Marked as attended', off: 'Attendance removed' },
  applied: { on: 'Marked as applied. Track it in My journey.', off: 'Removed from your tracker' },
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

  return (
    <button
      type="button"
      onClick={() => {
        if (kind === 'attended') toggleAttended(id);
        else toggleApplied(id);
        showToast(TOAST[kind][done ? 'off' : 'on']);
      }}
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
      <TickBox checked={done} round size="h-5 w-5" />
      {!compact && (done ? COPY[kind].on : COPY[kind].off)}
    </button>
  );
}
