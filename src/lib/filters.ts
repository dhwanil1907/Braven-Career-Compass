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
    if (major && !resource.majors.includes(major)) return false;
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
        ...resource.majors,
        ...resource.interests,
      ],
      query,
    );
  });
}

export function filterEvents(
  events: CareerEvent[],
  query: string,
  filters: Partial<EventFilters>,
): CareerEvent[] {
  const { eventType, format } = filters;
  return events
    .filter((event) => {
      if (eventType && event.eventType !== eventType) return false;
      if (format && event.format !== format) return false;
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
  return Object.values(filters).some((value) => value !== undefined && value !== '');
}
