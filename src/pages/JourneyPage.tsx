import { useMemo, useState } from 'react';
import { ArrowRight, Check, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { ResourceCard } from '../components/ResourceCard';
import { RoadmapList } from '../components/RoadmapList';
import { SkillsSection } from '../components/SkillsSection';
import { SectionHeader } from '../components/SectionHeader';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { DueSoonBanner } from '../components/DueSoonBanner';
import { countCompleted, buildRoadmap, getNextStep } from '../lib/roadmap';
import { getSkillGroups } from '../lib/skills';
import { getMatchReasons, recommendEvents, recommendResources } from '../lib/recommend';
import type { CareerEvent } from '../types';

export function JourneyPage() {
  const { profile, completedStepIds, toggleStep } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);
  const now = useMemo(() => new Date(), []);

  const steps = useMemo(() => buildRoadmap(profile, resources, events, now), [profile, now]);
  const nextStep = getNextStep(steps, completedStepIds);
  const doneCount = countCompleted(steps, completedStepIds);

  // Anything already in the roadmap is not repeated in the recommendation rows.
  const roadmapTargets = useMemo(() => new Set(steps.map((step) => step.targetId)), [steps]);
  const recommended = useMemo(
    () =>
      recommendResources(resources, profile).filter((item) => !roadmapTargets.has(item.id)).slice(0, 3),
    [profile, roadmapTargets],
  );
  const relevantEvents = useMemo(
    () => recommendEvents(events, profile, now).filter((item) => !roadmapTargets.has(item.id)).slice(0, 3),
    [profile, now, roadmapTargets],
  );

  const skillGroups = useMemo(() => getSkillGroups(profile, resources), [profile]);

  const summary = [profile.major, profile.year, profile.goal].filter(Boolean);

  return (
    <div className="pb-16">
      <section className="bg-hero text-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-navy-800">Your profile:</span>
            {summary.map((item) => (
              <span
                key={item}
                className="rounded-full border border-navy-950/15 bg-surface/50 px-3 py-1 font-medium"
              >
                {item}
              </span>
            ))}
            <Link
              to="/start"
              className="inline-flex items-center gap-1 font-semibold text-navy-900 underline-offset-4
                hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </Link>
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-navy-800">
            Your next action
          </p>
          {nextStep ? (
            <div className="mt-3 max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{nextStep.title}</h1>
              <p className="mt-4 text-lg text-navy-800">{nextStep.why}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={nextStep.href}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-coral-600 px-6 text-base
                    font-semibold text-white transition hover:bg-deep"
                >
                  {nextStep.kind === 'event' ? 'View event' : 'Open resource'}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleStep(nextStep.id)}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-navy-950/25
                    bg-surface/50 px-5 text-base font-semibold transition hover:bg-surface/80"
                >
                  <Check className="h-5 w-5" aria-hidden="true" />
                  Mark as done
                </button>
                <span className="text-sm text-navy-800">{nextStep.actionLabel}</span>
              </div>
            </div>
          ) : (
            <div className="mt-3 max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                You finished your roadmap
              </h1>
              <p className="mt-4 text-lg text-navy-800">
                Nice work. Keep the momentum: explore new resources or update your goal.
              </p>
              <Link
                to="/start"
                className="mt-6 inline-flex h-12 items-center rounded-full bg-coral-600 px-6 font-semibold
                  text-white transition hover:bg-deep"
              >
                Set a new goal
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-10 sm:px-6 lg:px-8">
        <DueSoonBanner />
        <section aria-labelledby="roadmap-heading" className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 id="roadmap-heading" className="text-2xl font-semibold text-navy-900">
              Your roadmap
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Built from your answers using simple rules, and linked to real items in the catalog.
            </p>
            <p className="mt-6 text-sm font-semibold text-navy-900">
              {doneCount} of {steps.length} steps done
            </p>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={doneCount}
              aria-label="Roadmap progress"
            >
              <div
                className="h-full rounded-full bg-coral-500 transition-all"
                style={{ width: steps.length ? `${(doneCount / steps.length) * 100}%` : '0%' }}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <RoadmapList steps={steps} completedIds={completedStepIds} onToggle={toggleStep} />
          </div>
        </section>

        <SkillsSection groups={skillGroups} />

        {relevantEvents.length > 0 && (
          <section aria-label="Events that fit you">
            <SectionHeader
              title="Events that fit you"
              subtitle="Save one and add it to your calendar."
              action={{ label: 'All events', to: '/events' }}
            />
            <div className="mt-6 space-y-3">
              {relevantEvents.map((event) => (
                <EventCard key={event.id} event={event} onSelect={setSelectedEvent} compact />
              ))}
            </div>
          </section>
        )}

        {recommended.length > 0 && (
          <section aria-label="More picks for you">
            <SectionHeader
              title="More picks for you"
              subtitle="Matched to your major and interests."
              action={{ label: 'All resources', to: '/resources' }}
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recommended.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  reasons={getMatchReasons(resource, profile)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
