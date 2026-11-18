import type { Resource } from '../types';
import { linkedinJobToResource, selectLinkedinJobs } from '../lib/linkedinJobs';
import type { LinkedinJob } from '../lib/linkedinJobs';
import internshipSnapshot from './scraped/linkedin-internships.json';
import jobSnapshot from './scraped/linkedin-jobs.json';

/**
 * Listings from LinkedIn, collected by `npm run scrape:linkedin` (internships) and
 * `npm run scrape:linkedin:jobs` (entry-level jobs). Each one links back to its LinkedIn posting;
 * the files are empty until the scrapers have been run.
 */
export const LINKEDIN_SCRAPED_AT = internshipSnapshot.scrapedAt;

const internships = selectLinkedinJobs(internshipSnapshot.jobs as LinkedinJob[]).map((job) =>
  linkedinJobToResource(job, internshipSnapshot.scrapedAt, 'Internship'),
);
const jobs = selectLinkedinJobs(jobSnapshot.jobs as LinkedinJob[]).map((job) =>
  linkedinJobToResource(job, jobSnapshot.scrapedAt, 'Job'),
);

export const linkedinResources: Resource[] = [...internships, ...jobs];
