import { describe, expect, it } from 'vitest';
import { toDisplayCase } from './text';

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
