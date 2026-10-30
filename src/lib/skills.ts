import { DEFAULT_INTEREST_BY_MAJOR, SKILLS_BY_INTEREST } from '../data/skills';
import type { Skill } from '../data/skills';
import type { CareerInterest, ProfileSignals, Resource } from '../types';
import { filterResources } from './filters';

export interface SkillWithResources extends Skill {
  /** Number of catalog resources that mention this skill. */
  resourceCount: number;
}

export interface SkillGroup {
  interest: CareerInterest;
  skills: SkillWithResources[];
}

const MAX_GROUPS = 2;

/** Fields to show skills for: the student's interests, else the default for their major. */
export function getSkillFields(profile: ProfileSignals): CareerInterest[] {
  if (profile.interests.length > 0) return profile.interests.slice(0, MAX_GROUPS);
  return profile.major ? [DEFAULT_INTEREST_BY_MAJOR[profile.major]] : [];
}

export function getSkillGroups(profile: ProfileSignals, resources: Resource[]): SkillGroup[] {
  return getSkillFields(profile).map((interest) => ({
    interest,
    skills: SKILLS_BY_INTEREST[interest].map((skill) => ({
      ...skill,
      resourceCount: filterResources(resources, skill.searchTerm, {}).length,
    })),
  }));
}
