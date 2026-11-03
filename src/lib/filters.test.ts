import { describe, expect, it } from 'vitest';
import type { CareerEvent, Resource } from '../types';
import {
  ALL_CLUBS_HOST,
  filterEvents,
  filterResources,
  getClubHosts,
  getUpcomingEvents,
  hasActiveFilters,
  matchesQuery,
} from './filters';

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'r1',
    title: 'Resource',
    summary: 'Summary',
    description: 'Description',
    whoItsFor: [],
    resourceType: 'Job',
    source: 'Source',
    sourceUrl: 'https://example.com',
    url: 'https://example.com',
    majors: [],
    interests: [],
    location: 'Remote',
    tags: [],
    featured: false,
    isDemo: true,
    ...overrides,
  };
}

function makeEvent(overrides: Partial<CareerEvent> = {}): CareerEvent {
  return {
    id: 'e1',
    title: 'Event',
    description: 'Description',
    eventType: 'Workshop',
    format: 'Virtual',
    start: '2026-06-01T17:00:00.000Z',
    end: '2026-06-01T18:00:00.000Z',
    location: 'Online',
    host: 'Braven',
    url: 'https://example.com',
    majors: [],
    interests: [],
    tags: [],
    isDemo: true,
    ...overrides,
  };
}

const resources: Resource[] = [
  makeResource({
    id: 'swe',
    title: 'Software Engineering Internship',
    majors: ['Computer Science'],
    interests: ['Software Engineering'],
    resourceType: 'Internship',
    location: 'Hybrid',
    tags: ['python'],
  }),
  makeResource({
    id: 'resume',
    title: 'Resume Review Clinic',
    summary: 'Get feedback on your resume',
    majors: ['Business', 'Computer Science'],
    interests: ['Finance'],
    resourceType: 'Resume Help',
    location: 'Remote',
  }),
  makeResource({
    id: 'ux',
    title: 'UX Mentorship',
    majors: ['Design'],
    interests: ['UX Design'],
    resourceType: 'Mentorship',
    location: 'In-Person',
  }),
];

