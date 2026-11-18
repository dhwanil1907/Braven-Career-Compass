import { describe, expect, it } from 'vitest';
import type { Professional } from '../data/professionals';
import { companiesWithCounts, filterProfessionals, initialsOf } from './professionals';

const make = (
  name: string,
  company: string,
  role: string,
  kind: Professional['kind'] = 'professional',
): Professional => ({
  id: `${name}-${company}`,
  name,
  company,
  role,
  kind,
  linkedinUrl: 'https://www.linkedin.com/in/x/',
});

const list = [
  make('Ada Lovelace', 'Cisco', 'Software Engineer'),
  make('Grace Hopper', 'Cisco', 'University Recruiter', 'recruiting'),
  make('Alan Turing', 'Apple', 'Data Analyst'),
];
const all = { query: '', company: '', kind: 'all' as const };

describe('filterProfessionals', () => {
  it('returns everyone with no filters', () => {
    expect(filterProfessionals(list, all)).toHaveLength(3);
  });

  it('matches query case-insensitively on name, company and role', () => {
    expect(filterProfessionals(list, { ...all, query: 'LOVELACE' })).toHaveLength(1);
    expect(filterProfessionals(list, { ...all, query: 'apple' })).toHaveLength(1);
    expect(filterProfessionals(list, { ...all, query: 'analyst' })).toHaveLength(1);
    expect(filterProfessionals(list, { ...all, query: '  cisco ' })).toHaveLength(2);
  });

  it('filters by company and kind together', () => {
    const result = filterProfessionals(list, { ...all, company: 'Cisco', kind: 'recruiting' });
    expect(result.map((person) => person.name)).toEqual(['Grace Hopper']);
  });

  it('returns nothing when nothing matches', () => {
    expect(filterProfessionals(list, { ...all, query: 'zzz' })).toEqual([]);
  });
});

describe('companiesWithCounts', () => {
  it('sorts by count desc then name', () => {
    expect(companiesWithCounts([...list, make('B', 'Amazon', '')])).toEqual([
      { company: 'Cisco', count: 2 },
      { company: 'Amazon', count: 1 },
      { company: 'Apple', count: 1 },
    ]);
  });
});

describe('initialsOf', () => {
  it('uses first and last word', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL');
    expect(initialsOf('Dale Van Treese')).toBe('DT');
  });

  it('ignores parentheses and punctuation', () => {
    expect(initialsOf('Xin (Nina) Zou')).toBe('XZ');
    expect(initialsOf("Y'Maia Jackson")).toBe('YJ');
  });

  it('handles single names and empty input', () => {
    expect(initialsOf('Maribel')).toBe('M');
    expect(initialsOf('')).toBe('?');
  });
});
