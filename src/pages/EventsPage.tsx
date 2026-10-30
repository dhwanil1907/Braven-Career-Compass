import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  CalendarDays,
  CalendarX,
  Info,
  LayoutList,
  X,
} from 'lucide-react';
import type { CareerEvent, EventFilters, EventFormat, EventType } from '../types';
import { events } from '../data/events';
import { EVENT_FORMATS, EVENT_TYPES } from '../data/taxonomy';
import { filterEvents, hasActiveFilters } from '../lib/filters';
import { useApp } from '../context/useApp';
import { SearchBar } from '../components/SearchBar';
import { FilterSelect } from '../components/FilterSelect';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { PageHeader } from '../components/PageHeader';
import { CalendarGrid } from '../components/CalendarGrid';
import { EmptyState } from '../components/EmptyState';

type ViewMode = 'list' | 'calendar';

interface MonthGroup {
  key: string;
  label: string;
  items: CareerEvent[];
}

function monthKey(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function monthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function groupByMonth(items: CareerEvent[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const event of items) {
    const key = monthKey(event.start);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(event);
    } else {
      groups.push({ key, label: monthLabel(event.start), items: [event] });
    }
  }
  return groups;
}

function initialMonth(): Date {
  const now = new Date();
  const firstUpcoming = [...events]
    .filter((event) => new Date(event.end) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];
  const base = firstUpcoming ? new Date(firstUpcoming.start) : now;
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

export function EventsPage() {
  const { isEventSaved } = useApp();
  const [query, setQuery] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [format, setFormat] = useState<EventFormat | ''>('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [view, setView] = useState<ViewMode>('list');
  const [month, setMonth] = useState<Date>(initialMonth);
  const [searchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(() => {
    const requestedId = searchParams.get('event');
    return events.find((event) => event.id === requestedId) ?? null;
  });

  const filters: EventFilters = useMemo(() => ({ eventType, format }), [eventType, format]);
  const isFiltered = hasActiveFilters(filters) || query.trim() !== '' || savedOnly;

  const filteredEvents = useMemo(() => {
    const matches = filterEvents(events, query, filters);
    return savedOnly ? matches.filter((event) => isEventSaved(event.id)) : matches;
  }, [query, filters, savedOnly, isEventSaved]);

  // The list shows either what is coming up or what already happened (most recent first).
  const listedEvents = useMemo(() => {
    const now = new Date();
    return showPast
      ? filteredEvents
          .filter((event) => new Date(event.end) < now)
          .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
      : filteredEvents.filter((event) => new Date(event.end) >= now);
  }, [filteredEvents, showPast]);

  const monthGroups = useMemo(() => groupByMonth(listedEvents), [listedEvents]);
  const visibleCount = view === 'list' ? listedEvents.length : filteredEvents.length;

  const clearFilters = () => {
    setQuery('');
    setEventType('');
    setFormat('');
    setSavedOnly(false);
  };

  const viewButtonClass = (mode: ViewMode) =>
    `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      view === mode
        ? 'bg-surface text-navy-900 shadow-sm'
        : 'text-slate-600 hover:text-navy-900'
    }`;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Events"
        title="Career Events Calendar"
        description="Workshops, networking nights, career fairs, and info sessions to help you explore paths and meet people in your field."
      >
          <div
            className={
              'flex max-w-2xl items-start gap-2 rounded-xl border border-amber-200 ' +
              'bg-amber-50 px-4 py-3 text-sm text-amber-900'
            }
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              These events are collected from the SJSU Career Center website. Confirm times and
              registration there before you go.
            </p>
          </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/70 bg-surface p-4 shadow-card sm:p-5">
          <SearchBar value={query} onChange={setQuery} placeholder="Search events..." />
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <FilterSelect
                id="event-type"
                label="Event type"
                value={eventType}
                options={EVENT_TYPES}
                onChange={setEventType}
                allLabel="All types"
              />
              <FilterSelect
                id="event-format"
                label="Format"
                value={format}
                options={EVENT_FORMATS}
                onChange={setFormat}
                allLabel="All formats"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={savedOnly}
                onClick={() => setSavedOnly((current) => !current)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm
                  font-medium transition ${
                    savedOnly
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-slate-200 bg-surface text-slate-700 hover:border-slate-300'
                  }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${savedOnly ? 'fill-current' : ''}`}
                  aria-hidden="true"
                />
                Saved only
              </button>
              {isFiltered && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={
                    'inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium ' +
                    'text-slate-600 transition hover:bg-slate-100 hover:text-navy-900'
                  }
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600" aria-live="polite">
            <span className="font-semibold text-navy-900">{visibleCount}</span>{' '}
            {visibleCount === 1 ? 'event' : 'events'}
            {view === 'list' && (showPast ? ' past' : ' upcoming')}
          </p>
          {view === 'list' && (
            <button
              type="button"
              aria-pressed={showPast}
              onClick={() => setShowPast((previous) => !previous)}
              className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold
                transition ${
                  showPast
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-slate-300 bg-surface text-navy-900 hover:bg-navy-50'
                }`}
            >
              {showPast ? 'Showing past events' : 'Show past events'}
            </button>
          )}
          <div
            className="inline-flex rounded-xl bg-slate-100 p-1"
            role="group"
            aria-label="Choose view"
          >
            <button
              type="button"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
              className={viewButtonClass('list')}
            >
              <LayoutList className="h-4 w-4" aria-hidden="true" />
              List
            </button>
            <button
              type="button"
              aria-pressed={view === 'calendar'}
              onClick={() => setView('calendar')}
              className={viewButtonClass('calendar')}
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Calendar
            </button>
          </div>
        </div>

        <div className="mt-4">
          {view === 'calendar' ? (
            <CalendarGrid
              events={filteredEvents}
              month={month}
              onMonthChange={setMonth}
              onSelectEvent={setSelectedEvent}
            />
          ) : monthGroups.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No events match your filters"
              description="Try a different search term or clear your filters to see all events."
              action={
                isFiltered ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={
                      'rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white ' +
                      'transition hover:bg-deep'
                    }
                  >
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-10">
              {monthGroups.map((group) => (
                <section key={group.key} aria-labelledby={`month-${group.key}`}>
                  <h2
                    id={`month-${group.key}`}
                    className="mb-4 flex items-center gap-3 text-lg font-semibold text-navy-900"
                  >
                    {group.label}
                    <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                    <span className="text-sm font-normal text-slate-500">
                      {group.items.length} {group.items.length === 1 ? 'event' : 'events'}
                    </span>
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {group.items.map((event) => (
                      <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
