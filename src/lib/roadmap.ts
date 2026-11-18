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
import { getMatchReasons, recommendEvents, scoreResource } from './recommend';

type StepKey = 'resume' | 'internships' | 'jobs' | 'interview' | 'mentor' | 'network' | 'explore' | 'event' | 'experience';

interface StepRule {
  key: StepKey;
  title: string;
  why: string;
  resourceTypes: ResourceType[];
  /** When set, the step prefers an upcoming event of these types before falling back to a resource. */
  eventTypes?: EventType[];
}

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
  },
  jobs: {
    key: 'jobs',
    title: 'Explore entry-level roles',
    why: 'See what employers expect so you can plan your last semesters around it.',
    resourceTypes: ['Job', 'Internship'],
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
  },
  network: {
    key: 'network',
    title: 'Grow your professional network',
    why: 'Most opportunities come through people, not job boards.',
    resourceTypes: ['Networking', 'Mentorship'],
    eventTypes: ['Networking'],
  },
  explore: {
    key: 'explore',
    title: 'Explore careers that fit your interests',
    why: 'Learning what people actually do day to day narrows your options fast.',
    resourceTypes: ['Career Exploration'],
    eventTypes: ['Panel', 'Info Session'],
  },
  event: {
    key: 'event',
    title: 'Attend a career event',
    why: 'Live events are where conversations, referrals and momentum start.',
    resourceTypes: ['Workshop'],
    eventTypes: ['Workshop', 'Career Fair', 'Networking', 'Panel', 'Info Session'],
  },
  experience: {
    key: 'experience',
    title: 'Build experience with an early-career program',
    why: 'Hands-on experience from a program or workshop makes internship applications much stronger.',
    resourceTypes: ['Workshop', 'Mentorship'],
    eventTypes: ['Workshop'],
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

/** Step title written for this student; falls back to the generic title when the profile is thin. */
function personaliseTitle(rule: StepRule, profile: UserProfile): string {
  const { major, year } = profile;
  const interest = profile.interests[0];
  switch (rule.key) {
    case 'resume':
      return year === 'First year' ? 'Build your first resume' : rule.title;
    case 'internships':
      return major ? `Explore ${major} internships` : rule.title;
    case 'jobs':
      return major ? `Explore entry-level ${major} roles` : rule.title;
    case 'explore':
      return interest ? `Explore ${interest} careers` : rule.title;
    default:
      return rule.title;
  }
}

/** Adds why this specific item was picked, using the match reasons the catalog already computes. */
function personaliseWhy(rule: StepRule, resource: Resource | undefined, profile: UserProfile) {
  if (!resource) return rule.why;
  const reasons = getMatchReasons(resource, profile)
    .filter((reason) => !reason.startsWith('Fits your goal'))
    .slice(0, 2);
  return reasons.length > 0 ? `${rule.why} Picked for you: ${reasons.join(', ')}.` : rule.why;
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
): Resource | undefined {
  return resources
    .filter((resource) => types.includes(resource.resourceType) && !used.has(resource.id))
    .map((resource) => ({ resource, score: scoreResource(resource, profile) }))
    .sort(
      (first, second) =>
        // Types are listed in order of preference, so the first-listed type always wins.
        types.indexOf(first.resource.resourceType) - types.indexOf(second.resource.resourceType) ||
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
): CareerEvent | undefined {
  const usable = (event: CareerEvent) =>
    types.includes(event.eventType) && !used.has(event.id) && !event.isFull;
  const matched = recommendEvents(events, profile, now).filter(usable);
  const upcoming = events
    .filter((event) => new Date(event.end).getTime() >= now.getTime() && usable(event))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  // Prefer events that fit the student, then any upcoming event; both favor easy-to-reach ones.
  return (
    matched.find(isEasyToAttend) ?? upcoming.find(isEasyToAttend) ?? matched[0] ?? upcoming[0]
  );
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

    const event = rule.eventTypes
      ? bestEvent(events, rule.eventTypes, profile, usedEvents, now)
      : undefined;
    if (event) {
      usedEvents.add(event.id);
      steps.push({
        id: `${key}:${event.id}`,
        title: personaliseTitle(rule, profile),
        why: rule.why,
        actionLabel: event.title,
        href: `/events?event=${event.id}`,
        kind: 'event',
        targetId: event.id,
      });
      continue;
    }

    const resource = bestResource(resources, rule.resourceTypes, profile, usedResources);
    if (resource) {
      usedResources.add(resource.id);
      steps.push({
        id: `${key}:${resource.id}`,
        title: personaliseTitle(rule, profile),
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
