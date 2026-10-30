# Braven Career Compass — Status & Plan

Student capstone prototype: one place to find career resources and events from Braven, the SJSU Career Center, Handshake and Idealist, filtered to your major and interests.

Stack: React 19, TypeScript, Vite, Tailwind v4, React Router, lucide-react. Frontend only. State lives in `localStorage`; there is no backend. Vitest covers filtering and recommendation logic.

---

## 1. What we have done so far

### Features (already on the site)
| Area | What exists |
| --- | --- |
| **Home** (`/`) | Hero with search and popular searches, live stats (resources, upcoming events, sources), quick-access cards, featured resources, upcoming events, "Recommended for you", demo-data disclaimer |
| **Explore** (`/resources`, `/resources/:id`) | Search plus filters (major, interest, type, location), resource cards, detail page with "who it's for", tags, source link, deadline |
| **Events** (`/events`) | List and month-calendar views, filters (event type, format), event detail modal, registration deadlines |
| **My Dashboard** (`/dashboard`) | Profile (major and interests), personalised recommendations, saved resources and events, timeline of upcoming events and deadlines |
| **Saving** | Bookmark resources and events, saved count in the navbar, persisted in `localStorage` |
| **Recommendations** | Scores resources against the saved major and interests and shows the match reasons |

### Design work this session
- Pulled the real Braven palette from braven.org's CSS: navy `#011936` / `#142744`, lime `#E0FF66` / `#DEE465`, coral `#EC596A`, sky `#8BC1DE`, cream `#EBE9DF`.
- Fonts: Rubik (headings) and Source Sans 3 (body); Adelle Sans would need an Adobe Fonts license.
- Restyled to match braven.org's feel: lime hero, coral pill buttons, cream surfaces.
- Dark and light mode: toggle in the navbar, follows the system setting, remembers the choice, no flash on load.
- Mock data: grew from 24 to 40 resources and from 13 to 25 events so every filter returns results. Deadlines and dates are generated relative to today.