describe('matchesQuery', () => {
  it('returns true for empty or blank queries', () => {
    expect(matchesQuery(['anything'], '')).toBe(true);
    expect(matchesQuery(['anything'], '   ')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(matchesQuery(['Resume Review'], 'RESUME')).toBe(true);
  });

  it('requires every term to appear', () => {
    expect(matchesQuery(['Resume Review', 'Clinic'], 'resume clinic')).toBe(true);
    expect(matchesQuery(['Resume Review', 'Clinic'], 'resume finance')).toBe(false);
  });
});

describe('filterResources', () => {
  it('returns all resources for a blank query and no filters', () => {
    expect(filterResources(resources, '  ', {})).toEqual(resources);
  });

  it('searches across fields with multiple terms, case-insensitively', () => {
    expect(filterResources(resources, 'PYTHON internship', {}).map((r) => r.id)).toEqual([
      'swe',
    ]);
    expect(filterResources(resources, 'feedback', {}).map((r) => r.id)).toEqual(['resume']);
  });

  it('filters by major and preserves input order', () => {
    const result = filterResources(resources, '', { major: 'Computer Science' });
    expect(result.map((r) => r.id)).toEqual(['swe', 'resume']);
  });

  it('filters by interest', () => {
    expect(filterResources(resources, '', { interest: 'UX Design' }).map((r) => r.id)).toEqual([
      'ux',
    ]);
  });

  it('filters by resource type', () => {
    const result = filterResources(resources, '', { resourceType: 'Resume Help' });
    expect(result.map((r) => r.id)).toEqual(['resume']);
  });

  it('filters by location', () => {
    expect(filterResources(resources, '', { location: 'Hybrid' }).map((r) => r.id)).toEqual([
      'swe',
    ]);
  });

  it('treats empty-string filters as no filter', () => {
    const result = filterResources(resources, '', {
      major: '',
      interest: '',
      resourceType: '',
      location: '',
    });
    expect(result).toHaveLength(3);
  });

  it('returns an empty array when combined filters match nothing', () => {
    const result = filterResources(resources, '', { major: 'Design', location: 'Remote' });
    expect(result).toEqual([]);
  });
});

describe('host filter', () => {
  const events: CareerEvent[] = [
    makeEvent({ id: 'center', host: 'SJSU Career Center' }),
    makeEvent({ id: 'braven', host: 'Braven at SJSU' }),
    makeEvent({ id: 'wib', host: 'Women in Business at SJSU' }),
    makeEvent({ id: 'aib', host: 'AI in Business at SJSU' }),
    makeEvent({ id: 'aib-2', host: 'AI in Business at SJSU' }),
  ];
  const ids = (...hosts: string[]) =>
    filterEvents(events, '', { hosts }).map((e) => e.id).sort();

  it('keeps only the chosen host', () => {
    expect(ids('SJSU Career Center')).toEqual(['center']);
    expect(ids('Braven at SJSU')).toEqual(['braven']);
    expect(ids('AI in Business at SJSU')).toEqual(['aib', 'aib-2']);
  });

  it('keeps events from any of several chosen hosts', () => {
    expect(ids('Braven at SJSU', 'Women in Business at SJSU')).toEqual(['braven', 'wib']);
  });

  it('shows everything when no host is chosen', () => {
    expect(ids()).toHaveLength(events.length);
  });

  it('matches every club, but not the Career Center or Braven, for "All student clubs"', () => {
    expect(ids(ALL_CLUBS_HOST)).toEqual(['aib', 'aib-2', 'wib']);
    expect(ids(ALL_CLUBS_HOST, 'Braven at SJSU')).toEqual(['aib', 'aib-2', 'braven', 'wib']);
  });

  it('combines hosts with the other filters', () => {
    const mixed = [
      makeEvent({ id: 'wib-talk', host: 'Women in Business at SJSU', format: 'In-Person' }),
      makeEvent({ id: 'wib-zoom', host: 'Women in Business at SJSU', format: 'Virtual' }),
    ];
    const result = filterEvents(mixed, '', {
      hosts: ['Women in Business at SJSU'],
      format: 'In-Person',
    });
    expect(result.map((e) => e.id)).toEqual(['wib-talk']);
  });

  it('lists each club once, alphabetically', () => {
    expect(getClubHosts(events)).toEqual(['AI in Business at SJSU', 'Women in Business at SJSU']);
  });
});

describe('filterEvents', () => {
  const events: CareerEvent[] = [
    makeEvent({
      id: 'late',
      title: 'Career Fair',
      eventType: 'Career Fair',
      format: 'In-Person',
      start: '2026-06-10T17:00:00.000Z',
      end: '2026-06-10T19:00:00.000Z',
    }),
    makeEvent({
      id: 'early',
      title: 'Resume Workshop',
      host: 'Acme Corp',
      start: '2026-06-02T17:00:00.000Z',
      end: '2026-06-02T18:00:00.000Z',
    }),
  ];

  it('sorts by start ascending without mutating input', () => {
    const result = filterEvents(events, '', {});
    expect(result.map((e) => e.id)).toEqual(['early', 'late']);
    expect(events.map((e) => e.id)).toEqual(['late', 'early']);
  });

  it('searches host and other fields', () => {
    expect(filterEvents(events, 'acme', {}).map((e) => e.id)).toEqual(['early']);
  });

  it('filters by event type and format', () => {
    expect(filterEvents(events, '', { eventType: 'Career Fair' }).map((e) => e.id)).toEqual([
      'late',
    ]);
    expect(filterEvents(events, '', { format: 'Virtual' }).map((e) => e.id)).toEqual(['early']);
    expect(filterEvents(events, '', { eventType: 'Panel', format: 'Virtual' })).toEqual([]);
  });
});

describe('getUpcomingEvents', () => {
  const now = new Date('2026-06-05T12:00:00.000Z');
  const events: CareerEvent[] = [
    makeEvent({ id: 'past', start: '2026-06-01T10:00:00Z', end: '2026-06-01T11:00:00Z' }),
    makeEvent({ id: 'third', start: '2026-06-09T10:00:00Z', end: '2026-06-09T11:00:00Z' }),
    makeEvent({ id: 'ongoing', start: '2026-06-05T11:00:00Z', end: '2026-06-05T13:00:00Z' }),
    makeEvent({ id: 'second', start: '2026-06-06T10:00:00Z', end: '2026-06-06T11:00:00Z' }),
  ];

  it('excludes past events and sorts by start', () => {
    expect(getUpcomingEvents(events, now).map((e) => e.id)).toEqual([
      'ongoing',
      'second',
      'third',
    ]);
  });

  it('respects the limit', () => {
    expect(getUpcomingEvents(events, now, 2).map((e) => e.id)).toEqual(['ongoing', 'second']);
  });
});

describe('hasActiveFilters', () => {
  it('is false for empty or blank filters', () => {
    expect(hasActiveFilters({})).toBe(false);
    expect(hasActiveFilters({ major: '', location: '' })).toBe(false);
    expect(hasActiveFilters({ hosts: [] })).toBe(false);
  });

  it('is true when hosts are chosen', () => {
    expect(hasActiveFilters({ hosts: ['Braven at SJSU'] })).toBe(true);
  });

  it('is true when any filter has a value', () => {
    expect(hasActiveFilters({ major: 'Biology' })).toBe(true);
    expect(hasActiveFilters({ format: 'Hybrid' })).toBe(true);
  });
});
