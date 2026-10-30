// Scrapes the public SJSU Career Center events and resources listings into JSON snapshots.
// Run with `npm run scrape`. robots.txt allows /events/ and /resources/ (it blocks /search/ and
// file downloads). Pages are fetched one at a time with a delay, and detail pages are not visited.
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'https://careercenter.sjsu.edu';
const OUT_DIR = new URL('../src/data/scraped/', import.meta.url);
const DELAY_MS = 800;
const MAX_PAGES = 60;
const USER_AGENT = 'BravenCareerCompass-capstone-scraper (student project)';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&#8217;': "'",
  '&#8216;': "'",
  '&#8220;': '"',
  '&#8221;': '"',
  '&#8211;': '-',
  '&#8212;': '-',
  '&hellip;': '...',
  '&#8230;': '...',
  '&nbsp;': ' ',
};

function clean(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[#a-z0-9]+;/gi, (entity) => ENTITIES[entity] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchPage(path) {
  const response = await fetch(`${BASE}${path}`, { headers: { 'User-Agent': USER_AGENT } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return response.text();
}

/** "4pm", "4:30pm", "12pm" -> minutes after midnight */
function parseClock(text) {
  const match = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(text);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toLowerCase() === 'pm') hours += 12;
  return hours * 60 + Number(match[2] ?? 0);
}

/** UTC offset like "-07:00" for a wall-clock time in America/Los_Angeles. */
function pacificOffset(year, month, day, minutes) {
  const guess = new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60));
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'longOffset',
  })
    .formatToParts(guess)
    .find((p) => p.type === 'timeZoneName')?.value;
  const match = /GMT([+-]\d{2}):?(\d{2})?/.exec(part ?? '');
  return match ? `${match[1]}:${match[2] ?? '00'}` : '-08:00';
}

function toIso(year, month, day, minutes) {
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${year}-${pad(month)}-${pad(day)}T${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;
  return stamp + pacificOffset(year, month, day, minutes);
}

function parseEvents(html) {
  const events = [];
  const items = html.match(/<li class="event_item[\s\S]*?<\/li>/g) ?? [];
  for (const item of items) {
    const href = /href="([^"]+)"/.exec(item)?.[1];
    const title = clean(/<h3 class="title">([\s\S]*?)<\/h3>/.exec(item)?.[1] ?? '').replace(
      /^Event:\s*/,
      '',
    );
    const time = clean(/<p class="event-time">([\s\S]*?)<\/p>/.exec(item)?.[1] ?? '');
    const location = clean(/<p class="event-location">([\s\S]*?)<\/p>/.exec(item)?.[1] ?? '');
    const dateMatch = /\/events\/(\d{4})\/(\d{2})\/(\d{2})\//.exec(href ?? '');
    if (!href || !title || !dateMatch) continue;
    const [year, month, day] = dateMatch.slice(1).map(Number);
    const [startText, endText = ''] = time.split('-').map((part) => part.trim());
    const endClock = parseClock(endText);
    // "10 - 2pm": a start without am/pm borrows the end's suffix.
    const startClock =
      parseClock(startText) ??
      parseClock(`${startText}${/am|pm/i.exec(endText)?.[0] ?? ''}`) ??
      9 * 60;
    events.push({
      slug: href.split('/').filter(Boolean).pop(),
      title,
      url: href,
      start: toIso(year, month, day, startClock),
      end: toIso(year, month, day, Math.max(endClock ?? startClock + 60, startClock + 15)),
      location,
      timeText: time,
    });
  }
  return events;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseResources(html) {
  const resources = [];
  const blocks = html.match(/<div class="post-wrapper">[\s\S]*?<div class="entry-footer/g) ?? [];
  for (const block of blocks) {
    const link = /<h2 class="entry-title">\s*<a\b[^>]*?\shref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/.exec(block);
    const description = /<div class="description entry-content">([\s\S]*?)<\/div>/.exec(block)?.[1];
    if (!link) continue;
    // Skip direct file downloads (sample PDFs): no description and robots.txt discourages them.
    if (/\.(pdf|docx?|pptx?|xlsx?)(\?|$)/i.test(link[1])) continue;
    resources.push({
      slug: slugify(clean(link[2])),
      title: clean(link[2]),
      url: link[1],
      snippet: clean(description ?? ''),
    });
  }
  return resources;
}

async function crawl(section, parse) {
  const seen = new Map();
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const html = await fetchPage(page === 1 ? `/${section}/` : `/${section}/page/${page}/`);
    if (!html) break;
    const found = parse(html);
    if (found.length === 0) break;
    for (const entry of found) seen.set(entry.url, entry);
    console.log(`${section} page ${page}: ${found.length} items (${seen.size} unique)`);
    await sleep(DELAY_MS);
  }
  return [...seen.values()];
}

/** Writes one section's snapshot. Events and resources are scraped and saved independently. */
async function scrapeSection(section, parse, key) {
  const items = await crawl(section, parse);
  if (items.length === 0) {
    throw new Error(`No ${section} found; the page layout may have changed. File not written.`);
  }
  if (key === 'resources') {
    const slugCounts = new Map();
    for (const item of items) {
      const count = (slugCounts.get(item.slug) ?? 0) + 1;
      slugCounts.set(item.slug, count);
      if (count > 1) item.slug = `${item.slug}-${count}`;
    }
  }
  const meta = { scrapedAt: new Date().toISOString(), source: 'SJSU Career Center', sourceUrl: BASE };
  await writeFile(
    new URL(`sjsu-${section}.json`, OUT_DIR),
    JSON.stringify({ ...meta, [key]: items }, null, 2),
  );
  console.log(`Saved ${items.length} ${section}.`);
}

async function main() {
  const target = process.argv[2] ?? 'all';
  if (!['events', 'resources', 'all'].includes(target)) {
    throw new Error('Usage: node scripts/scrape-sjsu.mjs [events|resources|all]');
  }
  await mkdir(OUT_DIR, { recursive: true });
  if (target !== 'resources') await scrapeSection('events', parseEvents, 'events');
  if (target !== 'events') await scrapeSection('resources', parseResources, 'resources');
}

main().catch((error) => {
  console.error('Scrape failed:', error);
  process.exitCode = 1;
});