### Known gaps
- Resource data is tech- and business-heavy (see feedback #6 and #7).
- Only 8 majors and 10 interests exist.
- Demo listings are fictional, and the UI labels them as such.
- Calendar and dashboard cannot yet be exported to a real calendar.
- Not yet checked visually in dark mode: Explore, Events, Dashboard and detail pages.
- No analytics, accounts or notifications.

---

## 2. Reflecting on the feedback

Interpretations marked **(confirm)** are my reading of a terse note. Please check them with whoever gave the feedback.

### The important question: how is this different from braven.org?

braven.org is an **organisation site**. It tells the Braven story, shows impact numbers (12K+ fellows, +$9.1K salary), and recruits partners, volunteers and donors. Its audience is mostly funders and partners.

Career Compass should be a **student tool that people come back to**. The difference to state and then build toward:

1. **Aggregation.** One searchable place across Braven, SJSU, Handshake and Idealist. braven.org only covers Braven.
2. **Personalisation.** Results are filtered by your major, interests and Braven status.
3. **Action and time.** Deadlines, reminders, calendar sync and a personal timeline. braven.org has none of this.
4. **Progress.** Track what you attended and applied to, and show momentum.

Pitch line: *braven.org tells you what Braven is. Career Compass tells a student what to do this week.*

Several items below (Braven-class awareness, reminders, gcal, attendance) are the features that make this difference real, so they are the highest priority.

### Feedback item by item

| # | Feedback | Reading | Status | Proposal | Effort |
| - | --- | --- | --- | --- | --- |
| 1 | Add all majors and all interests | The lists are too short | Not done (8 majors, 10 interests) | Expand the lists, grouped (see §3.1). Add an "Undecided / Exploring" option. Keep the filter dropdowns usable with groups. | S |
| 2 | Featured career resources: popular and important ones | Featured should be chosen by meaning, not hand-picked | Partly done (a `featured` flag exists) | Split into "Important / deadline soon" and "Popular". Popular needs a signal (save count) and is faked from mock data until there is a backend. | M |
| 3 | Braven class: show X if not in class, Y if in class | Content depends on whether the student is a Braven Fellow **(confirm)** | Not done | Add "Are you in a Braven course?" to the profile. Fellows see course resources, coaching and cohort events first. Non-Fellows see a "Join Braven" call to action. | M |
| 4 | Email notifications for new opportunities | Alerts matched to the student's profile | Not done | Needs a backend or an email service (see §3.4). First step: an email opt-in form that stores the profile and topics. | L |
| 5 | Calendar: link to Google Calendar | Add events to the student's own calendar | Not done | "Add to Google Calendar" link on each event (URL template, no backend needed). Also an `.ics` download for Apple and Outlook. | S |
| 6 | Career interest: liberal arts, social science | Not enough non-technical paths | Not done | New majors and interests plus new resources and events (see §3.1). | M |
| 7 | Looks heavy on the technical piece | Content and imagery lean toward tech | Partly mitigated (the 16 new resources added some Communications, Social Impact and Healthcare) | Rebalance the data so tech is a minority. Reword the hero and the quick-access cards to be neutral. Check the "Popular" searches. | M |
| 8 | How did you hear about the website? | Acquisition question | Not done | A one-question prompt on first visit or in the profile. Without a backend, store locally and record via the form/email service. | S |
| 9 | Check about the reminders | Unclear **(confirm)**: reminders for deadlines and events? | Not done | Needs a clarifying answer. See §3.5 for options. | M |
| 10 | Events attended: motivator | Reward participation | Not done | "Mark as attended", progress counts, streak and badges on the dashboard (see §3.6). | M |

---

## 3. What we can add

### 3.1 Content breadth (feedback #1, #6, #7)
**Majors, proposed full list (grouped):**
- STEM: Computer Science, Engineering, Biology, Chemistry, Mathematics, Environmental Science
- Business: Business, Economics, Accounting, Marketing
- Social science: Psychology, Sociology, Political Science, Anthropology, Public Health, Criminology
- Liberal arts and humanities: English, History, Philosophy, Communications, Journalism, Liberal Studies
- Arts and design: Design, Art, Music, Theatre
- Education and service: Education, Social Work, Nutrition and Kinesiology
- Other: Undecided / Exploring

**Interests, proposed additions:** Education and Teaching, Public Policy and Government, Law and Legal, Journalism and Media, Nonprofit Management, Research and Academia, Arts and Culture, Community Organizing, Sustainability, Counseling and Social Services, Writing and Content.

**Implementation:** `Major` and `CareerInterest` are union types in `src/types.ts` and are listed in `src/data/taxonomy.ts`. Add to both. Keep `MAJORS` used by "for everyone" resources so they don't need edits, but check that the new majors appear on those items.

**Data rebalance target:** about 40% STEM and business, 40% social science, liberal arts and humanities, 20% general. Add 15 to 20 resources and 8 to 10 events for the new areas (for example a teaching fellowship, a policy internship, a journalism portfolio review, a counseling career panel).

### 3.2 Smarter featured section (feedback #2)
- "Closing soon": derived from `deadline`, so no extra data.
- "Most saved": needs a count. Mock it with a `popularity` field first. A real count needs a backend.
- "Important": an editor-chosen flag for must-know resources (for example the Braven course, the career fair).

### 3.3 Braven-course awareness (feedback #3)
- Add `inBravenCourse: boolean | null` to `UserProfile`. `null` means not answered, shown as a prompt.
- Resources and events get an audience tag: `fellows`, `non-fellows`, `all`.
- Home and dashboard reorder or swap sections on the answer. Fellows: "Your Braven course" block, coaching, cohort events. Non-fellows: "What is Braven?" and how to join.
- Also feeds back into the difference-from-braven.org answer: the site meets Fellows where they are and brings others in.

### 3.4 Email notifications (feedback #4)
This is the first feature that cannot be done in the browser alone.
- **Prototype option (no backend):** an opt-in form that sends the email, major, interests and Fellow status to a form service such as Formspree or a Google Form. Someone sends digests by hand. Honest for a capstone.
- **Real option:** a small backend (for example Supabase plus Resend) that stores subscribers and sends a weekly digest of new items matching the profile.
- The "new" signal needs a `postedAt` field on every resource and event.
- Privacy: ask for explicit consent, and make unsubscribing easy.

### 3.5 Calendar and reminders (feedback #5, #9)
- **Add to Google Calendar:** a link built from the event's title, start, end and location. Also covers a deadline as an all-day event.
- **`.ics` export:** one file per event, and one for all saved events.
- **Reminder options** (pick after clarifying #9):
  - calendar-based: the exported event carries an alarm (one day before). No backend.
  - in-app: a "due soon" banner on the dashboard for saved items.
  - email: depends on §3.4.
- Open question for the reviewer: do they mean reminders for deadlines, for events they registered for, or for the whole site checking in?

### 3.6 Attendance and motivation (feedback #10)
- "I attended" on past events and "I applied" on resources.
- Dashboard "Your progress": events attended, applications sent, a weekly streak, simple badges such as First event, Three events, First application.
- Keep the tone encouraging, not competitive. Store in `localStorage` for now.

### 3.7 Acquisition question (feedback #8)
- One optional question: "How did you hear about this site?" with options such as Braven class, instructor, career center, friend, social media, other.
- Store with the signup or profile. It only has value if the answers are collected somewhere, so it ties to §3.4.

### 3.8 Differentiation features (the important question)
Roughly in order of impact:
1. Braven-course awareness (§3.3)
2. One-click calendar and reminders (§3.5)
3. Progress tracking (§3.6)
4. A visible "sources" line on the home page: Braven + SJSU + Handshake + Idealist, with counts
5. A "this week" view on the dashboard: what to do now, by deadline

---

## 4. Suggested order of work

| Phase | Items | Why first |
| --- | --- | --- |
| **1. Quick wins** | Expand majors and interests (#1, #6). Add to Google Calendar and `.ics` (#5). "How did you hear" prompt (#8). | Small, visible, and address the most direct feedback |
| **2. Content** | Rebalance data toward liberal arts and social science (#6, #7). Reword the hero and cards. Smarter featured section (#2). | Fixes the "too technical" impression |
| **3. Personalisation** | Braven-course question and Fellow versus non-Fellow views (#3). Attendance and progress (#10). | The biggest differentiators from braven.org |
| **4. Backend** | Email opt-in, then real digests (#4). Real reminders (#9). Save counts for "popular". | Needs infrastructure and a decision on privacy |

## 5. Open questions
1. Reminders (#9): which reminders are meant?
2. Braven class (#3): does "in class" mean a current Fellow? Which classes exist, and how do we know?
3. Email (#4): is a manual digest acceptable for the capstone, or is a working backend expected?
4. Who curates and updates real resources once the demo data is replaced?
5. Is the SJSU scope fixed, or should the site work for any Braven partner school?
6. Do we have the real Braven logo and licensed fonts (Canela, Basetica)?
7. Is the "how did you hear" answer going somewhere (analytics, a spreadsheet), or just a prompt?
