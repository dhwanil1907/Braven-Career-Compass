import { CalendarDays, Clock, ExternalLink, MapPin, Users, Video } from 'lucide-react';
import type { CareerEvent } from '../types';
import { formatTimeRange } from '../lib/dates';
import { stripEmoji, toDisplayCase } from '../lib/text';
import { Badge, DemoBadge, MetaText } from './Badge';
import { BookmarkButton } from './BookmarkButton';
import { MatchBadge } from './MatchBadge';
import { ProgressToggle } from './ProgressToggle';
import { ReminderCheckbox } from './ReminderCheckbox';

function hasStarted(event: CareerEvent): boolean {
  return new Date(event.start).getTime() <= Date.now();
}

function DateTile({ iso, compact }: { iso: string; compact: boolean }) {
  const date = new Date(iso);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const sizeClasses = compact ? 'h-12 w-12' : 'h-16 w-16';

  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl bg-deep
        text-white ${sizeClasses}`}
      aria-hidden="true"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
        {month}
      </span>
      <span className={`font-bold leading-none ${compact ? 'text-lg' : 'text-2xl'}`}>
        {date.getDate()}
      </span>
    </div>
  );
}

export function EventCard({
  event,
  onSelect,
  compact = false,
}: {
  event: CareerEvent;
  onSelect?: (event: CareerEvent) => void;
  compact?: boolean;
}) {
  const title = toDisplayCase(event.title);
  const timeRange = formatTimeRange(event.start, event.end);
  const dateLabel = new Date(event.start).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (compact) {
    return (
      <article
        className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 transition
          hover:-translate-y-0.5 dark:bg-surface"
      >
        <DateTile iso={event.start} compact />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-navy-900">
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(event)}
                className="max-w-full truncate rounded text-left transition hover:text-teal-700"
              >
                {title}
              </button>
            ) : (
              title
            )}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">{dateLabel}, </span>
            {timeRange}
          </p>
        </div>
        <ReminderCheckbox event={event} compact />
        {hasStarted(event) && <ProgressToggle kind="attended" id={event.id} compact />}
        <BookmarkButton kind="event" id={event.id} />
      </article>
    );
  }

  return (
    <article
      className="flex h-full flex-col rounded-3xl bg-slate-100 p-6 transition
        duration-300 hover:-translate-y-1 dark:bg-surface"
    >
      <div className="flex gap-4">
        <DateTile iso={event.start} compact={false} />
        <div className="min-w-0 flex-1">
          <div className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1">
            <MetaText icon={CalendarDays}>{event.eventType}</MetaText>
            <MetaText icon={event.format === 'Virtual' ? Video : MapPin}>{event.format}</MetaText>
            {event.isFull && <Badge variant="amber">Full</Badge>}
            {event.isDemo && <DemoBadge />}
          </div>
          <h3
            className="mt-2 line-clamp-2 font-display text-2xl font-semibold leading-[1.1]
              tracking-[-0.03em] text-navy-900"
            title={title}
          >
            <span className="sr-only">{dateLabel}: </span>
            {stripEmoji(title)}
          </h3>
        </div>
      </div>

      {/* When and where are what students scan for, so they sit together and read brighter. */}
      <ul className="mt-4 space-y-1.5 text-base font-medium text-slate-700">
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          {timeRange}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          <span className="truncate">{event.location}</span>
        </li>
      </ul>
      <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
        <Users className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        <span className="truncate">Hosted by {event.host}</span>
      </p>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{stripEmoji(event.description)}</p>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-200 pt-4">
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(event)}
              className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm
                font-semibold text-on-ink transition hover:opacity-85 focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              Details
            </button>
          )}
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-navy-800
              underline underline-offset-4 transition hover:text-coral-ink"
          >
            Source
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <MatchBadge item={event} />
            <ReminderCheckbox event={event} />
            {hasStarted(event) && <ProgressToggle kind="attended" id={event.id} />}
            <BookmarkButton kind="event" id={event.id} className="min-h-11 min-w-11" />
          </div>
        </div>
      </div>
    </article>
  );
}
