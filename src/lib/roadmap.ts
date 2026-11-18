import type {
  AcademicYear,
  CareerEvent,
  CareerGoal,
  EventType,
  ProfileSignals,
  Resource,
  ResourceType,
  RoadmapStep,
  UserProfile,
} from '../types';
import { isOpenToAllMajors } from '../data/taxonomy';
import { getMatchReasons, recommendEvents, scoreResource } from './recommend';

type StepKey = 'resume' | 'internships' | 'jobs' | 'interview' | 'mentor' | 'network' | 'explore' | 'event' | 'experience';

interface StepRule {
  key: StepKey;
  title: string;
  why: string;
  resourceTypes: ResourceType[];
  /** When set, the step prefers an upcoming event of these types before falling back to a resource. */
  eventTypes?: EventType[];
  /** The linked item's title must match this, so a step never links to something off-topic. */
  fit?: RegExp;
  /** The linked item's title must not match this (contract roles, clubs, summits, ...). */
  avoid?: RegExp;
}

const CONTRACT_ROLE = /contract|part-time|unbenefited|freelance/i;

/** Student clubs are not career-exploration resources, even when they are keyword-classified as such. */
const CLUB_LIKE = /association|\bclub\b|society|student organization|chapter/i;

/**
 * Groups for a specific identity. The profile says nothing about identity, so these are never
 * picked as a default step; students can still find them on the Resources and Events pages.
 */
const IDENTITY_GROUP =
  /\b(black|latinx?|latino|latina|hispanic|asian|indigenous|native american|women|womxn|lgbtq\+?|queer|first[- ]gen(eration)?|undocu\w*|veterans?|disabilit\w*|pacific islander|aapi|nsbe|shpe|swe)\b|ostem/i;

/** Events useful to any student, used when nothing is written for the student's own field. */
const GENERAL_CAREER_EVENT =
  /job fair|career fair|career summit|career week|career day|internship fair|resume|interview|networking|hiring|employer|job search|job success|mock/i;

const anyOf = (...patterns: RegExp[]) => new RegExp(patterns.map((pattern) => pattern.source).join('|'), 'i');

const RULES: Record<StepKey, StepRule> = {
  resume: {
    key: 'resume',
    title: 'Get your resume reviewed',
    why: 'A strong resume is the first thing every employer and program asks for.',
    resourceTypes: ['Resume Help'],
  },
  internships: {
    key: 'internships',
    title: 'Explore internships that fit your major',
    why: 'Short, targeted applications beat sending many generic ones.',
    resourceTypes: ['Internship'],
    avoid: CONTRACT_ROLE,
  },
  jobs: {
    key: 'jobs',
    title: 'Explore entry-level roles',
    why: 'See what employers expect so you can plan your last semesters around it.',
    resourceTypes: ['Job', 'Internship'],
    avoid: CONTRACT_ROLE,
  },
  interview: {
    key: 'interview',
    title: 'Practice interviewing',
    why: 'Out-loud practice is the fastest way to get comfortable before it counts.',
    resourceTypes: ['Interview Prep'],
  },
  mentor: {
    key: 'mentor',
    title: 'Talk with a coach or mentor',
    why: 'Someone who has done it can point you to the next best move.',
    resourceTypes: ['Mentorship', 'Networking'],
    avoid: IDENTITY_GROUP,
  },
  network: {
    key: 'network',
    title: 'Grow your professional network',
    why: 'Most opportunities come through people, not job boards.',
    resourceTypes: ['Networking', 'Mentorship'],
    eventTypes: ['Networking'],
    avoid: IDENTITY_GROUP,
  },
  explore: {
    key: 'explore',
    title: 'Explore careers that fit your interests',
    why: 'Learning what people actually do day to day narrows your options fast.',
    resourceTypes: ['Career Exploration'],
    eventTypes: ['Panel', 'Info Session'],
    avoid: anyOf(CLUB_LIKE, IDENTITY_GROUP),
  },
  event: {
    key: 'event',
    title: 'Attend a career event',
    why: 'Live events are where conversations, referrals and momentum start.',
    resourceTypes: ['Workshop'],
    eventTypes: ['Workshop', 'Career Fair', 'Networking', 'Panel', 'Info Session'],
    // Event types are keyword guesses, so the title itself must be about careers or hiring.
    fit: /career|\bjobs?\b|intern|fair|network|resume|interview|employer|hiring|recruit|professional|alumni|industry/i,
    avoid: IDENTITY_GROUP,
  },
  experience: {
    key: 'experience',
    title: 'Build hands-on experience',
    why: 'Real experience from a program, project or workshop makes internship applications much stronger.',
    resourceTypes: ['Workshop', 'Mentorship'],
    eventTypes: ['Workshop'],
    fit: /intern|fellowship|apprentic|research|volunteer|project|program|hackathon|\blab\b|co-?op|bootcamp|cohort|leadership|coaching|mentor/i,
    avoid: anyOf(/summit|\bfair\b|info session|networking/i, IDENTITY_GROUP),
  },
};

