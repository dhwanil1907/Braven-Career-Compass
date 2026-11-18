import type {
  AcademicYear,
  ApplicationStatus,
  CareerGoal,
  CareerInterest,
  Challenge,
  EventFormat,
  EventType,
  LocationFormat,
  Major,
  ReferralSource,
  ResourceType,
} from '../types';

export interface OptionGroup<T extends string> {
  label: string;
  options: T[];
}

export const MAJOR_GROUPS: OptionGroup<Major>[] = [
  {
    label: 'STEM',
    options: [
      'Computer Science',
      'Engineering',
      'Biology',
      'Chemistry',
      'Mathematics',
      'Environmental Science',
    ],
  },
  { label: 'Business', options: ['Business', 'Economics', 'Accounting', 'Marketing'] },
  {
    label: 'Social science',
    options: [
      'Psychology',
      'Sociology',
      'Political Science',
      'Anthropology',
      'Public Health',
      'Criminology',
    ],
  },
  {
    label: 'Liberal arts and humanities',
    options: ['English', 'History', 'Philosophy', 'Communications', 'Journalism', 'Liberal Studies'],
  },
  { label: 'Arts and design', options: ['Design', 'Art', 'Music', 'Theatre'] },
  {
    label: 'Education and service',
    options: ['Education', 'Social Work', 'Nutrition and Kinesiology'],
  },
  { label: 'Other', options: ['Undecided / Exploring'] },
];

export const INTEREST_GROUPS: OptionGroup<CareerInterest>[] = [
  {
    label: 'Technology and data',
    options: ['Software Engineering', 'Data Science', 'Product Management', 'UX Design'],
  },
  {
    label: 'Business and finance',
    options: ['Marketing', 'Finance', 'Consulting', 'Human Resources'],
  },
  {
    label: 'Public service and society',
    options: [
      'Social Impact',
      'Public Policy and Government',
      'Law and Legal',
      'Nonprofit Management',
      'Community Organizing',
      'Sustainability',
    ],
  },
  {
    label: 'Education, health and care',
    options: ['Education and Teaching', 'Healthcare', 'Counseling and Social Services'],
  },
  {
    label: 'Media, arts and research',
    options: [
      'Journalism and Media',
      'Writing and Content',
      'Arts and Culture',
      'Research and Academia',
    ],
  },
];

/** Career fields that realistically follow each major. Undecided students see every field. */
export const INTERESTS_BY_MAJOR: Record<Major, CareerInterest[]> = {
  'Computer Science': ['Software Engineering', 'Data Science', 'Product Management', 'UX Design', 'Research and Academia', 'Consulting'],
  'Engineering': ['Software Engineering', 'Data Science', 'Product Management', 'Consulting', 'Sustainability', 'Research and Academia'],
  'Biology': ['Healthcare', 'Research and Academia', 'Sustainability', 'Education and Teaching', 'Data Science'],
  'Chemistry': ['Research and Academia', 'Healthcare', 'Sustainability', 'Education and Teaching', 'Data Science'],
  'Mathematics': ['Data Science', 'Software Engineering', 'Finance', 'Research and Academia', 'Education and Teaching', 'Consulting'],
  'Environmental Science': ['Sustainability', 'Research and Academia', 'Public Policy and Government', 'Social Impact', 'Data Science', 'Community Organizing'],
  'Business': ['Consulting', 'Finance', 'Marketing', 'Product Management', 'Human Resources', 'Nonprofit Management'],
  'Economics': ['Finance', 'Consulting', 'Data Science', 'Public Policy and Government', 'Research and Academia', 'Law and Legal'],
  'Accounting': ['Finance', 'Consulting', 'Law and Legal', 'Nonprofit Management', 'Data Science'],
  'Marketing': ['Marketing', 'Product Management', 'Writing and Content', 'Consulting', 'Journalism and Media', 'UX Design'],
  'Psychology': ['Human Resources', 'Counseling and Social Services', 'Healthcare', 'Research and Academia', 'UX Design', 'Education and Teaching', 'Social Impact'],
  'Sociology': ['Community Organizing', 'Social Impact', 'Public Policy and Government', 'Counseling and Social Services', 'Research and Academia', 'Nonprofit Management', 'Human Resources'],
  'Political Science': ['Public Policy and Government', 'Law and Legal', 'Community Organizing', 'Journalism and Media', 'Social Impact', 'Nonprofit Management', 'Consulting'],
  'Anthropology': ['Research and Academia', 'Social Impact', 'UX Design', 'Community Organizing', 'Arts and Culture', 'Public Policy and Government'],
  'Public Health': ['Healthcare', 'Social Impact', 'Public Policy and Government', 'Community Organizing', 'Research and Academia', 'Data Science', 'Counseling and Social Services'],
  'Criminology': ['Law and Legal', 'Public Policy and Government', 'Counseling and Social Services', 'Community Organizing', 'Social Impact', 'Research and Academia'],
  'English': ['Writing and Content', 'Journalism and Media', 'Education and Teaching', 'Law and Legal', 'Marketing', 'Arts and Culture'],
  'History': ['Research and Academia', 'Education and Teaching', 'Law and Legal', 'Public Policy and Government', 'Arts and Culture', 'Writing and Content'],
  'Philosophy': ['Law and Legal', 'Research and Academia', 'Public Policy and Government', 'Writing and Content', 'Education and Teaching', 'Consulting'],
  'Communications': ['Marketing', 'Journalism and Media', 'Writing and Content', 'Human Resources', 'Public Policy and Government', 'Nonprofit Management'],
  'Journalism': ['Journalism and Media', 'Writing and Content', 'Public Policy and Government', 'Marketing', 'Arts and Culture'],
  'Liberal Studies': ['Education and Teaching', 'Writing and Content', 'Social Impact', 'Counseling and Social Services', 'Nonprofit Management', 'Community Organizing'],
  'Design': ['UX Design', 'Arts and Culture', 'Marketing', 'Product Management', 'Writing and Content'],
  'Art': ['Arts and Culture', 'UX Design', 'Marketing', 'Education and Teaching', 'Writing and Content'],
  'Music': ['Arts and Culture', 'Education and Teaching', 'Marketing', 'Writing and Content', 'Nonprofit Management'],
  'Theatre': ['Arts and Culture', 'Education and Teaching', 'Writing and Content', 'Marketing', 'Community Organizing'],
  'Education': ['Education and Teaching', 'Counseling and Social Services', 'Social Impact', 'Nonprofit Management', 'Community Organizing', 'Public Policy and Government'],
  'Social Work': ['Counseling and Social Services', 'Social Impact', 'Community Organizing', 'Nonprofit Management', 'Healthcare', 'Public Policy and Government'],
  'Nutrition and Kinesiology': ['Healthcare', 'Research and Academia', 'Education and Teaching', 'Counseling and Social Services', 'Social Impact'],
  'Undecided / Exploring': [],
};

