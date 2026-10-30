export type Major =
  | 'Computer Science'
  | 'Engineering'
  | 'Biology'
  | 'Chemistry'
  | 'Mathematics'
  | 'Environmental Science'
  | 'Business'
  | 'Economics'
  | 'Accounting'
  | 'Marketing'
  | 'Psychology'
  | 'Sociology'
  | 'Political Science'
  | 'Anthropology'
  | 'Public Health'
  | 'Criminology'
  | 'English'
  | 'History'
  | 'Philosophy'
  | 'Communications'
  | 'Journalism'
  | 'Liberal Studies'
  | 'Design'
  | 'Art'
  | 'Music'
  | 'Theatre'
  | 'Education'
  | 'Social Work'
  | 'Nutrition and Kinesiology'
  | 'Undecided / Exploring';

export type CareerInterest =
  | 'Software Engineering'
  | 'Data Science'
  | 'Product Management'
  | 'Marketing'
  | 'Finance'
  | 'Consulting'
  | 'UX Design'
  | 'Healthcare'
  | 'Human Resources'
  | 'Social Impact'
  | 'Education and Teaching'
  | 'Public Policy and Government'
  | 'Law and Legal'
  | 'Journalism and Media'
  | 'Nonprofit Management'
  | 'Research and Academia'
  | 'Arts and Culture'
  | 'Community Organizing'
  | 'Sustainability'
  | 'Counseling and Social Services'
  | 'Writing and Content';

export type ResourceType =
  | 'Job'
  | 'Internship'
  | 'Workshop'
  | 'Resume Help'
  | 'Interview Prep'
  | 'Networking'
  | 'Mentorship'
  | 'Career Exploration';

export type LocationFormat = 'Remote' | 'Hybrid' | 'In-Person';

export type EventType = 'Workshop' | 'Networking' | 'Career Fair' | 'Info Session' | 'Panel';

export type EventFormat = 'Virtual' | 'In-Person' | 'Hybrid';

export interface Resource {
  id: string;
  title: string;
  summary: string;
  description: string;
  whoItsFor: string[];
  resourceType: ResourceType;
  source: string;
  sourceUrl: string;
  url: string;
  majors: Major[];
  interests: CareerInterest[];
  location: LocationFormat;
  tags: string[];
  /** Editor flag: shown in the "Important" featured group. */
  featured: boolean;
  isDemo: boolean;
  /** ISO 8601 date string */
  deadline?: string;
  /** ISO 8601 date the catalog entry was last checked against its source, set by staff. */
  lastVerified?: string;
}

export interface CareerEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  format: EventFormat;
  /** ISO 8601 date-time string */
  start: string;
  /** ISO 8601 date-time string */
  end: string;
  location: string;
  host: string;
  url: string;
  majors: Major[];
  interests: CareerInterest[];
  tags: string[];
  isDemo: boolean;
  /** ISO 8601 date string */
  registrationDeadline?: string;
}

export type AcademicYear =
  | 'First year'
  | 'Second year'
  | 'Third year'
  | 'Fourth year or later'
  | 'Recent graduate';

export type CareerGoal =
  | 'First internship'
  | 'First job after graduation'
  | 'Explore career options'
  | 'Prepare for graduate school'
  | 'Grow my network';

export type Challenge =
  | 'Not sure where to start'
  | 'Hard to find relevant opportunities'
  | 'Resume or interviews need work'
  | 'Need connections and mentors'
  | 'Hard to stay on track';

export type ReferralSource =
  | 'Braven course or coach'
  | 'SJSU Career Center'
  | 'Professor or class'
  | 'Friend or classmate'
  | 'Social media'
  | 'Search engine'
  | 'Other';

export interface UserProfile {
  major: Major | null;
  interests: CareerInterest[];
  year: AcademicYear | null;
  goal: CareerGoal | null;
  challenge: Challenge | null;
  /** True once the student finished (or chose) the onboarding questionnaire. */
  onboarded: boolean;
}

/** The profile fields that drive matching; lets callers pass partial profiles. */
export type ProfileSignals = Pick<UserProfile, 'major' | 'interests'>;

/** One step of the generated career roadmap. Ids are stable so completion can be persisted. */
export interface RoadmapStep {
  id: string;
  title: string;
  why: string;
  actionLabel: string;
  href: string;
  kind: 'resource' | 'event';
  targetId: string;
}

export interface ResourceFilters {
  major: Major | '';
  interest: CareerInterest | '';
  resourceType: ResourceType | '';
  location: LocationFormat | '';
}

export interface EventFilters {
  eventType: EventType | '';
  format: EventFormat | '';
}
