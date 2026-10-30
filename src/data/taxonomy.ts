import type {
  AcademicYear,
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
