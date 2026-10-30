# Graph Report - braven  (2026-10-29)

## Corpus Check
- 64 files · ~33,370 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 409 nodes · 1107 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Feedback items #1 to #10
- react-router-dom
- ProgressPage.tsx
- package.json
- HomePage.tsx
- EventsPage.tsx
- types.ts
- assistant.ts
- Handoff: pick up where we left off
- compilerOptions
- compilerOptions
- roadmap.test.ts
- .oxlintrc.json
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `ProgressPage()` - 30 edges
2. `lucide-react` - 25 edges
3. `react` - 21 edges
4. `useApp()` - 21 edges
5. `react-router-dom` - 20 edges
6. `CareerEvent` - 19 edges
7. `compilerOptions` - 19 edges
8. `EventDetailsModal()` - 18 edges
9. `JourneyPage()` - 18 edges
10. `HomePage()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Code map` --references--> `AssistantWidget()`  [INFERRED]
  HANDOFF.md → src/components/AssistantWidget.tsx
- `Code map` --references--> `RoadmapList()`  [INFERRED]
  HANDOFF.md → src/components/RoadmapList.tsx
- `Code map` --references--> `ThemeToggle()`  [INFERRED]
  HANDOFF.md → src/components/ThemeToggle.tsx
- `Code map` --references--> `ProgressPage()`  [INFERRED]
  HANDOFF.md → src/pages/ProgressPage.tsx
- `Code map` --references--> `ResourceDetailPage()`  [INFERRED]
  HANDOFF.md → src/pages/ResourceDetailPage.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Career Compass core pages** — site_guide_my_journey, site_guide_explore, site_guide_events, site_guide_my_progress [EXTRACTED 1.00]
- **Phased delivery roadmap** — phases_phase_1_content_breadth, phases_phase_2_featured_awareness, phases_phase_3_progress_reminders, phases_phase_4_backend, phases_phase_5_trust_polish [EXTRACTED 1.00]
- **Features needing a backend** — plan_email_notifications, plan_calendar_reminders, plan_smarter_featured, plan_acquisition_question [INFERRED 0.75]

## Communities (14 total, 1 thin omitted)

### Community 0 - "Feedback items #1 to #10"
Cohesion: 0.08
Nodes (38): Career Compass Phases, Open questions (reminders, Braven class, email), Phase 1: Content breadth, Phase 2: Featured and awareness, Phase 3: Progress and reminders, Phase 4: Backend, Phase 5: Trust, polish and evidence, Braven Career Compass Status and Plan (+30 more)

### Community 1 - "react-router-dom"
Cohesion: 0.22
Nodes (13): react-router-dom, AssistantWidget(), Footer(), FOOTER_LINKS, Layout(), NAV_LINKS, Navbar(), navLinkClasses() (+5 more)

### Community 2 - "ProgressPage.tsx"
Cohesion: 0.07
Nodes (47): buildMonthDays(), CalendarGrid(), CHIP_CLASSES, DOT_CLASSES, WEEKDAYS, RoadmapList(), RoadmapListProps, daysUntil() (+39 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (41): Fraunces and Hanken Grotesk fonts, index.html entry page, Theme initialization script (no flash), dependencies, lucide-react, react, react-dom, react-router-dom (+33 more)

### Community 4 - "HomePage.tsx"
Cohesion: 0.14
Nodes (31): lucide-react, react, SUGGESTIONS, Badge(), BadgeVariant, DemoBadge(), VARIANT_CLASSES, BookmarkButton() (+23 more)

### Community 5 - "EventsPage.tsx"
Cohesion: 0.10
Nodes (38): Code map, App(), HomeRoute(), EmptyState(), FilterSelect(), SearchBar(), SkillsSection(), useApp() (+30 more)

### Community 6 - "types.ts"
Cohesion: 0.07
Nodes (35): AppContext, AppContextValue, AppProvider(), EMPTY_IDS, isProfile(), isReferralSource(), isStringArray(), toggleId() (+27 more)

### Community 7 - "assistant.ts"
Cohesion: 0.13
Nodes (18): Message, answerQuestion(), AssistantReply, detectTopics(), rankResources(), now, Topic, TOPIC_PATTERNS (+10 more)

### Community 8 - "Handoff: pick up where we left off"
Cohesion: 0.22
Nodes (8): Before the presentation (7 minutes), Do this first next time, graphify, Handoff: pick up where we left off, Start the project, The five files that explain everything, Things that will trip you up, Where the work stands

### Community 9 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+12 more)

### Community 10 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 12 - "roadmap.test.ts"
Cohesion: 0.20
Nodes (12): vitest, DEFAULT_PROFILE, MAYA_PROFILE, buildIcs(), downloadIcs(), escapeIcsText(), googleCalendarUrl(), PREP_TIPS (+4 more)

### Community 13 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **121 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Braven palette and design` connect `package.json` to `Feedback items #1 to #10`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ProgressPage()` (e.g. with `Code map` and `isDefined()`) actually correct?**
  _`ProgressPage()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Feedback items #1 to #10` be split into smaller, more focused modules?**
  _Cohesion score 0.0782051282051282 - nodes in this community are weakly interconnected._
- **Why does `Braven Career Compass Status and Plan` connect `Feedback items #1 to #10` to `package.json`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Should `ProgressPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07077922077922078 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.047474747474747475 - nodes in this community are weakly interconnected._