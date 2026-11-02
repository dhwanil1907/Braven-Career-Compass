import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CareerEvent, EventType } from '../types';
import { formatDate, formatTime, isSameDay } from '../lib/dates';

type CalendarMode = 'month' | 'week';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_CHIPS = 2;

const CHIP_CLASSES: Record<EventType, string> = {
  Workshop: 'bg-teal-50 text-teal-800 hover:bg-teal-100',
  Networking: 'bg-violet-50 text-violet-800 hover:bg-violet-100',
  'Career Fair': 'bg-amber-50 text-amber-800 hover:bg-amber-100',
  'Info Session': 'bg-navy-50 text-navy-800 hover:bg-navy-100',
  Panel: 'bg-rose-50 text-rose-800 hover:bg-rose-100',
};

const DOT_CLASSES: Record<EventType, string> = {
  Workshop: 'bg-teal-500',
  Networking: 'bg-violet-500',
  'Career Fair': 'bg-amber-500',
  'Info Session': 'bg-navy-500',
  Panel: 'bg-rose-500',
};

function buildMonthDays(month: Date): Date[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingDays = firstOfMonth.getDay();
  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

  return Array.from(
    { length: totalCells },
    (_, index) => new Date(month.getFullYear(), month.getMonth(), index - leadingDays + 1),
  );
}

