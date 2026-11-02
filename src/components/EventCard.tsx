import { Clock, ExternalLink, MapPin, Users } from 'lucide-react';
import type { CareerEvent } from '../types';
import { formatTimeRange } from '../lib/dates';
import { Badge, DemoBadge } from './Badge';
import { BookmarkButton } from './BookmarkButton';

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
      <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-300">
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
  const timeRange = formatTimeRange(event.start, event.end);
  const dateLabel = new Date(event.start).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (compact) {
    return (
      <article
        className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-surface p-3
          shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
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
                {event.title}
              </button>
            ) : (
              event.title
            )}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">{dateLabel}, </span>
            {timeRange}
          </p>
        </div>
        <BookmarkButton kind="event" id={event.id} />
      </article>
    );
  }

  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-surface p-5
        shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex gap-4">
        <DateTile iso={event.start} compact={false} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="teal">{event.eventType}</Badge>
            <Badge variant="outline">{event.format}</Badge>
            {event.isFull && <Badge variant="amber">Full</Badge>}
            {event.isDemo && <DemoBadge />}
          </div>
          <h3 className="mt-2 font-semibold leading-snug text-navy-900">
            <span className="sr-only">{dateLabel}: </span>
            {event.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{event.description}</p>

      <ul className="mt-4 space-y-1.5 text-sm text-slate-500">
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {timeRange}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate">{event.location}</span>
        </li>
        <li className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate">Hosted by {event.host}</span>
        </li>
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <div className="flex items-center gap-2">
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(event)}
              className="inline-flex h-9 items-center rounded-full bg-coral-600 px-4 text-sm
                font-semibold text-white transition hover:bg-deep"
            >
              Details
            </button>
          )}
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200
              px-3.5 text-sm font-medium text-navy-800 transition hover:border-navy-200
              hover:bg-navy-50"
          >
            Source
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <BookmarkButton kind="event" id={event.id} />
      </div>
    </article>
  );
}
