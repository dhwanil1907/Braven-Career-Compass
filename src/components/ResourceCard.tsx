import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  HeartHandshake,
  MessagesSquare,
  Presentation,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Resource, ResourceType } from '../types';
import { relativeDayLabel } from '../lib/dates';
import { Badge, DemoBadge, MetaText } from './Badge';
import { BookmarkButton } from './BookmarkButton';
import { MatchBadge } from './MatchBadge';
import { ProgressToggle } from './ProgressToggle';

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

/** Tags that only repeat what the card already shows (source, type, listing kind). */
function informativeTags(resource: Resource): string[] {
  const redundant = new Set(
    [resource.source, resource.resourceType, 'linkedin', 'internship', 'job'].map((value) =>
      value.toLowerCase(),
    ),
  );
  return resource.tags.filter((tag) => !redundant.has(tag.toLowerCase())).slice(0, 2);
}

const SECONDARY_TARGET = 'min-h-11';

export function ResourceCard({
  resource,
  reasons,
  showMatch = true,
  listing = false,
}: {
  /** Internship and job cards link straight to the original posting and offer "I applied". */
  listing?: boolean;
  resource: Resource;
  reasons?: string[];
  showMatch?: boolean;
}) {
  const TypeIcon = TYPE_ICONS[resource.resourceType];
  const tags = informativeTags(resource);
  const primaryClasses =
    'group inline-flex h-11 items-center gap-1.5 rounded-full bg-coral-600 px-5 text-sm ' +
    'font-semibold text-white transition hover:bg-coral-700 focus-visible:outline-2 ' +
    'focus-visible:outline-offset-2 focus-visible:outline-teal-500';

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-surface p-5 transition
        hover:border-navy-300 hover:shadow-card-hover"
    >
      {/* Reserved meta row: titles start at the same height with or without a match. */}
      <div className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1">
        <MetaText icon={TypeIcon}>{resource.resourceType}</MetaText>
        {resource.isDemo && <DemoBadge />}
        {showMatch && (
          <span className="ml-auto">
            <MatchBadge item={resource} />
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-3 font-display text-xl font-semibold leading-snug text-navy-900">
        <Link to={`/resources/${resource.id}`} className="transition hover:text-coral-ink">
          {resource.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm font-medium text-slate-600">
        {resource.source}
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        {resource.location}
      </p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{resource.summary}</p>

      {resource.deadline && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarClock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          Deadline:{' '}
          <span className="font-medium text-navy-800">{relativeDayLabel(resource.deadline)}</span>
        </p>
      )}

      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge variant="slate">{tag}</Badge>
            </li>
          ))}
        </ul>
      )}

      {showMatch && reasons && reasons.length > 0 && (
        <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-teal-700">
          <Sparkles className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Matches: {reasons.join(', ')}</span>
        </p>
      )}

      <div className="mt-auto pt-5">
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
        {listing ? (
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className={primaryClasses}>
            View listing
            <ExternalLink
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <Link to={`/resources/${resource.id}`} className={primaryClasses}>
            View Resource
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}
        <div className="ml-auto flex items-center gap-2">
          {listing && (
            <ProgressToggle kind="applied" id={resource.id} className={SECONDARY_TARGET} />
          )}
          <BookmarkButton
            kind="resource"
            id={resource.id}
            className={`${SECONDARY_TARGET} min-w-11`}
          />
        </div>
      </div>
      </div>
    </article>
  );
}
