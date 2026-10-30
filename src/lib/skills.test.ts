import { describe, expect, it } from 'vitest';
import { INTERESTS, MAJORS } from '../data/taxonomy';
import { DEFAULT_INTEREST_BY_MAJOR, SKILLS_BY_INTEREST } from '../data/skills';
import { resources } from '../data/resources';
import { getSkillFields, getSkillGroups } from './skills';

describe('skills data', () => {
  it('covers every career interest and every major', () => {
    for (const interest of INTERESTS) expect(SKILLS_BY_INTEREST[interest].length).toBeGreaterThan(0);
    for (const major of MAJORS) expect(DEFAULT_INTEREST_BY_MAJOR[major]).toBeDefined();
  });
});

describe('getSkillFields', () => {
  it('uses up to two interests', () => {
    expect(
      getSkillFields({ major: null, interests: ['Finance', 'Marketing', 'Consulting'] }),
    ).toEqual(['Finance', 'Marketing']);
  });

  it('falls back to the major when no interests are chosen', () => {
    expect(getSkillFields({ major: 'Computer Science', interests: [] })).toEqual([
      'Software Engineering',
    ]);
  });

  it('returns nothing for an empty profile', () => {
    expect(getSkillFields({ major: null, interests: [] })).toEqual([]);
  });
});

describe('getSkillGroups', () => {
  it('counts catalog resources for each skill', () => {
    const [group] = getSkillGroups({ major: null, interests: ['Data Science'] }, resources);
    expect(group.interest).toBe('Data Science');
    expect(group.skills.some((skill) => skill.resourceCount > 0)).toBe(true);
  });
});
