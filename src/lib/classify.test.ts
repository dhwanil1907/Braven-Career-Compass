import { describe, expect, it } from 'vitest';
import { sjsuEvents, sjsuResources } from '../data/sjsuCatalog';
import { MAJORS } from '../data/taxonomy';
import {
  classifyEventFormat,
  classifyEventType,
  classifyInterests,
  classifyMajors,
  classifyResourceType,
} from './classify';

describe('classify', () => {
  it('types resources from their wording', () => {
    expect(classifyResourceType('Resume Review appointments')).toBe('Resume Help');
    expect(classifyResourceType('Mock Interview practice')).toBe('Interview Prep');
    expect(classifyResourceType('Biology Students Association (BSA)')).toBe('Networking');
    expect(classifyResourceType('Something unrelated')).toBe('Career Exploration');
  });

  it('types events and formats', () => {
    expect(classifyEventType('Spring Job & Internship Fair')).toBe('Career Fair');
    expect(classifyEventType('Careers in Counseling Panel')).toBe('Panel');
    expect(classifyEventFormat('LinkedIn Launch', 'Virtual')).toBe('Virtual');
    expect(classifyEventFormat('Hybrid Career Panel', 'Walnut Creek')).toBe('Hybrid');
    expect(classifyEventFormat('Resume Lab', 'Clark Hall 102')).toBe('In-Person');
  });

  it('limits majors only when the title names one', () => {
    expect(classifyMajors('Biology Students Association')).toEqual(['Biology']);
    expect(classifyMajors('Resume Review')).toEqual(MAJORS);
  });

  it('finds interests and caps them at four', () => {
    expect(classifyInterests('Teaching and education careers')).toContain('Education and Teaching');
    expect(
      classifyInterests('software data marketing finance consulting health policy').length,
    ).toBeLessThanOrEqual(4);
  });
});

describe('scraped SJSU catalog', () => {
  it('has unique ids and real, labeled entries', () => {
    const ids = [...sjsuResources, ...sjsuEvents].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(sjsuResources.length).toBeGreaterThan(0);
    expect(sjsuEvents.length).toBeGreaterThan(0);
    expect(sjsuResources.every((item) => !item.isDemo && item.url.startsWith('http'))).toBe(true);
    expect(
      sjsuEvents.every((item) => new Date(item.start).getTime() < new Date(item.end).getTime()),
    ).toBe(true);
  });
});
