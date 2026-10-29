# Graph Report - 1bit.kr  (2026-10-29)

## Corpus Check
- 17 files · ~229,860 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 94 nodes · 133 edges · 13 communities (5 shown, 8 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7e9ce5e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- motion.test.cjs
- account.test.cjs
- engine.test.cjs
- import_questions.py
- viewer.test.cjs
- contact.js
- motion.js
- viewer.js
- render
- _config.yml
- QuizAccount

## God Nodes (most connected - your core abstractions)
1. `QuizAccount` - 15 edges
2. `extract()` - 3 edges
3. `updateNumbers()` - 3 edges
4. `render()` - 2 edges
5. `handleError()` - 2 edges
6. `save()` - 2 edges
7. `render()` - 2 edges
8. `exclude` - 1 edges
9. `copyButton` - 1 edges
10. `copyStatus` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (13 total, 8 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "account.test.cjs"
Cohesion: 0.14
Nodes (8): code, client, context, elements, originalApi, storage, users, source

### Community 2 - "engine.test.cjs"
Cohesion: 0.14
Nodes (8): extra, guessed, many, missing, multi, oldProgress, qs, s

### Community 4 - "viewer.test.cjs"
Cohesion: 0.25
Nodes (5): a, b, code, fallback, mapped

### Community 8 - "render"
Cohesion: 0.83
Nodes (3): render(), save(), updateNumbers()

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `account.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Should `engine.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._