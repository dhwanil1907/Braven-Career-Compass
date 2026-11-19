import { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationTracker } from '../components/ApplicationTracker';
import { EmptyState } from '../components/EmptyState';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { MomentumSection } from '../components/MomentumSection';
import { PageHeader } from '../components/PageHeader';
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

  const tabClass = (tab: SavedTab) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      savedTab === tab
        ? 'bg-surface font-bold text-navy-900 shadow-sm ring-1 ring-slate-300'
        : 'text-slate-600 hover:text-navy-900'
    }`;

  const summary = [profile.major, profile.year, profile.goal].filter(Boolean);

  return (
    <div className="pb-16">
      <PageHeader
        title="My journey"
        description="Find opportunities that fit your profile, then keep track of what you apply to and attend."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-slate-600">Your profile:</span>
            {summary.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-medium text-navy-900"
              >
                {item}
              </span>
            ))}
            <Link
              to="/start"
              className="inline-flex min-h-11 items-center gap-1 px-1 font-semibold text-navy-900
                underline underline-offset-4 hover:text-coral-ink"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            <Link
              to="/internships"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-coral-600 px-5 text-sm
                font-semibold text-white transition hover:bg-coral-700"
            >
              Find internships
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/events"
              className="inline-flex h-11 items-center rounded-full border border-slate-300
                bg-surface px-5 text-sm font-semibold text-navy-900 transition hover:bg-slate-100"
            >
              Browse events
            </Link>
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-10 px-4 pt-8 sm:px-6 lg:px-8">
        <DueSoonBanner />
        <MomentumSection />
        <section id="saved" className="scroll-mt-24" aria-labelledby="saved-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="saved-heading" className="text-2xl font-semibold text-navy-900">
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3
                  py-1.5 text-sm font-medium text-slate-600 transition hover:border-red-200
                  hover:bg-red-50 hover:text-red-700"
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
