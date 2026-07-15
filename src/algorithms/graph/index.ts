import { bellmanFord } from './bellmanFord'
import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'
import { kruskal } from './kruskal'
import { prim } from './prim'
import type { GraphSpec, GraphStep } from './types'

const CATEGORY = 'Graphs'

export interface GraphAlgorithm {
  id: string
  name: string
  category: string
  run: (graph?: GraphSpec, start?: string) => Generator<GraphStep>
  // Kruskal's processes edges in weight order regardless of a starting
  // point, so it has no meaningful start node - hide that control for it.
  usesStart?: boolean
  // Only Bellman-Ford handles negative weights correctly (and can detect a
  // negative cycle) - see parseGraphText's ParseGraphTextOptions.
  allowsNegativeWeights?: boolean
}

export const GRAPH_ALGORITHMS: GraphAlgorithm[] = [
  { id: 'bfs', name: 'BFS', category: CATEGORY, run: bfs },
  { id: 'dfs', name: 'DFS', category: CATEGORY, run: dfs },
  { id: 'dijkstra', name: 'Dijkstra', category: CATEGORY, run: dijkstra },
  { id: 'bellman-ford', name: 'Bellman-Ford', category: CATEGORY, run: bellmanFord, allowsNegativeWeights: true },
  { id: 'prim', name: "Prim's MST", category: CATEGORY, run: prim },
  { id: 'kruskal', name: "Kruskal's MST", category: CATEGORY, run: kruskal, usesStart: false },
]
