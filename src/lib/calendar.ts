import type { CareerEvent, EventType } from '../types';

function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(event: CareerEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    details: `${event.description}\n\nHost: ${event.host}\nMore info: ${event.url}`,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/** A single-event iCalendar file with a one-day-before reminder. */
export function buildIcs(event: CareerEvent, now: Date = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Braven Career Compass//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@career-compass.local`,
    `DTSTAMP:${toCalendarStamp(now.toISOString())}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(`${event.description}\nMore info: ${event.url}`)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(`Tomorrow: ${event.title}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export function downloadIcs(event: CareerEvent): void {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const PREP_TIPS: Record<EventType, string[]> = {
  Workshop: [
    'Bring your current resume or draft so you can apply the advice right away.',
    'Write down one question before you arrive.',
  ],
  Networking: [
    'Prepare a 20-second intro: your major, what you are exploring, one thing you are proud of.',
    'Aim for two real conversations, not ten quick ones. Follow up within 48 hours.',
  ],
  'Career Fair': [
    'Pick three organizations to visit first and read what they do.',
    'Bring copies of your resume and ask what the next step is for students like you.',
  ],
  'Info Session': [
    'Skim the host website beforehand so your question goes beyond the basics.',
    'Note any deadlines mentioned and add them to your calendar.',
  ],
  Panel: [
    'Look up the speakers and choose one question for the Q&A.',
    'Take notes on paths you had not considered.',
  ],
};

export function prepTipsFor(eventType: EventType): string[] {
  return PREP_TIPS[eventType];
}
