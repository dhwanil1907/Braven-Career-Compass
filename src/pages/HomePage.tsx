import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { CompassDial } from '../components/CompassDial';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { FeaturedShowcase } from '../components/FeaturedShowcase';
import { SearchBar } from '../components/SearchBar';
import { SectionHeader } from '../components/SectionHeader';
import { useApp } from '../context/useApp';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { getFeaturedGroups } from '../lib/featured';
import { formatTime } from '../lib/dates';
import { getUpcomingEvents } from '../lib/filters';
import { scoreMatch } from '../lib/matchScore';
import type { CareerEvent, Resource, UserProfile } from '../types';

/** Shown in the hero until the student answers the onboarding questions. */
const EXAMPLE_PROFILE: UserProfile = {
  major: 'Computer Science',
  interests: ['Software Engineering'],
  year: 'Third year',
  goal: 'First internship',
  challenge: 'Not sure where to start',
  onboarded: true,
};

const POPULAR_SEARCHES = ['Resume', 'Interview', 'Networking', 'Career fair'];

const QUICK_LINKS = [
  {
    title: 'Job search help',
    description: 'Guides and tools for finding jobs and internships.',
    to: '/resources?q=job%20search',
    tone: 'bg-coral-600 text-white',
  },
  {
    title: 'Career events',
    description: 'Workshops, panels, and career fairs you can add to your calendar.',
    to: '/events',
    tone: 'bg-teal-300 text-(--color-sky-ink)',
  },
  {
    title: 'Resume & interviews',
    description: 'Resume reviews, templates, and interview practice.',
    to: '/resources?q=resume',
    tone: 'bg-deep text-white',
  },
  {
    title: 'Talk to alumni',
    description: 'Find someone who studied what you study, and book a call.',
    to: '/alumni',
    tone: 'bg-cream-200 text-navy-950',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);

  const now = useMemo(() => new Date(), []);
  const { profile } = useApp();
  const matchProfile = profile.onboarded ? profile : EXAMPLE_PROFILE;
  const topMatch = useMemo(() => {
    let best: { resource: Resource; match: ReturnType<typeof scoreMatch> } | null = null;
    for (const resource of resources) {
      const match = scoreMatch(resource, matchProfile);
      const beatsBest =
        !best ||
        match.percent > best.match.percent ||
        (match.percent === best.match.percent && resource.featured && !best.resource.featured);
      if (beatsBest) best = { resource, match };
    }
    return best;
  }, [matchProfile]);
  const featuredResources = useMemo(() => getFeaturedGroups(resources, now).important, [now]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(events, now, 4), [now]);
  const radarEvents = upcomingEvents.slice(0, 3);
  const upcomingCount = useMemo(
    () => events.filter((event) => new Date(event.end).getTime() >= now.getTime()).length,
    [now],
  );

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/resources?q=${encodeURIComponent(trimmed)}` : '/resources');
  };

  const stats = [
    { label: 'Career resources', value: resources.length },
    { label: 'Upcoming events', value: upcomingCount },
    { label: 'Sources', value: new Set(resources.map((item) => item.source)).size },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-hero text-navy-950">
        <div
          className="mx-auto grid max-w-7xl gap-12 px-4 pb-32 pt-16 sm:px-6 lg:grid-cols-12
            lg:gap-8 lg:px-8 lg:pb-40 lg:pt-20"
        >
          <div className="animate-rise lg:col-span-7">
            <h1
              className="font-display text-5xl leading-[1.05] tracking-tight
                sm:text-6xl lg:text-7xl"
            >
              Find your next career move, faster.
            </h1>
            <span className="mt-6 block h-1 w-16 bg-sky-300" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-lg text-navy-900">
              Resources and events from Braven, the SJSU Career Center, and student clubs, with a
              plan built around your major and goals.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/start"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-coral-600 px-6
                  text-base font-semibold text-white transition hover:bg-navy-950"
              >
                Build my plan
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 max-w-xl">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={handleSearch}
                placeholder="Search resumes, jobs"
                size="lg"
              />
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Popular
                </span>
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    to={`/resources?q=${encodeURIComponent(term)}`}
                    className="font-medium underline decoration-navy-950/30 decoration-2
                      underline-offset-4 transition hover:decoration-coral-ink"
                  >
                    {term}
                  </Link>
                ))}
              </p>
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="mt-10 border border-navy-900 bg-surface p-7 text-navy-900">
              {topMatch && (
                <Link to={`/resources/${topMatch.resource.id}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral-ink">
                        {profile.onboarded ? 'Your top match' : 'Example match'}
                      </p>
                      {!profile.onboarded && (
                        <p className="mt-1 text-sm text-slate-500">
                          {matchProfile.major} major, {matchProfile.goal?.toLowerCase()}
                        </p>
                      )}
                    </div>
                    <CompassDial
                      percent={topMatch.match.percent}
                      size={48}
                      className="shrink-0 text-coral-ink"
                    />
                  </div>
                  <Badge variant="teal" className="mt-4">
                    <CompassDial percent={topMatch.match.percent} size={14} />
                    {topMatch.match.label ?? 'Match'} · {topMatch.match.percent}%
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl transition group-hover:text-coral-ink">
                    {topMatch.resource.title}
                  </h2>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {topMatch.match.reasons.slice(0, 2).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </Link>
              )}
              <h2 className="mt-6 border-t-2 border-dotted border-coral-400 pt-5 font-display text-xl">
                Coming up next
              </h2>
              <ul className="mt-3 divide-y-2 divide-dotted divide-coral-400">
                {radarEvents.slice(0, 2).map((event) => {
                  const start = new Date(event.start);
                  return (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="group flex w-full items-center gap-4 py-4 text-left"
                      >
                        <span className="w-12 shrink-0 text-center">
                          <span
                            className="block text-xs font-semibold uppercase
                              tracking-[0.14em] text-slate-500"
                          >
                            {start.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="block font-display text-3xl leading-none">
                            {start.getDate()}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className="block truncate font-semibold transition
                              group-hover:text-coral-ink"
                          >
                            {event.title}
                          </span>
                          <span className="block text-sm text-slate-500">
                            {formatTime(event.start)} · {event.format}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-slate-400 transition
                            group-hover:text-coral-ink"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/events"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold
                  text-coral-ink underline decoration-2 underline-offset-4"
              >
                Full calendar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl
          className="grid border border-navy-900 bg-surface sm:grid-cols-3 sm:divide-x-2
            sm:divide-dotted sm:divide-coral-400"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse px-8 py-7">
              <dt
                className="mt-3 text-xs font-semibold uppercase tracking-[0.14em]
                  text-slate-500"
              >
                {stat.label}
              </dt>
              <dd className="font-display text-6xl leading-none text-navy-900">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section
        aria-labelledby="how-heading"
        className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8"
      >
        <h2 id="how-heading" className="font-display text-3xl text-navy-900">
          How it works
        </h2>
        <span className="mt-3 block h-1 w-12 bg-sky-300" aria-hidden="true" />
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ['1', 'Tell us about you', 'Pick your major, year and goal. It takes about a minute.'],
            [
              '2',
              'Get your plan',
              'A 5-step roadmap with a real resource or event linked to every step.',
            ],
            [
              '3',
              'Save events, track progress',
              'Add events to your calendar, mark steps done, and book a call with alumni.',
            ],
          ].map(([number, title, text]) => (
            <li key={number} className="flex gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                  bg-coral-600 font-display text-lg text-white"
                aria-hidden="true"
              >
                {number}
              </span>
              <span>
                <span className="block font-semibold text-navy-900">{title}</span>
                <span className="mt-1 block text-slate-600">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="quick-access-heading"
        className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8"
      >
        <h2 id="quick-access-heading" className="sr-only">
          Quick access
        </h2>
        <ul className="grid gap-px bg-navy-900 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <li key={link.title}>
              <Link
                to={link.to}
                className={`group flex h-full min-h-56 flex-col p-7 transition ${link.tone}`}
              >
                <span className="mt-auto font-display text-2xl leading-tight">
                  {link.title}
                </span>
                <span className="mt-2 text-sm opacity-90">{link.description}</span>
                <ArrowRight
                  className="mt-5 h-5 w-5 transition group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {featuredResources.length > 0 && (
        <section className="mt-20 bg-cream-200 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Featured career resources"
              subtitle="Hand-picked by the Career Compass team."
              action={{ label: 'Browse all', to: '/resources' }}
            />
            <FeaturedShowcase group="important" resources={featuredResources} />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 sm:px-6 lg:px-8">
        <aside
          className="flex items-start gap-3 border-l-4 border-coral-500 bg-slate-50 px-5 py-4
            text-sm text-navy-900"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-ink" aria-hidden="true" />
          <p>
            Listings come from the SJSU Career Center website and a short list chosen by the
            team. They can change, so always verify details on the original source before
            applying.
          </p>
        </aside>
      </div>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
