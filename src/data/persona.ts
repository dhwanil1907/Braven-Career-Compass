import type { UserProfile } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  major: null,
  interests: [],
  year: null,
  goal: null,
  challenge: null,
  onboarded: false,
};

/** Sample profile used only by the automated tests. Not a real student and not shown in the app. */
export const MAYA_PROFILE: UserProfile = {
  major: 'Computer Science',
  interests: ['Software Engineering'],
  year: 'Third year',
  goal: 'First internship',
  challenge: 'Not sure where to start',
  onboarded: true,
};
