# Graph Report - 1bit.kr  (2026-10-29)

## Corpus Check
- 15 files · ~229,522 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 1, .zip 1)

## Summary
- 90 nodes · 128 edges · 11 communities (4 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `398b5be2`
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

## Communities (11 total, 7 thin omitted)

### Community 0 - "motion.test.cjs"
Cohesion: 0.15
Nodes (11): a, b, cachedGif, cachedLoaded, cachedPng, code, emptyReduced, missingCurrent (+3 more)

### Community 1 - "viewer.test.cjs"
Cohesion: 0.11
Nodes (12): code, a, b, code, fallback, mapped, client, context (+4 more)

### Community 2 - "engine.test.cjs"
Cohesion: 0.13
Nodes (8): extra, guessed, many, missing, multi, oldProgress, qs, s

### Community 8 - "render"
Cohesion: 0.83
Nodes (3): render(), save(), updateNumbers()

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `viewer.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._
- **Should `engine.test.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._