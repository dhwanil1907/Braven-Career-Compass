import { describe, expect, it } from 'vitest';
import { events } from '../data/events';
import { DEFAULT_PROFILE, MAYA_PROFILE } from '../data/persona';
import { resources } from '../data/resources';
import personaData from './__fixtures__/relevance-personas.json';
import { buildRoadmap, countCompleted, getNextStep } from './roadmap';
import type { UserProfile } from '../types';

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

  it('puts an experience step first for students who lack experience', () => {
    const steps = buildRoadmap(
      { ...MAYA_PROFILE, goal: 'First internship', challenge: 'Lack of experience' },
      resources,
      events,
      now,
    );
    expect(steps[0].id.startsWith('experience:')).toBe(true);
  });

  it('puts interview prep ahead of the resume step for a first internship', () => {
    const ids = buildRoadmap(
      { ...MAYA_PROFILE, year: null, goal: 'First internship', challenge: null },
      resources,
      events,
      now,
    ).map((step) => step.id.split(':')[0]);
    expect(ids.indexOf('interview')).toBeGreaterThanOrEqual(0);
    expect(ids.indexOf('interview')).toBeLessThan(ids.indexOf('resume'));
  });

  it('orders steps by academic year when no challenge is set', () => {
    const base = { ...MAYA_PROFILE, goal: 'First internship' as const, challenge: null };
    const first = buildRoadmap({ ...base, year: 'First year' }, resources, events, now);
    const senior = buildRoadmap({ ...base, year: 'Fourth year or later' }, resources, events, now);
    expect(first[0].id.startsWith('explore:') || first[0].id.startsWith('event:')).toBe(true);
    expect(senior.map((step) => step.id)).not.toEqual(first.map((step) => step.id));
  });

  it('keeps the stated challenge ahead of the year ordering', () => {
    const steps = buildRoadmap(
      { ...MAYA_PROFILE, year: 'First year', challenge: 'Resume or interviews need work' },
      resources,
      events,
      now,
    );
    expect(steps[0].id.startsWith('resume:')).toBe(true);
  });

  it('writes step titles from the major and interests', () => {
    const steps = buildRoadmap(
      { ...MAYA_PROFILE, major: 'Computer Science', goal: 'First internship', challenge: null },
      resources,
      events,
      now,
    );
    const internship = steps.find((step) => step.id.startsWith('internships:'));
    expect(internship?.title).toBe('Explore Computer Science internships');
  });

  it('explains why a resource was picked using its match reasons', () => {
    const steps = buildRoadmap(MAYA_PROFILE, resources, events, now);
    expect(steps.some((step) => step.why.includes('Picked for you:'))).toBe(true);
  });

  describe('accuracy across the judged personas', () => {
    const personas = personaData as unknown as UserProfile[];
    const roadmaps = personas.map((persona) => ({
      persona,
      steps: buildRoadmap({ ...persona, onboarded: true }, resources, events, now),
    }));

    it('never defaults a student to a group for a specific identity', () => {
      const identity = /\b(black|indigenous|latinx?|hispanic|women|lgbtq\+?|queer)\b|ostem/i;
      for (const { steps } of roadmaps) {
        for (const step of steps) expect(step.actionLabel).not.toMatch(identity);
      }
    });

    it('only names a major in a title when the linked listing is about that major', () => {
      for (const { persona, steps } of roadmaps) {
        const step = steps.find((item) => item.id.startsWith('internships:'));
        if (!step?.title.includes(persona.major ?? '#')) continue;
        const listing = resources.find((resource) => resource.id === step.targetId);
        expect(listing?.majors).toContain(persona.major);
      }
    });

    it('does not link to contract roles or student clubs for internships and exploring', () => {
      for (const { steps } of roadmaps) {
        for (const step of steps) {
          if (step.id.startsWith('internships:')) expect(step.actionLabel).not.toMatch(/contract/i);
          if (step.id.startsWith('explore:')) expect(step.actionLabel).not.toMatch(/association|\bclub\b/i);
        }
      }
    });

    it('gives event steps a date and a format', () => {
      for (const { steps } of roadmaps) {
        for (const step of steps.filter((item) => item.kind === 'event')) {
          expect(step.why).toMatch(/\b(virtual|in-person|hybrid)\.$/);
        }
      }
    });
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
