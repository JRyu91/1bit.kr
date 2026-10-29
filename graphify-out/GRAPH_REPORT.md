# Graph Report - 1bit.kr  (2026-10-29)

## Corpus Check
- 20 files · ~230,947 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 113 nodes · 164 edges · 15 communities (6 shown, 9 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9390cdb8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- motion.test.cjs
- viewer.test.cjs
- engine.test.cjs
- import_questions.py
- account.test.cjs
- contact.js
- motion.js
- viewer.js
- quiz.js
- _config.yml
- QuizAccount
- engine.js

## God Nodes (most connected - your core abstractions)
1. `QuizAccount` - 15 edges
2. `daily()` - 4 edges
3. `clearConfetti()` - 4 edges
4. `render()` - 4 edges
5. `checkDay()` - 4 edges
6. `extract()` - 3 edges
7. `save()` - 3 edges
8. `updateDaily()` - 3 edges
9. `updateNumbers()` - 3 edges
10. `render()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (15 total, 9 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.12
Nodes (10): code, a, b, code, fallback, mapped, source, blocked (+2 more)

### Community 2 - "engine.test.cjs"
Cohesion: 0.22
Nodes (8): extra, guessed, many, missing, multi, oldProgress, qs, s

### Community 4 - "account.test.cjs"
Cohesion: 0.14
Nodes (10): client, context, elements, originalApi, storage, users, before, full (+2 more)

### Community 8 - "quiz.js"
Cohesion: 0.54
Nodes (7): celebrateGoal(), checkDay(), clearConfetti(), render(), save(), updateDaily(), updateNumbers()

### Community 14 - "engine.js"
Cohesion: 0.36
Nodes (4): answer(), claimGoal(), daily(), setGoal()

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `viewer.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._
- **Should `account.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._