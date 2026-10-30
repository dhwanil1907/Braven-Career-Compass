import type { CareerEvent } from '../types';
import { sjsuEvents } from './sjsuCatalog';

/** Real events from the SJSU Career Center site, collected by `npm run scrape`. */
export const events: CareerEvent[] = sjsuEvents;

export function getEventById(id: string): CareerEvent | undefined {
  return events.find((event) => event.id === id);
}
