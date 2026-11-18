import { describe, expect, it } from 'vitest';
import { linkedinJobToResource } from './linkedinJobs';
import type { LinkedinJob } from './linkedinJobs';

const SCRAPED_AT = '2026-11-20T10:00:00.000Z';

const job: LinkedinJob = {
  id: '4012345678',
  title: 'Software Engineering Intern',
  company: 'Acme Robotics',
  location: 'San Jose, CA',
  url: 'https://www.linkedin.com/jobs/view/4012345678',
  postedAt: '2026-11-18T00:00:00.000Z',
  workplaceType: 'Hybrid',
};

describe('linkedinJobToResource', () => {
  it('builds an internship resource that links back to the LinkedIn posting', () => {
    const resource = linkedinJobToResource(job, SCRAPED_AT);
    expect(resource.id).toBe('linkedin-4012345678');
    expect(resource.title).toBe('Software Engineering Intern at Acme Robotics');
    expect(resource.resourceType).toBe('Internship');
    expect(resource.source).toBe('LinkedIn');
    expect(resource.url).toBe(job.url);
    expect(resource.scraped).toBe(true);
    expect(resource.lastVerified).toBe(SCRAPED_AT);
  });

  it('maps the workplace type to a location format', () => {
    expect(linkedinJobToResource(job, SCRAPED_AT).location).toBe('Hybrid');
    expect(linkedinJobToResource({ ...job, workplaceType: 'Remote' }, SCRAPED_AT).location).toBe(
      'Remote',
    );
    expect(linkedinJobToResource({ ...job, workplaceType: 'On-site' }, SCRAPED_AT).location).toBe(
      'In-Person',
    );
    expect(linkedinJobToResource({ ...job, workplaceType: null }, SCRAPED_AT).location).toBe(
      'In-Person',
    );
  });

  it('copes with a missing company and posting date', () => {
    const resource = linkedinJobToResource({ ...job, company: '', postedAt: null }, SCRAPED_AT);
    expect(resource.title).toBe('Software Engineering Intern');
    expect(resource.summary).toBe('San Jose, CA');
    expect(resource.description).not.toContain('Posted');
  });

  it('tells students to confirm details on LinkedIn', () => {
    expect(linkedinJobToResource(job, SCRAPED_AT).description).toContain('LinkedIn');
  });
});
