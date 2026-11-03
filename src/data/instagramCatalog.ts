import type { CareerEvent } from '../types';
import {
  classifyEventFormat,
  classifyEventType,
  classifyInterests,
  classifyMajors,
} from '../lib/classify';
import { parseInstagramPosts } from '../lib/instagramParse';
import postsSnapshot from './scraped/instagram-posts.json';

export const INSTAGRAM_SCRAPED_AT = postsSnapshot.scrapedAt;

/** Club posts are only useful before the event, so past ones are dropped when the site loads. */
const loadedAt = Date.now();
const upcomingClubEvents = parseInstagramPosts(postsSnapshot.posts).filter(
  (item) => new Date(item.end).getTime() >= loadedAt,
);

export const instagramEvents: CareerEvent[] = upcomingClubEvents.map(
  (item) => {
    const text = `${item.title} ${item.caption}`;
    return {
      id: item.id,
      title: item.title,
      description:
        `${item.caption.slice(0, 280)}${item.caption.length > 280 ? '…' : ''}\n\n` +
        `Posted by @${item.handle} on Instagram. Parsed on ` +
        `${postsSnapshot.scrapedAt.slice(0, 10)}. Confirm time and location on the post before you go.`,
      eventType: classifyEventType(item.title),
      format: classifyEventFormat(item.title, item.location),
      start: item.start,
      end: item.end,
      location: item.location,
      host: item.host,
      url: item.url,
      majors: classifyMajors(text),
      interests: classifyInterests(text),
      tags: ['instagram', item.handle.replace(/\./g, '-')],
      isDemo: false,
      scraped: true,
    };
  },
);
