import type { CareerEvent } from '../types';
import { instagramEvents } from './instagramCatalog';
import { sjsuEvents } from './sjsuCatalog';

/** Career Center listings plus club events parsed from Instagram post snapshots. */
const merged: CareerEvent[] = [...sjsuEvents];
const seen = new Set(merged.map((event) => event.id));
for (const event of instagramEvents) {
  if (seen.has(event.id)) continue;
  seen.add(event.id);
  merged.push(event);
}

/** Demo is on Nov 19, 2026, so only events from Nov 20 (Pacific time) onward are shown. */
const FIRST_SHOWN_AT = Date.parse('2026-11-20T00:00:00-08:00');

export const events: CareerEvent[] = merged
  .filter((event) => new Date(event.start).getTime() >= FIRST_SHOWN_AT)
  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

export function getEventById(id: string): CareerEvent | undefined {
  return events.find((event) => event.id === id);
}
