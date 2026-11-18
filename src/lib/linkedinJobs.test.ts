import { describe, expect, it } from 'vitest';
import { linkedinJobToResource, selectLinkedinJobs, tagLinkedinTitle } from './linkedinJobs';
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

  it('tags computing titles as Computer Science but not other engineering titles', () => {
    const majorsFor = (title: string) => linkedinJobToResource({ ...job, title }, SCRAPED_AT).majors;
    expect(majorsFor('Software Engineering Intern')).toContain('Computer Science');
    expect(majorsFor('Data Science Intern')).toContain('Computer Science');
    expect(majorsFor('Mechanical Engineering Intern')).toContain('Engineering');
    expect(majorsFor('Mechanical Engineering Intern')).not.toContain('Computer Science');
    expect(majorsFor('Electrical Engineering Intern')).not.toContain('Computer Science');
  });

  it('tells students to confirm details on LinkedIn', () => {
    expect(linkedinJobToResource(job, SCRAPED_AT).description).toContain('LinkedIn');
  });

  describe('selectLinkedinJobs', () => {
    it('drops PhD and MBA listings', () => {
      const jobs = [
        { ...job, id: '1', title: 'Research Scientist Intern (PhD)' },
        { ...job, id: '2', title: 'Summer 2027: MBA Strategy Intern' },
        { ...job, id: '3', title: 'Marketing Intern' },
      ];
      expect(selectLinkedinJobs(jobs).map((item) => item.id)).toEqual(['3']);
    });

    it('keeps one posting of the same title at the same company', () => {
      const jobs = [
        { ...job, id: '1', location: 'San Jose, CA' },
        { ...job, id: '2', location: 'Santa Clara, CA' },
        { ...job, id: '3', company: 'Other Co' },
      ];
      expect(selectLinkedinJobs(jobs).map((item) => item.id)).toEqual(['1', '3']);
    });
  });

  describe('tagLinkedinTitle', () => {
    it('tags software engineering with Computer Science and Engineering', () => {
      const tags = tagLinkedinTitle('Software Engineer Intern');
      expect(tags.majors).toContain('Computer Science');
      expect(tags.interests).toContain('Software Engineering');
    });

    it('keeps Computer Science off mechanical engineering', () => {
      const tags = tagLinkedinTitle('Mechanical Engineering Intern');
      expect(tags.majors).toEqual(['Engineering']);
    });

    it('tags human resources with Psychology and the Human Resources interest', () => {
      const tags = tagLinkedinTitle('Human Resources Intern');
      expect(tags.majors).toContain('Psychology');
      expect(tags.interests).toContain('Human Resources');
    });

    it('does not read "Recruitment Program" as an HR role', () => {
      const tags = tagLinkedinTitle('Research Scientist Intern - Tech Recruitment Program (PHD)');
      expect(tags.interests).not.toContain('Human Resources');
    });

    it('tags marketing, public health and UX titles', () => {
      expect(tagLinkedinTitle('Marketing Intern').majors).toContain('Marketing');
      expect(tagLinkedinTitle('Public Health Intern').majors).toContain('Public Health');
      expect(tagLinkedinTitle('UX Research Intern').majors).toEqual(
        expect.arrayContaining(['Psychology', 'Design']),
      );
    });

    it('keeps mental health out of Public Health', () => {
      const tags = tagLinkedinTitle('Mental Health Intern');
      expect(tags.majors).toContain('Psychology');
      expect(tags.majors).not.toContain('Public Health');
    });

    it('leaves generic titles untagged', () => {
      expect(tagLinkedinTitle('Operations Intern')).toEqual({ majors: [], interests: [] });
      expect(tagLinkedinTitle('Intern')).toEqual({ majors: [], interests: [] });
    });

    it('feeds the resource majors and interests', () => {
      const resource = linkedinJobToResource({ ...job, title: 'Finance Intern' }, SCRAPED_AT);
      expect(resource.majors).toContain('Accounting');
      expect(resource.interests).toContain('Finance');
    });
  });
});
