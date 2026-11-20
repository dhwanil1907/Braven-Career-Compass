# Braven Career Compass

A career site for SJSU students in the [Braven](https://bebraven.org) Post-Accelerator Fellowship. The hard part for students isn't a lack of opportunities, it's that internships, events, resources and alumni are scattered across a dozen sites. This pulls them into one place, ranks them by fit with the student's major, interests and goal, and includes an assistant that can search the web.

I built it for the Braven Capstone Challenge. It's a prototype: listings are scraped samples and alumni profiles are fictional.

**Live demo:** https://braven-career-compass.vercel.app/

## Features

- **Personalized matching:** a 3-step onboarding (major and year, goal and interests, biggest challenge) drives a transparent, rule-based match score on every listing. The score is not AI.
- **Internships and jobs:** LinkedIn and SJSU Career Center listings with filters (major, interest, location), sort by best match or soonest deadline, and an "I applied" tracker.
- **Resources and events:** searchable career resources, a list and calendar view of events, Google Calendar and `.ics` export, and an "I attended" toggle.
- **Alumni:** browse and match with alumni by field.
- **My journey:** momentum (events attended, applications sent, week streak), saved items and the application tracker in one view.
- **Wayfinder assistant:** streaming AI chat grounded in the site's own listings, with live web search via Perplexity Sonar.
- **Accounts optional:** email sign-in with Supabase sync, or continue as a guest (data stays in the browser).
- **Light and dark themes**, keyboard accessible, responsive.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Supabase, Perplexity Sonar API, Vitest, Oxlint. Deployed on Vercel.

## Getting started

Requires Node 20+.

```bash
git clone https://github.com/dhwanil1907/Braven-Career-Compass.git
cd Braven-Career-Compass
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

The dev server also serves `/api/chat`, so the assistant works locally.

### Environment variables

Never commit `.env`.

| Name | Required | Purpose |
| --- | --- | --- |
| `PERPLEXITY_API_KEY` | For the assistant | Key from [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api). Without it the chat shows "not set up yet". |
| `PERPLEXITY_MODEL` | No | Defaults to `sonar`. `sonar-pro` is more accurate but slower. |
| `VITE_SUPABASE_URL` | For accounts | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | For accounts | Supabase anon (public) key. |
| `APIFY_TOKEN` | Scraping only | Used by the LinkedIn and Instagram scrapers. |

Run `supabase/schema.sql` once in your Supabase project to create the sync table. Without Supabase, the site runs in guest mode.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Bundle the chat function, type-check, and build for production |
| `npm run build:api` | Regenerate `api/_chat-server.mjs` from `src/lib/chat` |
| `npm run preview` | Preview the production build |
| `npm test` | Run the Vitest suite |
| `npm run lint` | Run Oxlint |
| `npm run scrape` | Refresh SJSU events and resources |
| `npm run scrape:linkedin` | Refresh LinkedIn internships (`:jobs` and `:regions` variants available) |
| `npm run scrape:instagram` | Refresh Instagram event posts |

## Project structure

```
api/                  Vercel serverless function (/api/chat) and its generated bundle
scripts/              Scrapers and their search configs
supabase/schema.sql   Account sync table
src/
  components/         UI components
  context/            App and auth state
  data/               Catalog, including scraped JSON
  hooks/
  lib/                Matching, filtering, calendar, chat client and server
  pages/              One file per route
```

`api/_chat-server.mjs` is generated and committed, because Vercel runs the function without a bundler. Re-run `npm run build:api` after changing `src/lib/chat` or the data.

## How the assistant works

The browser posts the conversation and the student's profile (major, interests, year, goal) to `/api/chat`. The server retrieves matching listings, events and resources from the catalog, adds them to the system prompt, and streams the answer from Perplexity Sonar. The API key never reaches the browser. Questions are limited to 800 characters and 20 per 10 minutes per visitor.

## Matching

Scores come from weighted rules in `src/lib/matchRules.ts` and `src/lib/matchScore.ts`: major, interests, goal, challenge and year. A listing must fit topically to score at all, skipped questions never lower a score, and anything below 35% is not recommended. Bands: 80+ Excellent, 60+ Strong, 50+ Partly matches, 35+ Possible.

## How it was built

This was a time-constrained project: I had almost two weeks to go from idea to a working, deployed prototype for the Capstone Challenge. To fit that, I built it with Claude Code as my coding partner. I set the product direction, decided what the site should do for Braven students, and iterated on the results.

- **Frontend:** handled by Claude Code. It built the React pages, components, styling and theming from my direction.
- **Backend:** my part was reviewing it. Claude Code drafted the chat API, the scrapers and the Supabase sync, and I went through that code, checking how requests are handled, where the API key lives, the rate limits and how the data is stored.

Because of the deadline, I prioritized a complete end-to-end experience over polish. Listings are scraped samples rather than a live feed, and alumni profiles are fictional.

The match score is deliberately rule-based rather than AI, so a student can see exactly why a listing ranked where it did. The assistant is the only AI feature in the product.

## Deployment

Deploy on Vercel. Add the environment variables above under Project Settings, then redeploy: changes only apply to new deployments.

## Disclaimer

Not an official Braven product. Listings are scraped samples, not a live feed: confirm details and deadlines on the original posting before applying. Alumni profiles are invented for this prototype.
