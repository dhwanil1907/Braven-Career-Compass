import { describe, expect, it } from 'vitest';
import { INTERESTS, MAJORS } from '../data/taxonomy';
import type { Resource } from '../types';
import { getOpportunities, hasTopicalFit, splitByFit } from './internships';

const emptyProfile = { major: null, interests: [] };

function listing(overrides: Partial<Resource> & { id: string }): Resource {
  return {
    title: overrides.id,
    summary: '',
    description: '',
    whoItsFor: [],
    resourceType: 'Internship',
    source: 'SJSU Career Center',
    sourceUrl: 'https://example.com',
    url: 'https://example.com',
    majors: [],
    interests: [],
    location: 'Remote',
    tags: [],
    featured: false,
    isDemo: false,
    ...overrides,
  };
}

const catalog: Resource[] = [
  listing({ id: 'late', deadline: '2026-12-01' }),
  listing({ id: 'none' }),
  listing({ id: 'soon', deadline: '2026-11-20', location: 'In-Person' }),
  listing({ id: 'job', resourceType: 'Job' }),
  listing({ id: 'guide', resourceType: 'Workshop' }),
];

const base = { filters: { major: '', interest: '', location: '' } as const, profile: emptyProfile };

describe('getOpportunities', () => {
  it('returns only the requested kind', () => {
    const internships = getOpportunities(catalog, { ...base, kind: 'Internship', sort: 'deadline' });
    expect(internships.map((item) => item.id)).toEqual(['soon', 'late', 'none']);
    const jobs = getOpportunities(catalog, { ...base, kind: 'Job', sort: 'deadline' });
    expect(jobs.map((item) => item.id)).toEqual(['job']);
  });

  it('sorts by deadline soonest with undated listings last', () => {
    const ids = getOpportunities(catalog, { ...base, kind: 'Internship', sort: 'deadline' }).map(
      (item) => item.id,
    );
    expect(ids[0]).toBe('soon');
    expect(ids[ids.length - 1]).toBe('none');
  });

  it('applies the location filter', () => {
    const result = getOpportunities(catalog, {
      ...base,
      filters: { major: '', interest: '', location: 'In-Person' },
      kind: 'Internship',
      sort: 'deadline',
    });
    expect(result.map((item) => item.id)).toEqual(['soon']);
  });

  it('applies major and interest filters', () => {
    const tagged = [
      listing({ id: 'cs', majors: [MAJORS[0]], interests: [INTERESTS[0]] }),
      listing({ id: 'other', majors: [MAJORS[1]], interests: [INTERESTS[1]] }),
    ];
    const result = getOpportunities(tagged, {
      ...base,
      filters: { major: MAJORS[0], interest: INTERESTS[0], location: '' },
      kind: 'Internship',
      sort: 'match',
    });
    expect(result.map((item) => item.id)).toEqual(['cs']);
  });

  it('ranks by match score when a profile is given', () => {
    const tagged = [
      listing({ id: 'a-miss', majors: [MAJORS[1]], interests: [INTERESTS[1]] }),
      listing({ id: 'z-hit', majors: [MAJORS[0]], interests: [INTERESTS[0]] }),
    ];
    const result = getOpportunities(tagged, {
      ...base,
      profile: { major: MAJORS[0], interests: [INTERESTS[0]] },
      kind: 'Internship',
      sort: 'match',
    });
    expect(result[0].id).toBe('z-hit');
  });

  it('puts topical matches before higher-scoring non-matches', () => {
    const tagged = [
      listing({ id: 'a-open' }),
      listing({ id: 'z-fit', majors: [MAJORS[0]] }),
      listing({ id: 'm-fit', majors: [MAJORS[0]] }),
    ];
    const result = getOpportunities(tagged, {
      ...base,
      profile: { major: MAJORS[0], interests: [] },
      kind: 'Internship',
      sort: 'match',
    });
    expect(result.map((item) => item.id)).toEqual(['m-fit', 'z-fit', 'a-open']);
  });

  it('does not mutate the input', () => {
    const copy = [...catalog];
    getOpportunities(catalog, { ...base, kind: 'Internship', sort: 'deadline' });
    expect(catalog).toEqual(copy);
  });
});

describe('hasTopicalFit', () => {
  const major = MAJORS[0];
  const interest = INTERESTS[0];

  it('is true when the major is explicitly listed', () => {
    expect(hasTopicalFit(listing({ id: 'a', majors: [major] }), { major, interests: [] })).toBe(true);
  });

  it('is false for open-to-all-majors listings without an interest hit', () => {
    expect(hasTopicalFit(listing({ id: 'a', majors: [] }), { major, interests: [] })).toBe(false);
    expect(hasTopicalFit(listing({ id: 'b', majors: [...MAJORS] }), { major, interests: [] })).toBe(
      false,
    );
  });

  it('is true when an interest matches', () => {
    const item = listing({ id: 'a', interests: [interest] });
    expect(hasTopicalFit(item, { major: null, interests: [interest] })).toBe(true);
  });

  it('is false with no major and no interests', () => {
    const item = listing({ id: 'a', majors: [major], interests: [interest] });
    expect(hasTopicalFit(item, emptyProfile)).toBe(false);
  });
});

describe('splitByFit', () => {
  const major = MAJORS[0];
  const items = [
    listing({ id: 'fit', majors: [major] }),
    listing({ id: 'open' }),
    listing({ id: 'other', majors: [MAJORS[1]] }),
  ];

  it('separates topical matches from the rest', () => {
    const { forYou, others } = splitByFit(items, { major, interests: [] });
    expect(forYou.map((item) => item.id)).toEqual(['fit']);
    expect(others.map((item) => item.id)).toEqual(['open', 'other']);
  });

  it('returns everything as others for an empty profile', () => {
    const { forYou, others } = splitByFit(items, emptyProfile);
    expect(forYou).toEqual([]);
    expect(others).toHaveLength(3);
  });
});
