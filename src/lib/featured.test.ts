import { describe, expect, it } from 'vitest';
import type { Resource } from '../types';
import {
  getClosingSoon,
  getFeaturedGroups,
  getImportant,
  getPopular,
  MIN_PUBLIC_SAVES,
} from './featured';

const NOW = new Date(2026, 5, 1, 9, 0);

function daysAfterNow(days: number): string {
  const date = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), 12);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

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

describe('getClosingSoon', () => {
  it('keeps deadlines inside the window, soonest first', () => {
    const resources = [
      makeResource({ id: 'later', deadline: daysAfterNow(15) }),
      makeResource({ id: 'soon', deadline: daysAfterNow(3) }),
      makeResource({ id: 'today', deadline: daysAfterNow(0) }),
    ];
    expect(getClosingSoon(resources, NOW).map((item) => item.id)).toEqual([
      'today',
      'soon',
      'later',
    ]);
  });

  it('excludes past deadlines, far-off deadlines and resources without one', () => {
    const resources = [
      makeResource({ id: 'past', deadline: daysAfterNow(-1) }),
      makeResource({ id: 'far', deadline: daysAfterNow(22) }),
      makeResource({ id: 'none' }),
    ];
    expect(getClosingSoon(resources, NOW)).toEqual([]);
  });

  it('respects a custom window', () => {
    const resources = [makeResource({ id: 'week', deadline: daysAfterNow(7) })];
    expect(getClosingSoon(resources, NOW, 5)).toEqual([]);
  });
});

describe('getImportant', () => {
  it('returns only editor-flagged resources in catalog order', () => {
    const resources = [
      makeResource({ id: 'a', featured: true }),
      makeResource({ id: 'b' }),
      makeResource({ id: 'c', featured: true }),
    ];
    expect(getImportant(resources).map((item) => item.id)).toEqual(['a', 'c']);
  });
});

describe('getPopular', () => {
  it('ranks by real save counts and breaks ties by title', () => {
    const resources = [
      makeResource({ id: 'low', title: 'Low' }),
      makeResource({ id: 'tieB', title: 'B tie' }),
      makeResource({ id: 'tieA', title: 'A tie' }),
    ];
    const counts = { low: 3, tieB: 50, tieA: 50 };
    expect(getPopular(resources, counts).map((item) => item.id)).toEqual(['tieA', 'tieB', 'low']);
  });

  it('skips resources with no saves or fewer than the public minimum', () => {
    const resources = [makeResource({ id: 'few' }), makeResource({ id: 'none' })];
    expect(getPopular(resources, { few: MIN_PUBLIC_SAVES - 1 })).toEqual([]);
    expect(getPopular(resources)).toEqual([]);
  });
});

describe('getFeaturedGroups', () => {
  it('never shows the same resource in two groups', () => {
    const shared = makeResource({
      id: 'shared',
      featured: true,
      deadline: daysAfterNow(2),
    });
    const resources = [
      shared,
      makeResource({ id: 'flagged', featured: true }),
      makeResource({ id: 'liked' }),
    ];
    const groups = getFeaturedGroups(resources, NOW, 3, { shared: 999, liked: 5 });
    expect(groups.closingSoon.map((item) => item.id)).toEqual(['shared']);
    expect(groups.important.map((item) => item.id)).toEqual(['flagged']);
    expect(groups.popular.map((item) => item.id)).toEqual(['liked']);
  });

  it('caps each group at the group size', () => {
    const resources = Array.from({ length: 5 }, (_, index) =>
      makeResource({ id: `r${index}`, featured: true }),
    );
    expect(getFeaturedGroups(resources, NOW, 2).important).toHaveLength(2);
  });

  it('returns empty groups for an empty catalog', () => {
    expect(getFeaturedGroups([], NOW)).toEqual({ closingSoon: [], important: [], popular: [] });
  });
});
