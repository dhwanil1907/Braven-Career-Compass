# Graph Report - braven  (2026-10-29)

## Corpus Check
- 71 files · ~43,428 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 458 nodes · 1239 edges · 16 communities (15 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Feedback items #1 to #10
- App.tsx
- ProgressPage.tsx
- package.json
- ResourceDetailPage.tsx
- EventsPage.tsx
- AppContext.tsx
- resources.ts
- Handoff: pick up where we left off
- compilerOptions
- compilerOptions
- types.ts
- HomePage.tsx
- .oxlintrc.json
- tsconfig.json
- scrape-sjsu.mjs

## God Nodes (most connected - your core abstractions)
1. `ProgressPage()` - 30 edges
2. `lucide-react` - 26 edges
3. `react` - 21 edges
4. `react-router-dom` - 21 edges
5. `useApp()` - 21 edges
6. `CareerEvent` - 20 edges
7. `HomePage()` - 19 edges
8. `compilerOptions` - 19 edges
9. `EventDetailsModal()` - 18 edges
10. `JourneyPage()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Code map` --references--> `AssistantWidget()`  [INFERRED]
  HANDOFF.md → src/components/AssistantWidget.tsx
- `Code map` --references--> `ThemeToggle()`  [INFERRED]
  HANDOFF.md → src/components/ThemeToggle.tsx
- `Code map` --references--> `EventsPage()`  [INFERRED]
  HANDOFF.md → src/pages/EventsPage.tsx
- `Code map` --references--> `HomePage()`  [INFERRED]
  HANDOFF.md → src/pages/HomePage.tsx
- `Code map` --references--> `OnboardingPage()`  [INFERRED]
  HANDOFF.md → src/pages/OnboardingPage.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Career Compass core pages** — site_guide_my_journey, site_guide_explore, site_guide_events, site_guide_my_progress [EXTRACTED 1.00]
- **Phased delivery roadmap** — phases_phase_1_content_breadth, phases_phase_2_featured_awareness, phases_phase_3_progress_reminders, phases_phase_4_backend, phases_phase_5_trust_polish [EXTRACTED 1.00]
- **Features needing a backend** — plan_email_notifications, plan_calendar_reminders, plan_smarter_featured, plan_acquisition_question [INFERRED 0.75]

## Communities (16 total, 1 thin omitted)

### Community 0 - "Feedback items #1 to #10"
Cohesion: 0.07
Nodes (43): Fraunces and Hanken Grotesk fonts, index.html entry page, Theme initialization script (no flash), Career Compass Phases, Open questions (reminders, Braven class, email), Phase 1: Content breadth, Phase 2: Featured and awareness, Phase 3: Progress and reminders (+35 more)

### Community 1 - "App.tsx"
Cohesion: 0.11
Nodes (24): react-dom, react-router-dom, App(), HomeRoute(), AssistantWidget(), Footer(), FOOTER_LINKS, Layout() (+16 more)

### Community 2 - "ProgressPage.tsx"
Cohesion: 0.09
Nodes (43): Code map, RoadmapList(), RoadmapListProps, SectionHeader(), SkillsSection(), daysUntil(), baseScore(), getMatchReasons() (+35 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (38): dependencies, lucide-react, react, react-dom, react-router-dom, devDependencies, oxlint, tailwindcss (+30 more)

### Community 4 - "ResourceDetailPage.tsx"
Cohesion: 0.14
Nodes (31): Badge(), BadgeVariant, DemoBadge(), VARIANT_CLASSES, BookmarkButton(), buildMonthDays(), CalendarGrid(), CHIP_CLASSES (+23 more)

### Community 5 - "EventsPage.tsx"
Cohesion: 0.12
Nodes (29): lucide-react, react, EmptyState(), FilterSelect(), SearchBar(), EVENT_FORMATS, EVENT_TYPES, INTEREST_GROUPS (+21 more)

### Community 6 - "AppContext.tsx"
Cohesion: 0.11
Nodes (11): AppContext, AppContextValue, AppProvider(), EMPTY_IDS, isProfile(), isReferralSource(), isStringArray(), toggleId() (+3 more)

### Community 7 - "resources.ts"
Cohesion: 0.10
Nodes (27): vitest, Message, SUGGESTIONS, curatedEvents, events, DEFAULT_PROFILE, MAYA_PROFILE, curatedResources (+19 more)

### Community 8 - "Handoff: pick up where we left off"
Cohesion: 0.20
Nodes (9): Before the presentation (7 minutes), Do this first next time, graphify, Handoff: pick up where we left off, Scraper (SJSU Career Center), Start the project, The five files that explain everything, Things that will trip you up (+1 more)

### Community 9 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+12 more)

### Community 10 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 11 - "types.ts"
Cohesion: 0.12
Nodes (33): isExternal(), SJSU_SCRAPED_AT, sjsuEvents, sjsuResources, ACADEMIC_YEARS, CAREER_GOALS, CHALLENGES, INTERESTS (+25 more)

### Community 12 - "HomePage.tsx"
Cohesion: 0.17
Nodes (19): ClosingSoonList(), Eyebrow(), FeaturedGroupKey, FeaturedShowcase(), ImportantSpread(), PopularRanking(), ResourceTitleLink(), CLOSING_SOON_DAYS (+11 more)

### Community 13 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 15 - "scrape-sjsu.mjs"
Cohesion: 0.23
Nodes (14): clean(), crawl(), ENTITIES, fetchPage(), main(), OUT_DIR, pacificOffset(), parseClock() (+6 more)

## Knowledge Gaps
- **135 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 159 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html entry page` connect `Feedback items #1 to #10` to `App.tsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ProgressPage()` (e.g. with `Code map` and `isDefined()`) actually correct?**
  _`ProgressPage()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Feedback items #1 to #10` be split into smaller, more focused modules?**
  _Cohesion score 0.06767676767676768 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11092436974789915 - nodes in this community are weakly interconnected._
- **Should `ProgressPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09361393323657474 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._