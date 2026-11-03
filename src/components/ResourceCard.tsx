import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarClock,
  Compass,
  FileText,
  GraduationCap,
  HeartHandshake,
  MapPin,
  MessagesSquare,
  Presentation,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Resource, ResourceType } from '../types';
import { relativeDayLabel } from '../lib/dates';
import { Badge, DemoBadge } from './Badge';
import { BookmarkButton } from './BookmarkButton';
import { MatchBadge } from './MatchBadge';

const TYPE_ICONS: Record<ResourceType, LucideIcon> = {
  Job: Briefcase,
  Internship: GraduationCap,
  Workshop: Presentation,
  'Resume Help': FileText,
  'Interview Prep': MessagesSquare,
  Networking: Users,
  Mentorship: HeartHandshake,
  'Career Exploration': Compass,
};

export function ResourceCard({ resource, reasons }: { resource: Resource; reasons?: string[] }) {
  const TypeIcon = TYPE_ICONS[resource.resourceType];

  return (
    <article
      className="flex h-full flex-col border border-slate-200 bg-surface p-6 transition
        hover:-translate-x-1 hover:-translate-y-1 hover:border-navy-900 hover:shadow-card-hover"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase
            tracking-[0.14em] text-coral-ink"
        >
          <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {resource.resourceType}
        </span>
        {resource.isDemo && <DemoBadge />}
        <MatchBadge item={resource} />
      </div>

      <h3 className="mt-3 font-display text-xl leading-snug text-navy-900">
        <Link
          to={`/resources/${resource.id}`}
          className="transition hover:text-coral-ink"
        >
          {resource.title}
        </Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{resource.summary}</p>

      <dl className="mt-4 space-y-1.5 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Source</dt>
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <dd className="truncate">{resource.source}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Location</dt>
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <dd>{resource.location}</dd>
        </div>
        {resource.deadline && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">Deadline</dt>
            <CalendarClock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <dd>
              Deadline:{' '}
              <span className="font-medium text-navy-800">
                {relativeDayLabel(resource.deadline)}
              </span>
            </dd>
          </div>
        )}
      </dl>

      {resource.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {resource.tags.slice(0, 3).map((tag) => (
            <li key={tag}>
              <Badge variant="slate">{tag}</Badge>
            </li>
          ))}
        </ul>
      )}

      {reasons && reasons.length > 0 && (
        <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-teal-700">
          <Sparkles className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Matches: {reasons.join(', ')}</span>
        </p>
      )}

      <div className="mt-auto pt-5">
        <div
          className="flex items-center justify-between gap-3 border-t-2 border-dotted
            border-coral-400 pt-4"
        >
          <Link
            to={`/resources/${resource.id}`}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-coral-600 px-4
              text-sm font-semibold text-white transition hover:bg-navy-950"
          >
            View Resource
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <BookmarkButton kind="resource" id={resource.id} />
        </div>
      </div>
    </article>
  );
}