const GOAL_SEQUENCES: Record<CareerGoal, StepKey[]> = {
  'First internship': ['interview', 'resume', 'internships', 'event', 'mentor', 'experience'],
  'First job after graduation': ['interview', 'resume', 'jobs', 'network', 'event', 'experience'],
  'Explore career options': ['explore', 'event', 'mentor', 'resume', 'internships', 'experience'],
  'Prepare for graduate school': ['explore', 'resume', 'mentor', 'event', 'network', 'experience'],
  'Grow my network': ['network', 'mentor', 'event', 'interview', 'resume', 'experience'],
};

const CHALLENGE_PRIORITY: Record<NonNullable<UserProfile['challenge']>, StepKey[]> = {
  'Not sure where to start': ['mentor'],
  'Hard to find relevant opportunities': ['internships', 'jobs'],
  'Resume or interviews need work': ['resume', 'interview'],
  'Need connections and mentors': ['mentor', 'network'],
  'Hard to stay on track': ['event'],
  'Lack of experience': ['experience', 'mentor'],
};

/** Where a student is in their degree decides what is worth doing first. */
const YEAR_PRIORITY: Record<AcademicYear, StepKey[]> = {
  'First year': ['explore', 'event'],
  'Second year': ['explore', 'internships'],
  'Third year': ['internships', 'resume'],
  'Fourth year or later': ['jobs', 'interview'],
  'Recent graduate': ['jobs', 'resume'],
};

const MAX_STEPS = 5;

/** True when the listing names the student's major itself, not just "open to every major". */
function namesMajor(resource: Resource, profile: ProfileSignals): boolean {
  return (
    profile.major !== null &&
    !isOpenToAllMajors(resource.majors) &&
    resource.majors.includes(profile.major)
  );
}

/**
 * Step title written for this student. It only names a major or interest when the linked item
 * really is about it, so the title never promises something the link does not deliver.
 */
function personaliseTitle(rule: StepRule, profile: UserProfile, resource?: Resource): string {
  const { major, year } = profile;
  const sharedInterest = resource
    ? profile.interests.find((interest) => resource.interests.includes(interest))
    : undefined;
  switch (rule.key) {
    case 'resume':
      return year === 'First year' ? 'Build your first resume' : rule.title;
    case 'internships':
    case 'jobs': {
      const noun = rule.key === 'internships' ? 'internships' : 'roles';
      const level = rule.key === 'jobs' ? 'entry-level ' : '';
      if (resource && major && namesMajor(resource, profile)) {
        return `Explore ${level}${major} ${noun}`;
      }
      return sharedInterest ? `Explore ${level}${sharedInterest} ${noun}` : rule.title;
    }
    case 'explore':
      return sharedInterest ? `Explore ${sharedInterest} careers` : rule.title;
    default:
      return rule.title;
  }
}

/** Why this specific item was picked, using the match reasons the catalog already computes. */
function personaliseWhy(rule: StepRule, resource: Resource | undefined, profile: UserProfile) {
  if (!resource) return rule.why;
  const reasons = getMatchReasons(resource, profile)
    .filter((reason) => !reason.startsWith('Fits your goal'))
    .slice(0, 2);
  return reasons.length > 0 ? `${rule.why} Picked for you: ${reasons.join(', ')}.` : rule.why;
}

/** Events get their date and format, so the step says when and how, not just what. */
function eventWhy(rule: StepRule, event: CareerEvent): string {
  const date = new Date(event.start).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return `${rule.why} ${date}, ${event.format.toLowerCase()}.`;
}

/** Applies a rule's fit and avoid patterns to an item title. */
function acceptsTitle(rule: StepRule): (title: string) => boolean {
  return (title) => (!rule.fit || rule.fit.test(title)) && !rule.avoid?.test(title);
}

/** Moves the promoted keys to the front in their promoted order, keeping the rest in sequence order. */
function prioritise(sequence: StepKey[], promoted: StepKey[]): StepKey[] {
  const front = promoted.filter((key) => sequence.includes(key));
  const rest = sequence.filter((key) => !promoted.includes(key));
  return [...front, ...rest];
}

