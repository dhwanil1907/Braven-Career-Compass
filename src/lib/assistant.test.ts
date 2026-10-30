import { describe, expect, it } from 'vitest';
import { events } from '../data/events';
import { MAYA_PROFILE } from '../data/persona';
import { resources } from '../data/resources';
import { answerQuestion, detectTopics } from './assistant';

const now = new Date();

describe('detectTopics', () => {
  it('recognises several topics in one question', () => {
    expect(detectTopics('How do I find my first internship without a resume?')).toEqual(
      expect.arrayContaining(['internship', 'resume']),
    );
  });

  it('returns no topics for unrelated text', () => {
    expect(detectTopics('what is the weather')).toEqual([]);
  });
});

describe('answerQuestion', () => {
  it('answers the demo question with catalog items and a resume step first', () => {
    const reply = answerQuestion(
      'How can I find my first internship without experience?',
      MAYA_PROFILE,
      resources,
      events,
      now,
    );
    expect(reply.grounded).toBe(true);
    expect(reply.resources[0].resourceType).toBe('Resume Help');
    expect(reply.resources.some((resource) => resource.resourceType === 'Internship')).toBe(true);
    expect(reply.steps.length).toBeGreaterThan(0);
  });

  it('only ever links to items that exist in the dataset', () => {
    const reply = answerQuestion('mentor networking events', MAYA_PROFILE, resources, events, now);
    for (const resource of reply.resources) expect(resources).toContain(resource);
    for (const event of reply.events) expect(events).toContain(event);
  });

  it('says so instead of inventing an answer when nothing matches', () => {
    const reply = answerQuestion('zzzz qqqq', { major: null, interests: [] }, resources, events, now);
    expect(reply.grounded).toBe(false);
    expect(reply.resources).toEqual([]);
    expect(reply.summary).toMatch(/could not find/i);
  });

  it('answers skills questions with field-specific skills and catalog resources', () => {
    const reply = answerQuestion(
      'What skills should I build?',
      { major: 'Computer Science', interests: ['Data Science'] },
      resources,
      events,
      now,
    );
    expect(reply.grounded).toBe(true);
    expect(reply.steps.some((step) => step.startsWith('Data Science:'))).toBe(true);
    expect(reply.resources.length).toBeGreaterThan(0);
  });
});
