import type { GraphSpec } from './types'

// Weighted so Dijkstra has something to work with; BFS/DFS simply ignore
// the weights. Laid out roughly as two columns (B/C, then D, then E/F) so
// edges don't cross too much.
export const DEMO_GRAPH: GraphSpec = {
  nodes: [
    { id: 'A', x: 0.05, y: 0.5 },
    { id: 'B', x: 0.35, y: 0.15 },
    { id: 'C', x: 0.35, y: 0.85 },
    { id: 'D', x: 0.65, y: 0.5 },
    { id: 'E', x: 0.9, y: 0.15 },
    { id: 'F', x: 0.9, y: 0.85 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 },
  ],
}

export const DEMO_START = 'A'
