# Graph Report - 1bit.kr  (2026-10-26)

## Corpus Check
- 13 files · ~28,687 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 64 nodes · 65 edges · 10 communities (4 shown, 6 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c6d55e07`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- motion.test.cjs
- viewer.test.cjs
- engine.test.cjs
- import_questions.py
- contact.js
- motion.js
- viewer.js
- render
- _config.yml

## God Nodes (most connected - your core abstractions)
1. `extract()` - 3 edges
2. `updateNumbers()` - 3 edges
3. `render()` - 2 edges
4. `handleError()` - 2 edges
5. `save()` - 2 edges
6. `render()` - 2 edges
7. `exclude` - 1 edges
8. `copyButton` - 1 edges
9. `copyStatus` - 1 edges
10. `code` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (10 total, 6 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.16
Nodes (6): code, a, b, code, fallback, mapped

### Community 2 - "engine.test.cjs"
Cohesion: 0.15
Nodes (7): extra, many, missing, multi, oldProgress, qs, s

### Community 8 - "render"
Cohesion: 0.83
Nodes (3): render(), save(), updateNumbers()

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._