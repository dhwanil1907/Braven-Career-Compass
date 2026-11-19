import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  CalendarCheck,
  Flame,
  Pencil,
  Send,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationTracker } from '../components/ApplicationTracker';
import { EmptyState } from '../components/EmptyState';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { MomentumSection } from '../components/MomentumSection';
import { SlidingToggle } from '../components/SlidingToggle';
import { ResourceCard } from '../components/ResourceCard';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/useApp';
import { getEventById } from '../data/events';
import { getResourceById } from '../data/resources';
import { DueSoonBanner } from '../components/DueSoonBanner';
import type { CareerEvent } from '../types';

type SavedTab = 'resources' | 'events';

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function JourneyPage() {
  usePageTitle('My journey');
  const { profile, savedResourceIds, savedEventIds, clearSaved } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);
  const [savedTab, setSavedTab] = useState<SavedTab>('resources');

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
  const totalSaved = savedResources.length + savedEvents.length;

  const handleClearSaved = () => {
    if (window.confirm('Remove all saved resources and events? This cannot be undone.')) {
      clearSaved();
    }
  };

  const summary = [profile.major, profile.year, profile.goal].filter(Boolean);

  return (
    <div className="pb-16">
      <header className="relative overflow-hidden xl:min-h-[22rem]">
        <div className="mx-auto max-w-[100rem] px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16 lg:px-16">
          <h1
            className="max-w-[10ch] font-display text-[clamp(3.25rem,10vw,6rem)] font-semibold
              leading-[0.92] tracking-[-0.04em] text-navy-900"
          >
            My journey
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-slate-600 sm:text-xl">
            Find opportunities that fit your profile, then keep track of what you apply to and
            attend.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 font-medium text-slate-600">Your profile</span>
            {summary.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-4 py-2 font-semibold text-navy-900 dark:bg-surface"
              >
                {item}
              </span>
            ))}
            <Link
              to="/start"
              className="inline-flex min-h-11 items-center gap-1.5 px-2 font-semibold text-navy-900
                underline underline-offset-4 hover:text-coral-ink"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/internships"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-base
                font-semibold text-on-ink transition hover:opacity-85"
            >
              Find internships
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/events"
              className="inline-flex h-12 items-center rounded-full border border-slate-400 bg-surface
                px-6 text-base font-semibold text-navy-900 transition hover:bg-slate-100"
            >
              Browse events
            </Link>
          </div>
        </div>

        <div
          className="pointer-events-none absolute right-16 top-10 hidden h-80 w-[30rem] xl:block"
          aria-hidden="true"
        >
          <span
            className="absolute left-2 top-10 flex h-40 w-40 rotate-[-9deg] items-center justify-center
              rounded-[2rem] bg-teal-300 text-sky-ink shadow-card"
          >
            <CalendarCheck className="h-14 w-14" />
          </span>
          <span
            className="absolute left-44 top-0 flex h-36 w-36 rotate-[7deg] items-center justify-center
              rounded-[2rem] bg-sky-200 text-sky-ink shadow-card"
          >
            <Send className="h-12 w-12" />
          </span>
          <span
            className="absolute left-24 top-44 flex h-40 w-40 rotate-[4deg] items-center justify-center
              rounded-[2rem] bg-coral-600 text-white shadow-card"
          >
            <Flame className="h-14 w-14" />
          </span>
          <span
            className="absolute left-72 top-40 flex h-28 w-28 rotate-[-6deg] items-center justify-center
              rounded-[2rem] bg-slate-100 text-navy-900 shadow-card dark:bg-raised"
          >
            <Bookmark className="h-10 w-10" />
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[100rem] space-y-14 px-4 pt-4 sm:px-8 lg:px-16">
        <DueSoonBanner />
        <MomentumSection />
        <section id="saved" className="scroll-mt-24" aria-labelledby="saved-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="saved-heading"
                className="font-display text-3xl font-semibold tracking-[-0.03em] text-navy-900 sm:text-4xl"
              >
                Saved opportunities
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Everything you&apos;ve bookmarked, saved on this device.
              </p>
            </div>
            {totalSaved > 0 && (
              <button
                type="button"
                onClick={handleClearSaved}
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-300 px-5
                  text-sm font-semibold text-slate-700 transition hover:border-red-200
                  hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear all saved
              </button>
            )}
          </div>

          <SlidingToggle
            className="mb-6"
            label="Saved item type"
            value={savedTab}
            onChange={setSavedTab}
            options={[
              {
                value: 'resources',
                label: (
                  <>
                    Resources
                    <span className="rounded-full bg-black/10 px-2 text-xs dark:bg-white/10">
                      {savedResources.length}
                    </span>
                  </>
                ),
              },
              {
                value: 'events',
                label: (
                  <>
                    Events
                    <span className="rounded-full bg-black/10 px-2 text-xs dark:bg-white/10">
                      {savedEvents.length}
                    </span>
                  </>
                ),
              },
            ]}
          />

          {savedTab === 'resources' ? (
            savedResources.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {savedResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved resources yet"
                description="Bookmark jobs, internships, and workshops to keep them here."
                action={
                  <Link
                    to="/resources"
                    className="inline-flex min-h-11 items-center gap-1 rounded-full bg-coral-600 px-4 py-2
                      text-sm font-semibold text-white transition hover:bg-coral-700"
                  >
                    Browse resources
                  </Link>
                }
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
              action={
                <Link
                  to="/events"
                  className="inline-flex min-h-11 items-center gap-1 rounded-full bg-coral-600 px-4 py-2
                    text-sm font-semibold text-white transition hover:bg-coral-700"
                >
                  Browse events
                </Link>
              }
            />
          )}
        </section>

        <ApplicationTracker />
      </div>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
