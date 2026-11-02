import { describe, expect, it } from 'vitest';
import { events } from '../data/events';
import { resources } from '../data/resources';
import { sjsuEvents, sjsuResources } from '../data/sjsuCatalog';
import { alumni } from '../data/stories';
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
    expect(classifyMajors('Resume Review')).toEqual([]);
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

describe('alumni profiles', () => {
  it('has unique ids and a real quote', () => {
    expect(new Set(alumni.map((alum) => alum.id)).size).toBe(alumni.length);
    for (const alum of alumni) expect(alum.quote.trim().length).toBeGreaterThan(0);
  });

  it('has at least 3 alumni for every major', () => {
    for (const major of MAJORS) {
      expect(alumni.filter((alum) => alum.major === major).length, major).toBeGreaterThanOrEqual(3);
    }
  });

  it('requires written consent for real people and no links for sample people', () => {
    for (const alum of alumni) {
      if (alum.isSample) {
        expect(alum.linkedinUrl).toBeUndefined();
        expect(alum.schedulingUrl).toBeUndefined();
      } else {
        expect(alum.consentGiven).toBe(true);
      }
      for (const link of [alum.linkedinUrl, alum.schedulingUrl]) {
        if (link) expect(link.startsWith('https://')).toBe(true);
      }
    }
  });
});

describe('catalog ids', () => {
  it('are unique across resources and across events', () => {
    expect(new Set(resources.map((item) => item.id)).size).toBe(resources.length);
    expect(new Set(events.map((item) => item.id)).size).toBe(events.length);
  });
});
