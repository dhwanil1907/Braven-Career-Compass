import type { Resource } from '../types';
import { linkedinJobToResource, selectLinkedinJobs } from '../lib/linkedinJobs';
import type { LinkedinJob } from '../lib/linkedinJobs';
import snapshot from './scraped/linkedin-internships.json';

/**
 * Internship listings from LinkedIn, collected by `npm run scrape:linkedin`. Each one links back
 * to its LinkedIn posting; the file is empty until the scraper has been run.
 */
export const LINKEDIN_SCRAPED_AT = snapshot.scrapedAt;

export const linkedinResources: Resource[] = selectLinkedinJobs(snapshot.jobs as LinkedinJob[]).map(
  (job) => linkedinJobToResource(job, snapshot.scrapedAt),
);
