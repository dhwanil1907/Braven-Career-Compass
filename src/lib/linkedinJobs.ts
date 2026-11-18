import type { CareerInterest, LocationFormat, Major, Resource } from '../types';

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

interface TagRule {
  pattern: RegExp;
  /** The rule is skipped when the title also matches this, to avoid known false positives. */
  exclude?: RegExp;
  majors: Major[];
  interests?: CareerInterest[];
}

/**
 * Title keyword rules. Every matching rule contributes its tags, and a title that matches nothing
 * stays untagged ("open to everyone") because a wrong tag hides a listing from the right student.
 */
const TAG_RULES: TagRule[] = [
  {
    pattern:
      /software|front-?end|back-?end|full[- ]?stack|devops|distributed systems|firmware|technical staff|product engineering/i,
    majors: ['Computer Science', 'Engineering'],
    interests: ['Software Engineering'],
  },
  {
    pattern: /computer|cyber|\bsecurity\b|robotics|perception|neural|multimodal|graphics/i,
    majors: ['Computer Science'],
  },
  {
    pattern:
      /\bdata\b|analytics|machine learning|\bml\b|(?<!& )\bai\b|agentic|computational|business intelligence/i,
    majors: ['Computer Science', 'Mathematics'],
    interests: ['Data Science'],
  },
  {
    pattern:
      /mechanical|electrical|electromechanical|civil|materials|manufacturing|thermal|mechatronics|automation|optical|hardware (engineer|development)|systems engineering|robotics|displays engineer|engineering division|power electronics|transportation|\bengineer(ing)?\b/i,
    majors: ['Engineering'],
  },
  {
    pattern: /finance|financial|fp&a|\bfraud\b|\brisk\b/i,
    majors: ['Business', 'Economics', 'Accounting'],
    interests: ['Finance'],
  },
  { pattern: /accounting|audit|\btax\b/i, majors: ['Accounting', 'Business'], interests: ['Finance'] },
  {
    pattern: /marketing|brand|influencer|social media|\bgrowth\b/i,
    majors: ['Marketing', 'Business', 'Communications'],
    interests: ['Marketing'],
  },
  {
    pattern: /content|video|editorial|copywrit/i,
    majors: ['Communications'],
    interests: ['Writing and Content'],
  },
  {
    pattern: /business (analy|operations|undergraduate)|strategy|strategic|supply chain/i,
    majors: ['Business'],
  },
  {
    pattern: /strategy|strategic (?!finance)|consult/i,
    majors: ['Business', 'Economics'],
    interests: ['Consulting'],
  },
  {
    pattern: /product manage|program manage/i,
    majors: ['Business', 'Computer Science'],
    interests: ['Product Management'],
  },
  {
    pattern:
      /human resources|\bhr\b|people (products|operations|partner|team)|talent (acquisition|sourcing)|recruiter|recruit(ing|ment)|learning and development/i,
    exclude: /area manager|operations manager|recruitment program/i,
    majors: ['Psychology', 'Business', 'Sociology'],
    interests: ['Human Resources'],
  },
  {
    pattern: /\bux\b|\bui\b|user research|human[- ](computer|machine) interaction/i,
    majors: ['Psychology', 'Design'],
    interests: ['UX Design'],
  },
  { pattern: /product design/i, majors: ['Design'], interests: ['UX Design'] },
  { pattern: /graphic design|creative|illustrat/i, majors: ['Design', 'Art'] },
  { pattern: /\bart\b|animation/i, majors: ['Art', 'Design'], interests: ['Arts and Culture'] },
  {
    pattern: /biolog|biotech|\blab\b|laboratory|genom|sequencing|clinical (research|scientist)/i,
    majors: ['Biology'],
    interests: ['Research and Academia'],
  },
  { pattern: /chemi|clinical scientist|\bbioprocess/i, majors: ['Chemistry'] },
  {
    pattern: /clinical|(?<!mental )health|medical|patient/i,
    majors: ['Public Health'],
    interests: ['Healthcare'],
  },
  {
    pattern: /nutrition|dietit|kinesiolog|fitness/i,
    majors: ['Nutrition and Kinesiology', 'Public Health'],
    interests: ['Healthcare'],
  },
  {
    pattern: /health economics|heor/i,
    majors: ['Public Health', 'Economics'],
    interests: ['Healthcare'],
  },
  {
    pattern: /\bESH\b|environment(al)?,? (health|safety)/i,
    majors: ['Environmental Science', 'Public Health'],
  },
  {
    pattern: /psycholog|behavioral (health|science|research)|human behavior|counsel(or|ing)|mental health/i,
    majors: ['Psychology'],
    interests: ['Counseling and Social Services'],
  },
  {
    pattern:
      /mental health|social work|case manag|nonprofit|non-profit|outreach|social services|family services|victim|patient advocate|youth advocate|community (outreach|health|organi[sz]|services|program)/i,
    majors: ['Social Work', 'Sociology'],
    interests: ['Social Impact', 'Community Organizing'],
  },
  {
    pattern: /policy|government|council|legislat|city of|public affairs/i,
    majors: ['Political Science'],
    interests: ['Public Policy and Government'],
  },
  {
    pattern: /education|teach|tutor|youth|instruction|curriculum/i,
    exclude: /medical education|continuing education/i,
    majors: ['Education'],
    interests: ['Education and Teaching'],
  },
  {
    pattern: /legal|paralegal|law clerk|criminal|justice|attorney/i,
    majors: ['Criminology', 'Political Science'],
    interests: ['Law and Legal'],
  },
  {
    pattern: /journalis|public relations|\bpr\b|communications|editorial|newsroom|reporter/i,
    majors: ['Journalism', 'Communications', 'English'],
    interests: ['Journalism and Media'],
  },
  {
    pattern: /sustainab|environment|climate/i,
    majors: ['Environmental Science'],
    interests: ['Sustainability'],
  },
  {
    pattern: /\bphd\b|research scientist|research intern/i,
    majors: [],
    interests: ['Research and Academia'],
  },
];

