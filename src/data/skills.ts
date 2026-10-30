import type { CareerInterest, Major } from '../types';

export interface Skill {
  name: string;
  why: string;
  /** Term used to search the resource catalog for ways to build this skill. */
  searchTerm: string;
}

/**
 * General guidance on skills commonly asked for in entry-level roles in each field. This is
 * editorial content, not live labor-market data, and the UI labels it that way.
 */
export const SKILLS_BY_INTEREST: Record<CareerInterest, Skill[]> = {
  'Software Engineering': [
    { name: 'Programming fundamentals', why: 'Every technical screen starts here.', searchTerm: 'coding' },
    { name: 'Algorithms and problem solving', why: 'Shows up in most coding interviews.', searchTerm: 'algorithms' },
    { name: 'SQL and databases', why: 'Most products store and query data.', searchTerm: 'sql' },
    { name: 'Explaining your thinking', why: 'Interviewers hire people they can follow.', searchTerm: 'interviews' },
  ],
  'Data Science': [
    { name: 'Python', why: 'The common language for analysis and modeling.', searchTerm: 'python' },
    { name: 'SQL', why: 'Analysts spend much of their day pulling data.', searchTerm: 'sql' },
    { name: 'Data visualization', why: 'Insights only matter if others can see them.', searchTerm: 'dashboards' },
    { name: 'Analytics and statistics', why: 'Lets you tell signal from noise.', searchTerm: 'analytics' },
  ],
  'Product Management': [
    { name: 'Product thinking', why: 'Deciding what to build and why.', searchTerm: 'product' },
    { name: 'User research', why: 'Grounds decisions in what people need.', searchTerm: 'user research' },
    { name: 'Roadmapping and prioritizing', why: 'Turns ideas into a plan.', searchTerm: 'roadmap' },
    { name: 'Working across teams', why: 'PMs lead through influence, not authority.', searchTerm: 'networking' },
  ],
  Marketing: [
    { name: 'Social media and content', why: 'Entry-level roles often start in channels.', searchTerm: 'social media' },
    { name: 'Campaign analytics', why: 'Employers want results you can measure.', searchTerm: 'analytics' },
    { name: 'Writing', why: 'Clear copy is useful in every marketing job.', searchTerm: 'writing' },
    { name: 'Audience and campaign planning', why: 'Connects the message to who needs it.', searchTerm: 'campaigns' },
  ],
  Finance: [
    { name: 'Financial modeling', why: 'The core technical skill in many analyst roles.', searchTerm: 'modeling' },
    { name: 'Spreadsheets and reporting', why: 'Daily work in almost every finance team.', searchTerm: 'reporting' },
    { name: 'Data analysis', why: 'Supports decisions with evidence.', searchTerm: 'analytics' },
    { name: 'Interview preparation', why: 'Finance recruiting is structured and competitive.', searchTerm: 'interviews' },
  ],
  Consulting: [
    { name: 'Structured problem solving', why: 'Case interviews test how you break problems down.', searchTerm: 'case' },
    { name: 'Data analysis', why: 'Backs recommendations with numbers.', searchTerm: 'analytics' },
    { name: 'Communication', why: 'Clients buy clear thinking, clearly presented.', searchTerm: 'interviews' },
    { name: 'Networking', why: 'Recruiting often runs through people.', searchTerm: 'networking' },
  ],
  'UX Design': [
    { name: 'User research', why: 'Designs start with understanding people.', searchTerm: 'user research' },
    { name: 'Prototyping', why: 'Lets you test ideas before they are built.', searchTerm: 'prototyping' },
    { name: 'Usability testing', why: 'Proves a design works.', searchTerm: 'usability' },
    { name: 'Portfolio storytelling', why: 'Your portfolio is your resume.', searchTerm: 'portfolio' },
  ],
  Healthcare: [
    { name: 'Hands-on exposure', why: 'Clinical or research experience strengthens any application.', searchTerm: 'research' },
    { name: 'Healthcare knowledge', why: 'Shows you understand the field you are entering.', searchTerm: 'healthcare' },
    { name: 'Volunteering', why: 'Builds experience and references.', searchTerm: 'volunteer' },
    { name: 'Pre-health planning', why: 'Timelines and requirements matter early.', searchTerm: 'pre-health' },
  ],
  'Human Resources': [
    { name: 'Recruiting basics', why: 'The most common way into HR.', searchTerm: 'recruiting' },
    { name: 'Onboarding and people operations', why: 'How new hires become productive.', searchTerm: 'onboarding' },
    { name: 'Giving feedback', why: 'Core to coaching and employee relations.', searchTerm: 'feedback' },
    { name: 'Reporting', why: 'People analytics is a growing need.', searchTerm: 'reporting' },
  ],
  'Social Impact': [
    { name: 'Volunteer and program experience', why: 'Mission-driven employers value it.', searchTerm: 'volunteer' },
    { name: 'Nonprofit knowledge', why: 'Understand funding and how organizations work.', searchTerm: 'nonprofit' },
    { name: 'Community outreach', why: 'Core to most programs.', searchTerm: 'outreach' },
    { name: 'Writing', why: 'Grants, reports and stories all depend on it.', searchTerm: 'writing' },
  ],
  'Education and Teaching': [
    { name: 'Lesson and program design', why: 'Teaching roles start with planning learning.', searchTerm: 'teaching' },
    { name: 'Tutoring or mentoring experience', why: 'Shows you can work with learners.', searchTerm: 'tutoring' },
    { name: 'Classroom communication', why: 'Clear explanations matter in every setting.', searchTerm: 'communication' },
    { name: 'Credential pathways', why: 'Know the steps to a teaching credential.', searchTerm: 'education' },
  ],
  'Public Policy and Government': [
    { name: 'Policy writing', why: 'Memos and briefs are the core product.', searchTerm: 'policy' },
    { name: 'Research and data literacy', why: 'Policy claims rest on evidence.', searchTerm: 'research' },
    { name: 'Civic and public-sector knowledge', why: 'Know how agencies and legislatures work.', searchTerm: 'government' },
    { name: 'Public speaking', why: 'Testimony and briefings are routine.', searchTerm: 'speaking' },
  ],
  'Law and Legal': [
    { name: 'Legal research and writing', why: 'The basic daily skill in legal work.', searchTerm: 'legal' },
    { name: 'Critical reading', why: 'Contracts and statutes demand close reading.', searchTerm: 'reading' },
    { name: 'Argument and debate', why: 'Builds persuasive reasoning.', searchTerm: 'debate' },
    { name: 'Professional networking', why: 'Many legal roles come through referrals.', searchTerm: 'networking' },
  ],
  'Journalism and Media': [
    { name: 'Reporting and interviewing', why: 'The core of newsroom work.', searchTerm: 'journalism' },
    { name: 'Editing and fact-checking', why: 'Accuracy builds trust with editors.', searchTerm: 'editing' },
    { name: 'Portfolio of clips', why: 'Editors hire from published work.', searchTerm: 'portfolio' },
    { name: 'Multimedia basics', why: 'Audio, video and social are part of most roles.', searchTerm: 'media' },
  ],
  'Nonprofit Management': [
    { name: 'Program coordination', why: 'Keeps services running on time.', searchTerm: 'program' },
    { name: 'Fundraising and grant basics', why: 'Funding shapes what a nonprofit can do.', searchTerm: 'nonprofit' },
    { name: 'Volunteer management', why: 'Many programs run on volunteers.', searchTerm: 'volunteer' },
    { name: 'Budgeting', why: 'Small teams need people who track money.', searchTerm: 'budget' },
  ],
  'Research and Academia': [
    { name: 'Research methods', why: 'The base for any study or thesis.', searchTerm: 'research' },
    { name: 'Academic writing', why: 'Papers and proposals are how work is shared.', searchTerm: 'writing' },
    { name: 'Data analysis', why: 'Most fields now analyze data.', searchTerm: 'analytics' },
    { name: 'Graduate school planning', why: 'Applications have long lead times.', searchTerm: 'graduate school' },
  ],
  'Arts and Culture': [
    { name: 'Portfolio building', why: 'Arts employers look at your work first.', searchTerm: 'portfolio' },
    { name: 'Arts administration', why: 'Galleries and theaters need organizers.', searchTerm: 'arts' },
    { name: 'Audience outreach', why: 'Attendance and funding follow engagement.', searchTerm: 'outreach' },
    { name: 'Grant writing', why: 'Many arts organizations run on grants.', searchTerm: 'grant' },
  ],
  'Community Organizing': [
    { name: 'Relationship building', why: 'Organizing starts with one-to-one conversations.', searchTerm: 'organizing' },
    { name: 'Event and campaign planning', why: 'Turns interest into action.', searchTerm: 'campaign' },
    { name: 'Public speaking', why: 'Mobilizing people means speaking to groups.', searchTerm: 'speaking' },
    { name: 'Cultural competence', why: 'Trust depends on understanding the community.', searchTerm: 'community' },
  ],
  'Sustainability': [
    { name: 'Environmental literacy', why: 'Know the issues behind the work.', searchTerm: 'sustainability' },
    { name: 'Data and reporting', why: 'Impact has to be measured.', searchTerm: 'reporting' },
    { name: 'Project coordination', why: 'Programs need steady organizers.', searchTerm: 'program' },
    { name: 'Policy awareness', why: 'Regulation shapes the field.', searchTerm: 'policy' },
  ],
  'Counseling and Social Services': [
    { name: 'Active listening', why: 'The foundation of helping work.', searchTerm: 'counseling' },
    { name: 'Case documentation', why: 'Accurate records are required in service roles.', searchTerm: 'case management' },
    { name: 'Boundaries and self-care', why: 'Prevents burnout in helping professions.', searchTerm: 'wellness' },
    { name: 'Licensure pathways', why: 'Know the steps and supervised hours required.', searchTerm: 'social work' },
  ],
  'Writing and Content': [
    { name: 'Writing samples', why: 'Hiring managers ask to see your writing.', searchTerm: 'writing' },
    { name: 'Editing', why: 'Strong writers revise well.', searchTerm: 'editing' },
    { name: 'Audience awareness', why: 'Content must fit who reads it.', searchTerm: 'content' },
    { name: 'Social and digital publishing', why: 'Most content roles publish online.', searchTerm: 'social media' },
  ],
};

