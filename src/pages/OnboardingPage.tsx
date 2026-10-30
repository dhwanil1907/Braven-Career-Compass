import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import {
  ACADEMIC_YEARS,
  CAREER_GOALS,
  CHALLENGES,
  INTEREST_GROUPS,
  MAJOR_GROUPS,
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

const STEP_COUNT = 3;
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium
        transition ${
          selected
            ? 'border-navy-900 bg-ink text-on-ink'
            : 'border-slate-200 bg-surface text-slate-700 hover:border-slate-300'
        }`}
    >
      {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      {label}
    </button>
  );
}

function Question({
  title,
  hint,
  grouped = false,
  children,
}: {
  title: string;
  hint?: string;
  grouped?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-8 first:mt-0">
      <legend className="text-base font-semibold text-navy-900">{title}</legend>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      {grouped ? children : <div className="mt-3 flex flex-wrap gap-2">{children}</div>}
    </fieldset>
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
    <div className="mt-3 w-full space-y-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            {group.label}
          </p>
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

export function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, updateProfile, referralSource, setReferralSource } = useApp();
  const [step, setStep] = useState(0);
  const [major, setMajor] = useState<Major | null>(profile.major);
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

  const canContinue = [major !== null && year !== null, goal !== null, challenge !== null][step];
  const isLast = step === STEP_COUNT - 1;

  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    updateProfile({ major, year, goal, interests, challenge, onboarded: true });
    setReferralSource(referral);
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-800">
        Step {step + 1} of {STEP_COUNT}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={step + 1}
        aria-label="Onboarding progress"
      >
        <div
          className="h-full rounded-full bg-coral-500 transition-all"
          style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
        />
      </div>

      <h1 className="mt-6 text-3xl font-semibold text-navy-950 sm:text-4xl">
        {['Tell us about you', 'Where do you want to go?', 'What is in your way?'][step]}
      </h1>
      <p className="mt-2 text-slate-600">
        Three quick questions. We use them to build your next steps from resources Braven and
        partners already offer. Your answers stay in this browser.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200/70 bg-surface p-6 shadow-card sm:p-8">
        {step === 0 && (
          <>
            <Question title="What is your major?" grouped>
              <GroupedChips
                groups={MAJOR_GROUPS}
                isSelected={(option) => major === option}
                onSelect={setMajor}
              />
            </Question>
            <Question title="Where are you in school?">
              {ACADEMIC_YEARS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={year === option}
                  onSelect={() => setYear(option)}
                />
              ))}
            </Question>
          </>
        )}
        {step === 1 && (
          <>
            <Question title="What is your main goal right now?">
              {CAREER_GOALS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={goal === option}
                  onSelect={() => setGoal(option)}
                />
              ))}
            </Question>
            <Question
              title="Which fields interest you?"
              hint={`Optional. Pick up to ${MAX_INTERESTS}.`}
              grouped
            >
              <GroupedChips
                groups={INTEREST_GROUPS}
                isSelected={(option) => interests.includes(option)}
                onSelect={toggleInterest}
              />
            </Question>
          </>
        )}
        {step === 2 && (
          <>
            <Question title="What is your biggest challenge?" hint="We will put help for this first.">
              {CHALLENGES.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={challenge === option}
                  onSelect={() => setChallenge(option)}
                />
              ))}
            </Question>
            <Question
              title="How did you hear about Career Compass?"
              hint="Optional. Helps us see which outreach works. Stays in this browser."
            >
              {REFERRAL_SOURCES.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={referral === option}
                  onSelect={() => setReferral(referral === option ? null : option)}
                />
              ))}
            </Question>
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
            text-slate-600 transition hover:text-navy-900 disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-full bg-coral-600 px-6 py-2.5 text-sm
            font-semibold text-white transition hover:bg-deep disabled:cursor-not-allowed
            disabled:opacity-40"
        >
          {isLast ? 'Build my plan' : 'Continue'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
