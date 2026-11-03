// Shared helpers for the Instagram scrapers: account list and the posts snapshot on disk.
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const ACCOUNTS_URL = new URL('./instagram-accounts.json', import.meta.url);
const OUT_FILE = new URL('../src/data/scraped/instagram-posts.json', import.meta.url);

export async function loadAccounts() {
  const raw = await readFile(ACCOUNTS_URL, 'utf8');
  return JSON.parse(raw);
}

export async function loadExistingPosts() {
  try {
    const raw = await readFile(OUT_FILE, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw new Error(`Could not read ${OUT_FILE.pathname}: ${error.message}`);
  }
}

export const postKey = (post) => `${post.handle}:${post.shortcode}`;

/** Writes posts newest first and returns how many were saved. */
export async function saveSnapshot(postsByKey) {
  const posts = [...postsByKey.values()].sort(
    (a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime(),
  );
  await mkdir(new URL('.', OUT_FILE), { recursive: true });
  await writeFile(
    OUT_FILE,
    JSON.stringify({ scrapedAt: new Date().toISOString(), source: 'Instagram', posts }, null, 2),
  );
  return posts.length;
}