/** Tags a listing from its title alone. Exported for tests. */
export function tagLinkedinTitle(title: string): { majors: Major[]; interests: CareerInterest[] } {
  const majors = new Set<Major>();
  const interests = new Set<CareerInterest>();
  for (const rule of TAG_RULES) {
    if (!rule.pattern.test(title) || rule.exclude?.test(title)) continue;
    rule.majors.forEach((major) => majors.add(major));
    rule.interests?.forEach((interest) => interests.add(interest));
  }
  return { majors: [...majors], interests: [...interests] };
}

/** Graduate-only programs most SJSU students cannot apply to. */
const GRADUATE_ONLY_TITLE = /\bph\.?d\b|\bmba\b/i;

const dedupeKey = (job: LinkedinJob) => `${job.title}|${job.company}`.toLowerCase().replace(/\s+/g, ' ');

/**
 * Drops PhD/MBA-only listings and repeat postings of the same title at the same company (the
 * scraper returns one per city). The first occurrence wins, and the snapshot is newest first.
 */
export function selectLinkedinJobs(jobs: LinkedinJob[]): LinkedinJob[] {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    if (GRADUATE_ONLY_TITLE.test(job.title)) return false;
    const key = dedupeKey(job);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
export function linkedinJobToResource(
  job: LinkedinJob,
  scrapedAt: string,
  kind: 'Internship' | 'Job' = 'Internship',
): Resource {
  const postedNote = job.postedAt ? ` Posted ${job.postedAt.slice(0, 10)}.` : '';
  const place = job.location ? ` in ${job.location}` : '';
  const { majors, interests } = tagLinkedinTitle(job.title);
  return {
    id: `linkedin-${job.id}`,
    title: job.company ? `${job.title} at ${job.company}` : job.title,
    summary: [job.company, job.location].filter(Boolean).join(' · ') || `${kind} on LinkedIn`,
    description:
      `${job.title}${place}.${postedNote} Listed on LinkedIn and collected on ` +
      `${scrapedAt.slice(0, 10)}. Open the LinkedIn posting to confirm it is still open, ` +
      'the requirements and how to apply.',
    whoItsFor: [kind === 'Job' ? 'Graduates looking for entry-level jobs' : 'Students looking for internships'],
    resourceType: kind,
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    url: job.url,
    majors,
    interests,
    location: locationFormat(job.workplaceType),
    tags: ['linkedin', kind.toLowerCase()],
    featured: false,
    isDemo: false,
    scraped: true,
    lastVerified: scrapedAt,
  };
}
