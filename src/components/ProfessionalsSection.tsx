import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, Search, Users } from 'lucide-react';
import { professionals, type Professional } from '../data/professionals';
import {
  companiesWithCounts,
  filterProfessionals,
  initialsOf,
  type KindFilter,
} from '../lib/professionals';
import { Badge } from './Badge';
import { EmptyState } from './EmptyState';
import { SectionHeader } from './SectionHeader';

const KIND_OPTIONS: { value: KindFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'recruiting', label: 'Recruiting and university relations' },
  { value: 'professional', label: 'Other roles' },
];

const FIELD_LABEL = 'text-xs font-semibold uppercase tracking-wide text-slate-500';
const FIELD_FOCUS =
  'focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100';

const byCompanyThenName = (a: Professional, b: Professional) =>
  a.company.localeCompare(b.company) || a.name.localeCompare(b.name);

function Avatar({ person }: { person: Professional }) {
  if (person.photoUrl) {
    return (
      <img
        src={person.photoUrl}
        alt={person.name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100
        text-base font-semibold text-navy-900"
    >
      {initialsOf(person.name)}
    </span>
  );
}

function ProfessionalCard({ person }: { person: Professional }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-surface p-5">
      <div className="flex items-start gap-3">
        <Avatar person={person} />
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold text-navy-900">{person.name}</h3>
          {person.role && <p className="mt-0.5 text-sm text-slate-600">{person.role}</p>}
          <p className="mt-0.5 text-sm font-medium text-navy-900">{person.company}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {person.kind === 'recruiting' && <Badge variant="teal">Recruiting</Badge>}
        <a
          href={person.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-full bg-coral-600 px-4
            text-sm font-semibold text-white transition hover:bg-deep focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-coral-600"
        >
          View on LinkedIn
          <span className="sr-only">(opens in a new tab)</span>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

export function ProfessionalsSection() {
  const [query, setQuery] = useState('');
  const [company, setCompany] = useState('');
  const [kind, setKind] = useState<KindFilter>('all');

  const companies = useMemo(() => companiesWithCounts(professionals), []);
  const results = useMemo(
    () => filterProfessionals(professionals, { query, company, kind }).sort(byCompanyThenName),
    [query, company, kind],
  );

  const clearFilters = () => {
    setQuery('');
    setCompany('');
    setKind('all');
  };

  return (
    <section aria-label="Professionals at big companies" className="scroll-mt-24">
      <SectionHeader
        title="Connect with professionals at big companies"
        subtitle="People at companies that hire SJSU students. Each button opens their public LinkedIn profile in a new tab; send a short, polite message that says who you are."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="professionals-search" className={FIELD_LABEL}>
            Search by name, company or role
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2
                text-slate-400"
              aria-hidden="true"
            />
            <input
              id="professionals-search"
              type="search"
              value={query}
              onChange={(changeEvent) => setQuery(changeEvent.target.value)}
              className={`h-11 w-full rounded-xl border border-slate-200 bg-surface pl-9 pr-3.5
                text-sm text-navy-900 placeholder:text-slate-400 hover:border-slate-300
                ${FIELD_FOCUS}`}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="professionals-company" className={FIELD_LABEL}>
            Company
          </label>
          <div className="relative">
            <select
              id="professionals-company"
              value={company}
              onChange={(changeEvent) => setCompany(changeEvent.target.value)}
              className={`h-11 w-full cursor-pointer appearance-none rounded-xl border
                border-slate-200 bg-surface pl-3.5 pr-10 text-sm text-navy-900
                hover:border-slate-300 ${FIELD_FOCUS}`}
            >
              <option value="">All companies</option>
              {companies.map((entry) => (
                <option key={entry.company} value={entry.company}>
                  {entry.company} ({entry.count})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2
                text-slate-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div role="group" aria-label="Type of role" className="mt-4 flex flex-wrap gap-2">
        {KIND_OPTIONS.map((option) => {
          const active = kind === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => setKind(option.value)}
              className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm
                font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-coral-600 ${
                  active
                    ? 'border-coral-600 bg-coral-600 text-white'
                    : 'border-slate-300 bg-surface text-navy-900 hover:bg-slate-100'
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-slate-600" aria-live="polite">
        <span className="font-semibold text-navy-900">{results.length}</span>{' '}
        {results.length === 1 ? 'person' : 'people'}
      </p>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={Users}
            title="No one matches those filters"
            description="Try a different search or company, or clear the filters to see everyone."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-10 items-center rounded-full bg-coral-600 px-4 text-sm
                  font-semibold text-white transition hover:bg-deep focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-coral-600"
              >
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((person) => (
            <ProfessionalCard key={person.id} person={person} />
          ))}
        </ul>
      )}

      <p className="mt-6 text-sm text-slate-500">
        Listed for student networking. Never share personal details you would not want public, and
        keep messages respectful.
      </p>
    </section>
  );
}
