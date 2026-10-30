# Career Compass: What Each Page and Section Does

A reference for every page and section of the website, written for teammates, judges and anyone who needs to explain or demo it. Everything runs in the browser with demo data and no login.

## What this website is for

Career Compass helps Braven graduates (Post-Accelerator Fellows) discover, trust and act on relevant career opportunities after the Accelerator course ends.

Braven already offers coaching, mentorship, career communities, events and its MyBraven platform. The problem is not a lack of resources. Braven's own figures show many Fellows do not use them consistently:

| Braven-provided figure | Value |
| --- | --- |
| Fellows who have joined the Professional Mentor Program | 11% |
| Fellows who have had a career coaching conversation | 13.9% |
| Career Community event RSVPs that became attendance (Fall 2025, Spring 2026) | about 46% to 53% |
| Fellows who logged into MyBraven in each of two 2026 reporting periods | about 15% to 25% |
| MyBraven sessions on desktop | about 75% to 80% |

These measure different things and should not be combined. Why Fellows do not engage is still a set of hypotheses (awareness, relevance, knowing what to do next, trust, time, follow-through). Our student surveys and usability tests are meant to show which matter most.

## Why this, when Braven already has its own website

Braven's websites do different jobs from ours, and Career Compass is meant to complement them, not replace them.

| Existing site | What it is for | The gap Career Compass addresses |
| --- | --- | --- |
| braven.org | Tells Braven's story to the public, partners and donors. | It is not a tool a Fellow uses to decide what to do next. |
| MyBraven | Braven's existing web and mobile platform for its programs. | We are not claiming it fails. Our hypothesis is that Fellows still need help finding what is relevant to them and following through. |
| Handshake, school career centers | Large job boards and campus services. | They are generic and know nothing about a Fellow's Braven coaching, mentorship and communities. |

Career Compass does not create new career resources. It makes existing ones easier to find, more relevant to each student and easier to act on, and it could later connect with MyBraven. What is new is the combination: one place that gathers resources from several sources, personalizes them, turns them into a next step, and tracks follow-through.

## Our clear features

1. **Three-question onboarding.** Major, year, goal, interests and biggest challenge. No account.
2. **One clear next action.** The most prominent thing on My Journey is the single step the student should do now, with a reason and a link.
3. **Personal roadmap.** Up to five steps built by transparent rules from the student's goal and challenge, each linked to a real item in the catalog. Steps can be checked off and progress is saved.
4. **Skills to build for their field.** Skills for the student's interests (or major), each linked to matching resources.
5. **Search and filters that work.** Across resources from Braven, SJSU Career Center, Handshake, Idealist and others, filtered by major, interest, type and location.
6. **Personalized recommendations with reasons.** Every match says why it fits (for example "Computer Science major").
7. **Unified events calendar.** List and month views, filters by type and format, and saved events.
8. **Add to calendar.** One-click Google Calendar link and a downloadable `.ics` file with a one-day-before reminder.
9. **Event preparation tips.** Short tips for each event type, shown before the student registers.
10. **Resource-aware assistant ("Ask Compass").** Answers from the catalog only, links to real items, separates general advice from catalog results, and says so when it has nothing. It is a labeled demo, not live AI.
11. **Save and track.** Bookmarks, saved events, deadlines and a timeline on My Progress.
12. **Honest labeling.** Fictional listings carry a "Demo" badge, every resource shows its source, and unverified entries say so.
13. **Dark and light mode, responsive layout.** Follows the system setting and works on desktop and phone.

Not built yet: email or text reminders, email alerts for new opportunities, alumni success stories, and a connection to MyBraven. See "Data and honest limits" at the bottom.

## Overview

| Section | Address | What a student does there |
| --- | --- | --- |
| My Journey | `/` | Gets a personal plan and one clear next action. New visitors see a landing page first. |
| Explore | `/resources` | Searches and filters every resource, then opens a detail page. |
| Events | `/events` | Browses events as a list or calendar, saves them and adds them to a calendar. |
| My Progress | `/progress` | Ticks off roadmap steps, edits the profile, and reviews saved items and deadlines. |
| Onboarding | `/start` | Answers three questions that build the plan. Reached from the landing page or "Edit". |

Typical path: answer three questions, see the next action on My Journey, open the linked resource or event, mark the step done, and return to My Progress to see what is left.

---

## My Journey (`/`)

`/` shows one of two pages depending on whether the student has finished onboarding.

