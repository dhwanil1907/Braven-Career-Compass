import { useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileQuestion,
  MapPin,
  Tag,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Badge, DemoBadge } from '../components/Badge';
import { BookmarkButton } from '../components/BookmarkButton';
import { ProgressToggle } from '../components/ProgressToggle';
import { EmptyState } from '../components/EmptyState';
import { ResourceCard } from '../components/ResourceCard';
import { SectionHeader } from '../components/SectionHeader';
import { getResourceById, resources } from '../data/resources';
import { useApp } from '../context/useApp';
import { formatDate, relativeDayLabel } from '../lib/dates';
import { getMatchReasons } from '../lib/recommend';
import type { Resource } from '../types';

const CARD_CLASS = 'rounded-2xl border border-slate-200/70 bg-surface p-6 shadow-card sm:p-8';

function getRelatedResources(resource: Resource, limit = 3): Resource[] {
  return resources
    .filter((other) => other.id !== resource.id)
    .map((other) => {
      const sharedInterests = other.interests.filter((interest) =>
        resource.interests.includes(interest),
      ).length;
      const typeMatch = other.resourceType === resource.resourceType ? 2 : 0;
      return { other, score: typeMatch + sharedInterests };
    })
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map((entry) => entry.other);
}

interface MetaItemProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

function MetaItem({ icon, label, children }: MetaItemProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-teal-600">{icon}</span>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-navy-900">{children}</dd>
      </div>
    </div>
  );
}

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const resource = id ? getResourceById(id) : undefined;
  const related = useMemo(() => (resource ? getRelatedResources(resource) : []), [resource]);
  const { profile } = useApp();
  const reasons = resource ? getMatchReasons(resource, profile) : [];

  if (!resource) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={FileQuestion}
          title="Resource not found"
          description="This resource may have been removed or the link is incorrect."
          action={
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep"
            >
              Back to Resources
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-hero text-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-navy-800">
          <li>
            <Link to="/resources" className="font-medium underline-offset-4 transition hover:underline">
              Resources
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="truncate font-medium text-navy-900" aria-current="page">
            {resource.title}
          </li>
        </ol>
      </nav>

      <header className={`mt-6 ${CARD_CLASS}`}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="teal">{resource.resourceType}</Badge>
          <Badge variant="outline">{resource.location}</Badge>
          {resource.isDemo && <DemoBadge />}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          {resource.title}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">{resource.summary}</p>

        <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
          <MetaItem icon={<Building2 className="h-4 w-4" />} label="Source">
            {resource.source}
          </MetaItem>
          <MetaItem icon={<MapPin className="h-4 w-4" />} label="Location">
            {resource.location}
          </MetaItem>
          <MetaItem icon={<CalendarClock className="h-4 w-4" />} label="Deadline">
            {resource.deadline ? (
              <>
                {formatDate(resource.deadline)}{' '}
                <span className="text-slate-500">({relativeDayLabel(resource.deadline)})</span>
              </>
            ) : (
              'Rolling / no deadline'
            )}
          </MetaItem>
        </dl>

        {resource.isDemo && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold">This is a fictional sample.</span> It was created to
              demonstrate the prototype and does not represent a real opportunity.
            </p>
          </div>
        )}
      </header>

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className={CARD_CLASS}>
            <h2 className="text-xl font-semibold text-navy-950">About this resource</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
              {resource.description}
            </p>
          </section>

          <section className={CARD_CLASS} aria-labelledby="relevance-heading">
            <h2 id="relevance-heading" className="text-xl font-semibold text-navy-950">
              Why it may be relevant to you
            </h2>
            <p className="mt-3 text-slate-700">
              {reasons.length > 0
                ? `Matches your profile: ${reasons.join(', ')}.`
                : 'Complete your profile on My Journey to see how this fits your goals.'}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Source: {resource.source}.{' '}
              {resource.lastVerified
                ? `Last verified ${formatDate(resource.lastVerified)}.`
                : resource.isDemo
                  ? 'Demo listing: not a real opening.'
                  : 'Not yet verified by staff. Please confirm details on the source site.'}
            </p>
          </section>

          <section className={CARD_CLASS}>
            <h2 className="text-xl font-semibold text-navy-950">Who it&apos;s useful for</h2>
            <ul className="mt-4 space-y-3">
              {resource.whoItsFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${CARD_CLASS} grid gap-6 sm:grid-cols-2`}>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Relevant majors
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {resource.majors.map((major) => (
                  <Badge key={major} variant="navy">
                    {major}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Career interests
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {resource.interests.map((interest) => (
                  <Badge key={interest} variant="teal">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            {resource.tags.length > 0 && (
              <div className="sm:col-span-2">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  Tags
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="slate">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className={`${CARD_CLASS} space-y-5 lg:sticky lg:top-24`}>
            <div>
              <h2 className="text-lg font-semibold text-navy-950">Ready to take the next step?</h2>
              <p className="mt-1 text-sm text-slate-600">
                Apply or learn more on the original provider&apos;s website.
              </p>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-coral-600 px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              Visit original website
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <BookmarkButton kind="resource" id={resource.id} withLabel className="w-full" />
            <ProgressToggle kind="applied" id={resource.id} className="w-full" />
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Provided by
              </p>
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
              >
                <Building2 className="h-4 w-4" aria-hidden="true" />
                {resource.source}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader
            title="Related resources"
            subtitle="Similar opportunities you might want to explore."
            action={{ label: 'Browse all', to: '/resources' }}
          />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ResourceCard key={item.id} resource={item} />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
