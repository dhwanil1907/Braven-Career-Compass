import { useEffect, useRef } from 'react';
import {
  CalendarDays,
  CalendarClock,
  CalendarPlus,
  Clock,
  Download,
  Lightbulb,
  ExternalLink,
  Info,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import type { CareerEvent } from '../types';
import { formatDate, formatTimeRange, relativeDayLabel } from '../lib/dates';
import { downloadIcs, googleCalendarUrl, prepTipsFor } from '../lib/calendar';
import { Badge, DemoBadge } from './Badge';
import { BookmarkButton } from './BookmarkButton';
import { ProgressToggle } from './ProgressToggle';

export function EventDetailsModal({
  event,
  onClose,
}: {
  event: CareerEvent | null;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = event !== null;
  // Callers pass inline handlers; a ref keeps the effect from re-running (and stealing focus)
  // every time the parent re-renders.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!event) return null;

  const titleId = `event-modal-title-${event.id}`;
  const details = [
    { icon: CalendarDays, label: 'Date', value: formatDate(event.start) },
    { icon: Clock, label: 'Time', value: formatTimeRange(event.start, event.end) },
    { icon: MapPin, label: 'Location', value: event.location },
    { icon: Users, label: 'Host', value: event.host },
  ];
  if (event.registrationDeadline) {
    details.push({
      icon: CalendarClock,
      label: 'Register by',
      value: `${formatDate(event.registrationDeadline)} (${relativeDayLabel(
        event.registrationDeadline,
      )})`,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface
          p-6 shadow-card-hover sm:rounded-2xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center
            rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex flex-wrap items-center gap-1.5 pr-10">
          <Badge variant="teal">{event.eventType}</Badge>
          <Badge variant="outline">{event.format}</Badge>
          {event.isFull && <Badge variant="amber">Full</Badge>}
          {event.isDemo && <DemoBadge />}
        </div>
        <h2 id={titleId} className="mt-3 pr-8 text-xl font-bold leading-snug text-navy-900">
          {event.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{event.description}</p>

        <dl className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </dt>
                <dd className="text-sm text-navy-900">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {event.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
            {event.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="slate">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}

        <section className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4" aria-label="How to prepare">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-teal-800">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            How to prepare
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {prepTipsFor(event.eventType).map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        {event.isDemo && (
          <p
            className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50
              p-3 text-xs text-amber-800"
          >
            <Info className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
            This is a fictional sample event for prototype purposes. Always confirm details on
            the official source.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-coral-600 px-5 text-sm
              font-semibold text-white transition hover:bg-deep"
          >
            Visit host website
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300
              bg-surface px-4 text-sm font-semibold text-navy-900 transition hover:bg-navy-50"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Google Calendar
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={() => downloadIcs(event)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300
              bg-surface px-4 text-sm font-semibold text-navy-900 transition hover:bg-navy-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download .ics
          </button>
          <BookmarkButton kind="event" id={event.id} withLabel />
          {new Date(event.start).getTime() <= Date.now() && (
            <ProgressToggle kind="attended" id={event.id} />
          )}
        </div>
      </div>
    </div>
  );
}
