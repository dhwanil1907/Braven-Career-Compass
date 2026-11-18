import { useMemo, useState } from 'react';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { FilterSelect } from '../components/FilterSelect';
import { PageHeader } from '../components/PageHeader';
import { ResourceCard } from '../components/ResourceCard';
import { resources } from '../data/resources';
import { INTEREST_GROUPS, INTERESTS, LOCATIONS, MAJOR_GROUPS, MAJORS } from '../data/taxonomy';
import { useApp } from '../context/useApp';
import { hasActiveFilters } from '../lib/filters';
import {
  getOpportunities,
  type OpportunityKind,
  type OpportunitySort,
} from '../lib/internships';
import { hasProfile } from '../lib/recommend';
import type { CareerInterest, LocationFormat, Major } from '../types';

const KINDS: { kind: OpportunityKind; label: string; noun: string }[] = [
  { kind: 'Internship', label: 'Internships', noun: 'internship' },
  { kind: 'Job', label: 'Jobs', noun: 'job' },
];

const SORTS: { sort: OpportunitySort; label: string }[] = [
  { sort: 'match', label: 'Best match' },
  { sort: 'deadline', label: 'Deadline soonest' },
];

const segmentClasses = (active: boolean) =>
  `inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
    active ? 'bg-navy-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`;

export function InternshipsPage() {
  const { profile } = useApp();
  const canMatch = hasProfile(profile);

  const [kind, setKind] = useState<OpportunityKind>('Internship');
  const [major, setMajor] = useState<Major | ''>('');
  const [interest, setInterest] = useState<CareerInterest | ''>('');
  const [location, setLocation] = useState<LocationFormat | ''>('');
  const [chosenSort, setChosenSort] = useState<OpportunitySort | null>(null);
  const sort: OpportunitySort = chosenSort ?? (canMatch ? 'match' : 'deadline');

  const filters = { major, interest, location };
  const listings = useMemo(
    () => getOpportunities(resources, { kind, filters: { major, interest, location }, sort, profile }),
    [kind, major, interest, location, sort, profile],
  );

  const active = KINDS.find((entry) => entry.kind === kind) ?? KINDS[0];
  const countLabel = `${listings.length} ${listings.length === 1 ? active.noun : `${active.noun}s`}`;

  const clearFilters = () => {
    setMajor('');
    setInterest('');
    setLocation('');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Internships & jobs"
        title="Find your next opportunity"
        description="Internship and job listings for SJSU students. Filter by major, career interest, and location, and sort by how well each one fits you."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          Listings come from the SJSU Career Center and partner postings collected in this catalog.
          They are not a live feed, so check each posting for current openings and deadlines.
        </p>

        <section
          aria-label="Filters"
          className="mt-6 rounded-2xl border border-slate-200/70 bg-surface p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Listing type"
              className="inline-flex gap-1 rounded-full border border-slate-200 bg-surface p-1"
            >
              {KINDS.map((entry) => (
                <button
                  key={entry.kind}
                  type="button"
                  aria-pressed={kind === entry.kind}
                  onClick={() => setKind(entry.kind)}
                  className={segmentClasses(kind === entry.kind)}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            {hasActiveFilters(filters) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-teal-700 transition hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                Clear filters
              </button>
            )}
          </div>
          <h2 className="mt-5 flex items-center gap-2 text-sm font-semibold text-navy-900">
            <SlidersHorizontal className="h-4 w-4 text-teal-600" aria-hidden="true" />
            Filters
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FilterSelect
              id="internship-major"
              label="Major"
              value={major}
              options={MAJORS}
              groups={MAJOR_GROUPS}
              onChange={setMajor}
              allLabel="All majors"
            />
            <FilterSelect
              id="internship-interest"
              label="Career interest"
              value={interest}
              options={INTERESTS}
              groups={INTEREST_GROUPS}
              onChange={setInterest}
              allLabel="All interests"
            />
            <FilterSelect
              id="internship-location"
              label="Location"
              value={location}
              options={LOCATIONS}
              onChange={setLocation}
              allLabel="All locations"
            />
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600" aria-live="polite">
            <span className="font-semibold text-navy-900">{countLabel}</span>
          </p>
          <div
            role="group"
            aria-label="Sort by"
            className="inline-flex gap-1 rounded-full border border-slate-200 bg-surface p-1"
          >
            {SORTS.map((entry) => (
              <button
                key={entry.sort}
                type="button"
                aria-pressed={sort === entry.sort}
                onClick={() => setChosenSort(entry.sort)}
                className={segmentClasses(sort === entry.sort)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={SearchX}
              title={`No ${active.noun}s match these filters`}
              description="Remove a filter to see more opportunities."
              action={
                hasActiveFilters(filters) ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  >
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
