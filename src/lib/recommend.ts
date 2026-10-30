import type { CareerEvent, CareerInterest, Major, ProfileSignals, Resource } from '../types';

interface Taggable {
  majors: Major[];
  interests: CareerInterest[];
}

export function hasProfile(profile: ProfileSignals): boolean {
  return profile.major !== null || profile.interests.length > 0;
}

/** Major match +3, each interest match +2; 0 when nothing in the profile matches. */
function baseScore(item: Taggable, profile: ProfileSignals): number {
  const majorScore = profile.major !== null && item.majors.includes(profile.major) ? 3 : 0;
  const interestMatches = profile.interests.filter((interest) =>
    item.interests.includes(interest),
  ).length;
  return majorScore + interestMatches * 2;
}

export function scoreResource(resource: Resource, profile: ProfileSignals): number {
  const score = baseScore(resource, profile);
  if (score === 0) return 0;
  return resource.featured ? score + 1 : score;
}

export function getMatchReasons(resource: Resource, profile: ProfileSignals): string[] {
  const reasons: string[] = [];
  if (profile.major !== null && resource.majors.includes(profile.major)) {
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
