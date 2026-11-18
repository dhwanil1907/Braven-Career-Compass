import type { LocationFormat, Resource } from '../types';
import { classifyInterests, classifyMajors } from './classify';

/** One internship listing as saved by scripts/scrape-linkedin-apify.mjs. */
export interface LinkedinJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  postedAt: string | null;
  workplaceType: string | null;
}

const SOURCE = 'LinkedIn';
const SOURCE_URL = 'https://www.linkedin.com/jobs/';

function locationFormat(workplaceType: string | null): LocationFormat {
  const text = (workplaceType ?? '').toLowerCase();
  if (text.includes('remote')) return 'Remote';
  if (text.includes('hybrid')) return 'Hybrid';
  return 'In-Person';
}

/**
 * Turns a scraped LinkedIn listing into a catalog Resource. Majors and interests are keyword
 * guesses from the title, so the description tells students to confirm details on LinkedIn.
 */
export function linkedinJobToResource(job: LinkedinJob, scrapedAt: string): Resource {
  const postedNote = job.postedAt ? ` Posted ${job.postedAt.slice(0, 10)}.` : '';
  const place = job.location ? ` in ${job.location}` : '';
  return {
    id: `linkedin-${job.id}`,
    title: job.company ? `${job.title} at ${job.company}` : job.title,
    summary: [job.company, job.location].filter(Boolean).join(' · ') || 'Internship on LinkedIn',
    description:
      `${job.title}${place}.${postedNote} Listed on LinkedIn and collected on ` +
      `${scrapedAt.slice(0, 10)}. Open the LinkedIn posting to confirm it is still open, ` +
      'the requirements and how to apply.',
    whoItsFor: ['Students looking for internships'],
    resourceType: 'Internship',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    url: job.url,
    majors: classifyMajors(job.title),
    interests: classifyInterests(`${job.title} ${job.company}`),
    location: locationFormat(job.workplaceType),
    tags: ['linkedin', 'internship'],
    featured: false,
    isDemo: false,
    scraped: true,
    lastVerified: scrapedAt,
  };
}
