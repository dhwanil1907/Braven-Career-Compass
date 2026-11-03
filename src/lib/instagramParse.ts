import * as chrono from 'chrono-node';

/** Raw post row stored in src/data/scraped/instagram-posts.json */
export interface InstagramPostSnapshot {
  handle: string;
  host: string;
  shortcode: string;
  url: string;
  caption: string;
  /** ISO 8601 — when the post was published */
  takenAt: string;
}

export interface ParsedInstagramEvent {
  id: string;
  title: string;
  caption: string;
  start: string;
  end: string;
  location: string;
  host: string;
  handle: string;
  url: string;
  takenAt: string;
}

const EVENT_HINT =
  /\b(workshop|info\s*session|infosession|career\s*fair|networking|tabling|rsvp|register|registration|hiring|internship|meet\s*(the|&)|panel|speaker|webinar|zoom|office\s*hours|mix(er)?|conference|summit|open\s*house|volunteer)\b/i;

/** Thank-you and recap posts describe events that already happened. */
const RECAP_HINT =
  /\b(thanks?( you)? (so much )?(to )?(all|everyone|every)|this past|recap|throwback|was a (huge |great )?success|last (week|night))\b/i;

/** Clubs usually put details on emoji lines: "📅 November 5", "⏰ 6-7 PM", "📍 SU 3B". */
const DATE_LINE = /^\s*(?:\u{1F4C5}|\u{1F4C6}|\u{1F5D3}\uFE0F?|date\s*:|when\s*:)\s*(.+)$/imu;
const TIME_LINE = /^\s*(?:\u23F0\uFE0F?|[\u{1F550}-\u{1F567}]|time\s*:)\s*(.+)$/imu;

/** Each pattern exposes the venue as the `place` group. */
const LOCATION_PATTERNS: RegExp[] = [
  /^\s*\u{1F4CD}\uFE0F?\s*(?<place>.+)$/imu,
  /\blocation\s*:\s*(?<place>.+?)(?:\n|$)/i,
  /\bwhere\s*:\s*(?<place>.+?)(?:\n|$)/i,
  /\s@\s+(?<place>[^\n#@]+)/,
  /\b(?:at|in)\s+(?<place>(?:MLK|King Library|Student Union|Spartan)[^\n,.!]*)/i,
  /(?<place>\b(?:room|rm\.?)\s*[A-Za-z]*\s?\d+[A-Za-z]?\b[^\n]*)/i,
];

const DAY_MS = 24 * 60 * 60 * 1000;
/** A post announces events from shortly before it was posted up to about six months ahead. */
const EARLIEST_BEFORE_POST_MS = 2 * DAY_MS;
const LATEST_AFTER_POST_MS = 183 * DAY_MS;
const DEFAULT_DURATION_MS = 60 * 60 * 1000;
const MAX_TITLE_LENGTH = 90;

const EMOJI = /[\p{Extended_Pictographic}\uFE0F\u200D]/gu;

export function looksLikeEventCaption(caption: string): boolean {
  const text = caption.trim();
  if (text.length < 12) return false;
  return EVENT_HINT.test(text) && !RECAP_HINT.test(text);
}

export function eventTitleFromCaption(caption: string): string {
  const line = caption
    .trim()
    .split('\n')
    .map((part) => part.trim())
    .find(Boolean);
  if (!line) return 'Club event';
  const cleaned = line.replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, '').trim();
  if (cleaned.length <= MAX_TITLE_LENGTH) return cleaned || 'Club event';
  const firstSentence = cleaned.match(/^.+?[.!?](?=\s|$)/)?.[0];
  if (firstSentence && firstSentence.length <= MAX_TITLE_LENGTH) return firstSentence;
  const cut = cleaned.slice(0, MAX_TITLE_LENGTH - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).trimEnd()}…`;
}

export function locationFromCaption(caption: string): string {
  for (const pattern of LOCATION_PATTERNS) {
    const place = caption.match(pattern)?.groups?.place;
    if (!place) continue;
    const value = place
      .replace(EMOJI, '')
      .replace(/^\s*(?:location|where|venue)?\s*:\s*/i, '')
      .replace(/[\s|,.!-]+$/, '')
      .trim();
    if (value.length > 1 && value.length < 120) return value;
  }
  if (/zoom/i.test(caption)) return 'Online (Zoom — see Instagram post)';
  return 'See Instagram post for location';
}

/** Joins the "📅 date" and "⏰ time" lines so chrono reads them as one moment. */
function structuredWhen(caption: string): string | null {
  const date = caption.match(DATE_LINE)?.[1];
  if (!date) return null;
  const time = caption.match(TIME_LINE)?.[1];
  return time ? `${date} ${time}` : date;
}

/**
 * Finds the event's date: the structured date/time lines first, then anywhere in the caption.
 * Month-only mentions ("October calendar") and dates far from the post date are ignored.
 */
export function parseEventTimes(
  caption: string,
  reference: Date,
): { start: Date; end: Date } | null {
  const earliest = reference.getTime() - EARLIEST_BEFORE_POST_MS;
  const latest = reference.getTime() + LATEST_AFTER_POST_MS;
  const sources = [structuredWhen(caption), caption].filter((text): text is string => !!text);

  for (const text of sources) {
    // Captions write "Nov 6 @ 4:30 PM" or "November 5 | 4:30 PM"; chrono only understands "at".
    const normalized = text.replace(EMOJI, ' ').replace(/\s+[@|•·]\s+/g, ' at ');
    for (const result of chrono.parse(normalized, reference, { forwardDate: true })) {
      if (!result.start.isCertain('day')) continue;
      const start = result.start.date();
      if (start.getTime() < earliest || start.getTime() > latest) continue;
      const parsedEnd = result.end?.date();
      const end =
        parsedEnd && parsedEnd.getTime() > start.getTime()
          ? parsedEnd
          : new Date(start.getTime() + DEFAULT_DURATION_MS);
      return { start, end };
    }
  }
  return null;
}

export function parseInstagramPost(post: InstagramPostSnapshot): ParsedInstagramEvent | null {
  if (!looksLikeEventCaption(post.caption)) return null;
  const reference = new Date(post.takenAt);
  const times = parseEventTimes(post.caption, reference);
  if (!times) return null;

  return {
    id: `ig-${post.shortcode}`,
    title: eventTitleFromCaption(post.caption),
    caption: post.caption.trim(),
    start: times.start.toISOString(),
    end: times.end.toISOString(),
    location: locationFromCaption(post.caption),
    host: post.host,
    handle: post.handle,
    url: post.url,
    takenAt: post.takenAt,
  };
}

export function parseInstagramPosts(posts: InstagramPostSnapshot[]): ParsedInstagramEvent[] {
  const byId = new Map<string, ParsedInstagramEvent>();
  for (const post of posts) {
    const parsed = parseInstagramPost(post);
    if (parsed) byId.set(parsed.id, parsed);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}
