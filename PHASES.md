# Career Compass: Phases

Built from `SITE_GUIDE.md` (what exists now) and `plan.md` (feedback and proposals). Where the two disagree, the guide wins because it is newer. `plan.md` still lists some work as not done that has since shipped.

Feedback numbers (#1 to #10) refer to the table in `plan.md` section 2. Effort: S = small, M = medium, L = large.

---

## Phase 0: Done

| Area | Shipped | Feedback |
| --- | --- | --- |
| Onboarding | Three-step flow (`/start`), no account | |
| My Journey | Landing page, "Try Maya's demo", one clear next action, 5-step roadmap with progress, skills to build, matched events and resources | |
| Explore | Search plus major, interest, type and location filters; detail page with match reasons and verification status | |
| Events | List and month views, filters, saved only, detail window | |
| Calendar | Google Calendar link and `.ics` download with one-day-before alert | #5 |
| Event prep | Two tips per event type | |
| Ask Compass | Rule-based, catalog-only assistant, labeled as a demo | |
| My Progress | Stats, milestones, profile edit, saved items, deadline timeline | partly #10 |
| Honest labeling | "Demo" badges, source on every item, "Not yet verified" | |
| Design | Braven palette, Rubik (headings) and Source Sans 3 (body), dark and light mode, responsive | |

---

## Phase 1: Content breadth (next)

Fixes the "too technical" and "not enough majors" feedback. Highest-priority open work: it needs no backend and is the biggest gap in the guide's own limits table.

| # | Task | Feedback | Effort |
| --- | --- | --- | --- |
| 1.1 | Expand `Major` and `CareerInterest` in `src/types.ts` and `src/data/taxonomy.ts` to the grouped lists in `plan.md` §3.1, including "Undecided / Exploring" | #1, #6 | S |
| 1.2 | Make the onboarding and filter dropdowns usable with groups | #1 | S |
| 1.3 | Add default skill fields in `src/data/skills.ts` for every new major and interest | #1, #6 | S |
| 1.4 | Add 15 to 20 resources and 8 to 10 events for liberal arts, social science, education and service | #6, #7 | M |
| 1.5 | Rebalance toward about 40% STEM and business, 40% social science and humanities, 20% general | #7 | M |
| 1.6 | Reword the hero, quick-access cards and popular searches to be field-neutral | #7 | S |
| 1.7 | Check that "for everyone" resources still show for the new majors | #1 | S |

**Done when:** a Sociology or English major can finish onboarding and get a full five-step roadmap, skills and event matches without hitting an empty state.

---

## Phase 2: Featured and awareness

| # | Task | Feedback | Effort |
| --- | --- | --- | --- |
| 2.1 | Split featured into "Closing soon" (from `deadline`), "Important" (editor flag) and "Popular" | #2 | M |
| 2.2 | Add a mock `popularity` field for "Popular", labeled as sample data | #2 | S |
| 2.3 | Add "Are you in a Braven course?" to the profile (`inBravenCourse: boolean \| null`) | #3 | S |
| 2.4 | Add an audience tag (`fellows`, `non-fellows`, `all`) to resources and events | #3 | M |
| 2.5 | Fellow view: course block, coaching, cohort events. Non-Fellow view: "What is Braven?" and how to join | #3 | M |
| 2.6 | Optional "How did you hear about this site?" question, stored locally for now | #8 | S |

**Blocked on:** open question 2 (what "in class" means and how we know). Do 2.1, 2.2 and 2.6 first; hold 2.3 to 2.5 until it is answered.

---

## Phase 3: Progress and reminders

| # | Task | Feedback | Effort |
| --- | --- | --- | --- |
| 3.1 | "I attended" on past events and "I applied" on resources | #10 | M |
| 3.2 | Progress on My Progress: attended count, applications, weekly streak, simple badges (First event, Three events, First application). Encouraging tone, not competitive | #10 | M |
| 3.3 | "This week" view: what to do now, ordered by deadline | | M |
| 3.4 | In-app "due soon" banner for saved items | #9 | S |
| 3.5 | `.ics` export for all saved events in one file | #5 | S |

**Done:** 3.1, 3.2 and 3.4 (attended and applied buttons, "Your momentum" with streak and badges on My Progress, and a "due in 7 days" banner on My Journey and My Progress). Attended and applied lists sync to the account. Remaining: 3.3 ("This week" view) and 3.5 (export all saved events as one `.ics`).

**Blocked on:** open question 1 (which reminders are meant). 3.4 is the safe, no-backend option and can go ahead.

---

## Phase 4: Backend (needs decisions)

Nothing here can be done in the browser alone.

| # | Task | Feedback | Effort |
| --- | --- | --- | --- |
| 4.1 | Email opt-in form (email, major, interests, Fellow status) sent to a form service. Digests sent by hand for the capstone | #4 | M |
| 4.2 | Add `postedAt` to every resource and event so "new" can be detected | #4 | S |
| 4.3 | Real weekly digest (for example Supabase plus Resend), with consent and easy unsubscribe | #4 | L |
| 4.4 | Email and text reminders for deadlines and events | #9 | L |
| 4.5 | Real save counts to drive "Popular" | #2 | L |
| 4.6 | Connect the "how did you hear" answer to a place it is collected | #8 | S |
| 4.7 | Replace the rule-based assistant with a real model behind a small backend | | L |
| 4.8 | Connection to MyBraven | | L |

**Blocked on:** open question 3 (is a manual digest acceptable) and a privacy decision.

---

## Phase 5: Trust, polish and evidence

Not feedback items, but listed as limits in `SITE_GUIDE.md`.

| # | Task | Effort |
| --- | --- | --- |
| 5.1 | Braven staff verify the 16 real resources and set verification dates | S |
| 5.2 | Braven staff review the skills lists | S |
| 5.3 | Replace demo events and listings with real ones as they are sourced | M |
| 5.4 | Check dark mode visually on Explore, Events, My Progress and the detail pages | S |
| 5.5 | Add alumni success stories | M |
| 5.6 | Add real survey and usability findings (none are included yet) | M |
| 5.7 | Real Braven logo and licensed fonts (Canela, Basetica) | S |
| 5.8 | Update `plan.md` so it no longer lists shipped work (calendar export, onboarding, roadmap) as open | S |

---

## Open questions

Carried over from `plan.md` section 5. The first three gate work above.

1. **Reminders (#9):** deadlines, registered events, or the site checking in? Gates 3.4 and 4.4.
2. **Braven class (#3):** does "in class" mean a current Fellow? Which classes exist? Gates 2.3 to 2.5.
3. **Email (#4):** is a manual digest acceptable, or is a working backend expected? Gates Phase 4.
4. Who curates and updates real resources once demo data is replaced?
5. Is the scope fixed to SJSU, or should it work for any Braven partner school?
6. Do we have the real Braven logo and licensed fonts?
7. Where does the "how did you hear" answer go (analytics, spreadsheet, or just a prompt)?

---

## Suggested order

1. Phase 1 (content breadth), all of it.
2. Phase 2 tasks 2.1, 2.2, 2.6, then 2.3 to 2.5 once question 2 is answered.
3. Phase 3, starting with 3.1 and 3.2.
4. Phase 4 only after questions 1 and 3 are answered.
5. Phase 5 alongside the rest.
