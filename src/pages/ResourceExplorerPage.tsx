import { useMemo, useState } from 'react';
import { BookOpen, Users, Wrench, ChevronDown, SearchX, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { FilterSelect } from '../components/FilterSelect';
import { ResourceCard } from '../components/ResourceCard';
import { PageHeader } from '../components/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';
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
import { useApp } from '../context/useApp';
import { filterResources, hasActiveFilters } from '../lib/filters';

// Jobs and internships live on the Internships page.
const EXCLUDED_TYPES = ['Job', 'Internship'];
const pool = resources.filter((item) => !EXCLUDED_TYPES.includes(item.resourceType));
const typeOptions = RESOURCE_TYPES.filter((type) => !EXCLUDED_TYPES.includes(type));
import { hasProfile, recommendResources } from '../lib/recommend';
import type { ResourceFilters } from '../types';

const PAGE_SIZE = 24;

type FilterParam = 'major' | 'interest' | 'type' | 'location' | 'rec';

function pickValid<T extends string>(value: string | null, allowed: readonly T[]): T | '' {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : '';
}

export function ResourceExplorerPage() {
  usePageTitle('Resources');
  const [filtersOpen, setFiltersOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const filters: ResourceFilters = useMemo(
    () => ({
      major: pickValid(searchParams.get('major'), MAJORS),
      interest: pickValid(searchParams.get('interest'), INTERESTS),
      resourceType: pickValid(searchParams.get('type'), typeOptions),
      location: pickValid(searchParams.get('location'), LOCATIONS),
    }),
    [searchParams],
  );

  const { profile } = useApp();
  const canRecommend = hasProfile(profile);
  const recommendedOnly = canRecommend && searchParams.get('rec') === '1';

  const filtered = useMemo(() => {
    const matches = filterResources(pool, query, filters);
    if (!recommendedOnly) return matches;
    const rank = new Map(recommendResources(pool, profile).map((item, index) => [item.id, index]));
    return matches
      .filter((item) => rank.has(item.id))
      .sort((first, second) => (rank.get(first.id) ?? 0) - (rank.get(second.id) ?? 0));
  }, [query, filters, recommendedOnly, profile]);

  // Visible count resets whenever the query or filters change (keyed on the URL params).
  const filterKey = searchParams.toString();
  const [loaded, setLoaded] = useState({ key: filterKey, count: PAGE_SIZE });
  const visibleCount = loaded.key === filterKey ? loaded.count : PAGE_SIZE;
  const visible = filtered.slice(0, visibleCount);
  const loadMore = () => setLoaded({ key: filterKey, count: visibleCount + PAGE_SIZE });

  const filtersActive = hasActiveFilters(filters) || recommendedOnly;
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
        icons={[BookOpen, Wrench, Users]}
        title="Career resources"
        description="Search guides, tools, workshops, and mentorship from Braven and the SJSU Career Center. Narrow results by your major, interests, and type."
      />
      <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-8 lg:px-16">

      <section aria-label="Search and filters">
        <SearchBar
          value={query}
          onChange={(value) => updateParam('q', value)}
          placeholder="Search by title, organization, or keyword…"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="resource-filters"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300
              bg-surface px-4 text-sm font-semibold text-navy-900 transition hover:bg-slate-100
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeChips.length > 0 && (
              <span className="rounded-full bg-ink px-2 text-xs font-bold text-on-ink">
                {activeChips.length}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition ${filtersOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            aria-pressed={recommendedOnly}
            disabled={!canRecommend}
            title={canRecommend ? undefined : 'Answer the three quick questions to unlock this'}
            onClick={() => updateParam('rec', recommendedOnly ? '' : '1')}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500
              disabled:cursor-not-allowed disabled:opacity-50 ${
                recommendedOnly
                  ? 'border-ink bg-ink font-bold text-on-ink'
                  : 'border-slate-300 bg-surface font-medium text-slate-700 hover:bg-slate-100'
              }`}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Recommended for me
          </button>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-10 text-sm font-medium text-teal-700 underline underline-offset-4 transition hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              Clear filters
            </button>
          )}
        </div>
        {filtersOpen && (
          <div
            id="resource-filters"
            className="mt-4 grid gap-4 rounded-3xl bg-slate-100 p-6 dark:bg-surface sm:grid-cols-2 lg:grid-cols-4"
          >
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
              label="Career interest"
              value={filters.interest}
              options={INTERESTS}
              groups={INTEREST_GROUPS}
              onChange={(value) => updateParam('interest', value)}
              allLabel="All interests"
            />
            <FilterSelect
              id="filter-type"
              label="Resource type"
              value={filters.resourceType}
              options={typeOptions}
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
        )}
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600" aria-live="polite">
          Showing <span className="font-semibold text-navy-900">{visible.length}</span> of{' '}
          <span className="font-semibold text-navy-900">{filtered.length}</span> resources
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
          {visible.map((resource) => (
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
                  className="inline-flex items-center gap-2 rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                >
                  Clear all filters
                </button>
              ) : undefined
            }
          />
        </div>
      )}

      {visible.length < filtered.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-teal-200 bg-teal-50 px-6 py-2 text-sm font-semibold text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Load more ({Math.min(PAGE_SIZE, filtered.length - visible.length)} more)
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
