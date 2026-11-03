import { isOpenToAllMajors } from '../data/taxonomy';
import type { CareerEvent, EventFilters, Resource, ResourceFilters } from '../types';

export function matchesQuery(text: string[], query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = text.join(' ').toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function byStartAscending(first: CareerEvent, second: CareerEvent): number {
  return new Date(first.start).getTime() - new Date(second.start).getTime();
}

export function filterResources(
  resources: Resource[],
  query: string,
  filters: Partial<ResourceFilters>,
): Resource[] {
  const { major, interest, resourceType, location } = filters;
  return resources.filter((resource) => {
    if (major && !isOpenToAllMajors(resource.majors) && !resource.majors.includes(major)) {
      return false;
    }
    if (interest && !resource.interests.includes(interest)) return false;
    if (resourceType && resource.resourceType !== resourceType) return false;
    if (location && resource.location !== location) return false;
    return matchesQuery(
      [
        resource.title,
        resource.summary,
        resource.description,
        resource.source,
        resource.resourceType,
        ...resource.tags,
        ...(isOpenToAllMajors(resource.majors) ? [] : resource.majors),
        ...resource.interests,
      ],
      query,
    );
  });
}

export const CAREER_CENTER_HOST = 'SJSU Career Center';
export const BRAVEN_HOST = 'Braven at SJSU';
/** Filter value meaning "any host that is not the Career Center or Braven". */
export const ALL_CLUBS_HOST = 'All student clubs';

export function isClubEvent(event: CareerEvent): boolean {
  return event.host !== CAREER_CENTER_HOST && event.host !== BRAVEN_HOST;
}

/** Club names that have at least one event, alphabetical. */
export function getClubHosts(events: CareerEvent[]): string[] {
  const hosts = new Set(events.filter(isClubEvent).map((event) => event.host));
  return [...hosts].sort((first, second) => first.localeCompare(second));
}

function matchesAnyHost(event: CareerEvent, hosts: string[]): boolean {
  return hosts.some((host) => (host === ALL_CLUBS_HOST ? isClubEvent(event) : event.host === host));
}

export function filterEvents(
  events: CareerEvent[],
  query: string,
  filters: Partial<EventFilters>,
): CareerEvent[] {
  const { eventType, format, hosts = [] } = filters;
  return events
    .filter((event) => {
      if (eventType && event.eventType !== eventType) return false;
      if (format && event.format !== format) return false;
      if (hosts.length > 0 && !matchesAnyHost(event, hosts)) return false;
      return matchesQuery(
        [
          event.title,
          event.description,
          event.host,
          event.eventType,
          event.format,
          event.location,
          ...event.tags,
        ],
        query,
      );
    })
    .sort(byStartAscending);
}

export function getUpcomingEvents(
  events: CareerEvent[],
  now: Date = new Date(),
  limit?: number,
): CareerEvent[] {
  const nowMs = now.getTime();
  const upcoming = events
    .filter((event) => new Date(event.end).getTime() >= nowMs)
    .sort(byStartAscending);
  return limit === undefined ? upcoming : upcoming.slice(0, limit);
}

export function hasActiveFilters(
  filters: Partial<ResourceFilters> | Partial<EventFilters>,
): boolean {
  return Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '',
  );
}
