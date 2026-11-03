import { useMemo } from 'react';
import { Award, CalendarCheck, Flame, Send } from 'lucide-react';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { attendedWeekStreak, getBadges } from '../lib/progress';

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Flame;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-surface p-4">
      <Icon className="h-5 w-5 text-coral-ink" aria-hidden="true" />
      <div>
        <p className="font-display text-2xl leading-none text-navy-900">{value}</p>
        <p className="mt-1 text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
}

/** Encouraging progress: what the student has done, with no comparison to anyone else. */
export function MomentumSection() {
  const { attendedEventIds, appliedResourceIds } = useApp();

  const attendedEvents = useMemo(
    () => events.filter((event) => attendedEventIds.includes(event.id)),
    [attendedEventIds],
  );
  const appliedCount = useMemo(
    () => resources.filter((resource) => appliedResourceIds.includes(resource.id)).length,
    [appliedResourceIds],
  );
  const streak = attendedWeekStreak(attendedEvents);
  const badges = getBadges(attendedEvents.length, appliedCount);
  const earnedCount = badges.filter((badge) => badge.earned).length;
  const total = attendedEvents.length + appliedCount;

  const message =
    total === 0
      ? 'Mark an event you went to, or a resource you applied to, and it will show up here.'
      : `Nice work. You have taken ${total} real step${total === 1 ? '' : 's'} toward your goals.`;

  return (
    <section
      aria-labelledby="momentum-heading"
      className="rounded-2xl border border-slate-200/70 bg-surface p-6 shadow-card"
    >
      <h2 id="momentum-heading" className="text-lg font-semibold text-navy-900">
        Your momentum
      </h2>
      <p className="mt-1 text-sm text-slate-600">{message}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat icon={CalendarCheck} value={attendedEvents.length} label="Events attended" />
        <Stat icon={Send} value={appliedCount} label="Applications sent" />
        <Stat icon={Flame} value={streak} label={streak === 1 ? 'Week in a row' : 'Weeks in a row'} />
      </div>

      <h3 className="mt-6 flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Award className="h-4 w-4 text-coral-ink" aria-hidden="true" />
        Badges ({earnedCount} of {badges.length})
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <li
            key={badge.id}
            title={badge.earned ? 'Earned' : badge.hint}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              badge.earned
                ? 'border-coral-600 bg-coral-600 text-white'
                : 'border-dashed border-slate-300 text-slate-500'
            }`}
          >
            {badge.label}
            {!badge.earned && <span className="sr-only"> (locked: {badge.hint})</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
