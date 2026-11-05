import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  CalendarCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Clock,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CareerEvent, Major, Resource } from '../types';
import { resources, getResourceById } from '../data/resources';
import { events, getEventById } from '../data/events';
import { DueSoonBanner } from '../components/DueSoonBanner';
import { MomentumSection } from '../components/MomentumSection';
import { PageHeader } from '../components/PageHeader';
import { INTERESTS, MAJORS } from '../data/taxonomy';
import { useApp } from '../context/useApp';
import { RoadmapList } from '../components/RoadmapList';
import { buildRoadmap, countCompleted } from '../lib/roadmap';
import { getUpcomingEvents } from '../lib/filters';
import {
  getMatchReasons,
  hasProfile,
  recommendEvents,
  recommendResources,
} from '../lib/recommend';
import { daysUntil, formatDate, relativeDayLabel } from '../lib/dates';
import { FilterSelect } from '../components/FilterSelect';
import { EmptyState } from '../components/EmptyState';
import { SectionHeader } from '../components/SectionHeader';
import { ResourceCard } from '../components/ResourceCard';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';

type TimelineItem =
  | { kind: 'event'; date: string; event: CareerEvent }
  | { kind: 'deadline'; date: string; resource: Resource };

type SavedTab = 'resources' | 'events';

const TIMELINE_FALLBACK_LIMIT = 5;
const DEADLINE_WINDOW_DAYS = 30;

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function timelineKey(item: TimelineItem): string {
  return item.kind === 'event' ? `event-${item.event.id}` : `deadline-${item.resource.id}`;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: 'navy' | 'teal' | 'amber';
}

const STAT_TONES: Record<StatCardProps['tone'], string> = {
  navy: 'bg-navy-50 text-navy-700',
  teal: 'bg-teal-50 text-teal-700',
  amber: 'bg-amber-50 text-amber-700',
};

function StatCard({ icon: Icon, label, value, tone }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${STAT_TONES[tone]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-2xl font-bold text-navy-900">{value}</p>
          <p className="text-sm text-slate-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-surface p-5 shadow-card sm:p-6">
      {children}
    </div>
  );
}

function BrowseLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className={
        'inline-flex items-center gap-1 rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold ' +
        'text-white transition hover:bg-deep'
      }
    >
      {label}
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

interface TimelineRowProps {
  item: TimelineItem;
  now: Date;
  onSelectEvent: (event: CareerEvent) => void;
}

