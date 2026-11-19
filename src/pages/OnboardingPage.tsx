import { usePageTitle } from '../hooks/usePageTitle';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import {
  ACADEMIC_YEARS,
  CAREER_GOALS,
  CHALLENGES,
  INTEREST_GROUPS,
  MAJOR_GROUPS,
  interestGroupsFor,
  REFERRAL_SOURCES,
} from '../data/taxonomy';
import type {
  AcademicYear,
  CareerGoal,
  CareerInterest,
  Challenge,
  Major,
  ReferralSource,
} from '../types';

const MAX_INTERESTS = 3;

interface ChipProps {
  label: string;
  selected: boolean;
  onSelect(): void;
}

function Chip({ label, selected, onSelect }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 py-2.5 text-base
        font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-ink ${
          selected
            ? 'bg-ink text-on-ink'
            : 'bg-slate-100 text-navy-900 hover:bg-slate-200 dark:bg-surface dark:hover:bg-raised'
        }`}
    >
      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
      {label}
    </button>
  );
}

/** Chips under small group headings, so a long list stays easy to scan. */
function GroupedChips<T extends string>({
  groups,
  isSelected,
  onSelect,
}: {
  groups: { label: string; options: T[] }[];
  isSelected: (option: T) => boolean;
  onSelect: (option: T) => void;
}) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-sm font-semibold text-slate-600">{group.label}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.options.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={isSelected(option)}
                onSelect={() => onSelect(option)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Options<T extends string>({
  options,
  isSelected,
  onSelect,
}: {
  options: readonly T[];
  isSelected: (option: T) => boolean;
  onSelect: (option: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          selected={isSelected(option)}
          onSelect={() => onSelect(option)}
        />
      ))}
    </div>
  );
}

interface Step {
  title: string;
  hint?: string;
  optional: boolean;
  valid: boolean;
  /** True when an optional question has no answer yet, so the button reads "Skip". */
  empty: boolean;
  body: ReactNode;
}

export function OnboardingPage() {
  usePageTitle('Build my plan');
  const navigate = useNavigate();
  const { profile, updateProfile, referralSource, setReferralSource } = useApp();
  const [step, setStep] = useState(0);
  const [major, setMajor] = useState<Major | null>(profile.major);
  const [minor, setMinor] = useState<Major | null>(profile.minor ?? null);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [year, setYear] = useState<AcademicYear | null>(profile.year);
  const [goal, setGoal] = useState<CareerGoal | null>(profile.goal);
  const [interests, setInterests] = useState<CareerInterest[]>(profile.interests);
  const [challenge, setChallenge] = useState<Challenge | null>(profile.challenge);
  const [referral, setReferral] = useState<ReferralSource | null>(referralSource);

  const toggleInterest = (interest: CareerInterest) =>
    setInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((existing) => existing !== interest)
        : previous.length < MAX_INTERESTS
          ? [...previous, interest]
          : previous,
    );

  const interestGroups = showAllInterests ? INTEREST_GROUPS : interestGroupsFor([major, minor]);
  const isNarrowed = interestGroups !== INTEREST_GROUPS;

  const handleMajorSelect = (option: Major) => {
    setMajor(option);
    if (minor === option) setMinor(null);
    setInterests([]);
  };

  const handleMinorSelect = (option: Major) => {
    const next = minor === option ? null : option;
    setMinor(next);
    const allowed = new Set(interestGroupsFor([major, next]).flatMap((group) => group.options));
    setInterests((previous) => previous.filter((interest) => allowed.has(interest)));
  };

  // One question per screen, in the order the plan needs them.
  const steps: Step[] = [
    {
      title: 'What is your major?',
      optional: false,
      valid: major !== null,
      empty: false,
      body: (
        <GroupedChips
          groups={MAJOR_GROUPS}
          isSelected={(option) => major === option}
          onSelect={handleMajorSelect}
        />
      ),
    },
    {
      title: 'Do you have a minor?',
      hint: 'Optional. Tap again to clear.',
      optional: true,
      valid: true,
      empty: minor === null,
      body: (
        <GroupedChips
          groups={MAJOR_GROUPS.filter((group) => group.label !== 'Other')}
          isSelected={(option) => minor === option}
          onSelect={handleMinorSelect}
        />
      ),
    },
    {
      title: 'Where are you in school?',
      optional: false,
      valid: year !== null,
      empty: false,
      body: (
        <Options
          options={ACADEMIC_YEARS}
          isSelected={(option) => year === option}
          onSelect={setYear}
        />
      ),
    },
    {
      title: 'What is your main goal right now?',
      optional: false,
      valid: goal !== null,
      empty: false,
      body: (
        <Options
          options={CAREER_GOALS}
          isSelected={(option) => goal === option}
          onSelect={setGoal}
        />
      ),
    },
    {
      title: 'Which fields interest you?',
      hint: `Optional. Pick up to ${MAX_INTERESTS}.${
        isNarrowed ? ' Showing fields that fit your major.' : ''
      }`,
      optional: true,
      valid: true,
      empty: interests.length === 0,
      body: (
        <>
          <GroupedChips
            groups={interestGroups}
            isSelected={(option) => interests.includes(option)}
            onSelect={toggleInterest}
          />
          {(isNarrowed || showAllInterests) && (
            <button
              type="button"
              onClick={() => setShowAllInterests(!showAllInterests)}
              className="mt-5 min-h-11 text-sm font-semibold text-navy-900 underline underline-offset-4"
            >
              {showAllInterests ? 'Show only fields that fit my major' : 'Show all fields'}
            </button>
          )}
        </>
      ),
    },
    {
      title: 'What is your biggest challenge?',
      hint: 'We will put help for this first.',
      optional: false,
      valid: challenge !== null,
      empty: false,
      body: (
        <Options
          options={CHALLENGES}
          isSelected={(option) => challenge === option}
          onSelect={setChallenge}
        />
      ),
    },
    {
      title: 'How did you hear about Career Compass?',
      hint: 'Optional. Helps us see which outreach works. Stays in this browser.',
      optional: true,
      valid: true,
      empty: referral === null,
      body: (
        <Options
          options={REFERRAL_SOURCES}
          isSelected={(option) => referral === option}
          onSelect={(option) => setReferral(referral === option ? null : option)}
        />
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const skipping = current.optional && current.empty && !isLast;

  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    updateProfile({ major, minor, year, goal, interests, challenge, onboarded: true });
    setReferralSource(referral);
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
      <div className="flex items-center gap-4">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-surface"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label="Plan questions progress"
        >
          <div
            className="h-full rounded-full bg-ink transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-slate-600">
          {step + 1} of {steps.length}
        </p>
      </div>

      <div key={step} className="animate-rise">
        <h1
          className="mt-10 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em]
            text-navy-900 sm:text-5xl"
        >
          {current.title}
        </h1>
        {current.hint && <p className="mt-3 text-lg text-slate-600">{current.hint}</p>}
        <div className="mt-8">{current.body}</div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-base font-semibold
            text-slate-700 transition hover:text-navy-900 disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!current.valid}
          className={`inline-flex h-12 items-center gap-2 rounded-full px-7 text-base font-semibold
            transition disabled:cursor-not-allowed disabled:opacity-40 ${
              skipping
                ? 'border border-slate-400 bg-surface text-navy-900 hover:bg-slate-100'
                : 'bg-ink text-on-ink hover:opacity-85'
            }`}
        >
          {isLast ? 'Build my plan' : skipping ? 'Skip' : 'Continue'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
