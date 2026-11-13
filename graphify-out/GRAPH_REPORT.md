# Graph Report - 1bit.kr  (2026-11-14)

## Corpus Check
- 48 files · ~462,899 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 5, (none) 2, .zip 1)

## Summary
- 365 nodes · 518 edges · 28 communities (13 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `13177d05`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Quiz
- viewer.test.cjs
- engine.test.cjs
- import_questions.py
- main.tsx
- contact.js
- motion.js
- viewer.js
- quiz.js
- _config.yml
- QuizAccount
- package.json
- compilerOptions
- compilerOptions
- .oxlintrc.json
- steps
- Quiz.tsx
- onebit.variants.d.ts
- tsconfig.json
- engine.d.ts
- Profile.tsx

## God Nodes (most connected - your core abstractions)
1. `Quiz()` - 22 edges
2. `QuizAccount` - 18 edges
3. `compilerOptions` - 18 edges
4. `compilerOptions` - 15 edges
5. `QuizAccount` - 15 edges
6. `@astryxdesign/core` - 12 edges
7. `api()` - 10 edges
8. `react` - 9 edges
9. `steps` - 7 edges
10. `scripts` - 6 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --calls--> `api()`  [EXTRACTED]
  app/src/pages/Signup.tsx → app/src/quiz/account.ts
- `App()` --calls--> `Shell()`  [EXTRACTED]
  app/src/main.tsx → app/src/Shell.tsx
- `Quiz()` --calls--> `QuizAccount`  [EXTRACTED]
  app/src/pages/Quiz.tsx → app/src/quiz/account.ts
- `Signup()` --calls--> `api()`  [EXTRACTED]
  app/src/pages/Signup.tsx → app/src/quiz/account.ts

## Import Cycles
- None detected.

## Communities (28 total, 15 thin omitted)

### Community 0 - "Quiz"
Cohesion: 0.15
Nodes (15): celebrate(), Quiz(), leaveReview(), next(), pick(), reset(), restore(), saveGoal() (+7 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.06
Nodes (27): code, a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced (+19 more)

### Community 2 - "engine.test.cjs"
Cohesion: 0.08
Nodes (22): before, full, other, s, answer(), claimGoal(), daily(), recoverNavigation() (+14 more)

### Community 4 - "main.tsx"
Cohesion: 0.06
Nodes (37): dependencies, @astryxdesign/core@^0.7.15, @astryxdesign/theme-neutral@^0.7.15, @heroicons/react@^2.2.0, react@^19.3.1, react-dom@^19.3.1, defaultThemeSlug, themes (+29 more)

### Community 8 - "quiz.js"
Cohesion: 0.54
Nodes (7): celebrateGoal(), checkDay(), clearConfetti(), render(), save(), updateDaily(), updateNumbers()

### Community 14 - "package.json"
Cohesion: 0.08
Nodes (29): @stylexjs/stylex@^0.19.2, devDependencies, @astryxdesign/cli@^0.7.15, oxlint@^1.90.0, @types/node@^24.19.2, @types/react@^19.3.0, @types/react-dom@^19.3.0, typescript@~7.0.2 (+21 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 17 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 18 - "steps"
Cohesion: 0.07
Nodes (29): concurrency, cancel-in-progress, group, environment, runs-on, steps, name, url (+21 more)

### Community 19 - "Quiz.tsx"
Cohesion: 0.10
Nodes (17): cardColumn, confettiColors, hiddenInput, Loaded, Result, ApiError, Cached, E (+9 more)

### Community 26 - "engine.d.ts"
Cohesion: 0.14
Nodes (4): Daily, Question, QuizRecord, QuizState

### Community 27 - "Profile.tsx"
Cohesion: 0.31
Nodes (8): Bullet(), credentials, duties, PageHeader(), PanelContent(), Profile(), projects, skills

## Knowledge Gaps
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@astryxdesign/core` connect `main.tsx` to `Quiz.tsx`, `Profile.tsx`, `package.json`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Quiz()` (e.g. with `backup()` and `.importGuest()`) actually correct?**
  _`Quiz()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `viewer.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05758582502768549 - nodes in this community are weakly interconnected._
- **Why does `react` connect `main.tsx` to `Quiz.tsx`, `package.json`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `engine.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.08465608465608465 - nodes in this community are weakly interconnected._
- **Why does `Quiz()` connect `Quiz` to `Quiz.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `main.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._