function bestResource(
  resources: Resource[],
  types: ResourceType[],
  profile: ProfileSignals,
  used: Set<string>,
  accepts: (title: string) => boolean,
): Resource | undefined {
  return resources
    .filter(
      (resource) =>
        types.includes(resource.resourceType) && !used.has(resource.id) && accepts(resource.title),
    )
    .map((resource) => ({ resource, score: scoreResource(resource, profile) }))
    .sort(
      (first, second) =>
        // Types are listed in order of preference, so the first-listed type always wins.
        types.indexOf(first.resource.resourceType) - types.indexOf(second.resource.resourceType) ||
        // A listing that names the student's own major beats one that only matches an interest.
        Number(namesMajor(second.resource, profile)) - Number(namesMajor(first.resource, profile)) ||
        // Fit to the student comes before source, so a strong match is never beaten by a weak one.
        second.score - first.score ||
        // Hand-picked entries beat scraped ones with the same score.
        Number(Boolean(first.resource.scraped)) - Number(Boolean(second.resource.scraped)) ||
        Number(second.resource.featured) - Number(first.resource.featured) ||
        first.resource.title.localeCompare(second.resource.title),
    )[0]?.resource;
}

/** True for events a student can easily get to: online, or in San José / on campus. */
function isEasyToAttend(event: CareerEvent): boolean {
  return event.format !== 'In-Person' || /san jos[eé]|sjsu|campus/i.test(event.location);
}

function bestEvent(
  events: CareerEvent[],
  types: EventType[],
  profile: ProfileSignals,
  used: Set<string>,
  now: Date,
  accepts: (title: string) => boolean,
): CareerEvent | undefined {
  // An event written for other majors is never a fallback pick; open-to-all events are fine.
  const forStudent = (event: CareerEvent) =>
    profile.major === null ||
    isOpenToAllMajors(event.majors) ||
    event.majors.includes(profile.major);
  const usable = (event: CareerEvent) =>
    types.includes(event.eventType) &&
    !used.has(event.id) &&
    !event.isFull &&
    accepts(event.title) &&
    forStudent(event);
  // Type fit alone (any workshop suits "lack of experience") is not enough: the event must be
  // about the student's own major or interests.
  const aboutStudent = (event: CareerEvent) =>
    (profile.major !== null && !isOpenToAllMajors(event.majors) && event.majors.includes(profile.major)) ||
    profile.interests.some((interest) => event.interests.includes(interest));
  const matched = recommendEvents(events, profile, now).filter(usable).filter(aboutStudent);
  const upcoming = events
    .filter((event) => new Date(event.end).getTime() >= now.getTime() && usable(event))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  // Prefer events that fit the student. Otherwise only events about careers in general, so a
  // student is never sent to an unrelated industry event just because it is the next one.
  const general = upcoming.filter((event) => GENERAL_CAREER_EVENT.test(event.title));
  return matched.find(isEasyToAttend) ?? general.find(isEasyToAttend) ?? matched[0] ?? general[0];
}

/**
 * Rule-based roadmap: the goal picks the sequence, the stated challenge reorders it, and each
 * step links to the best matching item already in the catalog. Steps with nothing to link to
 * are dropped rather than invented.
 */
export function buildRoadmap(
  profile: UserProfile,
  resources: Resource[],
  events: CareerEvent[],
  now: Date = new Date(),
): RoadmapStep[] {
  if (profile.goal === null) return [];
  const byYear = profile.year
    ? prioritise(GOAL_SEQUENCES[profile.goal], YEAR_PRIORITY[profile.year])
    : GOAL_SEQUENCES[profile.goal];
  // The stated challenge is applied last so it always outranks the year.
  const promoted = profile.challenge ? CHALLENGE_PRIORITY[profile.challenge] : [];
  const sequence = prioritise(byYear, promoted);

  const usedResources = new Set<string>();
  const usedEvents = new Set<string>();
  const steps: RoadmapStep[] = [];

  for (const key of sequence) {
    if (steps.length === MAX_STEPS) break;
    const rule = RULES[key];

    const accepts = acceptsTitle(rule);
    const event = rule.eventTypes
      ? bestEvent(events, rule.eventTypes, profile, usedEvents, now, accepts)
      : undefined;
    if (event) {
      usedEvents.add(event.id);
      steps.push({
        id: `${key}:${event.id}`,
        title: personaliseTitle(rule, profile),
        why: eventWhy(rule, event),
        actionLabel: event.title,
        href: `/events?event=${event.id}`,
        kind: 'event',
        targetId: event.id,
      });
      continue;
    }

    const resource = bestResource(resources, rule.resourceTypes, profile, usedResources, accepts);
    if (resource) {
      usedResources.add(resource.id);
      steps.push({
        id: `${key}:${resource.id}`,
        title: personaliseTitle(rule, profile, resource),
        why: personaliseWhy(rule, resource, profile),
        actionLabel: resource.title,
        href: `/resources/${resource.id}`,
        kind: 'resource',
        targetId: resource.id,
      });
    }
  }
  return steps;
}

export function getNextStep(
  steps: RoadmapStep[],
  completedIds: string[],
): RoadmapStep | undefined {
  return steps.find((step) => !completedIds.includes(step.id));
}

export function countCompleted(steps: RoadmapStep[], completedIds: string[]): number {
  return steps.filter((step) => completedIds.includes(step.id)).length;
}
