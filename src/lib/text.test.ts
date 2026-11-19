import { describe, expect, it } from 'vitest';
import { stripEmoji, toDisplayCase } from './text';

describe('toDisplayCase', () => {
  it('converts mostly uppercase titles and keeps acronyms', () => {
    expect(toDisplayCase('SJSU CAREER FAIR: MEET EMPLOYERS')).toBe('SJSU Career Fair: Meet Employers');
    expect(toDisplayCase('AI AND STEM NETWORKING NIGHT')).toBe('AI And STEM Networking Night');
  });

  it('leaves mixed-case titles unchanged', () => {
    expect(toDisplayCase('Resume Workshop with HR')).toBe('Resume Workshop with HR');
  });

  it('handles empty and non-letter strings', () => {
    expect(toDisplayCase('')).toBe('');
    expect(toDisplayCase('2026')).toBe('2026');
  });

  it('capitalises hyphenated words', () => {
    expect(toDisplayCase('FIRST-YEAR MIXER')).toBe('First-Year Mixer');
  });
});

describe('stripEmoji', () => {
  it('removes emoji and tidies spacing', () => {
    expect(stripEmoji('\u{1F31F} Teacher Assistant \u2013 Autism')).toBe('Teacher Assistant \u2013 Autism');
    expect(stripEmoji('Intern \u{1F680}\u{1F680} at Acme')).toBe('Intern at Acme');
  });

  it('leaves plain titles and digits untouched', () => {
    expect(stripEmoji('2027 Summer Intern')).toBe('2027 Summer Intern');
    expect(stripEmoji('')).toBe('');
  });
});
