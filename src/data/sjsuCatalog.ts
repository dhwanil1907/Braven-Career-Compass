import type { CareerEvent, Resource } from '../types';
import {
  classifyEventFormat,
  classifyEventType,
  classifyInterests,
  classifyMajors,
  classifyResourceLocation,
  classifyResourceType,
} from '../lib/classify';
import eventsSnapshot from './scraped/sjsu-events.json';
import resourcesSnapshot from './scraped/sjsu-resources.json';

/**
 * Real listings from the public SJSU Career Center site, collected by `npm run scrape`.
 * Titles, links, dates and locations come from the source. Category labels (type, interests,
 * majors, format) are keyword guesses made by src/lib/classify.ts, so each description tells
 * students to confirm details on the source page.
 */

const SOURCE = 'SJSU Career Center';
const RESOURCES_URL = 'https://careercenter.sjsu.edu/resources/';

export const SJSU_SCRAPED_AT = resourcesSnapshot.scrapedAt;

function isExternal(url: string): boolean {
  return !new URL(url).hostname.endsWith('careercenter.sjsu.edu');
}

export const sjsuResources: Resource[] = resourcesSnapshot.resources.map((item) => {
  const text = `${item.title} ${item.snippet}`;
  const summary = item.snippet || `Listed on the ${SOURCE} resources page.`;
  return {
    id: `sjsu-${item.slug}`,
    title: item.title,
    summary,
    description:
      `${summary}\n\nThis listing was collected from the ${SOURCE} website on ` +
      `${resourcesSnapshot.scrapedAt.slice(0, 10)}. Open the original page for the full ` +
      'description, eligibility and current details.',
    whoItsFor: ['SJSU students'],
    resourceType: classifyResourceType(text),
    source: SOURCE,
    sourceUrl: RESOURCES_URL,
    url: item.url,
    majors: classifyMajors(item.title),
    interests: classifyInterests(text),
    location: classifyResourceLocation(text, isExternal(item.url)),
    tags: ['sjsu', 'career center'],
    featured: false,
    isDemo: false,
    lastVerified: resourcesSnapshot.scrapedAt,
  };
});

export const sjsuEvents: CareerEvent[] = eventsSnapshot.events.map((item) => ({
  id: `sjsu-${item.slug}`,
  title: item.title,
  description:
    `Listed on the ${SOURCE} events page (${item.timeText}). Collected on ` +
    `${eventsSnapshot.scrapedAt.slice(0, 10)}. Open the original page for the description and ` +
    'registration, and confirm the time before you go.',
  eventType: classifyEventType(item.title),
  format: classifyEventFormat(item.title, item.location),
  start: item.start,
  end: item.end,
  location: item.location,
  host: SOURCE,
  url: item.url,
  majors: classifyMajors(item.title),
  interests: classifyInterests(item.title),
  tags: ['sjsu', 'career center'],
  isDemo: false,
}));
