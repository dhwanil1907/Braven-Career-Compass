import { describe, expect, it } from 'vitest';
import { resources } from '../data/resources';
import { events } from '../data/events';
import { MAJORS } from '../data/taxonomy';
import type { CareerEvent, Resource } from '../types';
import { BANDS, MIN_RECOMMENDED_PERCENT } from './matchRules';
import {
  hasAnswers,
  isRecommended,
  labelForPercent,
  scoreMatch,
  type MatchProfile,
} from './matchScore';
import { recommendResources } from './recommend';

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'r1',
    title: 'Resource',
    summary: 'Summary',
    description: 'Description',
    whoItsFor: [],
    resourceType: 'Workshop',
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
    start: '2030-01-01T10:00:00-08:00',
    end: '2030-01-01T11:00:00-08:00',
    location: 'Online',
    host: 'Host',
    url: 'https://example.com',
    majors: [],
    interests: [],
    tags: [],
    isDemo: true,
    ...overrides,
  } as CareerEvent;
}

const csOnly: MatchProfile = { major: 'Computer Science', interests: [] };
const full: MatchProfile = {
  major: 'Computer Science',
  interests: ['Data Science'],
  year: 'Third year',
  goal: 'First internship',
  challenge: 'Resume or interviews need work',
};

describe('hasAnswers', () => {
  it('is false for an empty profile and true for any single answer', () => {
    expect(hasAnswers({ major: null, interests: [] })).toBe(false);
    expect(hasAnswers({ major: null, interests: [], goal: 'Grow my network' })).toBe(true);
    expect(hasAnswers({ major: null, interests: [], year: 'First year' })).toBe(true);
    expect(hasAnswers({ major: null, interests: ['Marketing'] })).toBe(true);
  });
});

describe('scoreMatch weights', () => {
  it('gives full major credit when the listing names the major', () => {
    const result = scoreMatch(makeResource({ majors: ['Computer Science'] }), csOnly);
    expect(result.percent).toBe(100);
    expect(result.reasons).toEqual(['Computer Science major']);
  });

  it('scores nothing for a listing that names only other majors', () => {
    expect(scoreMatch(makeResource({ majors: ['Biology'] }), csOnly).percent).toBe(0);
  });

  it('gives 70 / 90 / 100 percent of the interest weight for 1 / 2 / 3+ shared interests', () => {
    const profile: MatchProfile = {
      major: null,
      interests: ['Data Science', 'Marketing', 'Finance', 'Consulting'],
    };
    const score = (interests: Resource['interests']) =>
      scoreMatch(makeResource({ interests }), profile).percent;
    expect(score(['Data Science'])).toBe(70);
    expect(score(['Data Science', 'Marketing'])).toBe(90);
    expect(score(['Data Science', 'Marketing', 'Finance'])).toBe(100);
    expect(score(['Data Science', 'Marketing', 'Finance', 'Consulting'])).toBe(100);
  });

  it('gives full goal credit for an exact type and half for an adjacent type', () => {
    const profile: MatchProfile = { major: null, interests: [], goal: 'First internship' };
    expect(scoreMatch(makeResource({ resourceType: 'Internship' }), profile).percent).toBe(100);
    // Adjacent types have no specific fit on their own, so they only count with a real signal.
    const withInterest: MatchProfile = { ...profile, interests: ['Data Science'] };
    const adjacent = makeResource({ resourceType: 'Job', interests: ['Data Science'] });
    // interest 70% of 30 = 21, goal adjacent 50% of 20 = 10, possible 50 -> 62
    expect(scoreMatch(adjacent, withInterest).percent).toBe(62);
  });

  it('scores challenge and year fit by listing type', () => {
    const profile: MatchProfile = {
      major: null,
      interests: [],
      challenge: 'Resume or interviews need work',
      year: 'Fourth year or later',
    };
    // challenge 15 + year 5 earned out of 20
    expect(scoreMatch(makeResource({ resourceType: 'Resume Help' }), profile).percent).toBe(100);
    // challenge fits but year does not (Workshop is not in the fourth-year list): 15 of 20
    expect(scoreMatch(makeResource({ resourceType: 'Workshop' }), profile).percent).toBe(75);
  });

  it('combines every answer into the documented total', () => {
    // open to all majors 6 + one interest 21 + goal 20 + challenge 0 + year 5 = 52 of 100
    const resource = makeResource({ resourceType: 'Internship', interests: ['Data Science'] });
    expect(scoreMatch(resource, full).percent).toBe(52);
  });

  it('scores events by their event type', () => {
    const fair = makeEvent({ eventType: 'Career Fair' });
    const profile: MatchProfile = { major: null, interests: [], goal: 'First internship' };
    expect(scoreMatch(fair, profile).percent).toBe(100);
  });
});

