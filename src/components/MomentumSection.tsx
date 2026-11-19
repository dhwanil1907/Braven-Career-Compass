import { useMemo } from 'react';
import { ArrowRight, CalendarCheck, Flame, Send, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { attendedWeekStreak } from '../lib/progress';

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
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-4">
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
  const total = attendedEvents.length + appliedCount;
  const allZero = attendedEvents.length === 0 && appliedCount === 0 && streak === 0;

  return (
    <section aria-labelledby="momentum-heading">
      <h2 id="momentum-heading" className="text-xl font-semibold text-navy-900">
        Your momentum
      </h2>

      {allZero ? (
        <div
          className="mt-3 flex flex-col gap-4 rounded-xl border border-slate-200 bg-surface px-5 py-5
            sm:flex-row sm:items-center"
        >
          <Sprout className="h-6 w-6 shrink-0 text-teal-700" aria-hidden="true" />
          <p className="flex-1 text-sm text-slate-700">
            Your first step starts here. Mark an event you went to, or an internship you applied
            to, and it will show up here.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <Link
              to="/internships"
              className="inline-flex min-h-11 items-center gap-1 text-coral-ink underline
                underline-offset-4 hover:text-navy-900"
            >
              Find internships
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/events"
              className="inline-flex min-h-11 items-center gap-1 text-coral-ink underline
                underline-offset-4 hover:text-navy-900"
            >
              Browse events
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-slate-600">
            {`Nice work. You have taken ${total} real step${total === 1 ? '' : 's'} toward your goals.`}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Stat icon={CalendarCheck} value={attendedEvents.length} label="Events attended" />
            <Stat icon={Send} value={appliedCount} label="Applications sent" />
            <Stat
              icon={Flame}
              value={streak}
              label={streak === 1 ? 'Week in a row' : 'Weeks in a row'}
            />
          </div>
        </>
      )}
    </section>
  );
}
