import { useMemo, useState } from 'react';
import { Handshake, Info, MessageCircle, Users } from 'lucide-react';
import { AlumniCard, StoryMarquee } from '../components/AlumniStories';
import { EmptyState } from '../components/EmptyState';
import { FilterSelect } from '../components/FilterSelect';
import { PageHeader } from '../components/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';
import { SectionHeader } from '../components/SectionHeader';
import { alumni } from '../data/stories';
import { INTEREST_GROUPS, INTERESTS, MAJOR_GROUPS, MAJORS } from '../data/taxonomy';
import type { CareerInterest, Major } from '../types';

const PAGE_SIZE = 15;
const PAGE_BUTTON_BASE =
  'inline-flex h-11 items-center justify-center rounded-full border px-4 text-sm font-semibold ' +
  'transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500';
const PAGE_BUTTON = `${PAGE_BUTTON_BASE} border-slate-300 bg-surface text-navy-900 hover:bg-navy-50`;
const PAGE_BUTTON_ACTIVE = `${PAGE_BUTTON_BASE} border-ink bg-ink text-on-ink`;

export function AlumniPage() {
  usePageTitle('Alumni');
  const [major, setMajor] = useState<Major | ''>('');
  const [interest, setInterest] = useState<CareerInterest | ''>('');
  const [page, setPage] = useState(1);

  const hasSamples = alumni.some((alum) => alum.isSample);
  const filtered = useMemo(
    () =>
      alumni.filter(
        (alum) =>
          (major === '' || alum.major === major) &&
          (interest === '' || alum.interests.includes(interest)),
      ),
    [major, interest],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), pageCount));
    document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHeader
        icons={[Users, MessageCircle, Handshake]}
        title="Talk to someone who has done it"
        description="Find alumni who studied what you study or work in the field you want, read what they would tell you, and book a call."
      />

      {alumni.length === 0 ? (
        <div className="mx-auto max-w-[100rem] px-4 py-10 sm:px-8 lg:px-16">
          <EmptyState
            icon={Users}
            title="Alumni are on the way"
            description="We are collecting alumni who are happy to talk with students. We only list them with their permission."
          />
        </div>
      ) : (
        <div className="mx-auto max-w-[100rem] space-y-12 px-4 py-8 sm:px-8 lg:px-16">
          <section id="browse-section" aria-labelledby="browse-heading" className="scroll-mt-24">
            <SectionHeader title="Browse all alumni" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FilterSelect
                id="alumni-major"
                label="Their major"
                value={major}
                options={MAJORS}
                groups={MAJOR_GROUPS}
                onChange={(value) => {
                  setMajor(value);
                  setPage(1);
                }}
                allLabel="All majors"
              />
              <FilterSelect
                id="alumni-interest"
                label="Field they work in"
                value={interest}
                options={INTERESTS}
                groups={INTEREST_GROUPS}
                onChange={(value) => {
                  setInterest(value);
                  setPage(1);
                }}
                allLabel="All fields"
              />
            </div>
            <p id="browse-heading" className="mt-4 text-sm text-slate-600" aria-live="polite">
              <span className="font-semibold text-navy-900">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'alum' : 'alumni'}
            </p>
            {filtered.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={Users}
                  title="No alumni match those filters"
                  description="Try a different major or field, or clear both to see everyone."
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((alum) => (
                  <AlumniCard key={alum.id} alum={alum} />
                ))}
              </div>
            )}
            {pageCount > 1 && (
              <nav aria-label="Alumni pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${PAGE_BUTTON} disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Previous
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => goToPage(number)}
                    aria-label={`Page ${number}`}
                    aria-current={number === currentPage ? 'page' : undefined}
                    className={`${number === currentPage ? PAGE_BUTTON_ACTIVE : PAGE_BUTTON} min-w-10`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className={`${PAGE_BUTTON} disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Next
                </button>
              </nav>
            )}
          </section>

          <StoryMarquee />

          {hasSamples && (
            <p className="flex max-w-[75ch] items-start gap-2 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                These profiles are invented for this prototype and are not real people. Real
                alumni will appear here with their own permission.
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
