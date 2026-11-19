import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  FileText,
  Flag,
  Handshake,
  Info,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { events } from '../data/events';
import { APPLICATION_STATUSES } from '../data/taxonomy';
import { resources } from '../data/resources';
import { getUpcomingEvents } from '../lib/filters';
import { scoreMatch } from '../lib/matchScore';
import { toDisplayCase } from '../lib/text';
import type { CareerEvent, UserProfile } from '../types';

/** Shown until the student answers the onboarding questions. */
const EXAMPLE_PROFILE: UserProfile = {
  major: 'Computer Science',
  interests: ['Software Engineering'],
  year: 'Third year',
  goal: 'First internship',
  challenge: 'Not sure where to start',
  onboarded: true,
};

type Tone = 'lime' | 'sky' | 'coral' | 'grey' | 'ink';

// Fixed fills with fixed text colors, so cards read the same in light and dark.
const TONE_CLASS: Record<Tone, string> = {
  lime: 'bg-teal-300 text-sky-ink',
  sky: 'bg-sky-200 text-sky-ink',
  coral: 'bg-coral-600 text-white',
  grey: 'bg-slate-100 text-navy-900 dark:bg-raised',
  ink: 'bg-ink text-on-ink',
};

const ICON_CHIP: Record<Tone, string> = {
  lime: 'bg-sky-ink text-teal-300',
  sky: 'bg-white text-sky-ink',
  coral: 'bg-white text-coral-600',
  grey: 'bg-sky-ink text-teal-300',
  ink: 'bg-white text-sky-ink',
};

const SOFT_CARD = 'bg-slate-100 dark:bg-surface';

const EXPLORE: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
  featured?: boolean;
}[] = [
  {
    title: 'Internships',
    description:
      'Internship and job listings for SJSU students, ranked by how well they fit your major and goals. Mark the ones you applied to and track them.',
    icon: Briefcase,
    tone: 'sky',
    featured: true,
  },
  {
    title: 'Assistant',
    description:
      'Ask anything about your career search and get answers drawn from the listings, events and resources on this site.',
    icon: Bot,
    tone: 'lime',
    featured: true,
  },
  {
    title: 'Resources',
    description: 'Resume reviews, interview prep, workshops and mentorship.',
    icon: FileText,
    tone: 'coral',
  },
  {
    title: 'Events',
    description: 'Career fairs, workshops and club events, with reminders.',
    icon: CalendarDays,
    tone: 'sky',
  },
  {
    title: 'Alumni',
    description: 'Find someone who studied what you study, and book a call.',
    icon: Handshake,
    tone: 'ink',
  },
  {
    title: 'My journey',
    description: 'Your applications, events attended and momentum.',
    icon: Flag,
    tone: 'lime',
  },
];

const STEPS: { title: string; text: string; tone: Tone }[] = [
  {
    title: 'Tell us about you',
    text: 'Pick your major, year and goal. It takes about a minute.',
    tone: 'lime',
  },
  {
    title: 'Get matched',
    text: 'Internships, resources and events ranked by how well they fit you.',
    tone: 'sky',
  },
  {
    title: 'Save and track',
    text: 'Save what you like, mark the internships you applied to, and watch your momentum.',
    tone: 'coral',
  },
];

const PILL_PRIMARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-base ' +
  'font-semibold text-on-ink transition hover:-translate-y-0.5 hover:opacity-85';

const SECTION_HEADING =
  'font-display text-3xl font-semibold tracking-[-0.03em] text-navy-900 sm:text-5xl';