function startOfWeek(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const short = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${short(weekStart)} – ${short(weekEnd)}, ${weekEnd.getFullYear()}`;
}

function WeekView({
  events,
  weekStart,
  today,
  onSelectEvent,
}: {
  events: CareerEvent[];
  weekStart: Date;
  today: Date;
  onSelectEvent: (event: CareerEvent) => void;
}) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div className="grid gap-px overflow-hidden rounded-xl bg-slate-100 sm:grid-cols-7">
      {days.map((day) => {
        const isToday = isSameDay(day, today);
        const dayEvents = events.filter((event) => isSameDay(new Date(event.start), day));

        return (
          <section
            key={day.toISOString()}
            aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            className="flex min-h-24 flex-col gap-2 bg-surface p-2.5 sm:min-h-72"
          >
            <header className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {WEEKDAYS[day.getDay()]}
              </span>
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm
                  font-medium ${
                    isToday
                      ? 'bg-teal-50 font-bold text-teal-700 ring-2 ring-teal-500'
                      : 'text-navy-900'
                  }`}
              >
                {day.getDate()}
              </span>
            </header>
            {dayEvents.length === 0 ? (
              <p className="text-xs text-slate-400">No events</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className={`w-full rounded-lg px-2 py-1.5 text-left transition
                        ${CHIP_CLASSES[event.eventType]}`}
                    >
                      <span className="block text-[11px] font-semibold opacity-80">
                        {formatTime(event.start)}
                      </span>
                      <span className="block text-xs font-medium leading-snug">{event.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function CalendarGrid({
  events,
  month,
  onMonthChange,
  onSelectEvent,
}: {
  events: CareerEvent[];
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelectEvent: (event: CareerEvent) => void;
}) {
  const [mode, setMode] = useState<CalendarMode>('month');
  const today = new Date();
  const days = buildMonthDays(month);
  const weekStart = startOfWeek(month);
  const sortedEvents = [...events].sort(
    (first, second) => new Date(first.start).getTime() - new Date(second.start).getTime(),
  );
  const monthEvents = sortedEvents.filter((event) => {
    const start = new Date(event.start);
    return start.getFullYear() === month.getFullYear() && start.getMonth() === month.getMonth();
  });
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const heading = mode === 'month' ? monthLabel : formatWeekRange(weekStart);

  const shift = (offset: number) => {
    onMonthChange(
      mode === 'month'
        ? new Date(month.getFullYear(), month.getMonth() + offset, 1)
        : addDays(month, offset * 7),
    );
  };

  const modeButtonClass = (value: CalendarMode) =>
    `inline-flex h-9 items-center px-3.5 text-sm font-medium transition ${
      mode === value ? 'bg-ink text-on-ink' : 'bg-surface text-navy-800 hover:bg-navy-50'
    }`;

  const navButtonClasses = `inline-flex h-9 w-9 items-center justify-center rounded-full border
    border-slate-200 bg-surface text-navy-800 transition hover:bg-navy-50`;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-surface p-4 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-navy-900" aria-live="polite">
          {heading}
        </h2>
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Calendar view"
            className="mr-1 inline-flex overflow-hidden rounded-full border border-slate-200"
          >
            <button
              type="button"
              aria-pressed={mode === 'month'}
              onClick={() => setMode('month')}
              className={modeButtonClass('month')}
            >
              Month
            </button>
            <button
              type="button"
              aria-pressed={mode === 'week'}
              onClick={() => {
                setMode('week');
                // Month view anchors on the 1st; open the week the student is in right now.
                const showingThisMonth =
                  month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
                if (showingThisMonth) onMonthChange(today);
              }}
              className={modeButtonClass('week')}
            >
              Week
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              onMonthChange(mode === 'month' ? new Date(today.getFullYear(), today.getMonth(), 1) : today)
            }
            className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-surface
              px-3.5 text-sm font-medium text-navy-800 transition hover:bg-navy-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label={mode === 'month' ? 'Previous month' : 'Previous week'}
            className={navButtonClasses}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label={mode === 'month' ? 'Next month' : 'Next week'}
            className={navButtonClasses}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mode === 'week' ? (
        <WeekView
          events={sortedEvents}
          weekStart={weekStart}
          today={today}
          onSelectEvent={onSelectEvent}
        />
      ) : (
        <>
      <div className="grid grid-cols-7 border-b border-slate-200 pb-2" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-xl bg-slate-100">
        {days.map((day) => {
          const inMonth = day.getMonth() === month.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = sortedEvents.filter((event) => isSameDay(new Date(event.start), day));
          const visibleEvents = dayEvents.slice(0, MAX_CHIPS);
          const hiddenEvents = dayEvents.slice(MAX_CHIPS);

          return (
            <div
              key={day.toISOString()}
              className={`flex min-h-16 flex-col gap-1 p-1 sm:min-h-28 sm:p-1.5
                ${inMonth ? 'bg-surface' : 'bg-slate-50'}`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center self-center
                  rounded-full text-xs font-medium sm:self-start
                  ${inMonth ? 'text-navy-900' : 'text-slate-400'}
                  ${isToday ? 'bg-teal-50 font-bold text-teal-700 ring-2 ring-teal-500' : ''}`}
              >
                {day.getDate()}
              </span>

              <div className="flex flex-wrap justify-center gap-1 sm:hidden" aria-hidden="true">
                {dayEvents.map((event) => (
                  <span
                    key={event.id}
                    className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[event.eventType]}`}
                  />
                ))}
              </div>

              <div className="hidden min-w-0 flex-col gap-1 sm:flex">
                {visibleEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onSelectEvent(event)}
                    title={event.title}
                    aria-label={`${event.title}, ${formatDate(event.start)} at ${formatTime(
                      event.start,
                    )}`}
                    className={`w-full truncate rounded-md px-1.5 py-0.5 text-left text-[11px]
                      font-medium transition ${CHIP_CLASSES[event.eventType]}`}
                  >
                    {event.title}
                  </button>
                ))}
                {hiddenEvents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectEvent(hiddenEvents[0])}
                    aria-label={`${hiddenEvents.length} more events on ${formatDate(
                      day.toISOString(),
                    )}`}
                    className="w-full rounded-md px-1.5 py-0.5 text-left text-[11px] font-semibold
                      text-slate-500 transition hover:bg-slate-100 hover:text-navy-800"
                  >
                    +{hiddenEvents.length} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 sm:hidden">
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Events this month</h3>
        {monthEvents.length === 0 ? (
          <p className="text-sm text-slate-500">No events scheduled this month.</p>
        ) : (
          <ul className="space-y-2">
            {monthEvents.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200
                    p-3 text-left transition hover:bg-slate-50"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_CLASSES[event.eventType]}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy-900">
                      {event.title}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {formatDate(event.start)} · {formatTime(event.start)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
        </>
      )}
    </div>
  );
}
