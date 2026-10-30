# Handoff: pick up where we left off

Written 2026-10-29. Read this first when you reopen the project, then go to `PHASES.md`.

## Where the work stands

Career Compass is a working prototype for the Braven Capstone Challenge: a career engagement site for Post-Accelerator Fellows. The core student journey is built and checked in the browser:

landing page, then three-question onboarding, then My Journey (next action, roadmap, skills, events, picks), then Explore, Events (with Google Calendar and `.ics`), and My Progress. Dark and light mode, the Braven palette, and a rule-based "Ask Compass" assistant are in.

`npx tsc -b`, `npx vitest run` (53 tests) and `npm run build` all passed at the last check.

## Start the project

```bash
cd /Users/dhwanil/Desktop/braven
npm run dev        # opens at http://localhost:5173
```

Other checks:

```bash
npx tsc -b         # type check
npx vitest run     # tests
npm run build      # production build into dist/
npx oxlint         # lint (two harmless Date-in-render warnings remain)
```

## The five files that explain everything

| File | Read it for |
| --- | --- |
| `HANDOFF.md` | This file: how to resume, gotchas, what to do first |
| `PHASES.md` | The ordered task list (Phase 0 done through Phase 5), with feedback numbers and effort |
| `SITE_GUIDE.md` | What every page and section does, why the site exists next to braven.org, and the honest-limits table |
| `plan.md` | The original feedback analysis. Out of date: it still lists shipped work (calendar export, onboarding, roadmap) as open. `PHASES.md` task 5.8 fixes this |
| `graphify-out/` | A knowledge graph of the codebase and docs. See the graphify section below |

## Do this first next time

1. Run `npm run dev` and click through once: landing, "Try Maya's demo journey", ask the assistant "How can I find my first internship without experience?", open an event, then My Progress.
2. Answer the three blocking open questions in `PHASES.md` (reminders, what "in class" means, manual or real email). They gate Phases 2 to 4.
3. Start Phase 1 in `PHASES.md` (content breadth: more majors, interests and liberal arts and social science content). It needs no backend and fixes the "looks too technical" feedback.

## Code map

| Area | Where |
| --- | --- |
| Pages | `src/pages/` (`HomePage` is the landing, `JourneyPage` the personal home, plus `OnboardingPage`, `ResourceExplorerPage`, `ResourceDetailPage`, `EventsPage`, `ProgressPage`) |
| Routing | `src/App.tsx`. `/` shows the landing or the journey depending on `profile.onboarded` |
| Shared components | `src/components/` (cards, modals, `AssistantWidget`, `RoadmapList`, `SkillsSection`, `ThemeToggle`) |
| Data (edit these to change content) | `src/data/resources.ts`, `events.ts`, `skills.ts`, `taxonomy.ts`, `persona.ts` |
| Logic (all tested) | `src/lib/`: `recommend.ts`, `roadmap.ts`, `skills.ts`, `assistant.ts`, `calendar.ts`, `filters.ts` |
| State | `src/context/AppContext.tsx`, saved in the browser with `src/hooks/useLocalStorage.ts` |
| Colors, fonts, dark mode | `src/index.css` (tokens) and `index.html` (fonts, theme script) |

Browser storage keys: `bcc:profile:v2`, `bcc:completedSteps`, `bcc:savedResources`, `bcc:savedEvents`, `theme`. To reset the demo, open the browser console and run `localStorage.clear()`, then reload.

## Things that will trip you up

