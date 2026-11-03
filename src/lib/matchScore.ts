import { isOpenToAllMajors } from '../data/taxonomy';
import { TYPE_GUESS_TAG } from './classify';
import type { CareerEvent, ProfileSignals, Resource, UserProfile } from '../types';
import {
  ADJACENT_CREDIT,
  BANDS,
  CHALLENGE_FIT,
  GOAL_FIT,
  INTEREST_CREDIT,
  MIN_RECOMMENDED_PERCENT,
  OPEN_MAJOR_CREDIT,
  SPECIFICITY_FLOOR,
  WEIGHTS,
  YEAR_FIT,
} from './matchRules';

/** The onboarding answers that drive matching. Every field beyond major/interests is optional. */
export type MatchProfile = ProfileSignals & Partial<Pick<UserProfile, 'year' | 'goal' | 'challenge'>>;

export interface MatchResult {
  /** Whole number, 0 to 100. */
  percent: number;
  /** Band label, or null when the listing is below the recommendation cutoff. */
  label: string | null;
  reasons: string[];
}

type Listing = Resource | CareerEvent;

function listingType(item: Listing): string {
  return 'resourceType' in item ? item.resourceType : item.eventType;
}

export function hasAnswers(profile: MatchProfile): boolean {
  return (
    profile.major !== null ||
    profile.interests.length > 0 ||
    Boolean(profile.year) ||
    Boolean(profile.goal) ||
    Boolean(profile.challenge)
  );
}

export function labelForPercent(percent: number): string | null {
  return BANDS.find((band) => percent >= band.min)?.label ?? null;
}

/**
 * Weighted 0-100 match between a student's answers and a listing. The denominator is the weight of
 * the answers the student gave, so skipping a question never caps the score. A listing must also
 * have one specific fit (a named major, a shared interest, or a full goal or challenge fit);
 * otherwise being open to every major would make almost everything look partly relevant.
 */
export function scoreMatch(item: Listing, profile: MatchProfile): MatchResult {
  const type = listingType(item);
  // A guessed type (no keyword matched) carries no information about goal, challenge or year fit.
  const typeKnown = !item.tags.includes(TYPE_GUESS_TAG);
  const reasons: string[] = [];
  let earned = 0;
  let possible = 0;
  let topicalFit = false;
  let typeFit = false;

  if (profile.major !== null) {
    possible += WEIGHTS.major;
    if (isOpenToAllMajors(item.majors)) {
      earned += WEIGHTS.major * OPEN_MAJOR_CREDIT;
    } else if (item.majors.includes(profile.major)) {
      earned += WEIGHTS.major;
      topicalFit = true;
      reasons.push(`${profile.major} major`);
    }
  }

  if (profile.interests.length > 0) {
    possible += WEIGHTS.interests;
    const shared = profile.interests.filter((interest) => item.interests.includes(interest));
    // A listing dedicated to the student's field says more than one tagged with five fields.
    const specificity = shared.length / Math.max(item.interests.length, 1);
    earned +=
      WEIGHTS.interests *
      INTEREST_CREDIT[Math.min(shared.length, INTEREST_CREDIT.length - 1)] *
      (SPECIFICITY_FLOOR + (1 - SPECIFICITY_FLOOR) * specificity);
    if (shared.length > 0) topicalFit = true;
    for (const interest of shared) reasons.push(`${interest} interest`);
  }

  if (profile.goal) {
    possible += WEIGHTS.goal;
    const fit = GOAL_FIT[profile.goal];
    if (!typeKnown) {
      // no credit: the type is a fallback guess
    } else if (fit.full.includes(type)) {
      earned += WEIGHTS.goal;
      typeFit = true;
      reasons.push(`Fits your goal: ${profile.goal}`);
    } else if (fit.adjacent.includes(type)) {
      earned += WEIGHTS.goal * ADJACENT_CREDIT;
    }
  }

  if (profile.challenge) {
    possible += WEIGHTS.challenge;
    if (typeKnown && CHALLENGE_FIT[profile.challenge].includes(type)) {
      earned += WEIGHTS.challenge;
      typeFit = true;
      reasons.push(`Helps with: ${profile.challenge.toLowerCase()}`);
    }
  }

  if (profile.year) {
    possible += WEIGHTS.year;
    if (typeKnown && YEAR_FIT[profile.year].includes(type)) earned += WEIGHTS.year;
  }

  if (possible === 0 || !(topicalFit || typeFit)) return { percent: 0, label: null, reasons };
  const percent = Math.round((earned / possible) * 100);
  return { percent, label: labelForPercent(percent), reasons };
}

export function isRecommended(item: Listing, profile: MatchProfile): boolean {
  return scoreMatch(item, profile).percent >= MIN_RECOMMENDED_PERCENT;
}
