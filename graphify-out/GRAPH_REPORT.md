# Graph Report - 1bit.kr  (2026-10-26)

## Corpus Check
- 12 files · ~6,558 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 52 nodes · 52 edges · 11 communities (3 shown, 8 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40d28e4a`
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
1. `render()` - 4 edges
2. `render()` - 2 edges
3. `handleError()` - 2 edges
4. `save()` - 2 edges
5. `exclude` - 1 edges
6. `copyButton` - 1 edges
7. `copyStatus` - 1 edges
8. `code` - 1 edges
9. `code` - 1 edges
10. `a` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 8 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.25
Nodes (5): a, b, code, fallback, mapped

### Community 2 - "engine.test.cjs"
Cohesion: 0.29
Nodes (4): extra, many, multi, s

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._