import { useMemo } from 'react';
import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { FilterSelect } from '../components/FilterSelect';
import { ResourceCard } from '../components/ResourceCard';
import { PageHeader } from '../components/PageHeader';
import { SearchBar } from '../components/SearchBar';
import { resources } from '../data/resources';
import {
  INTEREST_GROUPS,
  INTERESTS,
  LOCATIONS,
  MAJOR_GROUPS,
  MAJORS,
  RESOURCE_TYPES,
} from '../data/taxonomy';
import { filterResources, hasActiveFilters } from '../lib/filters';
import type { ResourceFilters } from '../types';

type FilterParam = 'major' | 'interest' | 'type' | 'location';

function pickValid<T extends string>(value: string | null, allowed: readonly T[]): T | '' {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : '';
}

export function ResourceExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const filters: ResourceFilters = useMemo(
    () => ({
      major: pickValid(searchParams.get('major'), MAJORS),
      interest: pickValid(searchParams.get('interest'), INTERESTS),
      resourceType: pickValid(searchParams.get('type'), RESOURCE_TYPES),
      location: pickValid(searchParams.get('location'), LOCATIONS),
    }),
    [searchParams],
  );

  const filtered = useMemo(() => filterResources(resources, query, filters), [query, filters]);
  const filtersActive = hasActiveFilters(filters);
  const anyActive = filtersActive || query.trim() !== '';

  const updateParam = (key: FilterParam | 'q', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => setSearchParams(new URLSearchParams(), { replace: true });

  const activeChips: { key: FilterParam; label: string; value: string }[] = [
    { key: 'major' as const, label: 'Major', value: filters.major },
    { key: 'interest' as const, label: 'Interest', value: filters.interest },
    { key: 'type' as const, label: 'Type', value: filters.resourceType },
    { key: 'location' as const, label: 'Location', value: filters.location },
  ].filter((chip) => chip.value !== '');

  return (
    <div>
      <PageHeader
        eyebrow="Resources"
        title="Career Resources"
        description="Search internships, jobs, workshops, mentorship, and more from Braven, the SJSU Career Center, and Handshake. Narrow results by your major, interests, and preferred format."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      <section
        aria-label="Search and filters"
        className="mt-8 rounded-2xl border border-slate-200/70 bg-surface p-5 shadow-card sm:p-6"
      >
        <SearchBar
          value={query}
          onChange={(value) => updateParam('q', value)}
          placeholder="Search by title, organization, or keyword…"
        />
        <div className="mt-5 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
            <SlidersHorizontal className="h-4 w-4 text-teal-600" aria-hidden="true" />
            Filters
          </h2>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-teal-700 transition hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            id="filter-major"
            label="Major"
            value={filters.major}
            options={MAJORS}
            groups={MAJOR_GROUPS}
            onChange={(value) => updateParam('major', value)}
            allLabel="All majors"
          />
          <FilterSelect
            id="filter-interest"
            label="Career Interest"
            value={filters.interest}
            options={INTERESTS}
            groups={INTEREST_GROUPS}
            onChange={(value) => updateParam('interest', value)}
            allLabel="All interests"
          />
          <FilterSelect
            id="filter-type"
            label="Resource Type"
            value={filters.resourceType}
            options={RESOURCE_TYPES}
            onChange={(value) => updateParam('type', value)}
            allLabel="All types"
          />
          <FilterSelect
            id="filter-location"
            label="Location"
            value={filters.location}
            options={LOCATIONS}
            onChange={(value) => updateParam('location', value)}
            allLabel="All locations"
          />
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600" aria-live="polite">
          Showing <span className="font-semibold text-navy-900">{filtered.length}</span> of{' '}
          <span className="font-semibold text-navy-900">{resources.length}</span> resources
        </p>
        {activeChips.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Active filters">
            {activeChips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={() => updateParam(chip.key, '')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  aria-label={`Remove ${chip.label} filter: ${chip.value}`}
                >
                  <span className="text-teal-600">{chip.label}:</span>
                  {chip.value}
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={SearchX}
            title="No resources match your search"
            description="Try a different keyword or remove a filter to see more opportunities."
            action={
              anyActive ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  Clear all filters
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
