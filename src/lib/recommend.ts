import { isOpenToAllMajors } from '../data/taxonomy';
import type {
  AlumniProfile,
  CareerEvent,
  CareerInterest,
  Major,
  ProfileSignals,
  Resource,
} from '../types';

interface Taggable {
  majors: Major[];
  interests: CareerInterest[];
}

export function hasProfile(profile: ProfileSignals): boolean {
  return profile.major !== null || profile.interests.length > 0;
}

/**
 * Major named by the listing +3, each interest match +2. A listing that is open to every major gets
 * a small +1 so general resources still appear, below real matches.
 */
function baseScore(item: Taggable, profile: ProfileSignals): number {
  const openToAll = isOpenToAllMajors(item.majors);
  const majorScore =
    profile.major !== null && !openToAll && item.majors.includes(profile.major) ? 3 : 0;
  const interestMatches = profile.interests.filter((interest) =>
    item.interests.includes(interest),
  ).length;
  return majorScore + interestMatches * 2 + (openToAll ? 1 : 0);
}

export function scoreResource(resource: Resource, profile: ProfileSignals): number {
  const score = baseScore(resource, profile);
  if (score === 0) return 0;
  return resource.featured ? score + 1 : score;
}

export function getMatchReasons(resource: Resource, profile: ProfileSignals): string[] {
  const reasons: string[] = [];
  if (
    profile.major !== null &&
    !isOpenToAllMajors(resource.majors) &&
    resource.majors.includes(profile.major)
  ) {
    reasons.push(`${profile.major} major`);
  }
  for (const interest of profile.interests) {
    if (resource.interests.includes(interest)) reasons.push(`${interest} interest`);
  }
  return reasons;
}

export function recommendResources(
  resources: Resource[],
  profile: ProfileSignals,
  limit?: number,
): Resource[] {
  if (!hasProfile(profile)) return [];
  const ranked = resources
    .map((resource) => ({ resource, score: scoreResource(resource, profile) }))
    .filter(({ score }) => score > 0)
    .sort(
      (first, second) =>
        second.score - first.score || first.resource.title.localeCompare(second.resource.title),
    )
    .map(({ resource }) => resource);
  return limit === undefined ? ranked : ranked.slice(0, limit);
}

export function recommendEvents(
  events: CareerEvent[],
  profile: ProfileSignals,
  now: Date = new Date(),
  limit?: number,
): CareerEvent[] {
  if (!hasProfile(profile)) return [];
  const nowMs = now.getTime();
  const ranked = events
    .filter((event) => new Date(event.end).getTime() >= nowMs)
    .map((event) => ({ event, score: baseScore(event, profile) }))
    .filter(({ score }) => score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
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
