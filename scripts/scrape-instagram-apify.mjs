// Fetches recent posts for every club in instagram-accounts.json through Apify's
// Instagram Post Scraper, so no Instagram login or cookie is needed.
// Run: APIFY_TOKEN='…' npm run scrape:instagram:apify
// Pricing is per post returned (about $2.70 per 1,000 on the free plan); MAX_CHARGE_USD caps a run.
import { loadAccounts, loadExistingPosts, postKey, saveSnapshot } from './instagram-snapshot.mjs';

const ACTOR = 'apify~instagram-post-scraper';
const API = 'https://api.apify.com/v2';
const POSTS_PER_CLUB = 12;
const ONLY_POSTS_NEWER_THAN = '3 months';
const MAX_CHARGE_USD = 1.5;
const FINISHED = new Set(['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT']);

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

async function runScraper(token, handles) {
  const input = {
    username: handles,
    resultsLimit: POSTS_PER_CLUB,
    onlyPostsNewerThan: ONLY_POSTS_NEWER_THAN,
    skipPinnedPosts: false,
    dataDetailLevel: 'basicData',
  };
  const started = await apify(`/acts/${ACTOR}/runs?maxTotalChargeUsd=${MAX_CHARGE_USD}`, token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  let run = started.data;
  console.log(`Started Apify run ${run.id} for ${handles.length} clubs. This takes a few minutes.`);

  while (!FINISHED.has(run.status)) {
    run = (await apify(`/actor-runs/${run.id}?waitForFinish=60`, token)).data;
    console.log(`  status: ${run.status}`);
  }
  if (run.status !== 'SUCCEEDED') {
    throw new Error(`Apify run ${run.id} ended with status ${run.status}`);
  }
  return apify(`/datasets/${run.defaultDatasetId}/items?clean=true&format=json`, token);
}

async function main() {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error(
      'Set APIFY_TOKEN (Apify Console → Settings → API & Integrations), e.g.\n' +
        "  APIFY_TOKEN='apify_api_…' npm run scrape:instagram:apify",
    );
  }

  const accounts = await loadAccounts();
  const hostByHandle = new Map(
    accounts.map((account) => [account.handle.toLowerCase(), account.host]),
  );
  const items = await runScraper(token, accounts.map((account) => account.handle));

  const byKey = new Map((await loadExistingPosts()).map((post) => [postKey(post), post]));
  const countByHandle = new Map();
  for (const item of items) {
    const handle = item.ownerUsername?.toLowerCase();
    const host = handle ? hostByHandle.get(handle) : undefined;
    if (!host || !item.shortCode || !item.caption?.trim() || !item.timestamp) continue;
    const post = {
      handle,
      host,
      shortcode: item.shortCode,
      url: item.url ?? `https://www.instagram.com/p/${item.shortCode}/`,
      caption: item.caption.trim(),
      takenAt: new Date(item.timestamp).toISOString(),
    };
    byKey.set(postKey(post), post);
    countByHandle.set(handle, (countByHandle.get(handle) ?? 0) + 1);
  }

  for (const { handle } of accounts) {
    console.log(`@${handle}: ${countByHandle.get(handle.toLowerCase()) ?? 0} posts`);
  }
  const saved = await saveSnapshot(byKey);
  console.log(`Saved ${saved} posts to src/data/scraped/instagram-posts.json.`);
}

main().catch((error) => {
  console.error('Apify Instagram scrape failed:', error.message);
  process.exitCode = 1;
});
