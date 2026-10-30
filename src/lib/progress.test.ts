import { describe, expect, it } from 'vitest';
import type { CareerEvent, Resource } from '../types';
import { attendedWeekStreak, getBadges, getDueSoon } from './progress';

// Wednesday, Nov 4 2026, noon local time
const NOW = new Date(2026, 10, 4, 12, 0);

function eventOn(id: string, year: number, month: number, day: number): CareerEvent {
  return {
    id,
    title: id,
    description: '',
    eventType: 'Workshop',
    format: 'Virtual',
    start: new Date(year, month, day, 12).toISOString(),
    end: new Date(year, month, day, 13).toISOString(),
    location: '',
    host: '',
    url: '',
    majors: [],
    interests: [],
    tags: [],
    isDemo: false,
  };
}

function resourceWithDeadline(id: string, deadline?: string): Resource {
  return {
    id,
    title: id,
    summary: '',
    description: '',
    whoItsFor: [],
    resourceType: 'Job',
    source: '',
    sourceUrl: '',
    url: '',
    majors: [],
    interests: [],
    location: 'Remote',
    tags: [],
    featured: false,
    isDemo: false,
    deadline,
  };
}

describe('attendedWeekStreak', () => {
  it('is 0 with nothing attended', () => {
    expect(attendedWeekStreak([], NOW)).toBe(0);
  });

  it('counts consecutive weeks including this one', () => {
    const attended = [
      eventOn('a', 2026, 10, 3), // this week
      eventOn('b', 2026, 9, 28), // last week
      eventOn('c', 2026, 9, 21), // two weeks ago
    ];
    expect(attendedWeekStreak(attended, NOW)).toBe(3);
  });

  it('keeps the streak alive when only last week has an event', () => {
    expect(attendedWeekStreak([eventOn('b', 2026, 9, 28)], NOW)).toBe(1);
  });

  it('breaks on a missed week', () => {
    const attended = [eventOn('a', 2026, 10, 3), eventOn('c', 2026, 9, 21)];
    expect(attendedWeekStreak(attended, NOW)).toBe(1);
  });

  it('ignores events older than last week', () => {
    expect(attendedWeekStreak([eventOn('old', 2026, 9, 14)], NOW)).toBe(0);
  });
});

describe('getBadges', () => {
  it('earns badges at the right counts', () => {
    const earned = (events: number, applied: number) =>
      getBadges(events, applied).filter((badge) => badge.earned).map((badge) => badge.id);
    expect(earned(0, 0)).toEqual([]);
    expect(earned(1, 0)).toEqual(['first-event']);
    expect(earned(3, 1)).toEqual(['first-event', 'three-events', 'first-application']);
  });
});

describe('getDueSoon', () => {
  it('lists deadlines and starts within a week, soonest first', () => {
    const items = getDueSoon(
      [
        resourceWithDeadline('soon', new Date(2026, 10, 6).toISOString()),
        resourceWithDeadline('later', new Date(2026, 10, 20).toISOString()),
        resourceWithDeadline('none'),
      ],
      [eventOn('tomorrow', 2026, 10, 5)],
      [],
      NOW,
    );
    expect(items.map((item) => item.id)).toEqual(['tomorrow', 'soon']);
  });

  it('skips resources already marked applied and past items', () => {
    const items = getDueSoon(
      [
        resourceWithDeadline('done', new Date(2026, 10, 6).toISOString()),
        resourceWithDeadline('gone', new Date(2026, 10, 1).toISOString()),
      ],
      [],
      ['done'],
      NOW,
    );
    expect(items).toEqual([]);
  });
});