### Landing page (new visitors)

| Section | What it does |
| --- | --- |
| Hero | Headline, a "For Braven Post-Accelerator Fellows" badge and the two main actions. |
| Build my plan | Goes to the 3-step onboarding. |
| Try Maya's demo journey | Fills in a sample profile (Computer Science, third year, first internship) and opens the personal journey. For demos only. |
| Search bar | Searches all resources and opens Explore with the results. |
| Popular searches | Shortcut chips (Internships, Resume, Data Science, Networking) that open Explore. |
| Stats | Live counts of resources, upcoming events and sources, read from the data. |
| Quick-access cards | Four shortcuts: Jobs & Internships, Career Events, Resume & Interview Resources, Mentorship. |
| Featured career resources | Resources flagged as featured. |
| Upcoming events | The next four events. |
| Recommended for you | Picks matched to the profile, or a prompt to build a plan if there is none. |
| Demo-data notice | States that items marked "Demo" are fictional samples. |

### Onboarding (`/start`)

Three steps with a progress bar. "Continue" stays disabled until the required answers are chosen, and "Back" returns to the previous step.

| Step | Questions | Required |
| --- | --- | --- |
| 1. Tell us about you | Major, year in school | Both |
| 2. Where do you want to go? | Main goal, field interests (up to 3) | Goal only |
| 3. What is in your way? | Biggest challenge | Yes |

"Build my plan" saves the answers and opens My Journey. Returning later via "Edit" shows the saved answers pre-selected.

### Personal journey page (after onboarding)

| Section | What it does |
| --- | --- |
| Profile chips and Edit | Shows major, year and goal. "Edit" reopens onboarding. |
| Your next action | The largest element on the page: the first roadmap step not yet done, why it matters and the name of the linked item. |
| Open resource / View event | Opens the item the step links to. |
| Mark as done | Completes the step; the next one takes its place. When all steps are done the page says so and offers "Set a new goal". |
| Your roadmap | Up to five steps with a progress bar ("2 of 5 steps done"). Each step has a checkbox, a reason and a link to a real item. |
| Skills to build | Skills for the student's field with a reason and the number of catalog resources that cover each. See below. |
| Events that fit you | Up to three upcoming events matched to the profile that are not already in the roadmap. Opens the event details. |
| More picks for you | Up to three resources matched to the profile, with the reasons they match. |

#### Skills to build

Shows up to two fields, taken from the student's interests, or the default field for their major if none were chosen. Each field has four skills. A skill links to Explore, searching the catalog for that skill, and shows how many resources match. A skill with no match says "No catalog resources yet". The lists are general guidance, not live job-market data, and the page says so.

---

## Explore (`/resources`)

| Section | What it does |
| --- | --- |
| Search | Matches title, summary, description, source, type, tags, majors and interests. All words must match. |
| Filters | Major, career interest, resource type and location (Remote, Hybrid, In-Person). They combine with search. |
| Result cards | Type badge, title, summary, source, location, tags, why it matches the profile, "View Resource" and a bookmark button. |
| Empty state | Shown when nothing matches, with a way to clear filters. |

### Resource detail (`/resources/:id`)

| Section | What it does |
| --- | --- |
| Header | Title, type, source, location, deadline with a countdown, a "Demo" badge on fictional listings, and a bookmark. |
| About this resource | The full description. |
| Why it may be relevant to you | Lists which parts of the profile match, or prompts the student to complete the profile. Also shows the source and verification status (see limits). |
| Who it's useful for | The audiences the resource suits. |
| Relevant majors and interests | The majors and interests it is tagged for. |
| Source link | Goes to the official site. |
| Related resources | Other resources that share interests or type. |

---

## Events (`/events`)

| Section | What it does |
| --- | --- |
| Search and filters | Search plus event type (Workshop, Networking, Career Fair, Info Session, Panel) and format (Virtual, In-Person, Hybrid). |
| Saved only | Limits the list to saved events. |
| List view | Upcoming events grouped by month, with a date tile, time, host and bookmark. |
| Calendar view | A month grid with events colored by type; clicking one opens its details. |
| Event details window | Date, time, location, host, tags, a demo notice, and the actions below. |
| How to prepare | Two short tips based on the event type. |
| Visit host website | Opens the host's page to register. |
| Google Calendar | Opens a prefilled Google Calendar entry. |
| Download .ics | Saves a file for Apple, Outlook or any calendar. It includes a reminder one day before. |
| Save | Bookmarks the event. |

