# AlgoCanvas — Product Requirements Document

## 1. Vision
A playground where every algorithm becomes an animation. Users pick an algorithm,
watch it run step-by-step on a canvas, and can pause, rewind, or scrub through
execution frame-by-frame — like a video player for algorithms.

## 2. Full scope

### Visualizations
- **Comparison sorts:** Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort
- **Non-comparison sorts:** Counting Sort, Radix Sort, Bucket Sort
- **Graph:** BFS, DFS, Dijkstra
- **Trees:** Binary Tree, Binary Search Tree (BST), AVL Tree, Red-Black Tree, B-Tree, Trie
  - Full/Complete/Perfect are *shape classifications*, not build algorithms — shown as a
    "check shape" overlay on the Binary Tree visualizer, not a separate feature.
- **Hashing:** Hash Table (with collision resolution shown)

### Playback controls
- Play / Pause
- Step forward / Step back (single frame)
- Scrub via a timeline/slider
- Speed control (0.5x–4x)
- Reset

### Non-goals (any phase)
- User-authored/custom algorithms
- Multi-algorithm race/comparison view
- Mobile-optimized layout
- Accounts, saved sessions, sharing

## 3. Tech stack
- **Language:** TypeScript
- **UI:** React
- **Rendering:** Canvas 2D (`<canvas>` + 2D context), no WebGL in v1
- **Build tool:** Vite
- **Testing:** Vitest for algorithm/generator logic

## 4. Core architecture

### 4.1 Algorithm-as-generator
Every algorithm is implemented as a JS/TS generator function that `yield`s a
**step** object describing what changed, rather than mutating shared state and
animating live. Example shape:

```ts
type Step =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number] }
  | { type: "overwrite"; index: number; value: number }
  | { type: "recurse"; range: [number, number] }
  | { type: "done" };

function* quickSort(arr: number[]): Generator<Step> { ... }
```

### 4.2 Frame recording
On "Run", the generator is fully drained up front into an array of
`{ step, arraySnapshot }` frames. This is what makes rewind/step-back/scrub
free — the player is just an index into a precomputed array, never
re-executing the algorithm.

### 4.3 Renderer
A pure function `render(ctx, frame)` draws the current frame's state
(bars, nodes, edges, hash buckets) to the canvas. Rendering is a stateless
function of `(frame index)` — no incremental drawing logic to keep in sync.

### 4.4 Player
A small state machine (`idle | playing | paused | done`) driving a
`requestAnimationFrame` loop that advances the frame index according to
speed, or is driven directly by the scrub slider / step buttons.

## 5. Build phases (one PR-sized chunk at a time)

Phases are not "v1/v2" cutoffs users see — they're just the order you build in.
Every phase after Phase 1 slots into the same architecture unchanged.

**Phase 1 — Skeleton (proves the architecture works at all)**
1. Project scaffold (Vite + React + TS), empty canvas, no algorithms yet
2. Player component: play/pause/step/scrub/speed, wired to a fake/dummy step sequence
3. Array renderer (bars) + Bubble Sort generator — simplest possible real algorithm,
   first true end-to-end slice

**Phase 2 — Comparison sorts (same renderer, cements the generator pattern)**
4. Selection Sort, Insertion Sort
5. Quick Sort, Merge Sort (recursive control flow — first real test of the pattern)
6. Heap Sort (needs a small heap/tree overlay on the array view)

**Phase 3 — Non-comparison sorts (new renderer needs: buckets/digits)**
7. Counting Sort
8. Radix Sort
9. Bucket Sort

**Phase 4 — Graphs**
10. Graph renderer (nodes/edges) + BFS, DFS
11. Dijkstra (extends graph renderer with weights/distances)

**Phase 5 — Trees (new renderer: nodes/edges laid out hierarchically)**
12. Tree renderer + Binary Tree (insert/search) + shape-classification overlay
    (full/complete/perfect)
13. Binary Search Tree (insert/delete/search with BST invariant)
14. AVL Tree (adds rotations for self-balancing)
15. Red-Black Tree (adds color + rotation rules)
16. B-Tree (multi-way node splits/merges — biggest renderer change so far)
17. Trie (char-by-char renderer, distinct from numeric trees)

**Phase 6 — Hashing & polish**
18. Hash Table visualization (collision resolution shown) + renderer
19. Polish pass: speed presets, keyboard shortcuts, responsive layout

## 6. Success criteria
- Every algorithm above is selectable, runs correctly, and matches its
  textbook step semantics (verified with unit tests on the generator output,
  not just visually).
- Pause/step/rewind/scrub work identically for every algorithm because they
  all go through the same frame-recording/player architecture.
- Each commit in git history corresponds to one working, reviewed feature
  from the build order above.
