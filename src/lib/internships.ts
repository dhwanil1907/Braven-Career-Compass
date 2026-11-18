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
 * Internship or job listings from the catalog, filtered and sorted. Listings without a deadline
 * sort last when ordering by deadline; ties fall back to title so the order is stable.
 */
export function getOpportunities(resources: Resource[], options: OpportunityOptions): Resource[] {
  const { kind, filters, sort, profile } = options;
  const matches = filterResources(resources, '', { ...filters, resourceType: kind });
  const scores = new Map(matches.map((item) => [item.id, scoreResource(item, profile)]));
  return matches.sort((first, second) => {
    if (sort === 'deadline') {
      const byDeadline = deadlineMs(first) - deadlineMs(second);
      if (byDeadline !== 0 && !Number.isNaN(byDeadline)) return byDeadline;
    } else {
      const byScore = (scores.get(second.id) ?? 0) - (scores.get(first.id) ?? 0);
      if (byScore !== 0) return byScore;
    }
    return first.title.localeCompare(second.title);
  });
}
