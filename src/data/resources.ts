import type { Resource } from '../types';
import { sjsuResources } from './sjsuCatalog';
import { MAJORS } from './taxonomy';

const BRAVEN_URL = 'https://bebraven.org/';
const SJSU_URL = 'https://www.sjsu.edu/careercenter/';
const HANDSHAKE_URL = 'https://joinhandshake.com/';
const IDEALIST_URL = 'https://www.idealist.org/';

const curatedResources: Resource[] = [
  {
    id: 'braven-career-accelerator',
    title: 'Braven Career Accelerator Course',
    summary: 'A course that builds the skills, confidence, and network to land a strong first job.',
    description:
      'Braven partners with universities to offer a Career Accelerator course focused on ' +
      'career readiness. Students work in small cohorts on skills like storytelling, ' +
      'networking, and interviewing. Check Braven\'s site for details on partner campuses.',
    whoItsFor: [
      'Undergraduates at partner universities',
      'First-generation college students',
      'Students unsure where to start',
    ],
    resourceType: 'Workshop',
    source: 'Braven',
    sourceUrl: BRAVEN_URL,
    url: BRAVEN_URL,
    majors: MAJORS,
    interests: ['Social Impact', 'Consulting', 'Product Management', 'Marketing'],
    location: 'Hybrid',
    tags: ['career readiness', 'cohort', 'skills'],
    featured: true,
    isDemo: false,
  },
  {
    id: 'braven-leadership-coaching',
    title: 'Braven Leadership Coaching',
    summary: 'Work with a volunteer professional coach who guides a small cohort through ' +
      'career milestones.',
    description:
      'Braven pairs student cohorts with volunteer Leadership Coaches from a range of ' +
      'industries. Coaches offer feedback, accountability, and real-world perspective ' +
      'as students plan their next steps.',
    whoItsFor: ['Braven Fellows', 'Students who want a mentor', 'Career changers'],
    resourceType: 'Mentorship',
    source: 'Braven',
    sourceUrl: BRAVEN_URL,
    url: BRAVEN_URL,
    majors: MAJORS,
    interests: ['Social Impact', 'Human Resources', 'Consulting'],
    location: 'Hybrid',
    tags: ['mentorship', 'coaching', 'feedback'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'braven-professional-network',
    title: 'Braven Professional Network',
    summary: 'Connect with Braven alumni, coaches, and employer partners to grow your network.',
    description:
      'Braven helps students build social capital by connecting them with professionals ' +
      'and employer partners. Building relationships early can open doors to ' +
      'informational interviews, referrals, and internships.',
    whoItsFor: ['Braven Fellows and alumni', 'Students building a network'],
    resourceType: 'Networking',
    source: 'Braven',
    sourceUrl: BRAVEN_URL,
    url: BRAVEN_URL,
    majors: MAJORS,
    interests: ['Social Impact', 'Finance', 'Marketing', 'Software Engineering'],
    location: 'Remote',
    tags: ['networking', 'alumni', 'social capital'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'sjsu-resume-review',
    title: 'SJSU Career Center Resume Review',
    summary: 'Get personalized feedback on your resume and cover letter from SJSU career staff.',
    description:
      'The SJSU Career Center offers resume and cover letter support for students. ' +
      'Advisors can help you tailor your materials to specific roles. Visit the Career ' +
      'Center site for current ways to book a review.',
    whoItsFor: ['SJSU students', 'Anyone applying for internships', 'First-time job seekers'],
    resourceType: 'Resume Help',
    source: 'SJSU Career Center',
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ['Software Engineering', 'Marketing', 'Finance', 'Healthcare'],
    location: 'In-Person',
    tags: ['resume', 'cover letter', 'feedback', 'advising'],
    featured: true,
    isDemo: false,
  },
  {
    id: 'sjsu-mock-interviews',
    title: 'SJSU Mock Interviews',
    summary: 'Practice interviewing and get constructive feedback before the real thing.',
    description:
      'The SJSU Career Center provides mock interview practice so students can rehearse ' +
      'answers and build confidence. Feedback can cover both content and delivery.',
    whoItsFor: ['SJSU students', 'Students with upcoming interviews'],
    resourceType: 'Interview Prep',
    source: 'SJSU Career Center',
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ['Consulting', 'Finance', 'Product Management', 'Human Resources'],
    location: 'In-Person',
    tags: ['interviews', 'practice', 'feedback'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'sjsu-career-fairs',
    title: 'SJSU Career Fairs',
    summary: 'Meet employers recruiting SJSU students for internships and full-time roles.',
    description:
      'The SJSU Career Center hosts career fairs where students can meet recruiters ' +
      'across industries. Prepare your elevator pitch and resume ahead of time. Check ' +
      'the Career Center site for upcoming fair dates.',
    whoItsFor: ['SJSU students', 'Job and internship seekers'],
    resourceType: 'Networking',
    source: 'SJSU Career Center',
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ['Software Engineering', 'Data Science', 'Finance', 'Marketing', 'Healthcare'],
    location: 'In-Person',
    tags: ['career fair', 'recruiters', 'employers'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'sjsu-career-advising',
    title: 'SJSU Career Advising & Exploration',
    summary: 'Meet with a career advisor to explore majors, careers, and next steps.',
    description:
      'Career advisors at SJSU help students connect their interests and strengths to ' +
      'possible career paths. Advising is a good first step if you are undecided or ' +
      'considering a change.',
    whoItsFor: ['Undecided students', 'SJSU students exploring options'],
    resourceType: 'Career Exploration',
    source: 'SJSU Career Center',
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ['Product Management', 'Consulting', 'Human Resources', 'Social Impact'],
    location: 'Hybrid',
    tags: ['advising', 'exploration', 'planning'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'handshake-job-board',
    title: 'Handshake Job & Internship Board',
    summary: 'Search internships and entry-level jobs from employers recruiting college students.',
    description:
      'Handshake is a career platform where students can find jobs, internships, and ' +
      'employer events. Many universities use it for campus recruiting. Complete your ' +
      'profile so employers can find you.',
    whoItsFor: ['College students', 'Recent graduates', 'Internship seekers'],
    resourceType: 'Job',
    source: 'Handshake',
    sourceUrl: HANDSHAKE_URL,
    url: HANDSHAKE_URL,
    majors: MAJORS,
    interests: ['Software Engineering', 'Data Science', 'Marketing', 'Finance', 'UX Design'],
    location: 'Remote',
    tags: ['jobs', 'internships', 'job board', 'recruiting'],
    featured: true,
    isDemo: false,
  },
  {
    id: 'linkedin-learning',
    title: 'LinkedIn Learning Courses',
    summary: 'On-demand video courses on business, technology, and creative skills.',
    description:
      'LinkedIn Learning offers a large library of courses taught by industry experts. ' +
      'Topics range from spreadsheets and project management to design and programming. ' +
      'Some universities and libraries provide free access.',
    whoItsFor: ['Students building job skills', 'Self-paced learners'],
    resourceType: 'Workshop',
    source: 'LinkedIn Learning',
    sourceUrl: 'https://www.linkedin.com/learning/',
    url: 'https://www.linkedin.com/learning/',
    majors: MAJORS,
    interests: ['Marketing', 'Product Management', 'UX Design', 'Human Resources'],
    location: 'Remote',
    tags: ['online courses', 'skills', 'self-paced'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'google-interview-warmup',
    title: 'Google Interview Warmup',
    summary: 'Practice answering interview questions out loud and get AI-powered insights.',
    description:
      'Interview Warmup is a free tool from Google that lets you practice answering ' +
      'common interview questions. It transcribes your answers and highlights patterns ' +
      'to help you improve.',
    whoItsFor: ['Anyone preparing for interviews', 'Students new to interviewing'],
    resourceType: 'Interview Prep',
    source: 'Google',
    sourceUrl: 'https://grow.google/',
    url: 'https://grow.google/certificates/interview-warmup/',
    majors: MAJORS,
    interests: ['Software Engineering', 'Data Science', 'UX Design', 'Marketing'],
    location: 'Remote',
    tags: ['interviews', 'practice', 'free'],
    featured: true,
    isDemo: false,
  },
  {
    id: 'onet-online',
    title: 'O*NET OnLine Career Explorer',
    summary: 'Explore detailed occupation profiles, skills, and related careers.',
    description:
      'O*NET OnLine, sponsored by the U.S. Department of Labor, describes the tasks, ' +
      'skills, and knowledge required for hundreds of occupations. Use it to compare ' +
      'careers and discover related paths.',
    whoItsFor: ['Undecided students', 'Anyone researching careers'],
    resourceType: 'Career Exploration',
    source: 'U.S. Department of Labor',
    sourceUrl: 'https://www.onetonline.org/',
    url: 'https://www.onetonline.org/',
    majors: MAJORS,
    interests: ['Healthcare', 'Human Resources', 'Consulting', 'Social Impact'],
    location: 'Remote',
    tags: ['career research', 'occupations', 'skills'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'bls-occupational-outlook',
    title: 'BLS Occupational Outlook Handbook',
    summary: 'Look up pay, job outlook, and education requirements for hundreds of careers.',
    description:
      'The Occupational Outlook Handbook from the U.S. Bureau of Labor Statistics ' +
      'covers what workers do, typical pay, and projected job growth. It is a reliable ' +
      'starting point for comparing career options.',
    whoItsFor: ['Students comparing careers', 'Anyone curious about salaries'],
    resourceType: 'Career Exploration',
    source: 'U.S. Department of Labor',
    sourceUrl: 'https://www.bls.gov/',
    url: 'https://www.bls.gov/ooh/',
    majors: MAJORS,
    interests: ['Finance', 'Healthcare', 'Data Science', 'Software Engineering'],
    location: 'Remote',
    tags: ['salary data', 'job outlook', 'career research'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'kaggle-learn',
    title: 'Kaggle Learn Micro-Courses',
    summary: 'Free, hands-on micro-courses in Python, SQL, machine learning, and data viz.',
    description:
      'Kaggle Learn offers short, practical courses that run in the browser. They are a ' +
      'quick way to build data skills and start a portfolio of notebooks.',
    whoItsFor: ['Aspiring data scientists', 'Students learning Python or SQL'],
    resourceType: 'Workshop',
    source: 'Kaggle',
    sourceUrl: 'https://www.kaggle.com/',
    url: 'https://www.kaggle.com/learn',
    majors: ['Computer Science', 'Economics', 'Engineering', 'Biology', 'Business'],
    interests: ['Data Science', 'Software Engineering'],
    location: 'Remote',
    tags: ['python', 'sql', 'machine learning', 'free'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'leetcode-practice',
    title: 'LeetCode Coding Interview Practice',
    summary: 'Practice data structures and algorithms problems common in technical interviews.',
    description:
      'LeetCode hosts a large set of coding problems used to prepare for technical ' +
      'interviews. Many problems are free, and community discussions show multiple ' +
      'approaches.',
    whoItsFor: ['CS and engineering students', 'Software internship applicants'],
    resourceType: 'Interview Prep',
    source: 'LeetCode',
    sourceUrl: 'https://leetcode.com/',
    url: 'https://leetcode.com/',
    majors: ['Computer Science', 'Engineering'],
    interests: ['Software Engineering', 'Data Science'],
    location: 'Remote',
    tags: ['coding', 'algorithms', 'technical interviews'],
    featured: false,
    isDemo: false,
  },
  {
    id: 'idealist-social-impact',
    title: 'Idealist Nonprofit Jobs & Internships',
    summary: 'Find jobs, internships, and volunteer roles at nonprofits and mission-driven orgs.',
    description:
      'Idealist lists opportunities with nonprofits and social-impact organizations. It ' +
      'is a strong option for students who want their work to serve a community cause.',
    whoItsFor: ['Students interested in nonprofits', 'Volunteers', 'Social-impact seekers'],
    resourceType: 'Internship',
    source: 'Idealist',
    sourceUrl: IDEALIST_URL,
    url: IDEALIST_URL,
    majors: ['Psychology', 'Communications', 'Business', 'Economics', 'Biology'],
    interests: ['Social Impact', 'Human Resources', 'Marketing'],
    location: 'Hybrid',
    tags: ['nonprofit', 'volunteer', 'social impact'],
    featured: true,
    isDemo: false,
  },
  {
    id: 'usajobs-pathways',
    title: 'USAJOBS Pathways for Students',
    summary: 'Explore federal internships and early-career roles through the Pathways Programs.',
    description:
      'USAJOBS is the official job site of the U.S. federal government. Its Pathways ' +
      'Programs are designed for students and recent graduates interested in public ' +
      'service careers.',
    whoItsFor: ['U.S. citizens in college', 'Recent graduates', 'Public service seekers'],
    resourceType: 'Internship',
    source: 'USAJOBS',
    sourceUrl: 'https://www.usajobs.gov/',
    url: 'https://www.usajobs.gov/',
    majors: MAJORS,
    interests: ['Social Impact', 'Healthcare', 'Finance', 'Data Science'],
    location: 'In-Person',
    tags: ['government', 'federal', 'public service', 'internships'],
    featured: false,
    isDemo: false,
  },
];

/** Hand-written entries first, then the listings scraped from the SJSU Career Center site. */
const curatedIds = new Set(curatedResources.map((resource) => resource.id));
export const resources: Resource[] = [
  ...curatedResources,
  // A hand-written entry wins if a scraped listing has the same id.
  ...sjsuResources.filter((resource) => !curatedIds.has(resource.id)),
];

export function getResourceById(id: string): Resource | undefined {
  return resources.find((resource) => resource.id === id);
}