- **There is no git repository.** Nothing is version controlled, so edits cannot be undone. Run `git init` and make a first commit before starting Phase 1.
- **No demo data any more.** The fictional listings and events and the "Try Maya's demo journey" shortcut were removed. The catalog is 16 hand-picked real resources plus whatever `npm run scrape` collects from the SJSU Career Center (about 235 resources and 22 events). `MAYA_PROFILE` stays in `src/data/persona.ts` only as a test fixture. Real listings have almost no deadlines, so the "Closing soon" tab and the deadline stat are empty, and there are no past events to mark as attended until scraped events pass. A copy of the old data files is in the Claude session scratchpad, not in the project.
- **The assistant is not AI.** It is keyword rules over the catalog and is labeled "Demo mode". Do not describe it as live AI in the presentation.
- **Hook prompts.** In Claude Code sessions, a "fact-forcing gate" hook asks for a short statement of facts before the first edit, write or shell command. State the facts and retry the same call.
- **A stray Claude Docs document.** An early attempt at the site guide was started as a Claude Docs document (https://claude.ai/artifact/XhHPnQWDsv59pEwe1sZrTN) with only the overview filled in. The markdown `SITE_GUIDE.md` replaced it. Delete the document if it is not wanted.
- **Not covered by checks.** Mobile layout, light mode on the new pages, and dark mode on Explore, Events, My Progress and the detail pages have not been looked at.

## Before the presentation (7 minutes)

- Rehearse the two-minute demo: landing, Maya's journey, next action, the assistant question, an event, add to calendar, mark the step done.
- Take screenshots of every step as a fallback in case the live demo fails.
- Do the student survey and usability tests. No findings are in the site or the docs, and none should be invented. Add the real numbers to the slides.
- Be ready for these questions: why not MyBraven, why not ChatGPT or Handshake, who maintains the data, will the assistant make things up, is this realistic for Braven. Answers are in `SITE_GUIDE.md` and the Braven brief.

## Assistant (switched off)

The "Ask Compass" chatbot is not shown on the site any more. Its code is still in `src/components/AssistantWidget.tsx` and `src/lib/assistant.ts` (with tests). To bring it back, add `<AssistantWidget />` to `src/components/Layout.tsx`.

## Save counts

- **Popular tab:** uses real save counts from students' accounts. Run Part 2 of `supabase/schema.sql` once to create the `save_counts` view. A resource appears under Popular only after at least 3 students have saved it, and the view shows totals only. The old made-up counts were deleted.

## Login (Supabase)

`/login` is the first page for anyone who has not signed in or chosen guest. Sign in, create account, "Try Maya's demo journey" and "Continue as a guest" all work; the guest and demo paths need no keys. Accounts need a Supabase project:

1. Create a free project at supabase.com. In Authentication, keep email sign-in on (decide whether to require email confirmation).
2. Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Settings, API). Use the anon key only. Restart `npm run dev`.
3. Run `supabase/schema.sql` once (SQL Editor, New query, paste, Run). It creates the `user_data` table with row-level security. Until then, accounts work but nothing is saved to them and the browser console logs "Account sync is off".
4. How sync works (`src/components/AccountSync.tsx`): on sign-in the account's copy replaces the browser's; a first-time account uploads what is in the browser. Changes save about a second after they stop. Guests are never synced. Signing out of an account clears this browser's saved data.
5. Not built yet: password reset and any link between an account and Braven enrollment.

Supabase's built-in email sender allows only a few emails per hour for the whole project, so "Create account" fails with "Too many attempts" while Confirm email is on. For the demo, create accounts under Authentication, Users, Add user, with Auto Confirm User ticked, or turn Confirm email off. Before real students use it, set up custom SMTP.

Without keys the page shows a notice and disables the sign-in button. Code: `src/lib/supabase.ts`, `src/context/AuthContext.tsx`, `src/pages/LoginPage.tsx`, guard in `src/App.tsx`.

## Scraper (SJSU Career Center)

`npm run scrape` (or `scrape:events` / `scrape:resources` on their own) fetches careercenter.sjsu.edu/events/ and /resources/ (allowed by its robots.txt, about 30 requests with a delay) and saves `src/data/scraped/sjsu-events.json` and `sjsu-resources.json`. `src/data/sjsuCatalog.ts` turns them into real (not demo) listings, merged into `resources.ts` and `events.ts`. Titles, links, dates and places come from the source. Type, interests, majors and format are keyword guesses from `src/lib/classify.ts`; "Hybrid" is the fallback location when the text gives no clue. Re-run the scrape to refresh, then rebuild. Handshake and Idealist are not scraped.

## graphify

A knowledge graph of the project lives in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`). Open `graphify-out/graph.html` in a browser to explore it, and read `GRAPH_REPORT.md` for the main nodes and clusters.

After large changes, refresh it with `/graphify . --update` in Claude Code. If `graphify-out/` is missing, `/graphify .` builds it again.
