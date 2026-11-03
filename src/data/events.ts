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

export const events: CareerEvent[] = merged.sort(
  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
);

export function getEventById(id: string): CareerEvent | undefined {
  return events.find((event) => event.id === id);
}
