import { describe, expect, it } from 'vitest';
import { buildPlaceOptions, matchesPlace, stateOf, suggestPlaces } from './places';

const places = [
  'San Jose, CA',
  'San Jose, CA',
  'San Francisco, CA',
  'Santa Clara, CA',
  'San Francisco Bay Area',
  'Austin, TX',
  undefined,
];

describe('buildPlaceOptions', () => {
  it('counts places and adds a region per state', () => {
    const options = buildPlaceOptions(places);
    expect(options.find((option) => option.value === 'San Jose, CA')?.count).toBe(2);
    const california = options.find((option) => option.value === 'state:CA');
    expect(california).toMatchObject({ label: 'California', count: 4, kind: 'region' });
    expect(options.find((option) => option.value === 'state:TX')?.label).toBe('Texas');
  });

  it('ignores listings with no place', () => {
    expect(buildPlaceOptions([undefined, undefined])).toEqual([]);
  });
});

describe('suggestPlaces', () => {
  const options = buildPlaceOptions(places);

  it('narrows as the student types', () => {
    expect(suggestPlaces(options, 'san j').map((option) => option.label)).toEqual(['San Jose, CA']);
    expect(suggestPlaces(options, 'sa').length).toBeGreaterThan(2);
  });

  it('finds a whole state by its name, ahead of its cities', () => {
    expect(suggestPlaces(options, 'calif')[0].value).toBe('state:CA');
  });

  it('ignores case, and returns nothing for a place with no listings', () => {
    expect(suggestPlaces(options, 'AUSTIN')[0].label).toBe('Austin, TX');
    expect(suggestPlaces(options, 'tokyo')).toEqual([]);
  });

  it('shows regions first when nothing is typed', () => {
    expect(suggestPlaces(options, '', 3)[0].kind).toBe('region');
  });
});

describe('matchesPlace', () => {
  it('lets everything through when no place is chosen', () => {
    expect(matchesPlace(undefined, '')).toBe(true);
  });

  it('matches an exact place or every city in a chosen state', () => {
    expect(matchesPlace('San Jose, CA', 'San Jose, CA')).toBe(true);
    expect(matchesPlace('Santa Clara, CA', 'San Jose, CA')).toBe(false);
    expect(matchesPlace('Santa Clara, CA', 'state:CA')).toBe(true);
    expect(matchesPlace('Austin, TX', 'state:CA')).toBe(false);
  });

  it('excludes listings with no place once a place is chosen', () => {
    expect(matchesPlace(undefined, 'state:CA')).toBe(false);
  });
});

describe('stateOf', () => {
  it('reads the state from "City, ST" only', () => {
    expect(stateOf('San Jose, CA')).toBe('CA');
    expect(stateOf('San Francisco Bay Area')).toBeNull();
  });
});
