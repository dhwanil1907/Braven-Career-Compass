import { describe, expect, it } from 'vitest';
import { MAJORS } from '../data/taxonomy';
import type { AlumniProfile, CareerEvent, Resource, ProfileSignals } from '../types';
import {
  getMatchReasons,
  hasProfile,
  matchAlumni,
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
  it('returns the match percent: full major and strong interest overlap scores 95', () => {
    const resource = makeResource({
      majors: ['Computer Science'],
      interests: ['Data Science', 'Software Engineering'],
    });
    expect(scoreResource(resource, csProfile)).toBe(95);
  });

  it('scores an interest-only match on an open-to-all listing at 45', () => {
    const resource = makeResource({ interests: ['Data Science'] });
    expect(scoreResource(resource, csProfile)).toBe(45);
  });

  it('does not treat an open-to-all listing as a match without a specific fit', () => {
    const everyone = makeResource({ majors: [] });
    const everyMajor = makeResource({ majors: MAJORS });
    expect(getMatchReasons(everyone, csProfile)).toEqual([]);
    expect(getMatchReasons(everyMajor, csProfile)).toEqual([]);
    expect(scoreResource(everyMajor, csProfile)).toBe(0);
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
    makeResource({ id: 'cs-only', title: 'Alpha CS', majors: ['Computer Science'] }),
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

  it('orders by score desc, dropping listings under the 50% cutoff', () => {
    // a-interest and b-interest score 45% (interest only), so they are not recommended.
    expect(recommendResources(resources, csProfile).map((r) => r.id)).toEqual(['top', 'cs-only']);
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
    makeEvent({
      id: 'major-later',
      majors: ['Computer Science'],
      start: '2026-06-28T10:00:00Z',
      end: '2026-06-28T11:00:00Z',
    }),
    makeEvent({ id: 'unrelated', majors: ['Design'] }),
  ];

  it('excludes past, unmatched and under-50% events, sorting ties by start', () => {
    expect(recommendEvents(events, csProfile, now).map((e) => e.id)).toEqual([
      'major',
      'major-later',
    ]);
  });

  it('returns an empty array for an empty profile', () => {
    expect(recommendEvents(events, emptyProfile, now)).toEqual([]);
  });

  it('respects the limit', () => {
    expect(recommendEvents(events, csProfile, now, 2)).toHaveLength(2);
  });
});

function makeAlum(overrides: Partial<AlumniProfile>): AlumniProfile {
  return {
    id: 'a',
    name: 'Alex',
    role: 'Role',
    major: 'Sociology',
    gradYear: 2022,
    interests: [],
    helpsWith: [],
    quote: 'q',
    isSample: true,
    consentGiven: false,
    ...overrides,
  };
}

describe('matchAlumni', () => {
  const alumni = [
    makeAlum({ id: 'major', name: 'Major match', major: 'English' }),
    makeAlum({ id: 'field', name: 'Field match', major: 'Biology', interests: ['Healthcare'] }),
    makeAlum({
      id: 'both',
      name: 'Both',
      major: 'English',
      interests: ['Writing and Content', 'Marketing'],
    }),
    makeAlum({ id: 'none', name: 'No match', major: 'History' }),
  ];

  it('returns nothing without a profile', () => {
    expect(matchAlumni(alumni, { major: null, interests: [] })).toEqual([]);
  });

  it('scores major +3 and each shared field +2, drops non-matches, best first', () => {
    const matches = matchAlumni(alumni, {
      major: 'English',
      interests: ['Writing and Content', 'Healthcare'],
    });
    expect(matches.map((match) => [match.alum.id, match.score])).toEqual([
      ['both', 5],
      ['major', 3],
      ['field', 2],
    ]);
    expect(matches[0].reasons).toEqual(['Also studied English', 'Works in Writing and Content']);
  });

  it('respects the limit', () => {
    expect(matchAlumni(alumni, { major: 'English', interests: [] }, 1)).toHaveLength(1);
  });
});