export function HomePage() {
  usePageTitle('Career Compass');
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);

  const now = useMemo(() => new Date(), []);
  // The landing page is for signed-out visitors, so the preview uses a sample CS profile.
  const previewListings = useMemo(
    () =>
      resources
        .filter((item) => item.resourceType === 'Internship')
        .map((resource) => ({ resource, percent: scoreMatch(resource, EXAMPLE_PROFILE).percent }))
        .sort((first, second) => second.percent - first.percent)
        .slice(0, 3),
    [],
  );

  const upcoming = useMemo(() => getUpcomingEvents(events, now, 3), [now]);
  const nextEvent = upcoming[0];

  const counts = useMemo(() => {
    const listings = resources.filter(
      (item) => item.resourceType === 'Internship' || item.resourceType === 'Job',
    ).length;
    const clubs = new Set(
      events
        .filter(
          (event) =>
            event.tags.includes('instagram') && new Date(event.end).getTime() >= now.getTime(),
        )
        .map((event) => event.host),
    ).size;
    const upcomingCount = events.filter(
      (event) => new Date(event.end).getTime() >= now.getTime(),
    ).length;
    return { listings, others: resources.length - listings, upcomingCount, clubs };
  }, [now]);

  const stats = [
    { value: counts.listings, label: 'Internships and jobs', note: 'From LinkedIn and the Career Center' },
    { value: counts.others, label: 'Career resources', note: 'Guides, workshops and mentorship' },
    { value: counts.upcomingCount, label: 'Upcoming events', note: 'Career fairs, workshops and mixers' },
    { value: counts.clubs, label: 'Student clubs', note: 'Posting events on Instagram' },
  ];

  const nextEventDate = nextEvent ? new Date(nextEvent.start) : null;

  return (
    <div>
      {/* 1. Hero */}
      <section className="mx-auto max-w-[100rem] px-4 pb-16 pt-12 sm:px-8 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="animate-rise flex min-w-0 flex-col items-start gap-6 lg:col-span-5">
            <h1
              className="font-display text-[clamp(2.75rem,6.5vw,4.75rem)] font-bold leading-[0.98]
                tracking-[-0.04em] text-navy-900"
            >
              Find your next career move, faster.
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              Resources and events from Braven, the SJSU Career Center and student clubs, with a
              plan built around your major and goals.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/login" className={PILL_PRIMARY}>
                Get started
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center rounded-full bg-slate-100 px-7 text-base
                  font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:bg-slate-200
                  dark:bg-surface"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product preview: real listings and events, shown the way they look after sign-in */}
          <div className="relative min-w-0 lg:col-span-7" aria-hidden="true">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:block lg:h-[30rem]">
              {previewListings[0] && (
                <div
                  className={`rounded-[28px] p-6 shadow-card lg:absolute lg:left-0 lg:top-0 lg:w-[22rem]
                    lg:-rotate-3 ${SOFT_CARD}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${TONE_CLASS.sky}`}>
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-teal-300 px-3 py-1 text-sm font-bold text-sky-ink">
                      {previewListings[0].percent}% match
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-navy-900">
                    {previewListings[0].resource.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {previewListings[0].resource.source} · {previewListings[0].resource.location}
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-on-ink">
                      View listing
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="inline-flex h-11 items-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-navy-900">
                      I applied
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`rounded-[28px] p-6 shadow-card lg:absolute lg:right-0 lg:top-20 lg:w-[24rem]
                  lg:rotate-2 ${TONE_CLASS.lime}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl font-bold tracking-[-0.02em]">Application tracker</p>
                  <span className="rounded-full bg-sky-ink/10 px-3 py-1 text-xs font-bold">Example</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {previewListings.map(({ resource }, index) => (
                    <li
                      key={resource.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{resource.title}</span>
                        <span className="block truncate text-xs">{resource.source}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-sky-ink px-3 py-1 text-xs font-bold text-white">
                        {APPLICATION_STATUSES[index] ?? 'Applied'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {nextEvent && nextEventDate && (
                <div
                  className={`flex items-center gap-4 rounded-[28px] p-5 shadow-card sm:col-span-2
                    lg:absolute lg:bottom-0 lg:left-16 lg:w-[22rem] lg:-rotate-1 ${TONE_CLASS.coral}`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${ICON_CHIP.coral}`}>
                    <CalendarCheck className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wide opacity-90">
                      Next event ·{' '}
                      {nextEventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="line-clamp-2 block font-display text-lg font-bold leading-tight">
                      {toDisplayCase(nextEvent.title)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats */}
      <section className="bg-deep py-12 text-deep-ink" aria-label="Site at a glance">
        <dl className="mx-auto grid max-w-[100rem] grid-cols-2 gap-8 px-4 sm:px-8 md:grid-cols-4 lg:px-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dd className="font-display text-5xl font-bold leading-none tracking-[-0.04em] text-teal-300 lg:text-[3.5rem]">
                {stat.value.toLocaleString('en-US')}
              </dd>
              <dt className="mt-3 text-base font-bold">{stat.label}</dt>
              <dd className="text-sm font-normal tracking-normal text-deep-muted">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 4. How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-16 bg-slate-100/70 py-16 dark:bg-surface/60 lg:py-24"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-[100rem] px-4 sm:px-8 lg:px-16">
          <h2 id="how-heading" className={SECTION_HEADING}>
            How it works
          </h2>
          <p className="mt-2 max-w-2xl text-lg text-slate-600">
            Three steps, no resume upload and no long forms.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative flex flex-col rounded-[30px] bg-white p-8 transition duration-200
                  hover:-translate-y-1 dark:bg-raised"
              >
                <span
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full font-display
                    text-xl font-bold ${TONE_CLASS[step.tone]}`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-slate-600">{step.text}</p>
                {index < STEPS.length - 1 && (
                  <span
                    className="absolute -right-6 top-14 z-10 hidden h-9 w-9 items-center justify-center
                      rounded-full bg-ink text-on-ink md:flex"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Explore */}
      <section
        id="explore"
        className="mx-auto max-w-[100rem] scroll-mt-16 px-4 py-16 sm:px-8 lg:px-16 lg:py-24"
        aria-labelledby="explore-heading"
      >
        <h2 id="explore-heading" className={SECTION_HEADING}>
          Explore Career Compass
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">
          Everything in one place. Sign in to open any of it.
        </p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {EXPLORE.map((item) => (
            <li key={item.title} className={item.featured ? 'lg:col-span-6' : 'lg:col-span-3'}>
              <Link
                to="/login"
                className={`group flex h-full flex-col justify-between rounded-[30px] p-8 transition
                  duration-200 hover:-translate-y-1.5 ${SOFT_CARD} ${
                    item.featured ? 'min-h-[20rem]' : 'min-h-[14rem]'
                  }`}
              >
                <span className="flex items-start justify-between">
                  <span
                    className={`flex items-center justify-center rounded-2xl ${TONE_CLASS[item.tone]} ${
                      item.featured ? 'h-16 w-16' : 'h-14 w-14'
                    }`}
                  >
                    <item.icon className={item.featured ? 'h-8 w-8' : 'h-7 w-7'} aria-hidden="true" />
                  </span>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-900
                      transition group-hover:bg-ink group-hover:text-on-ink dark:bg-raised"
                  >
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-8 block">
                  <span
                    className={`block font-display font-bold tracking-[-0.02em] text-navy-900 ${
                      item.featured ? 'text-3xl' : 'text-2xl'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="mt-2 block max-w-[48ch] text-base text-slate-600">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Call to action */}
      <section className="mx-auto max-w-[100rem] px-4 pb-16 sm:px-8 lg:px-16">
        <div
          className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[32px]
            bg-deep p-8 text-deep-ink md:flex-row md:items-center md:p-14 lg:p-16"
        >
          <div className="z-10 max-w-2xl">
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] lg:text-[2.75rem]">
              Ready to chart your career?
            </h2>
            <p className="mt-4 text-lg text-deep-muted">
              Answer three quick questions and see internships, resources and events ranked for you.
            </p>
          </div>
          <div className="z-10 flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-300 px-8
                text-base font-bold text-sky-ink transition hover:brightness-95"
            >
              Get started
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white/15 px-7 text-base
                font-semibold text-deep-ink transition hover:bg-white/25"
            >
              See how it works
            </a>
          </div>
          <div
            className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-teal-300/10"
            aria-hidden="true"
          />
        </div>

        <aside className="mt-10 flex items-start gap-3 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-navy-900 dark:bg-surface">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-ink" aria-hidden="true" />
          <p>
            Listings come from the SJSU Career Center website, LinkedIn searches and a short list
            chosen by the team. They can change, so always verify details on the original source
            before applying.
          </p>
        </aside>
      </section>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