Links like `/events?event=<id>` open that event's details directly. The roadmap and the assistant use them.

---

## My Progress (`/progress`)

| Section | What it does |
| --- | --- |
| Header stats | Saved resources, saved events, deadlines in the next 30 days, and the number of recommended matches. |
| Career milestones | The same roadmap as My Journey, with the same checkboxes. Progress is shared between the two pages. |
| Profile | Edit major and interests, or reset. Year, goal and challenge are changed through "Edit" on My Journey. |
| Recommended resources and events | Matches for the profile. |
| Saved items | Tabs for saved resources and saved events, with "clear all". The navbar's bookmark link jumps here. |
| Upcoming events & deadlines | A timeline of saved events and resource deadlines, or the next ones overall if nothing is saved. Rows are labeled "Today", "Tomorrow" or "In N days". |

---

## On every page

| Feature | What it does |
| --- | --- |
| Navigation bar | Links to the four sections, a saved-items counter that opens My Progress, and a menu on small screens. |
| Dark / light toggle | Follows the system setting on first visit, then remembers the choice. |
| Ask Compass | A floating chat in the bottom-left corner. See below. |
| Footer | Links, and a note that this is a student capstone prototype and not an official product of Braven, SJSU or Handshake. |
| Not-found page | Shown for unknown addresses, with a way back. |
| `/dashboard` | Redirects to `/progress`. |

### Ask Compass (assistant)

A demo assistant, labeled "Demo mode: not a live AI". It is not a language model. It finds topics in the question (internships, jobs, resumes, interviews, networking, mentors, events, exploring, skills) and builds an answer from the catalog.

| Part of an answer | Source |
| --- | --- |
| General advice | A short fixed tip per topic, labeled as general advice. |
| From the catalog | Resources from the dataset, best matches for the profile first. |
| Upcoming events | Events from the dataset that match the profile. |

It can only link to items that exist in the data. When nothing matches, it says so instead of guessing. It has three suggested questions, closes with Escape, and announces new answers to screen readers.

---

## How the logic works

| Feature | Rule |
| --- | --- |
| Recommendations | Major match +3, each interest match +2, featured items +1. Items scoring 0 are not recommended. Events must still be upcoming. |
| Roadmap | The goal picks a sequence of up to five steps, for example: resume, internships, event, mentor, interview. The biggest challenge moves its related steps to the front. Each step picks the best catalog item: real entries before demo ones, then by profile match, then featured, then title. A step with nothing to link to is dropped. |
| Next action | The first roadmap step not marked done. |
| Skills | Fixed lists per career interest, with a default field per major. Resource counts come from searching the catalog. |
| Assistant | Keyword topic detection, then catalog lookup, as described above. |
| Calendar export | Builds a Google Calendar link and a standard `.ics` file from the event data. |

### What is saved in the browser

Nothing leaves the device. There is no account or server.

| Key | Contents |
| --- | --- |
| `bcc:profile:v2` | Major, year, goal, challenge, interests, and whether onboarding is finished. |
| `bcc:completedSteps` | Roadmap steps marked done. |
| `bcc:savedResources` | Bookmarked resources. |
| `bcc:savedEvents` | Bookmarked events. |
| `theme` | Dark or light choice. |

---

## Data and honest limits

| Item | Status |
| --- | --- |
| Resources | 39 entries: 16 real organizations and links, 23 fictional "Demo" listings. |
| Events | 24 entries, all fictional demo events. Dates are generated relative to today. |
| Verification dates | The field exists, but no entry has been verified by staff yet. The resource page says "Not yet verified" for real entries and "Demo listing" for fictional ones. |
| Assistant | Rule-based, not live AI. A real model would need a small backend to keep its key private. |
| Reminders | Only the `.ics` one-day-before alert. No email or text reminders. |
| Email alerts | Not built. Needs a backend or an email service. |
| Skills lists | Editorial guidance written by the team. They should be reviewed by Braven staff. |
| Fields covered | 8 majors and 10 interests, which lean toward technical and business fields. Liberal arts and social science are not yet covered. |
| Not built | Alumni success stories, usability metrics, a "how did you hear about us" question. |
| Student findings | None are included. Real survey and testing results must be added separately. |

The data lives in `src/data/` (`resources.ts`, `events.ts`, `skills.ts`, `taxonomy.ts`, `persona.ts`). Editing those files changes what the site shows.