describe('scoreMatch specificity and type confidence', () => {
  const profile: MatchProfile = { major: null, interests: ['Data Science'] };

  it('ranks a listing dedicated to the field above one tagged with many fields', () => {
    const dedicated = makeResource({ interests: ['Data Science'] });
    const generic = makeResource({
      interests: ['Data Science', 'Marketing', 'Finance', 'Consulting'],
    });
    expect(scoreMatch(dedicated, profile).percent).toBe(70);
    expect(scoreMatch(generic, profile).percent).toBe(49);
  });

  it('ignores goal, challenge and year fit when the listing type is only a guess', () => {
    const goal: MatchProfile = { major: null, interests: [], goal: 'First internship' };
    const known = makeResource({ resourceType: 'Internship' });
    const guessed = makeResource({ resourceType: 'Internship', tags: ['type-guess'] });
    expect(scoreMatch(known, goal).percent).toBe(100);
    expect(scoreMatch(guessed, goal).percent).toBe(0);
  });
});

describe('scoreMatch denominator and gate', () => {
  it('does not penalise skipped answers', () => {
    const resource = makeResource({ interests: ['Data Science'] });
    const interestsOnly: MatchProfile = { major: null, interests: ['Data Science'] };
    expect(scoreMatch(resource, interestsOnly).percent).toBe(70);
  });

  it('returns 0 for an empty profile', () => {
    const result = scoreMatch(makeResource({ majors: ['Computer Science'] }), {
      major: null,
      interests: [],
    });
    expect(result).toEqual({ percent: 0, label: null, reasons: [] });
  });

  it('does not recommend an open-to-all listing with no specific fit', () => {
    const everyMajor = makeResource({ majors: MAJORS, resourceType: 'Workshop' });
    expect(scoreMatch(everyMajor, csOnly).percent).toBe(0);
    expect(isRecommended(everyMajor, csOnly)).toBe(false);
  });
});

describe('labelForPercent', () => {
  it('maps band boundaries', () => {
    expect(labelForPercent(49)).toBeNull();
    expect(labelForPercent(50)).toBe('Partly matches');
    expect(labelForPercent(59)).toBe('Partly matches');
    expect(labelForPercent(60)).toBe('Strong match');
    expect(labelForPercent(79)).toBe('Strong match');
    expect(labelForPercent(80)).toBe('Excellent match');
    expect(labelForPercent(100)).toBe('Excellent match');
  });

  it('shows no label below the recommendation cutoff', () => {
    expect(labelForPercent(25)).toBeNull();
  });

  it('keeps the lowest band at the recommendation cutoff', () => {
    expect(BANDS[BANDS.length - 1].min).toBe(MIN_RECOMMENDED_PERCENT);
    expect(MIN_RECOMMENDED_PERCENT).toBe(50);
  });
});

describe('real catalog calibration', () => {
  it('ranks internship and resume resources first for a CS student seeking an internship', () => {
    const top = recommendResources(resources, full, 5);
    expect(top.length).toBeGreaterThan(0);
    for (const resource of top) {
      expect(scoreMatch(resource, full).percent).toBeGreaterThanOrEqual(40);
    }
  });

  it('never scores a listing for other majors above the cutoff for a major-only profile', () => {
    const biology: MatchProfile = { major: 'Biology', interests: [] };
    const otherMajorOnly = resources.filter(
      (resource) =>
        resource.majors.length > 0 &&
        resource.majors.length < MAJORS.length &&
        !resource.majors.includes('Biology'),
    );
    expect(otherMajorOnly.length).toBeGreaterThan(0);
    for (const resource of otherMajorOnly) {
      expect(isRecommended(resource, biology)).toBe(false);
    }
  });

  it('stays selective: a major and interest profile recommends a small share of the catalog', () => {
    const profile: MatchProfile = { major: 'Computer Science', interests: ['Data Science'] };
    expect(recommendResources(resources, profile).length / resources.length).toBeLessThan(0.25);
    const recommendedEvents = events.filter((event) => isRecommended(event, profile));
    expect(recommendedEvents.length / events.length).toBeLessThan(0.5);
  });
});
