import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FeaturedGroups } from '../lib/featured';
import { daysUntil } from '../lib/dates';
import type { Resource } from '../types';
import { BookmarkButton } from './BookmarkButton';
import type { SaveCounts } from '../lib/featured';
import { DemoBadge } from './Badge';

type FeaturedGroupKey = keyof FeaturedGroups;

function Eyebrow({ resource }: { resource: Resource }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral-600">
      {resource.resourceType}
      <span className="mx-1.5 text-slate-400">/</span>
      <span className="text-slate-500">{resource.source}</span>
    </p>
  );
}

function ResourceTitleLink({ resource }: { resource: Resource }) {
  return (
    <Link to={`/resources/${resource.id}`} className="transition hover:text-coral-600">
      {resource.title}
    </Link>
  );
}

function ClosingSoonList({ resources }: { resources: Resource[] }) {
  return (
    <ol className="divide-y-2 divide-dotted divide-coral-400 border-y border-navy-900 bg-surface">
      {resources.map((resource) => {
        if (!resource.deadline) return null;
        const deadline = new Date(resource.deadline);
        const days = daysUntil(resource.deadline);
        return (
          <li key={resource.id} className="grid grid-cols-[5rem_1fr_auto] items-center gap-5 p-5">
            <div className="border-r border-slate-200 pr-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {deadline.toLocaleDateString('en-US', { month: 'short' })}
              </p>
              <p className="font-display text-4xl leading-none text-navy-900">
                {deadline.getDate()}
              </p>
            </div>
            <div className="min-w-0">
              <Eyebrow resource={resource} />
              <h3 className="mt-1 font-display text-xl text-navy-900">
                <ResourceTitleLink resource={resource} />
              </h3>
              <p className="mt-1 text-sm font-medium text-coral-600">
                {days === 0 ? 'Closes today' : `Closes in ${days} day${days === 1 ? '' : 's'}`}
              </p>
            </div>
            <BookmarkButton kind="resource" id={resource.id} />
          </li>
        );
      })}
    </ol>
  );
}

function ImportantSpread({ resources }: { resources: Resource[] }) {
  const [lead, ...rest] = resources;
  if (!lead) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <article className="relative overflow-hidden bg-deep p-8 text-white lg:col-span-3 lg:p-10">
        <span
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full
            bg-coral-500"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">
            Editor&apos;s pick / {lead.source}
          </p>
          <h3 className="mt-4 max-w-md font-display text-3xl leading-tight sm:text-4xl">
            <Link to={`/resources/${lead.id}`} className="transition hover:text-teal-300">
              {lead.title}
            </Link>
          </h3>
          <p className="mt-4 max-w-md text-white/80">{lead.summary}</p>
          <Link
            to={`/resources/${lead.id}`}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-teal-300 px-5
              text-sm font-semibold text-navy-950 transition hover:bg-white"
          >
            View resource
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
      <div className="flex flex-col gap-6 lg:col-span-2">
        {rest.map((resource) => (
          <article
            key={resource.id}
            className="flex flex-1 flex-col border border-slate-200 bg-surface p-6"
          >
            <Eyebrow resource={resource} />
            <h3 className="mt-2 font-display text-xl text-navy-900">
              <ResourceTitleLink resource={resource} />
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{resource.summary}</p>
            <div className="mt-auto flex justify-end pt-4">
              <BookmarkButton kind="resource" id={resource.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PopularRanking({
  resources,
  saveCounts,
}: {
  resources: Resource[];
  saveCounts: SaveCounts;
}) {
  return (
    <ol className="grid gap-px bg-slate-200 md:grid-cols-3">
      {resources.map((resource, index) => (
        <li key={resource.id} className="flex flex-col bg-surface p-6">
          <p className="font-display text-6xl leading-none text-coral-500">
            {String(index + 1).padStart(2, '0')}
          </p>
          <div className="mt-6">
            <Eyebrow resource={resource} />
            <h3 className="mt-2 font-display text-xl text-navy-900">
              <ResourceTitleLink resource={resource} />
            </h3>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {saveCounts[resource.id] ?? 0} saves
            </p>
            <div className="flex items-center gap-2">
              {resource.isDemo && <DemoBadge />}
              <BookmarkButton kind="resource" id={resource.id} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FeaturedShowcase({
  group,
  resources,
  saveCounts = {},
}: {
  group: FeaturedGroupKey;
  resources: Resource[];
  saveCounts?: SaveCounts;
}) {
  if (group === 'closingSoon') return <ClosingSoonList resources={resources} />;
  if (group === 'important') return <ImportantSpread resources={resources} />;
  return <PopularRanking resources={resources} saveCounts={saveCounts} />;
}
