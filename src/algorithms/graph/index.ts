import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'
import type { GraphSpec, GraphStep } from './types'

const CATEGORY = 'Graphs'

export interface GraphAlgorithm {
  id: string
  name: string
  category: string
  run: (graph?: GraphSpec, start?: string) => Generator<GraphStep>
}

export const GRAPH_ALGORITHMS: GraphAlgorithm[] = [
  { id: 'bfs', name: 'BFS', category: CATEGORY, run: bfs },
  { id: 'dfs', name: 'DFS', category: CATEGORY, run: dfs },
  { id: 'dijkstra', name: 'Dijkstra', category: CATEGORY, run: dijkstra },
]