function TimelineRow({ item, now, onSelectEvent }: TimelineRowProps) {
  const isSoon = daysUntil(item.date, now) <= 7;
  const title = item.kind === 'event' ? item.event.title : item.resource.title;
  const kindLabel = item.kind === 'event' ? 'Event' : 'Application deadline';
  const rowClass =
    'group flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50';

  const content = (
    <>
      <span
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          item.kind === 'event' ? 'bg-teal-500' : 'bg-coral-500'
        }`}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium text-slate-500">{formatDate(item.date)}</span>
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${
              isSoon ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {relativeDayLabel(item.date, now)}
          </span>
        </span>
        <span
          className={
            'mt-1 line-clamp-2 block text-sm font-semibold text-navy-900 ' +
            'group-hover:text-teal-700'
          }
        >
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">{kindLabel}</span>
      </span>
      <ChevronRight
        className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-teal-600"
        aria-hidden="true"
      />
    </>
  );

  if (item.kind === 'event') {
    return (
      <button type="button" onClick={() => onSelectEvent(item.event)} className={rowClass}>
        {content}
      </button>
    );
  }

  return (
    <Link to={`/resources/${item.resource.id}`} className={rowClass}>
      {content}
    </Link>
  );
}

export function ProgressPage() {
  const {
    savedResourceIds,
    savedEventIds,
    profile,
    setMajor,
    toggleInterest,
    resetProfile,
    clearSaved,
    completedStepIds,
    toggleStep,
  } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);
  const [savedTab, setSavedTab] = useState<SavedTab>('resources');

  const now = useMemo(() => new Date(), []);
  const profileReady = hasProfile(profile);

  const savedResources = useMemo(
    () => savedResourceIds.map((id) => getResourceById(id)).filter(isDefined),
    [savedResourceIds],
  );
  const savedEvents = useMemo(
    () =>
      savedEventIds
        .map((id) => getEventById(id))
        .filter(isDefined)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [savedEventIds],
  );
  const roadmapSteps = useMemo(
    () => buildRoadmap(profile, resources, events, now),
    [profile, now],
  );
  const roadmapDone = countCompleted(roadmapSteps, completedStepIds);
  const totalSaved = savedResources.length + savedEvents.length;

  const recommendedResources = useMemo(
    () => (profileReady ? recommendResources(resources, profile, 6) : []),
    [profile, profileReady],
  );
  const recommendedEvents = useMemo(
    () => (profileReady ? recommendEvents(events, profile, now, 3) : []),
    [profile, profileReady, now],
  );

  const upcomingDeadlineCount = useMemo(
    () =>
      resources.filter((resource) => {
        if (!resource.deadline) return false;
        const days = daysUntil(resource.deadline, now);
        return days >= 0 && days <= DEADLINE_WINDOW_DAYS;
      }).length,
    [now],
  );

  const timeline = useMemo<TimelineItem[]>(() => {
    const upcomingSaved = savedEvents.filter((event) => new Date(event.end) >= now);
    const timelineEvents =
      upcomingSaved.length > 0
        ? upcomingSaved
        : getUpcomingEvents(events, now, TIMELINE_FALLBACK_LIMIT);

    const toDeadlineItems = (pool: Resource[]): TimelineItem[] =>
      pool.flatMap((resource) =>
        resource.deadline && daysUntil(resource.deadline, now) >= 0
          ? [{ kind: 'deadline' as const, date: resource.deadline, resource }]
          : [],
      );
    const savedDeadlines = toDeadlineItems(savedResources);
    const deadlineItems =
      savedDeadlines.length > 0
        ? savedDeadlines
        : sortByDate(toDeadlineItems(resources)).slice(0, TIMELINE_FALLBACK_LIMIT);

    return sortByDate<TimelineItem>([
      ...timelineEvents.map((event) => ({ kind: 'event' as const, date: event.start, event })),
      ...deadlineItems,
    ]);
  }, [savedEvents, savedResources, now]);

  const handleClearSaved = () => {
    if (window.confirm('Remove all saved resources and events? This cannot be undone.')) {
      clearSaved();
    }
  };

  const tabClass = (tab: SavedTab) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      savedTab === tab ? 'bg-surface text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
    }`;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="My progress"
        title="Track what you have done and what is next"
        description={`${greetingForHour(now.getHours())}! Everything you save with the bookmark, mark done on your plan, or tick as attended or applied shows up here.`}
      >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Bookmark}
              label="Saved resources"
              value={savedResources.length}
              tone="navy"
            />
            <StatCard
              icon={CalendarCheck}
              label="Saved events"
              value={savedEvents.length}
              tone="teal"
            />
            <StatCard
              icon={Clock}
              label={`Deadlines in next ${DEADLINE_WINDOW_DAYS} days`}
              value={upcomingDeadlineCount}
              tone="amber"
            />
            <StatCard
              icon={Sparkles}
              label="Recommended matches"
              value={recommendedResources.length}
              tone="teal"
            />
          </div>
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-10 lg:col-span-2">
          <DueSoonBanner />
          <MomentumSection />
          <section aria-labelledby="milestones-heading">
            <Panel>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="milestones-heading" className="text-lg font-semibold text-navy-900">
                  Career milestones
                </h2>
                {roadmapSteps.length > 0 && (
                  <p className="text-sm font-semibold text-teal-700">
                    {roadmapDone} of {roadmapSteps.length} complete
                  </p>
                )}
              </div>
              {roadmapSteps.length > 0 ? (
                <div className="mt-4">
                  <RoadmapList
                    steps={roadmapSteps}
                    completedIds={completedStepIds}
                    onToggle={toggleStep}
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Answer three quick questions to get a roadmap.{' '}
                  <Link to="/start" className="font-semibold text-teal-700 hover:underline">
                    Build my plan
                  </Link>
                </p>
              )}
            </Panel>
          </section>

          <section aria-labelledby="profile-heading">
            <Panel>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="profile-heading" className="text-lg font-semibold text-navy-900">
                    Your profile
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Tell us what you study and what excites you to get better recommendations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetProfile}
                  className={
                    'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ' +
                    'font-medium text-slate-600 transition hover:bg-slate-100 hover:text-navy-900'
                  }
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset
                </button>
              </div>

              <div className="mt-5 max-w-sm">
                <FilterSelect<Major>
                  id="profile-major"
                  label="Major"
                  value={profile.major ?? ''}
                  options={MAJORS}
                  onChange={(value) => setMajor(value || null)}
                  allLabel="Select your major"
                />
              </div>

              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-navy-900">Career interests</legend>
                <p className="mt-1 text-xs text-slate-500">Pick as many interests as you like</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => {
                    const selected = profile.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleInterest(interest)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5
                          py-1.5 text-sm font-medium transition ${
                            selected
                              ? 'border-coral-600 bg-coral-600 text-white shadow-sm'
                              : 'border-slate-200 bg-surface text-slate-700 ' +
                                'hover:border-teal-300 hover:text-teal-800'
                          }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </Panel>
          </section>

          <section aria-label="Recommended for you">
            <SectionHeader
              title="Recommended for you"
              subtitle="Matched to your major and career interests."
              action={
                profileReady ? { label: 'Browse all resources', to: '/resources' } : undefined
              }
            />
            {!profileReady ? (
              <EmptyState
                icon={Sparkles}
                title="Personalize your recommendations"
                description={
                  'Pick a major or a few career interests above and we\'ll surface ' +
                  'resources and events that fit you.'
                }
              />
            ) : (
              <div className="space-y-8">
                {recommendedResources.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendedResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        reasons={getMatchReasons(resource, profile)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Sparkles}
                    title="No resource matches yet"
                    description="Try adding more interests to broaden your recommendations."
                  />
                )}
                {recommendedEvents.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-base font-semibold text-navy-900">
                      Events you might like
                    </h3>
                    <div className="grid gap-3">
                      {recommendedEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onSelect={setSelectedEvent}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section id="saved" className="scroll-mt-24" aria-labelledby="saved-heading">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="saved-heading" className="text-2xl font-bold text-navy-900">
                  Saved opportunities
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Everything you&apos;ve bookmarked, saved on this device.
                </p>
              </div>
              {totalSaved > 0 && (
                <button
                  type="button"
                  onClick={handleClearSaved}
                  className={
                    'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 ' +
                    'py-1.5 text-sm font-medium text-slate-600 transition hover:border-red-200 ' +
                    'hover:bg-red-50 hover:text-red-700'
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Clear all saved
                </button>
              )}
            </div>

            <div
              className="mb-5 inline-flex rounded-xl bg-slate-100 p-1"
              role="group"
              aria-label="Saved item type"
            >
              <button
                type="button"
                aria-pressed={savedTab === 'resources'}
                onClick={() => setSavedTab('resources')}
                className={tabClass('resources')}
              >
                Resources
                <span className="rounded-full bg-navy-100 px-2 text-xs text-navy-800">
                  {savedResources.length}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={savedTab === 'events'}
                onClick={() => setSavedTab('events')}
                className={tabClass('events')}
              >
                Events
                <span className="rounded-full bg-teal-100 px-2 text-xs text-teal-800">
                  {savedEvents.length}
                </span>
              </button>
            </div>

            {savedTab === 'resources' ? (
              savedResources.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Bookmark}
                  title="No saved resources yet"
                  description="Bookmark jobs, internships, and workshops to keep them here."
                  action={<BrowseLink to="/resources" label="Browse resources" />}
                />
              )
            ) : savedEvents.length > 0 ? (
              <div className="grid gap-3">
                {savedEvents.map((event) => (
                  <EventCard key={event.id} event={event} onSelect={setSelectedEvent} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved events yet"
                description="Save events from the calendar to build your personal schedule."
                action={<BrowseLink to="/events" label="Browse events" />}
              />
            )}
          </section>
        </div>

        <aside className="lg:col-span-1" aria-labelledby="timeline-heading">
          <div className="lg:sticky lg:top-24">
            <Panel>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-teal-600" aria-hidden="true" />
                <h2 id="timeline-heading" className="text-lg font-semibold text-navy-900">
                  Upcoming events &amp; deadlines
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {totalSaved > 0
                  ? 'Prioritizing what you have saved.'
                  : 'The next opportunities on the calendar.'}
              </p>
              {timeline.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">Nothing coming up right now.</p>
              ) : (
                <ol className="mt-5 space-y-1">
                  {timeline.map((item) => (
                    <li key={timelineKey(item)}>
                      <TimelineRow item={item} now={now} onSelectEvent={setSelectedEvent} />
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </div>
        </aside>
      </div>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
