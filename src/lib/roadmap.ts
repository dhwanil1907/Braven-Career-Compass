import type {
  CareerEvent,
  CareerGoal,
  EventType,
  ProfileSignals,
  Resource,
  ResourceType,
  RoadmapStep,
  UserProfile,
} from '../types';
import { recommendEvents, scoreResource } from './recommend';

type StepKey = 'resume' | 'internships' | 'jobs' | 'interview' | 'mentor' | 'network' | 'explore' | 'event';

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
};

const GOAL_SEQUENCES: Record<CareerGoal, StepKey[]> = {
  'First internship': ['resume', 'internships', 'event', 'mentor', 'interview'],
  'First job after graduation': ['resume', 'jobs', 'interview', 'network', 'event'],
  'Explore career options': ['explore', 'event', 'mentor', 'resume', 'internships'],
  'Prepare for graduate school': ['explore', 'resume', 'mentor', 'event', 'network'],
  'Grow my network': ['network', 'mentor', 'event', 'resume', 'interview'],
};

const CHALLENGE_PRIORITY: Record<NonNullable<UserProfile['challenge']>, StepKey[]> = {
  'Not sure where to start': ['mentor'],
  'Hard to find relevant opportunities': ['internships', 'jobs'],
  'Resume or interviews need work': ['resume', 'interview'],
  'Need connections and mentors': ['mentor', 'network'],
  'Hard to stay on track': ['event'],
};

const MAX_STEPS = 5;

/** Moves the keys the student said they struggle with to the front, keeping the rest in order. */
function prioritise(sequence: StepKey[], promoted: StepKey[]): StepKey[] {
  const front = sequence.filter((key) => promoted.includes(key));
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
        // Real catalog entries beat fictional demo listings of the same type.
        Number(first.resource.isDemo) - Number(second.resource.isDemo) ||
        second.score - first.score ||
        Number(second.resource.featured) - Number(first.resource.featured) ||
        first.resource.title.localeCompare(second.resource.title),
    )[0]?.resource;
}

function bestEvent(
  events: CareerEvent[],
  types: EventType[],
  profile: ProfileSignals,
  used: Set<string>,
  now: Date,
): CareerEvent | undefined {
  return recommendEvents(events, profile, now).find(
    (event) => types.includes(event.eventType) && !used.has(event.id),
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
  const promoted = profile.challenge ? CHALLENGE_PRIORITY[profile.challenge] : [];
  const sequence = prioritise(GOAL_SEQUENCES[profile.goal], promoted);

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
        title: rule.title,
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
        title: rule.title,
        why: rule.why,
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
