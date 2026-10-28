# Graph Report - 1bit.kr  (2026-10-28)

## Corpus Check
- 15 files · ~229,244 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 89 nodes · 127 edges · 12 communities (5 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9b41207b`
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

## Communities (12 total, 7 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.16
Nodes (6): code, a, b, code, fallback, mapped

### Community 2 - "engine.test.cjs"
Cohesion: 0.22
Nodes (8): extra, guessed, many, missing, multi, oldProgress, qs, s

### Community 4 - "account.test.cjs"
Cohesion: 0.15
Nodes (5): client, context, elements, storage, users

### Community 8 - "render"
Cohesion: 0.83
Nodes (3): render(), save(), updateNumbers()

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._