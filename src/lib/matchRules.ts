import type { AcademicYear, CareerGoal, Challenge } from '../types';

/** Points each onboarding answer can earn. Only answered signals count toward the total. */
export const WEIGHTS = {
  major: 30,
  interests: 30,
  goal: 20,
  challenge: 15,
  year: 5,
} as const;

/** Share of the major weight a listing earns when it is open to every major. */
export const OPEN_MAJOR_CREDIT = 0.2;

/** Share of the interest weight earned by 1, 2, and 3+ shared interests. */
export const INTEREST_CREDIT = [0, 0.7, 0.9, 1] as const;

/** Lowest share of the interest credit kept when a listing is tagged with many other fields. */
export const SPECIFICITY_FLOOR = 0.6;

/** Share of the goal weight earned by an adjacent (not exact) type. */
export const ADJACENT_CREDIT = 0.5;

/** Listings below this percent are not recommended and show no label. */
export const MIN_RECOMMENDED_PERCENT = 50;

export const BANDS: { min: number; label: string }[] = [
  { min: 80, label: 'Excellent match' },
  { min: 60, label: 'Strong match' },
  { min: MIN_RECOMMENDED_PERCENT, label: 'Partly matches' },
];

/**
 * Fit tables work on the listing type, which is a resource type or an event type. That keeps the
 * engine independent of per-listing goal tags the sources do not provide.
 */
export const GOAL_FIT: Record<CareerGoal, { full: string[]; adjacent: string[] }> = {
  'First internship': {
    full: ['Internship', 'Career Fair'],
    adjacent: ['Job', 'Resume Help', 'Interview Prep', 'Workshop'],
  },
  'First job after graduation': {
    full: ['Job', 'Career Fair'],
    adjacent: ['Resume Help', 'Interview Prep', 'Networking', 'Internship'],
  },
  'Explore career options': {
    full: ['Career Exploration', 'Info Session', 'Panel'],
    adjacent: ['Workshop', 'Mentorship', 'Networking'],
  },
  'Prepare for graduate school': {
    full: ['Career Exploration', 'Mentorship', 'Info Session', 'Panel'],
    adjacent: ['Workshop', 'Networking'],
  },
  'Grow my network': {
    full: ['Networking', 'Mentorship', 'Panel'],
    adjacent: ['Career Fair', 'Workshop'],
  },
};

export const CHALLENGE_FIT: Record<Challenge, string[]> = {
  'Not sure where to start': ['Career Exploration', 'Info Session', 'Workshop', 'Panel'],
  'Hard to find relevant opportunities': ['Job', 'Internship', 'Career Fair'],
  'Resume or interviews need work': ['Resume Help', 'Interview Prep', 'Workshop'],
  'Need connections and mentors': ['Networking', 'Mentorship', 'Panel', 'Career Fair'],
  'Hard to stay on track': ['Workshop', 'Mentorship'],
};

export const YEAR_FIT: Record<AcademicYear, string[]> = {
  'First year': ['Career Exploration', 'Workshop', 'Info Session', 'Mentorship'],
  'Second year': ['Career Exploration', 'Internship', 'Workshop', 'Networking'],
  'Third year': ['Internship', 'Networking', 'Resume Help', 'Interview Prep', 'Career Fair'],
  'Fourth year or later': ['Job', 'Resume Help', 'Interview Prep', 'Career Fair'],
  'Recent graduate': ['Job', 'Networking', 'Interview Prep', 'Career Fair'],
};
