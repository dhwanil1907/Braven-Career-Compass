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
import { stripEmoji } from '../lib/text';
import { DemoBadge } from './Badge';
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
    'group inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm ' +
    'font-semibold text-on-ink transition hover:opacity-85 focus-visible:outline-2 ' +
    'focus-visible:outline-offset-2 focus-visible:outline-teal-500';

  return (
    <article
      className="flex h-full flex-col rounded-3xl bg-slate-100 p-6 transition duration-300
        hover:-translate-y-1 dark:bg-surface"
    >
      {/* Reserved meta row: titles start at the same height with or without a match. */}
      <div className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className={`flex items-center justify-center ${
            'h-9 w-9 rounded-xl'
          } ${
            resource.resourceType === 'Job'
              ? 'bg-sky-200 text-sky-ink'
              : 'bg-black/5 text-navy-900 dark:bg-white/10'
          }`}
        >
          <TypeIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-navy-900">{resource.resourceType}</span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {resource.source}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {resource.location}
        </p>
        {resource.isDemo && <DemoBadge />}
        {showMatch && (
          <span className="ml-auto">
            <MatchBadge item={resource} />
          </span>
        )}
      </div>

      <h3
        className="mt-4 line-clamp-2 font-display text-2xl font-semibold leading-[1.1]
          tracking-[-0.03em] text-navy-900"
        title={resource.title}
      >
        <Link to={`/resources/${resource.id}`} className="transition hover:text-coral-ink">
          {stripEmoji(resource.title)}
        </Link>
      </h3>
      {listing ? (
        // Company and city sit right under the title as one group.
        <p className="mt-3 line-clamp-1 text-base font-semibold text-slate-700">{resource.summary}</p>
      ) : (
        <p className="mt-3 line-clamp-3 text-base text-slate-700">{resource.summary}</p>
      )}

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
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-white/10">
                {tag}
              </span>
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
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-300/70 pt-4">
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
