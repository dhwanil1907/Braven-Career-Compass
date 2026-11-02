import { CalendarClock, ExternalLink, Link2 } from 'lucide-react';
import { alumni } from '../data/stories';
import type { AlumniProfile } from '../types';
import { Badge } from './Badge';

const SAMPLE_NOTE = 'Sample profile: real alumni get their own link here';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const ACTION_CLASS =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm ' +
  'font-semibold transition';

function LinkedInAction({ alum }: { alum: AlumniProfile }) {
  if (alum.linkedinUrl) {
    return (
      <a
        href={alum.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION_CLASS} border-slate-300 bg-surface text-navy-900 hover:bg-navy-50`}
      >
        <Link2 className="h-4 w-4" aria-hidden="true" />
        LinkedIn
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      title={SAMPLE_NOTE}
      className={`${ACTION_CLASS} cursor-not-allowed border-slate-200 text-slate-400`}
    >
      <Link2 className="h-4 w-4" aria-hidden="true" />
      LinkedIn
      <span className="sr-only"> ({SAMPLE_NOTE})</span>
    </button>
  );
}

function ScheduleAction({ alum }: { alum: AlumniProfile }) {
  if (alum.schedulingUrl) {
    return (
      <a
        href={alum.schedulingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION_CLASS} border-coral-600 bg-coral-600 text-white hover:bg-deep`}
      >
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        Schedule a call
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      title={SAMPLE_NOTE}
      className={`${ACTION_CLASS} cursor-not-allowed border-slate-200 text-slate-400`}
    >
      <CalendarClock className="h-4 w-4" aria-hidden="true" />
      Schedule a call
      <span className="sr-only"> ({SAMPLE_NOTE})</span>
    </button>
  );
}

/** One alum: who they are, what they can help with, and how to reach them. */
export function AlumniCard({ alum, reasons = [] }: { alum: AlumniProfile; reasons?: string[] }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200/70 bg-surface p-6 shadow-card">
      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hero
            font-display text-lg text-navy-950"
          aria-hidden="true"
        >
          {initials(alum.name)}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl text-navy-900">{alum.name}</h3>
          <p className="text-sm text-slate-600">
            {alum.role}
            {alum.employer ? `, ${alum.employer}` : ''}
          </p>
          <p className="text-xs text-slate-500">
            {alum.major}, class of {alum.gradYear}
          </p>
        </div>
      </div>

      {(alum.isSample || reasons.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <Badge key={reason} variant="teal">
              {reason}
            </Badge>
          ))}
          {alum.isSample && <Badge variant="amber">Sample profile</Badge>}
        </div>
      )}

      <blockquote className="mt-4 text-sm leading-relaxed text-slate-700">
        &ldquo;{alum.quote}&rdquo;
      </blockquote>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Ask them about
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {alum.helpsWith.map((topic) => (
          <li key={topic}>
            <Badge variant="slate">{topic}</Badge>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <ScheduleAction alum={alum} />
        <LinkedInAction alum={alum} />
      </div>
    </article>
  );
}

/** A slow, endless line of quotes. Pauses on hover and stays still for reduced motion. */
export function StoryMarquee() {
  if (alumni.length === 0) return null;
  const loop = [...alumni, ...alumni];

  return (
    <section aria-labelledby="marquee-heading">
      <h2 id="marquee-heading" className="font-display text-3xl text-navy-900">
        In their own words
      </h2>
      <span className="mt-3 block h-1 w-12 bg-sky-300" aria-hidden="true" />
      <div className="group mt-6 overflow-hidden motion-reduce:overflow-x-auto">
        <ul
          className="flex w-max animate-marquee motion-reduce:animate-none
            group-hover:[animation-play-state:paused]"
        >
          {loop.map((alum, index) => (
            <li
              key={`${alum.id}-${index}`}
              aria-hidden={index >= alumni.length}
              className="mr-4 flex w-80 shrink-0 flex-col border border-slate-200/70 bg-surface p-6"
            >
              <blockquote className="font-display text-lg leading-snug text-navy-900">
                &ldquo;{alum.quote}&rdquo;
              </blockquote>
              <p className="mt-auto pt-4 text-sm font-semibold text-navy-900">{alum.name}</p>
              <p className="text-xs text-slate-500">
                {alum.role}
                {alum.isSample ? ' · Sample profile' : ''}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
