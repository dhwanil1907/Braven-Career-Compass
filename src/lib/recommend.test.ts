import { describe, expect, it } from 'vitest';
import type { CareerEvent, Resource, ProfileSignals } from '../types';
import {
  getMatchReasons,
  hasProfile,
  recommendEvents,
  recommendResources,
  scoreResource,
} from './recommend';

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
    start: '2026-06-10T17:00:00.000Z',
    end: '2026-06-10T18:00:00.000Z',
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

const emptyProfile: ProfileSignals = { major: null, interests: [] };
const csProfile: ProfileSignals = {
  major: 'Computer Science',
  interests: ['Data Science', 'Software Engineering'],
};

describe('hasProfile', () => {
  it('detects empty and non-empty profiles', () => {
    expect(hasProfile(emptyProfile)).toBe(false);
    expect(hasProfile({ major: 'Biology', interests: [] })).toBe(true);
    expect(hasProfile({ major: null, interests: ['Finance'] })).toBe(true);
  });
});

describe('scoreResource', () => {
  it('adds 3 for major, 2 per interest, and 1 for featured', () => {
    const resource = makeResource({
      majors: ['Computer Science'],
      interests: ['Data Science', 'Software Engineering'],
      featured: true,
    });
    expect(scoreResource(resource, csProfile)).toBe(3 + 2 + 2 + 1);
  });

  it('scores interest-only matches', () => {
    const resource = makeResource({ interests: ['Data Science'] });
    expect(scoreResource(resource, csProfile)).toBe(2);
  });

  it('returns 0 for a featured resource with no profile match', () => {
    const resource = makeResource({ majors: ['Biology'], featured: true });
    expect(scoreResource(resource, csProfile)).toBe(0);
  });
});

describe('getMatchReasons', () => {
  it('lists matched major and interests', () => {
    const resource = makeResource({
      majors: ['Computer Science'],
      interests: ['Data Science'],
    });
    expect(getMatchReasons(resource, csProfile)).toEqual([
      'Computer Science major',
      'Data Science interest',
    ]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(getMatchReasons(makeResource(), csProfile)).toEqual([]);
  });
});

describe('recommendResources', () => {
  const resources: Resource[] = [
    makeResource({ id: 'none', title: 'Unrelated', majors: ['Biology'], featured: true }),
    makeResource({ id: 'b-interest', title: 'Beta', interests: ['Data Science'] }),
    makeResource({ id: 'a-interest', title: 'Alpha', interests: ['Software Engineering'] }),
    makeResource({
      id: 'top',
      title: 'Zeta',
      majors: ['Computer Science'],
      interests: ['Data Science'],
    }),
  ];

  it('returns an empty array for an empty profile', () => {
    expect(recommendResources(resources, emptyProfile)).toEqual([]);
  });

  it('orders by score desc then title, excluding zero scores', () => {
    expect(recommendResources(resources, csProfile).map((r) => r.id)).toEqual([
      'top',
      'a-interest',
      'b-interest',
    ]);
  });

  it('respects the limit', () => {
    expect(recommendResources(resources, csProfile, 1).map((r) => r.id)).toEqual(['top']);
  });
});

describe('recommendEvents', () => {
  const now = new Date('2026-06-05T12:00:00.000Z');
  const events: CareerEvent[] = [
    makeEvent({
      id: 'past',
      majors: ['Computer Science'],
      start: '2026-06-01T10:00:00Z',
      end: '2026-06-01T11:00:00Z',
    }),
    makeEvent({
      id: 'later-interest',
      interests: ['Data Science'],
      start: '2026-06-20T10:00:00Z',
      end: '2026-06-20T11:00:00Z',
    }),
    makeEvent({
      id: 'sooner-interest',
      interests: ['Software Engineering'],
      start: '2026-06-08T10:00:00Z',
      end: '2026-06-08T11:00:00Z',
    }),
    makeEvent({
      id: 'major',
      majors: ['Computer Science'],
      start: '2026-06-25T10:00:00Z',
      end: '2026-06-25T11:00:00Z',
    }),
    makeEvent({ id: 'unrelated', majors: ['Design'] }),
  ];

  it('excludes past and unmatched events, sorting by score then start', () => {
    expect(recommendEvents(events, csProfile, now).map((e) => e.id)).toEqual([
      'major',
      'sooner-interest',
      'later-interest',
    ]);
  });

  it('returns an empty array for an empty profile', () => {
    expect(recommendEvents(events, emptyProfile, now)).toEqual([]);
  });

  it('respects the limit', () => {
    expect(recommendEvents(events, csProfile, now, 2)).toHaveLength(2);
  });
});
