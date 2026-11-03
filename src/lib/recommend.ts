import type { AlumniProfile, CareerEvent, ProfileSignals, Resource } from '../types';
import { MIN_RECOMMENDED_PERCENT } from './matchRules';
import { hasAnswers, scoreMatch, type MatchProfile } from './matchScore';

export function hasProfile(profile: MatchProfile): boolean {
  return hasAnswers(profile);
}

/** Match percent (0-100). Kept as a number-returning helper for callers that only need to sort. */
export function scoreResource(resource: Resource, profile: MatchProfile): number {
  return scoreMatch(resource, profile).percent;
}

export function getMatchReasons(resource: Resource, profile: MatchProfile): string[] {
  return scoreMatch(resource, profile).reasons;
}

/** Resources at or above the recommendation cutoff, best match first (featured, then title). */
export function recommendResources(
  resources: Resource[],
  profile: MatchProfile,
  limit?: number,
): Resource[] {
  if (!hasProfile(profile)) return [];
  const ranked = resources
    .map((resource) => ({ resource, percent: scoreMatch(resource, profile).percent }))
    .filter(({ percent }) => percent >= MIN_RECOMMENDED_PERCENT)
    .sort(
      (first, second) =>
        second.percent - first.percent ||
        Number(second.resource.featured) - Number(first.resource.featured) ||
        first.resource.title.localeCompare(second.resource.title),
    )
    .map(({ resource }) => resource);
  return limit === undefined ? ranked : ranked.slice(0, limit);
}

/** Upcoming events at or above the cutoff, best match first (ties by start date). */
export function recommendEvents(
  events: CareerEvent[],
  profile: MatchProfile,
  now: Date = new Date(),
  limit?: number,
): CareerEvent[] {
  if (!hasProfile(profile)) return [];
  const nowMs = now.getTime();
  const ranked = events
    .filter((event) => new Date(event.end).getTime() >= nowMs)
    .map((event) => ({ event, percent: scoreMatch(event, profile).percent }))
    .filter(({ percent }) => percent >= MIN_RECOMMENDED_PERCENT)
    .sort(
      (first, second) =>
        second.percent - first.percent ||
        new Date(first.event.start).getTime() - new Date(second.event.start).getTime(),
    )
    .map(({ event }) => event);
  return limit === undefined ? ranked : ranked.slice(0, limit);
}

export interface AlumniMatch {
  alum: AlumniProfile;
  score: number;
  reasons: string[];
}

/**
 * Alumni ranked for a student: same major +3, each shared field +2. Only people with at least one
 * match are returned, best first (ties by name).
 */
export function matchAlumni(
  alumni: AlumniProfile[],
  profile: ProfileSignals,
  limit?: number,
): AlumniMatch[] {
  if (!hasProfile(profile)) return [];
  const matches = alumni
    .map((alum) => {
      const reasons: string[] = [];
      const sameMajor = profile.major !== null && alum.major === profile.major;
      if (sameMajor) reasons.push(`Also studied ${alum.major}`);
      const sharedFields = profile.interests.filter((interest) => alum.interests.includes(interest));
      for (const interest of sharedFields) reasons.push(`Works in ${interest}`);
      return { alum, score: (sameMajor ? 3 : 0) + sharedFields.length * 2, reasons };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.alum.name.localeCompare(b.alum.name));
  return limit === undefined ? matches : matches.slice(0, limit);
}
