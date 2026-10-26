# Graph Report - 1bit.kr  (2026-10-26)

## Corpus Check
- 12 files · ~6,530 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 53 nodes · 53 edges · 11 communities (4 shown, 7 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `666b1209`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- motion.test.cjs
- viewer.test.cjs
- engine.test.cjs
- contact.test.cjs
- contact.js
- motion.js
- viewer.js
- render
- _config.yml

## God Nodes (most connected - your core abstractions)
1. `updateNumbers()` - 3 edges
2. `render()` - 2 edges
3. `handleError()` - 2 edges
4. `save()` - 2 edges
5. `render()` - 2 edges
6. `exclude` - 1 edges
7. `copyButton` - 1 edges
8. `copyStatus` - 1 edges
9. `code` - 1 edges
10. `code` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 7 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.25
Nodes (5): a, b, code, fallback, mapped

### Community 2 - "engine.test.cjs"
Cohesion: 0.29
Nodes (4): extra, many, multi, s

### Community 8 - "render"
Cohesion: 0.83
Nodes (3): render(), save(), updateNumbers()

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._