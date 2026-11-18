import { describe, expect, it } from 'vitest';
import { professionals } from './professionals';

const LINKEDIN_PROFILE = /^https:\/\/www\.linkedin\.com\/in\/[^\s/?#]+\/?$/;

describe('professionals data', () => {
  it('has unique ids', () => {
    const ids = professionals.map((person) => person.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a name, company and clean LinkedIn profile URL for everyone', () => {
    for (const person of professionals) {
      expect(person.name.trim(), person.id).not.toBe('');
      expect(person.company.trim(), person.id).not.toBe('');
      expect(person.linkedinUrl, person.id).toMatch(LINKEDIN_PROFILE);
    }
  });

  it('stores no email-like text in any field', () => {
    for (const person of professionals) {
      expect(JSON.stringify(person), person.id).not.toContain('@');
    }
  });

  it('excludes people who opted out', () => {
    const names = professionals.map((person) => person.name);
    for (const optedOut of ['Kyle Stubbs', 'Sitong Ju', 'Nick Reyes']) {
      expect(names).not.toContain(optedOut);
    }
  });
});
