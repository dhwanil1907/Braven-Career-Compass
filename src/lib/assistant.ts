import type { CareerEvent, ProfileSignals, Resource, ResourceType } from '../types';
import { filterResources } from './filters';
import { recommendEvents, scoreResource } from './recommend';
import { getSkillGroups } from './skills';

export interface AssistantReply {
  /** One-sentence framing. Everything below it comes from the catalog or is labelled general. */
  summary: string;
  /** Short general-advice steps. These are not catalog data and are labelled as such in the UI. */
  steps: string[];
  resources: Resource[];
  events: CareerEvent[];
  /** True when at least one catalog item backs the answer. */
  grounded: boolean;
}

type Topic = 'skills' | 'internship' | 'job' | 'resume' | 'interview' | 'network' | 'mentor' | 'event' | 'explore';

const TOPIC_PATTERNS: Array<[Topic, RegExp]> = [
  ['skills', /\b(skill|skills|learn|learning|gain|qualif\w*)\b/i],
  ['internship', /\b(intern|internship|internships|co-?op)\b/i],
  ['job', /\b(job|jobs|full-?time|entry[- ]level|hire|hiring)\b/i],
  ['resume', /\b(resume|résumé|cv|cover letter|portfolio)\b/i],
  ['interview', /\b(interview|interviews|interviewing)\b/i],
  ['network', /\b(network|networking|connections?|linkedin|alumni)\b/i],
  ['mentor', /\b(mentor|mentors|mentorship|coach|coaching|advice)\b/i],
  ['event', /\b(event|events|workshop|workshops|fair|panel|session|calendar)\b/i],
  ['explore', /\b(explore|options|major|which career|don'?t know|not sure|where (do|should) i start)\b/i],
];

const TOPIC_RESOURCE_TYPES: Record<Topic, ResourceType[]> = {
  skills: [],
  internship: ['Internship'],
  job: ['Job'],
  resume: ['Resume Help'],
  interview: ['Interview Prep'],
  network: ['Networking'],
  mentor: ['Mentorship'],
  event: ['Workshop'],
  explore: ['Career Exploration'],
};

const TOPIC_STEPS: Record<Topic, string[]> = {
  skills: [],
  internship: [
    'Start with your resume: list classes, projects and activities, not only paid jobs.',
    'Apply to a few roles that fit your major rather than many generic ones.',
    'Ask a coach or alumnus to look at your application before you send it.',
  ],
  job: [
    'Read three entry-level postings and note the skills that repeat.',
    'Tailor your resume to those skills before you apply.',
  ],
  resume: [
    'Lead each bullet with an action and a result.',
    'Keep it to one page and match keywords from the posting.',
  ],
  interview: [
    'Prepare three stories using situation, task, action and result.',
    'Practice out loud at least once before the real interview.',
  ],
  network: [
    'Send a short message that says who you are and asks one specific question.',
    'Follow up within two days of meeting someone.',
  ],
  mentor: [
    'Come to a coaching conversation with one concrete goal for the month.',
    'Ask what they would do in your position.',
  ],
  event: [
    'Pick one event this week and add it to your calendar so it happens.',
    'Prepare one question before you go.',
  ],
  explore: [
    'Choose two or three roles that sound interesting and read what people in them do.',
    'Talk to one person in each and note what energizes you.',
  ],
};

const MAX_RESOURCES = 4;
const MAX_EVENTS = 2;
const MAX_STEPS = 4;

export function detectTopics(question: string): Topic[] {
  return TOPIC_PATTERNS.filter(([, pattern]) => pattern.test(question)).map(([topic]) => topic);
}

function rankResources(
  resources: Resource[],
  candidates: Resource[],
  profile: ProfileSignals,
): Resource[] {
  const order = new Map(resources.map((resource, index) => [resource.id, index]));
  return [...candidates].sort(
    (first, second) =>
      scoreResource(second, profile) - scoreResource(first, profile) ||
      Number(second.featured) - Number(first.featured) ||
      (order.get(first.id) ?? 0) - (order.get(second.id) ?? 0),
  );
}

/**
 * Demonstration assistant. It is not a language model: it recognises topics in the question,
 * then assembles a short plan from catalog entries and clearly separated general advice.
 * It can only ever link to items that exist in the dataset.
 */
export function answerQuestion(
  question: string,
  profile: ProfileSignals,
  resources: Resource[],
  events: CareerEvent[],
  now: Date = new Date(),
): AssistantReply {
  const topics = detectTopics(question);
  const types = new Set(topics.flatMap((topic) => TOPIC_RESOURCE_TYPES[topic]));

  const skillTerms = topics.includes('skills')
    ? getSkillGroups(profile, resources).flatMap((group) =>
        group.skills.slice(0, 3).map((skill) => skill.searchTerm),
      )
    : [];
  const bySkill = skillTerms.flatMap((term) => filterResources(resources, term, {}));
  const byTopic = [
    ...resources.filter((resource) => types.has(resource.resourceType)),
    ...bySkill,
  ].filter((resource, index, all) => all.indexOf(resource) === index);
  const byText = filterResources(resources, question, {});
  const pool = byTopic.length > 0 ? byTopic : byText;

  // A "first internship" question benefits from a resume step even if the word is absent.
  const needsResumeFirst = topics.includes('internship') || topics.includes('job');
  const resumeResources = needsResumeFirst
    ? rankResources(
        resources,
        resources.filter((resource) => resource.resourceType === 'Resume Help'),
        profile,
      ).slice(0, 1)
    : [];

  const picked = [
    ...resumeResources,
    ...rankResources(resources, pool, profile).filter(
      (resource) => !resumeResources.some((existing) => existing.id === resource.id),
    ),
  ].slice(0, MAX_RESOURCES);

  const wantsEvents =
    topics.length === 0 ||
    topics.some((topic) => topic === 'event' || topic === 'network' || topic === 'internship');
  const matchedEvents = wantsEvents
    ? recommendEvents(events, profile, now, MAX_EVENTS)
    : [];

  const skillSteps = topics.includes('skills')
    ? getSkillGroups(profile, resources).flatMap((group) =>
        group.skills.slice(0, 3).map((skill) => `${group.interest}: ${skill.name}. ${skill.why}`),
      )
    : [];
  const steps = [
    ...new Set([...skillSteps, ...topics.flatMap((topic) => TOPIC_STEPS[topic])]),
  ].slice(0, MAX_STEPS + (skillSteps.length > 0 ? 2 : 0));
  const grounded = picked.length > 0 || matchedEvents.length > 0;

  if (!grounded) {
    return {
      summary:
        'I could not find anything in the Career Compass catalog that matches that yet. ' +
        'Try asking about internships, resumes, interviews, networking, mentors or events.',
      steps: [],
      resources: [],
      events: [],
      grounded: false,
    };
  }

  return {
    summary:
      topics.length > 0
        ? 'Here is a short plan, with matching items from the Career Compass catalog.'
        : 'I was not sure what to focus on, so here are items that match your profile.',
    steps,
    resources: picked,
    events: matchedEvents,
    grounded,
  };
}
