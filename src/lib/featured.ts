import type { Resource } from '../types';
import { daysUntil } from './dates';

export const CLOSING_SOON_DAYS = 21;
const DEFAULT_GROUP_SIZE = 3;

/** How many signed-in students saved each resource, keyed by resource id. */
export type SaveCounts = Record<string, number>;

/**
 * A resource needs this many saves before it is ranked or its count is shown, so one student's
 * saves are never visible on their own.
 */
export const MIN_PUBLIC_SAVES = 3;

export interface FeaturedGroups {
  closingSoon: Resource[];
  important: Resource[];
  popular: Resource[];
}

/** Resources whose deadline falls between today and `withinDays` from now, soonest first. */
export function getClosingSoon(
  resources: Resource[],
  now: Date = new Date(),
  withinDays: number = CLOSING_SOON_DAYS,
): Resource[] {
  return resources
    .flatMap((resource) => {
      if (!resource.deadline) return [];
      const daysLeft = daysUntil(resource.deadline, now);
      return daysLeft >= 0 && daysLeft <= withinDays ? [{ resource, daysLeft }] : [];
    })
    .sort(
      (first, second) =>
        first.daysLeft - second.daysLeft || first.resource.title.localeCompare(second.resource.title),
    )
    .map(({ resource }) => resource);
}

export function getImportant(resources: Resource[]): Resource[] {
  return resources.filter((resource) => resource.featured);
}

/** Resources ranked by real save counts, highest first. Needs MIN_PUBLIC_SAVES to qualify. */
export function getPopular(resources: Resource[], saveCounts: SaveCounts = {}): Resource[] {
  return resources
    .filter((resource) => (saveCounts[resource.id] ?? 0) >= MIN_PUBLIC_SAVES)
    .sort(
      (first, second) =>
        (saveCounts[second.id] ?? 0) - (saveCounts[first.id] ?? 0) ||
        first.title.localeCompare(second.title),
    );
}

/** Builds the three homepage groups; a resource appears in at most one group. */
export function getFeaturedGroups(
  resources: Resource[],
  now: Date = new Date(),
  groupSize: number = DEFAULT_GROUP_SIZE,
  saveCounts: SaveCounts = {},
): FeaturedGroups {
  const usedIds = new Set<string>();
  const take = (candidates: Resource[]) => {
    const picked = candidates.filter((resource) => !usedIds.has(resource.id)).slice(0, groupSize);
    picked.forEach((resource) => usedIds.add(resource.id));
    return picked;
  };

  return {
    closingSoon: take(getClosingSoon(resources, now)),
    important: take(getImportant(resources)),
    popular: take(getPopular(resources, saveCounts)),
  };
}
