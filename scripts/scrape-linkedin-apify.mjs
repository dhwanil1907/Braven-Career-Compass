// Fetches internship listings from LinkedIn through Apify's LinkedIn Jobs Scraper
// (curious_coder/linkedin-jobs-scraper), so no LinkedIn login or cookie is needed.
// Run: APIFY_TOKEN='…' npm run scrape:linkedin          (internships)
//      APIFY_TOKEN='…' npm run scrape:linkedin:jobs     (entry-level full-time jobs)
// Check the raw output first, without saving: add `-- --sample` to either command.
// Pricing is per job returned ($1 to $2 per 1,000); MAX_CHARGE_USD caps a run.
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const ACTOR = 'curious_coder~linkedin-jobs-scraper';
const API = 'https://api.apify.com/v2';
const JOBS_PER_SEARCH = 15;
const SAMPLE_JOBS_PER_SEARCH = 2;
const SAMPLE_SEARCHES = 2;
const PAST_MONTH_SECONDS = 30 * 24 * 60 * 60;
const MAX_CHARGE_USD = 1.5;
const FINISHED = new Set(['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT']);
// `--jobs` collects entry-level full-time roles instead of internships.
const JOBS_MODE = process.argv.includes('--jobs');
const SEARCHES_URL = new URL(
  JOBS_MODE ? './linkedin-job-searches.json' : './linkedin-searches.json',
  import.meta.url,
);
const OUT_FILE = new URL(
  JOBS_MODE
    ? '../src/data/scraped/linkedin-jobs.json'
    : '../src/data/scraped/linkedin-internships.json',
  import.meta.url,
);
const LISTING_NAME = JOBS_MODE ? 'jobs' : 'internships';

async function apify(path, token, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const body = (await response.text()).slice(0, 300);
    const route = path.split('?')[0];
    throw new Error(`Apify ${init.method ?? 'GET'} ${route} returned ${response.status}: ${body}`);
  }
  return response.json();
}

function searchUrl(keywords, location) {
  const params = new URLSearchParams({
    keywords,
    location,
    f_TPR: `r${PAST_MONTH_SECONDS}`,
  });
  return `https://www.linkedin.com/jobs/search/?${params}`;
}

async function runScraper(token, urls, limitPerSource) {
  const input = { urls, limitPerSource, scrapeCompany: false };
  const started = await apify(`/acts/${ACTOR}/runs?maxTotalChargeUsd=${MAX_CHARGE_USD}`, token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  let run = started.data;
  console.log(`Started Apify run ${run.id} for ${urls.length} searches. This takes a few minutes.`);

  while (!FINISHED.has(run.status)) {
    run = (await apify(`/actor-runs/${run.id}?waitForFinish=60`, token)).data;
    console.log(`  status: ${run.status}`);
  }
  if (run.status !== 'SUCCEEDED') {
    throw new Error(`Apify run ${run.id} ended with status ${run.status}`);
  }
  return apify(`/datasets/${run.defaultDatasetId}/items?clean=true&format=json`, token);
}

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function workplaceOf(item) {
  const value = item.workplaceTypes;
  if (Array.isArray(value)) return value.join(', ') || null;
  return typeof value === 'string' && value ? value : null;
}

/** The actor's AI search can return non-internships, so keep only listings that say intern. */
function looksLikeInternship(item) {
  const text = `${item.title ?? ''} ${item.employmentType ?? ''} ${item.seniorityLevel ?? ''}`;
  return /intern/i.test(text);
}

const SENIOR_TITLE =
  /\b(senior|sr\.?|staff|principal|director|vp|head of|manager|lead|architect|chief)\b|ph\.?d|\bmba\b/i;

/** Entry-level full-time roles: not an internship, and not a senior or management title. */
function looksLikeEntryLevelJob(item) {
  const title = String(item.title ?? '');
  const type = `${item.employmentType ?? ''}`;
  return !/intern|co-?op/i.test(`${title} ${type}`) && !SENIOR_TITLE.test(title);
}

const matchesMode = (item) => (JOBS_MODE ? looksLikeEntryLevelJob(item) : looksLikeInternship(item));

/** Drops LinkedIn's tracking parameters so the saved link is short and stable. */
function cleanUrl(link) {
  try {
    const url = new URL(String(link));
    url.search = '';
    return url.toString();
  } catch {
    return String(link);
  }
}

function normalise(item) {
  return {
    id: String(item.id),
    title: String(item.title).trim(),
    company: String(item.companyName ?? '').trim(),
    location: String(item.location ?? '').trim(),
    url: cleanUrl(item.link),
    postedAt: toIsoDate(item.postedAt),
    workplaceType: workplaceOf(item),
  };
}

async function main() {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error(
      'Set APIFY_TOKEN (Apify Console → Settings → API & Integrations), e.g.\n' +
        "  APIFY_TOKEN='apify_api_…' npm run scrape:linkedin",
    );
  }
  const sample = process.argv.includes('--sample');

  const { location, keywords } = JSON.parse(await readFile(SEARCHES_URL, 'utf8'));
  const searches = sample ? keywords.slice(0, SAMPLE_SEARCHES) : keywords;
  const urls = searches.map((term) => searchUrl(term, location));
  const items = await runScraper(token, urls, sample ? SAMPLE_JOBS_PER_SEARCH : JOBS_PER_SEARCH);

  if (sample) {
    console.log(`Got ${items.length} raw items. Nothing was saved. First item:`);
    console.log(JSON.stringify(items[0], null, 2)?.slice(0, 2500));
    return;
  }

  const byId = new Map();
  let skipped = 0;
  for (const item of items) {
    if (!item.id || !item.title || !item.link || !matchesMode(item)) {
      skipped += 1;
      continue;
    }
    const job = normalise(item);
    byId.set(job.id, job);
  }

  if (byId.size === 0) {
    throw new Error(`No usable ${LISTING_NAME} in ${items.length} items; kept the existing file.`);
  }
  const jobs = [...byId.values()].sort(
    (a, b) => new Date(b.postedAt ?? 0).getTime() - new Date(a.postedAt ?? 0).getTime(),
  );
  await mkdir(new URL('.', OUT_FILE), { recursive: true });
  await writeFile(
    OUT_FILE,
    JSON.stringify({ scrapedAt: new Date().toISOString(), source: 'LinkedIn', jobs }, null, 2),
  );
  console.log(`Saved ${jobs.length} ${LISTING_NAME} (${skipped} of ${items.length} skipped).`);
}

main().catch((error) => {
  console.error('Apify LinkedIn scrape failed:', error.message);
  process.exitCode = 1;
});
