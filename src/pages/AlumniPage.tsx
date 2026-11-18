import { useMemo, useState } from 'react';
import { Info, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlumniCard, StoryMarquee } from '../components/AlumniStories';
import { EmptyState } from '../components/EmptyState';
import { FilterSelect } from '../components/FilterSelect';
import { PageHeader } from '../components/PageHeader';
import { SectionHeader } from '../components/SectionHeader';
import { useApp } from '../context/useApp';
import { alumni } from '../data/stories';
import { INTEREST_GROUPS, INTERESTS, MAJOR_GROUPS, MAJORS } from '../data/taxonomy';
import { hasProfile, matchAlumni } from '../lib/recommend';
import type { CareerInterest, Major } from '../types';

const MATCH_COUNT = 3;
const PAGE_SIZE = 15;
const PAGE_BUTTON =
  'inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-surface ' +
  'px-4 text-sm font-semibold text-navy-900 transition hover:bg-navy-50';

export function AlumniPage() {
  const { profile } = useApp();
  const [major, setMajor] = useState<Major | ''>('');
  const [interest, setInterest] = useState<CareerInterest | ''>('');
  const [page, setPage] = useState(1);

  const hasSamples = alumni.some((alum) => alum.isSample);
  const personalized = hasProfile(profile);
  const matches = useMemo(() => matchAlumni(alumni, profile, MATCH_COUNT), [profile]);
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
        eyebrow="Alumni"
        title="Talk to someone who has done it"
        description="Find alumni who studied what you study or work in the field you want, read what they would tell you, and book a call."
      >
        {hasSamples && (
          <div
            className="flex max-w-2xl items-start gap-2 rounded-xl border border-amber-200 bg-amber-50
              px-4 py-3 text-sm text-amber-900"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              The profiles marked <span className="font-semibold">Sample profile</span> are invented
              for this prototype and are not real people. Real alumni will appear here with their
              own permission, LinkedIn and scheduling link.
            </p>
          </div>
        )}
      </PageHeader>

      {alumni.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyState
            icon={Users}
            title="Alumni are on the way"
            description="We are collecting alumni who are happy to talk with students. We only list them with their permission."
          />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
          <section aria-labelledby="matches-heading">
            <SectionHeader
              title="Matched for you"
              subtitle="Based on your major and the fields you picked. Same major counts most."
              action={personalized ? { label: 'Edit my answers', to: '/start' } : undefined}
            />
            {!personalized ? (
              <EmptyState
                icon={Sparkles}
                title="Tell us about you to see your matches"
                description="Pick your major and the fields you like, and we will show the alumni closest to your path."
                action={
                  <Link
                    to="/start"
                    className="rounded-full bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep"
                  >
                    Build my plan
                  </Link>
                }
              />
            ) : matches.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No close matches yet"
                description="Nobody in the list shares your major or fields yet. Browse everyone below."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-3" id="matches-heading">
                {matches.map((match) => (
                  <AlumniCard key={match.alum.id} alum={match.alum} reasons={match.reasons} />
                ))}
              </div>
            )}
          </section>

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
                    className={`${PAGE_BUTTON} min-w-10 ${
                      number === currentPage ? 'border-ink bg-ink text-on-ink' : ''
                    }`}
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
        </div>
      )}
    </div>
  );
}
