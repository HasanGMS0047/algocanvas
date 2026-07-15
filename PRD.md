# AlgoCanvas — Product Requirements Document

## 1. Vision

**"The Interactive Algorithm Laboratory."**

AlgoCanvas is moving from "pick a fixed demo, watch it animate" to a platform
where users bring their own problems — their own array, their own graph, their
own tree — and watch the algorithm actually solve *that*. The flagship
differentiator on top of that is **"Think Like the Algorithm" mode**: instead
of just watching, the app pauses before each meaningful decision and asks the
user to predict it first, then reveals and explains what really happened.

The interface should feel premium: dark theme, considered typography,
smooth motion, a canvas that invites exploration rather than a static demo
page.

## 2. What exists today (v1 — shipped)

16 algorithms, each fully interactive (play/pause/step/scrub/speed,
keyboard shortcuts), built on a shared generator → recorder → renderer
architecture (§4), with a 108-test Vitest suite covering correctness and
structural invariants:

- **Comparison sorts (6):** Bubble, Selection, Insertion, Quick, Merge, Heap
- **Non-comparison sorts (3):** Counting, Radix, Bucket
- **Trees (6):** Binary Tree (+ full/complete/perfect shape classification),
  BST (insert/search/delete, all 3 delete cases), AVL (rotations), Red-Black
  (color + rotations), B-Tree (multi-key nodes, splits), Trie (prefix sharing)
- **Hashing (1):** Hash Table with chaining collision resolution

**Known gap:** graph algorithms (BFS, DFS, Dijkstra) were in the original
scope for this phase and were never actually built — the build order skipped
straight from sorts to trees. This should be treated as unfinished v1 work,
not new scope.

**The core limitation driving this rewrite of the PRD:** every algorithm
runs against a single hardcoded demo input, chosen by hand to exercise
interesting cases (collisions, rotations, splits, etc.). There is no way for
a user to supply their own array, graph, or tree. That was the original
complaint that started this planning pass, and it's the most important gap
to close.

## 3. What this PRD does *not* commit to (yet)

The following were part of an early, much larger wishlist (auth, a Postgres
+ Redis backend, a real LLM-backed AI tutor, an embedded Monaco code editor
with live execution/debugging, collaborative multi-user sessions, GIF/video/
PDF export, a challenge mode with leaderboards and XP, Docker/Vercel/Railway
deployment). Each of those is a substantial subsystem in its own right —
weeks of work for a real backend team, not a feature to bolt onto a
client-only Vite app in a session. Attempting all of it at once would mean
mostly hollow stubs: an "AI Tutor" panel with no model behind it, an "export
video" button that doesn't export anything. That directly contradicts how
this project has actually been built so far — small, verified, real slices.

These stay on the table as a *possible* future direction if AlgoCanvas ever
grows into a longer-term or multi-person project, but nothing in the phases
below assumes they exist.

## 4. Core architecture (unchanged, proven across 16 algorithms)

### 4.1 Algorithm-as-generator
Every algorithm is a generator function that `yield`s a **step** object
describing what changed, rather than mutating shared state and animating
live directly.

### 4.2 Frame recording
The generator is drained up front into an array of frames. This is what
makes rewind/step-back/scrub free — the player indexes into a precomputed
array, never re-executing the algorithm. New for predict-mode: recording
also needs to mark *which* frames are "decision points" worth pausing at
(see Phase 7).

### 4.3 Renderer
A pure function of `(ctx, width, height, frame)` — no incremental drawing
state to keep in sync. Different visualization families (bars, trees,
buckets, node/edge graphs) get their own renderer sharing this shape.

### 4.4 Player
A state machine driving playback, now needing a new state for predict-mode:
`idle | playing | paused | awaiting-prediction | done`.

## 5. Roadmap (next phases, in order)

Each phase is still one PR-sized chunk at a time, verified in-browser and
committed individually — same discipline as v1.

**Phase 7 — "Think Like the Algorithm" (predict mode)**
- Extend the step vocabulary so specific step types can be flagged as
  "decision points" (pivot choice in Quick Sort, next node in BFS/DFS,
  minimum tentative distance in Dijkstra once it exists, rotation case in
  AVL/RB, etc.)
- Player pauses at a decision point, shows a prediction UI (e.g. "which
  bucket/node/index?"), accepts the user's guess
- On reveal: show correct vs. predicted, continue the animation, explain why
- Start with 2–3 algorithms that have the clearest decision points (Quick
  Sort pivot/partition, BST/AVL insert direction, one graph algorithm once
  Phase 9 lands) rather than retrofitting all 16 at once

**Phase 8 — Visual redesign**
- Dark theme as default: background `#09090B`, panels `#18181B`, accents
  (blue `#4F8BFF`, purple `#7C5CFC`, green `#32D583`, orange `#F79009`,
  danger `#F04438`) — reusing these as the new highlight-color system
  instead of the current ad hoc per-renderer colors
- Inter typeface, larger type scale, generous spacing, 16px rounded corners
- Landing/intro treatment for the algorithm picker; this is a visual pass,
  not a new page/routing structure

**Phase 9 — Graph algorithms (the missed v1 phase)**
- Graph renderer (nodes/edges, force-ish fixed layout — doesn't need to be
  physics-based)
- BFS, DFS, Dijkstra

**Phase 10 — Custom user input**
- Per-algorithm input UI appropriate to its data shape: array editor for
  sorts, node/edge editor for graphs and trees
- Validate input against each algorithm's preconditions (e.g. BST insert
  sequence, connected graph for Dijkstra) with clear error states
- Random / worst-case / best-case generators as a fallback to typing values
  by hand
- This directly replaces the fixed `DEMO_ARRAY` / hardcoded insert
  sequences used throughout v1

**Phase 11 — Algorithm library expansion**
Only after 7–10 are solid. Candidates, roughly in order of reusing existing
renderers vs. needing new ones:
- Searching: Linear, Binary, Jump, Interpolation (reuse array renderer)
- More graphs: Bellman-Ford, Floyd-Warshall, Prim, Kruskal, Topological
  Sort, A*, Union-Find (reuse graph renderer from Phase 9)
- Dynamic programming: Knapsack, LCS, Coin Change, Edit Distance, LIS
  (new renderer: DP table with dependency arrows)
- Backtracking: N-Queens, Sudoku, Maze (new renderer: grid + search tree)
- Greedy: Huffman, Activity Selection, Fractional Knapsack

## 6. Success criteria
- Every phase ships as working, verified, committed slices — no feature is
  "checked off" without running correctly in the browser first.
- Predict-mode (Phase 7) is judged on whether it actually changes how it
  feels to use the app, not on how many algorithms support it initially.
- Custom input (Phase 10) must handle invalid input gracefully for every
  algorithm it's added to, not just the happy path.
