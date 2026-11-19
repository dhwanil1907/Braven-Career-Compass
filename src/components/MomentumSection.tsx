import { useMemo } from 'react';
import { ArrowRight, CalendarCheck, Flame, Send, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { attendedWeekStreak } from '../lib/progress';

type Tone = 'lime' | 'sky' | 'coral';

// Fixed fills with fixed text colors, so each card reads the same in light and dark.
const TONES: Record<Tone, { card: string; chip: string }> = {
  lime: { card: 'bg-teal-300 text-sky-ink', chip: 'bg-sky-ink/10' },
  sky: { card: 'bg-sky-200 text-sky-ink', chip: 'bg-sky-ink/10' },
  coral: { card: 'bg-coral-600 text-white', chip: 'bg-white/20' },
};

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Flame;
  value: number;
  label: string;
  tone: Tone;
}) {
  const { card, chip } = TONES[tone];
  return (
    <div
      className={`flex min-h-[12rem] flex-col justify-between rounded-3xl p-6 transition-transform
        duration-300 hover:-translate-y-1 sm:p-7 ${card}`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${chip}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-7xl font-semibold leading-none tracking-[-0.04em]">
          {value}
        </p>
        <p className="mt-2 text-base font-medium">{label}</p>
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
      <h2
        id="momentum-heading"
        className="font-display text-3xl font-semibold tracking-[-0.03em] text-navy-900 sm:text-4xl"
      >
        Your momentum
      </h2>

      {allZero ? (
        <div
          className="mt-5 flex flex-col gap-5 rounded-3xl bg-teal-300 p-7 text-sky-ink sm:flex-row
            sm:items-center sm:p-9"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-ink/10">
            <Sprout className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="flex-1 font-display text-2xl font-medium leading-snug tracking-[-0.02em]">
            Your first step starts here. Mark an event you went to, or an internship you applied
            to, and it shows up here.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              to="/internships"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-sky-ink px-5 text-white
                transition hover:opacity-85"
            >
              Find internships
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/events"
              className="inline-flex h-11 items-center rounded-full bg-sky-ink/10 px-5 transition
                hover:bg-sky-ink/20"
            >
              Browse events
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-base text-slate-600">
            {`Nice work. You have taken ${total} real step${total === 1 ? '' : 's'} toward your goals.`}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Stat
              icon={CalendarCheck}
              value={attendedEvents.length}
              label="Events attended"
              tone="lime"
            />
            <Stat icon={Send} value={appliedCount} label="Applications sent" tone="sky" />
            <Stat
              icon={Flame}
              value={streak}
              label={streak === 1 ? 'Week in a row' : 'Weeks in a row'}
              tone="coral"
            />
          </div>
        </>
      )}
    </section>
  );
}