/** Used when a student picked a major but no interests. */
export const DEFAULT_INTEREST_BY_MAJOR: Record<Major, CareerInterest> = {
  'Computer Science': 'Software Engineering',
  'Business': 'Consulting',
  'Engineering': 'Data Science',
  'Psychology': 'Human Resources',
  'Communications': 'Marketing',
  'Biology': 'Healthcare',
  'Economics': 'Finance',
  'Design': 'UX Design',
  'Chemistry': 'Research and Academia',
  'Mathematics': 'Data Science',
  'Environmental Science': 'Sustainability',
  'Accounting': 'Finance',
  'Marketing': 'Marketing',
  'Sociology': 'Community Organizing',
  'Political Science': 'Public Policy and Government',
  'Anthropology': 'Research and Academia',
  'Public Health': 'Healthcare',
  'Criminology': 'Law and Legal',
  'English': 'Writing and Content',
  'History': 'Research and Academia',
  'Philosophy': 'Law and Legal',
  'Journalism': 'Journalism and Media',
  'Liberal Studies': 'Education and Teaching',
  'Art': 'Arts and Culture',
  'Music': 'Arts and Culture',
  'Theatre': 'Arts and Culture',
  'Education': 'Education and Teaching',
  'Social Work': 'Counseling and Social Services',
  'Nutrition and Kinesiology': 'Healthcare',
  'Undecided / Exploring': 'Social Impact',
};
