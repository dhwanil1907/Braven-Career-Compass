import { isOpenToAllMajors } from '../data/taxonomy';
import type { Resource, ResourceFilters } from '../types';
import { filterResources } from './filters';
import { scoreResource } from './recommend';
import type { MatchProfile } from './matchScore';

export type OpportunityKind = 'Internship' | 'Job';
export type OpportunitySort = 'match' | 'deadline';

export interface OpportunityOptions {
  kind: OpportunityKind;
  filters: Pick<ResourceFilters, 'major' | 'interest' | 'location'>;
  sort: OpportunitySort;
  profile: MatchProfile;
}

function deadlineMs(resource: Resource): number {
  if (!resource.deadline) return Number.POSITIVE_INFINITY;
  const time = new Date(resource.deadline).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

/**
 * True when the listing is genuinely about the student's field: their major is explicitly listed
 * (not just open to everyone) or at least one of their interests is.
 */
export function hasTopicalFit(resource: Resource, profile: MatchProfile): boolean {
  const majorHit =
    profile.major !== null &&
    !isOpenToAllMajors(resource.majors) &&
    resource.majors.includes(profile.major);
  const interestHit = profile.interests.some((interest) => resource.interests.includes(interest));
  return majorHit || interestHit;
}

/** Splits listings into topical matches and the rest, preserving input order. */
export function splitByFit(
  items: Resource[],
  profile: MatchProfile,
): { forYou: Resource[]; others: Resource[] } {
  const forYou: Resource[] = [];
  const others: Resource[] = [];
  for (const item of items) {
    (hasTopicalFit(item, profile) ? forYou : others).push(item);
  }
  return { forYou, others };
}

/**
 * Internship or job listings from the catalog, filtered and sorted. Listings without a deadline
 * sort last when ordering by deadline; ties fall back to title so the order is stable. When
 * ordering by match, listings with topical fit come first.
 */
export function getOpportunities(resources: Resource[], options: OpportunityOptions): Resource[] {
  const { kind, filters, sort, profile } = options;
  const matches = filterResources(resources, '', { ...filters, resourceType: kind });
  const scores = new Map(matches.map((item) => [item.id, scoreResource(item, profile)]));
  const fits = new Map(matches.map((item) => [item.id, hasTopicalFit(item, profile)]));
  return matches.sort((first, second) => {
    if (sort === 'deadline') {
      const byDeadline = deadlineMs(first) - deadlineMs(second);
      if (byDeadline !== 0 && !Number.isNaN(byDeadline)) return byDeadline;
    } else {
      const byFit = Number(fits.get(second.id)) - Number(fits.get(first.id));
      if (byFit !== 0) return byFit;
      const byScore = (scores.get(second.id) ?? 0) - (scores.get(first.id) ?? 0);
      if (byScore !== 0) return byScore;
    }
    return first.title.localeCompare(second.title);
  });
}
