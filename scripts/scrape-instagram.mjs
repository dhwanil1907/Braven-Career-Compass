// Fetches recent Instagram posts for configured SJSU club accounts into a JSON snapshot.
// Instagram blocks unauthenticated API calls (HTTP 400/401). For live data, pass a logged-in
// sessionid cookie from your browser:
//   INSTAGRAM_SESSIONID='…' npm run scrape:instagram
// Run: npm run scrape:instagram
// Without a cookie, use the Apify version instead: npm run scrape:instagram:apify
import { loadAccounts, loadExistingPosts, postKey, saveSnapshot } from './instagram-snapshot.mjs';

const DELAY_MS = 6000;
const DELAY_JITTER_MS = 4000;
const MAX_POSTS_PER_ACCOUNT = 12;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class RateLimitError extends Error {
  constructor() {
    super('HTTP 429 (rate limited)');
    this.name = 'RateLimitError';
  }
}

/** Random wait between requests so the run looks less like a burst. */
const politeDelay = () => sleep(DELAY_MS + Math.floor(Math.random() * DELAY_JITTER_MS));

/** @type {{ cookies: Map<string, string>, csrf: string | null }} */
let jar = { cookies: new Map(), csrf: null };

function parseSetCookie(header) {
  const part = header.split(';')[0];
  const eq = part.indexOf('=');
  if (eq === -1) return null;
  return { name: part.slice(0, eq).trim(), value: part.slice(eq + 1).trim() };
}

function storeCookies(response) {
  const raw = response.headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const parsed = parseSetCookie(line);
    if (!parsed) continue;
    jar.cookies.set(parsed.name, parsed.value);
    if (parsed.name === 'csrftoken') jar.csrf = parsed.value;
  }
}

function cookieHeader() {
  return [...jar.cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function warmSession() {
  jar = { cookies: new Map(), csrf: null };
  const sessionid = process.env.INSTAGRAM_SESSIONID?.trim();
  if (sessionid) {
    jar.cookies.set('sessionid', sessionid);
  }
  const response = await fetch('https://www.instagram.com/', {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
  });
  storeCookies(response);
  await response.text();
  if (sessionid && !jar.cookies.has('sessionid')) {
    jar.cookies.set('sessionid', sessionid);
  }
  if (process.env.INSTAGRAM_CSRF_TOKEN?.trim()) {
    jar.csrf = process.env.INSTAGRAM_CSRF_TOKEN.trim();
    jar.cookies.set('csrftoken', jar.csrf);
  }
}

async function fetchPostsForHandle(handle) {
  const profileUrl = `https://www.instagram.com/${handle}/`;
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(handle)}`;
  const headers = {
    'User-Agent': USER_AGENT,
    'X-IG-App-ID': '936619743392459',
    'X-Requested-With': 'XMLHttpRequest',
    Accept: '*/*',
    Referer: profileUrl,
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
  };
  const cookies = cookieHeader();
  if (cookies) headers.Cookie = cookies;
  if (jar.csrf) headers['X-CSRFToken'] = jar.csrf;

  const response = await fetch(url, { headers });
  storeCookies(response);
  if (response.status === 429) throw new RateLimitError();
  if (!response.ok) {
    const body = await response.text();
    const isHtml = body.trimStart().startsWith('<');
    const detail = isHtml ? '' : ` — ${body.slice(0, 120)}`;
    throw new Error(`HTTP ${response.status}${detail}`);
  }
  const payload = await response.json();
  const media = payload?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];
  const posts = [];
  for (const edge of media.slice(0, MAX_POSTS_PER_ACCOUNT)) {
    const node = edge?.node;
    if (!node?.shortcode) continue;
    const caption =
      node.edge_media_to_caption?.edges?.[0]?.node?.text?.trim() ??
      node.accessibility_caption?.trim() ??
      '';
    if (!caption) continue;
    posts.push({
      handle,
      shortcode: node.shortcode,
      url: `https://www.instagram.com/p/${node.shortcode}/`,
      caption,
      takenAt: new Date(Number(node.taken_at_timestamp) * 1000).toISOString(),
    });
  }
  return posts;
}

function printAuthHelp() {
  console.error(`
Instagram did not return any posts (logged-out scraping is blocked).

Without a session cookie, add posts manually to:
  src/data/scraped/instagram-posts.json
Each entry needs: handle, host, shortcode, url, caption, takenAt (ISO date).
Copy event captions from Instagram; the site parses date/time/location from the caption.

Optional — logged-in fetch on your machine only:
  INSTAGRAM_SESSIONID='…' npm run scrape:instagram
Do not commit session cookies.
`);
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log(`Usage: npm run scrape:instagram [-- handle1 handle2 ...]

Pass handles to scrape only those clubs (useful after a rate limit).

Environment:
  INSTAGRAM_SESSIONID   Logged-in sessionid cookie (required for live fetches)
  INSTAGRAM_CSRF_TOKEN  Optional csrftoken if the API still returns 403
`);
    return;
  }

  await warmSession();
  const allAccounts = await loadAccounts();
  const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
  const accounts = requested.length
    ? allAccounts.filter((account) => requested.includes(account.handle))
    : allAccounts;
  if (requested.length && accounts.length === 0) {
    throw new Error(`None of ${requested.join(', ')} are in scripts/instagram-accounts.json`);
  }
  const existing = await loadExistingPosts();
  const byKey = new Map(existing.map((post) => [postKey(post), post]));

  let fetchedAccounts = 0;
  let rateLimited = false;
  for (const [index, account] of accounts.entries()) {
    const { handle, host } = account;
    if (index > 0) await politeDelay();
    try {
      const rawPosts = await fetchPostsForHandle(handle);
      for (const post of rawPosts) {
        byKey.set(postKey(post), { ...post, host });
      }
      fetchedAccounts += 1;
      console.log(`@${handle}: ${rawPosts.length} posts`);
    } catch (error) {
      if (error instanceof RateLimitError) {
        rateLimited = true;
        const remaining = accounts.slice(index).map((item) => item.handle);
        console.warn(`@${handle}: rate limited by Instagram. Stopping to protect your account.`);
        const envPrefix = process.env.INSTAGRAM_SESSIONID ? "INSTAGRAM_SESSIONID='…' " : '';
        const resumeArgs = remaining.length === accounts.length ? '' : ` -- ${remaining.join(' ')}`;
        console.warn(
          `Wait 30-60 minutes, then resume with:\n  ${envPrefix}npm run scrape:instagram${resumeArgs}`,
        );
        break;
      }
      console.warn(`@${handle}: skipped (${error.message})`);
    }
  }

  if (fetchedAccounts === 0 && !rateLimited) {
    printAuthHelp();
  }

  const saved = await saveSnapshot(byKey);
  console.log(
    `Saved ${saved} posts (${fetchedAccounts}/${accounts.length} accounts fetched this run).`,
  );
}

main().catch((error) => {
  console.error('Instagram scrape failed:', error);
  process.exitCode = 1;
});
