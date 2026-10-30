import { describe, expect, it } from 'vitest';
import { events } from '../data/events';
import { buildIcs, googleCalendarUrl, prepTipsFor } from './calendar';

const event = events[0];

describe('googleCalendarUrl', () => {
  it('encodes the title and a start/end range', () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('text')).toBe(event.title);
    expect(url.searchParams.get('dates')).toMatch(/^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
  });
});

describe('buildIcs', () => {
  const ics = buildIcs({ ...event, title: 'Hello, world; test' });

  it('produces a valid single-event calendar with CRLF line endings', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR')).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
  });

  it('escapes commas and semicolons in text fields', () => {
    expect(ics).toContain('SUMMARY:Hello\\, world\\; test');
  });

  it('includes a one-day-before reminder', () => {
    expect(ics).toContain('TRIGGER:-P1D');
  });
});

describe('prepTipsFor', () => {
  it('has tips for every event type in the data', () => {
    for (const item of events) expect(prepTipsFor(item.eventType).length).toBeGreaterThan(0);
  });
});
