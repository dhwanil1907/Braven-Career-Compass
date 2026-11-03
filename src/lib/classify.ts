import { INTERESTS, MAJORS } from '../data/taxonomy';
import type {
  CareerInterest,
  EventFormat,
  EventType,
  LocationFormat,
  Major,
  ResourceType,
} from '../types';

/**
 * Keyword rules that turn scraped titles and descriptions into the site's filter categories.
 * These are guesses from wording, not data from the source, so scraped items are labeled as such.
 */

const RESOURCE_TYPE_RULES: [RegExp, ResourceType][] = [
  [/\bresum[eé]s?\b|cover letter|\bcv\b/i, 'Resume Help'],
  [/\binterview|mock interview/i, 'Interview Prep'],
  [/\bmentor|\bcoach/i, 'Mentorship'],
  [/\bnetwork|\bclubs?\b|student organizations?|\bassociation\b|\bsociety\b|\bfraternity/i, 'Networking'],
  [/\bworkshops?\b|\bacademy\b|\btraining\b|\bseminar|\bcourse\b/i, 'Workshop'],
];

/** Tag put on a resource whose type is the fallback, not a keyword match. */
export const TYPE_GUESS_TAG = 'type-guess';

/** True when no type keyword matched, so the type is only the fallback. */
export function isGuessedResourceType(text: string): boolean {
  return !RESOURCE_TYPE_RULES.some(([pattern]) => pattern.test(text));
}

export function classifyResourceType(text: string): ResourceType {
  return RESOURCE_TYPE_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? 'Career Exploration';
}

const INTEREST_RULES: [RegExp, CareerInterest][] = [
  // Patterns use word boundaries and specific phrases: bare words such as "it", "data", "design",
  // "community", "education" or "research" appear in ordinary sentences and tagged half the catalog.
  [/\bsoftware\b|computer science|\bcoding\b|\bprogramming\b|\bcyber|information technology/i, 'Software Engineering'],
  [/\bIT\b/, 'Software Engineering'],
  [/data science|data scientist|data analy|\banalytics\b|\bstatistics\b|machine learning/i, 'Data Science'],
  [/product management|product manager/i, 'Product Management'],
  [/\bmarketing\b|advertising/i, 'Marketing'],
  [/\bfinance\b|\bfinancial services\b|\bbanking\b|investment|accounting|\bcpa\b/i, 'Finance'],
  [/\bconsulting\b|\bconsultant/i, 'Consulting'],
  [/\bux\b|user experience|graphic design|product design|interaction design/i, 'UX Design'],
  [/\bhealth ?care\b|\bhealth\b|medical|nursing|clinical|kinesiology|nutrition/i, 'Healthcare'],
  [/human resources|\bhr\b|talent acquisition|\brecruiter/i, 'Human Resources'],
  [/nonprofit|non-profit|social impact|public service|volunteer/i, 'Social Impact'],
  [/\bteach(er|ers|ing)\b|\bk-12\b|\btutor|education (career|major|program)|school (counselor|teacher)/i, 'Education and Teaching'],
  [/\bpolicy\b|\bgovernment\b|public administration|political|\bcivic\b/i, 'Public Policy and Government'],
  [/\blaw\b|\blegal\b|pre-law|attorney/i, 'Law and Legal'],
  [/journalis|\bnewsroom|\bbroadcast|\bnews\b|\bmedia\b/i, 'Journalism and Media'],
  [/nonprofit management|fundrais/i, 'Nonprofit Management'],
  [/academia|graduate school|grad school|\bscholars?\b|\bphd\b|research (assistant|opportunit|program|position)/i, 'Research and Academia'],
  [/\barts?\b|museum|theat|\bmusic\b/i, 'Arts and Culture'],
  [/community organizing|\borganizing\b|\badvocacy\b|grassroots|activis/i, 'Community Organizing'],
  [/sustainab|environmental|climate|renewable|conservation|\bcwea\b|\bwater\b/i, 'Sustainability'],
  [/\bstem\b|engineering|tesla/i, 'Software Engineering'],
  [/\bstem\b/i, 'Data Science'],
  [/counsel|social work|mental health|social services/i, 'Counseling and Social Services'],
  [/\bwriting\b|\bwriter|copywrit|\beditor|editorial/i, 'Writing and Content'],
];

