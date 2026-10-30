import { describe, expect, it } from 'vitest';
import { events } from '../data/events';
import { DEFAULT_PROFILE, MAYA_PROFILE } from '../data/persona';
import { resources } from '../data/resources';
import { buildRoadmap, countCompleted, getNextStep } from './roadmap';

const now = new Date();

describe('buildRoadmap', () => {
  it('returns nothing until the student has chosen a goal', () => {
    expect(buildRoadmap(DEFAULT_PROFILE, resources, events, now)).toEqual([]);
  });

  it('builds up to five distinct steps that all point at real catalog items', () => {
    const steps = buildRoadmap(MAYA_PROFILE, resources, events, now);
    expect(steps.length).toBeGreaterThan(2);
    expect(steps.length).toBeLessThanOrEqual(5);
    expect(new Set(steps.map((step) => step.id)).size).toBe(steps.length);
    for (const step of steps) {
      const exists =
        step.kind === 'resource'
          ? resources.some((resource) => resource.id === step.targetId)
          : events.some((event) => event.id === step.targetId);
      expect(exists).toBe(true);
    }
  });

  it('puts the step that matches the stated challenge first', () => {
    const resumeFirst = buildRoadmap(
      { ...MAYA_PROFILE, goal: 'Grow my network', challenge: 'Resume or interviews need work' },
      resources,
      events,
      now,
    );
    expect(resumeFirst[0].id.startsWith('resume:')).toBe(true);
  });

  it('is deterministic for the same profile', () => {
    expect(buildRoadmap(MAYA_PROFILE, resources, events, now)).toEqual(
      buildRoadmap(MAYA_PROFILE, resources, events, now),
    );
  });
});

describe('roadmap progress', () => {
  const steps = buildRoadmap(MAYA_PROFILE, resources, events, now);

  it('returns the first incomplete step as the next action', () => {
    expect(getNextStep(steps, [])?.id).toBe(steps[0].id);
    expect(getNextStep(steps, [steps[0].id])?.id).toBe(steps[1].id);
  });

  it('has no next action once every step is complete', () => {
    expect(getNextStep(steps, steps.map((step) => step.id))).toBeUndefined();
  });

  it('counts only steps that belong to the current roadmap', () => {
    expect(countCompleted(steps, [steps[0].id, 'stale:old-step'])).toBe(1);
  });
});