/** Interest groups limited to what fits the given majors; every group when none narrow it. */
export function interestGroupsFor(majors: (Major | null | undefined)[]): OptionGroup<CareerInterest>[] {
  const picked = majors.filter((major): major is Major => !!major);
  const allowed = new Set(picked.flatMap((major) => INTERESTS_BY_MAJOR[major]));
  if (allowed.size === 0) return INTEREST_GROUPS;
  return INTEREST_GROUPS.map((group) => ({
    ...group,
    options: group.options.filter((option) => allowed.has(option)),
  })).filter((group) => group.options.length > 0);
}

export const MAJORS: Major[] = MAJOR_GROUPS.flatMap((group) => group.options);

export const INTERESTS: CareerInterest[] = INTEREST_GROUPS.flatMap((group) => group.options);

export const RESOURCE_TYPES: ResourceType[] = [
  'Job',
  'Internship',
  'Workshop',
  'Resume Help',
  'Interview Prep',
  'Networking',
  'Mentorship',
  'Career Exploration',
];

export const LOCATIONS: LocationFormat[] = ['Remote', 'Hybrid', 'In-Person'];

export const EVENT_TYPES: EventType[] = [
  'Workshop',
  'Networking',
  'Career Fair',
  'Info Session',
  'Panel',
];

export const EVENT_FORMATS: EventFormat[] = ['Virtual', 'In-Person', 'Hybrid'];

export const ACADEMIC_YEARS: AcademicYear[] = [
  'First year',
  'Second year',
  'Third year',
  'Fourth year or later',
  'Recent graduate',
];

export const CAREER_GOALS: CareerGoal[] = [
  'First internship',
  'First job after graduation',
  'Explore career options',
  'Prepare for graduate school',
  'Grow my network',
];

export const CHALLENGES: Challenge[] = [
  'Not sure where to start',
  'Hard to find relevant opportunities',
  'Resume or interviews need work',
  'Need connections and mentors',
  'Hard to stay on track',
  'Lack of experience',
];

export const REFERRAL_SOURCES: ReferralSource[] = [
  'Braven course or coach',
  'SJSU Career Center',
  'Professor or class',
  'Friend or classmate',
  'Social media',
  'Search engine',
  'Other',
];

/** True when a listing names no major, or lists every major: it is open to everyone. */
export function isOpenToAllMajors(majors: readonly Major[]): boolean {
  return majors.length === 0 || majors.length >= MAJORS.length;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
];