export function classifyInterests(text: string): CareerInterest[] {
  const matches = INTEREST_RULES.filter(([pattern]) => pattern.test(text)).map(([, interest]) => interest);
  return INTERESTS.filter((interest) => matches.includes(interest)).slice(0, 4);
}

const MAJOR_RULES: [RegExp, Major[]][] = [
  [/computer science|software engineering|\bcs\b/i, ['Computer Science']],
  [/engineering|aviation|tesla/i, ['Engineering', 'Computer Science']],
  [/\bstem\b/i, ['Engineering', 'Computer Science', 'Mathematics', 'Biology', 'Chemistry']],
  [/social sciences/i, ['Psychology', 'Sociology', 'Political Science', 'Anthropology', 'Criminology']],
  [/\bcwea\b|water/i, ['Environmental Science']],
  [/biolog|life science/i, ['Biology']],
  [/chemi/i, ['Chemistry']],
  [/mathematic|\bmath\b/i, ['Mathematics']],
  [/environmental/i, ['Environmental Science']],
  [/accounting/i, ['Accounting']],
  [/\bbusiness\b/i, ['Business', 'Economics', 'Accounting', 'Marketing']],
  [/economics/i, ['Economics']],
  [/psycholog/i, ['Psychology']],
  [/sociolog/i, ['Sociology']],
  [/political science|pi sigma alpha/i, ['Political Science']],
  [/anthropolog/i, ['Anthropology']],
  [/public health|health science/i, ['Public Health']],
  [/criminolog|justice studies/i, ['Criminology']],
  [/\benglish\b/i, ['English']],
  [/\bhistory\b/i, ['History']],
  [/philosoph/i, ['Philosophy']],
  [/journalism|mass communications?/i, ['Journalism', 'Communications']],
  [/\bart\b|\barts\b|\bdesign\b/i, ['Art', 'Design']],
  [/\bmusic\b/i, ['Music']],
  [/theatre|theater/i, ['Theatre']],
  [/\beducation\b|teaching/i, ['Education']],
  [/social work/i, ['Social Work']],
  [/nutrition|kinesiology/i, ['Nutrition and Kinesiology']],
];

/**
 * Majors a listing names explicitly (for example a department's student clubs). An empty list
 * means the listing is open to every major, because the source does not restrict it.
 */
export function classifyMajors(title: string): Major[] {
  const matches = new Set<Major>();
  for (const [pattern, majors] of MAJOR_RULES) {
    if (pattern.test(title)) majors.forEach((major) => matches.add(major));
  }
  return MAJORS.filter((major) => matches.has(major));
}

export function classifyResourceLocation(text: string, isExternalSite: boolean): LocationFormat {
  if (/virtual|online|zoom|website|app\b|platform/i.test(text) || isExternalSite) return 'Remote';
  if (/appointment|drop-in|walk-in|visit|on campus|in person|in-person|hall\b|office/i.test(text)) {
    return 'In-Person';
  }
  return 'Hybrid';
}

export function classifyEventType(title: string): EventType {
  if (/fair|expo/i.test(title)) return 'Career Fair';
  if (/panel|speaker series|conversation/i.test(title)) return 'Panel';
  if (/network|dinner|mixer|meet|connect|reception|coffee/i.test(title)) return 'Networking';
  if (/info session|information session|open house|employer spotlight|presents/i.test(title)) {
    return 'Info Session';
  }
  return 'Workshop';
}

export function classifyEventFormat(title: string, location: string): EventFormat {
  if (/hybrid/i.test(`${title} ${location}`)) return 'Hybrid';
  if (/virtual|online|zoom|webinar/i.test(location) || /\bvirtual\b|webinar/i.test(title)) {
    return 'Virtual';
  }
  return 'In-Person';
}
