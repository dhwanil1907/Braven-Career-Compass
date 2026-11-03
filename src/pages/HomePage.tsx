import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Clock, Info, Star, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { FeaturedShowcase } from '../components/FeaturedShowcase';
import { SearchBar } from '../components/SearchBar';
import { SectionHeader } from '../components/SectionHeader';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { useSaveCounts } from '../hooks/useSaveCounts';
import { CLOSING_SOON_DAYS, getClosingSoon, getFeaturedGroups } from '../lib/featured';
import type { FeaturedGroups } from '../lib/featured';
import { formatTime } from '../lib/dates';
import { getUpcomingEvents } from '../lib/filters';
import type { CareerEvent } from '../types';

const POPULAR_SEARCHES = ['Resume', 'Interview', 'Networking', 'Career fair'];

type FeaturedGroupKey = keyof FeaturedGroups;

const FEATURED_TABS: {
  key: FeaturedGroupKey;
  label: string;
  icon: LucideIcon;
  description: string;
  emptyText: string;
}[] = [
  {
    key: 'closingSoon',
    label: 'Closing soon',
    icon: Clock,
    description: `Application deadlines in the next ${CLOSING_SOON_DAYS} days.`,
    emptyText: `No deadlines in the next ${CLOSING_SOON_DAYS} days. Check back soon.`,
  },
  {
    key: 'important',
    label: 'Important',
    icon: Star,
    description: 'Hand-picked by the Career Compass team as worth your time.',
    emptyText: 'Nothing is flagged as important right now.',
  },
  {
    key: 'popular',
    label: 'Popular',
    icon: TrendingUp,
    description: 'Resources that students with an account have saved most.',
    emptyText: 'Popular picks appear once at least 3 students have saved the same resource.',
  },
];

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
    tone: 'bg-sky-300 text-(--color-sky-ink)',
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
  const saveCounts = useSaveCounts();
  const featuredGroups = useMemo(
    () => getFeaturedGroups(resources, now, undefined, saveCounts),
    [now, saveCounts],
  );
  // Open on the first tab that has something in it; deadlines are only on some listings.
  const [activeTab, setActiveTab] = useState<FeaturedGroupKey>(() =>
    getClosingSoon(resources, new Date()).length > 0 ? 'closingSoon' : 'important',
  );
  const activeTabConfig =
    FEATURED_TABS.find((tab) => tab.key === activeTab) ?? FEATURED_TABS[0];
  const activeResources = featuredGroups[activeTab];
  const upcomingEvents = useMemo(() => getUpcomingEvents(events, now, 4), [now]);
  const radarEvents = upcomingEvents.slice(0, 3);
  const upcomingCount = useMemo(
    () => events.filter((event) => new Date(event.end).getTime() >= now.getTime()).length,
    [now],
  );
  const closingSoonCount = useMemo(() => getClosingSoon(resources, now).length, [now]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/resources?q=${encodeURIComponent(trimmed)}` : '/resources');
  };

  const stats = [
    { label: 'Career resources in one place', value: resources.length },
    { label: 'Upcoming events', value: upcomingCount },
    closingSoonCount > 0
      ? { label: `Deadlines in the next ${CLOSING_SOON_DAYS} days`, value: closingSoonCount }
      : { label: 'Sources', value: new Set(resources.map((item) => item.source)).size },
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
              Career resources and events from Braven and the SJSU Career Center, in one place,
              with a plan built around your major and goals.
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
                placeholder="What career resources are you looking for?"
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
            <span
              className="absolute -right-24 -top-10 h-80 w-80 rounded-full bg-coral-500"
              aria-hidden="true"
            />
            <div className="relative mt-10">
              <span
                className="absolute inset-0 translate-x-6 translate-y-6 bg-sky-300"
                aria-hidden="true"
              />
              <div className="relative bg-surface p-7 text-navy-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-ink">
                  On your radar
                </p>
                <h2 className="mt-2 font-display text-2xl">Coming up next</h2>
                <ul className="mt-5 divide-y-2 divide-dotted divide-coral-400">
                  {radarEvents.map((event) => {
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
                              className="block text-[0.65rem] font-semibold uppercase
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
              'Take the next step',
              'Save events to your calendar, track what you did, and talk to alumni.',
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
          {QUICK_LINKS.map((link, index) => (
            <li key={link.title}>
              <Link
                to={link.to}
                className={`group flex h-full min-h-56 flex-col p-7 transition ${link.tone}`}
              >
                <span className="text-xs font-semibold tracking-[0.2em] opacity-90">
                  {String(index + 1).padStart(2, '0')}
                </span>
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

      <section className="mt-20 bg-cream-200 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured career resources"
            subtitle="What is closing soon, what matters most, and what other students save."
            action={{ label: 'Browse all', to: '/resources' }}
          />
          <div
            role="tablist"
            aria-label="Featured resource groups"
            className="flex flex-wrap gap-x-8 border-b border-navy-900/20"
          >
            {FEATURED_TABS.map(({ key, label }) => {
              const selected = key === activeTab;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`featured-tab-${key}`}
                  aria-selected={selected}
                  aria-controls="featured-panel"
                  onClick={() => setActiveTab(key)}
                  className={`-mb-px border-b-4 pb-3 pt-1 text-base font-semibold transition ${
                    selected
                      ? 'border-coral-600 text-navy-900'
                      : 'border-transparent text-slate-500 hover:text-navy-900'
                  }`}
                >
                  {label}
                  <span className="ml-2 text-xs font-medium text-slate-500">
                    {featuredGroups[key].length}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            id="featured-panel"
            role="tabpanel"
            aria-labelledby={`featured-tab-${activeTab}`}
            className="mt-6"
          >
            <p className="mb-6 text-sm text-slate-600">{activeTabConfig.description}</p>
            {activeResources.length > 0 ? (
              <FeaturedShowcase group={activeTab} resources={activeResources} saveCounts={saveCounts} />
            ) : (
              <EmptyState
                icon={activeTabConfig.icon}
                title={`Nothing in ${activeTabConfig.label.toLowerCase()}`}
                description={activeTabConfig.emptyText}
              />
            )}
          </div>
        </div>
      </section>

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
