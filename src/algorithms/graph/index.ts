import { bellmanFord } from './bellmanFord'
import { bfs } from './bfs'
import { bfsShortestPath } from './bfsShortestPath'
import { dfs } from './dfs'
import { dfsShortestPath } from './dfsShortestPath'
import { dijkstra } from './dijkstra'
import { kruskal } from './kruskal'
import { prim } from './prim'
import type { GraphSpec, GraphStep } from './types'

const CATEGORY = 'Graphs'

export interface GraphAlgorithm {
  id: string
  name: string
  category: string
  run: (graph?: GraphSpec, start?: string, target?: string) => Generator<GraphStep>
  // Kruskal's processes edges in weight order regardless of a starting
  // point, so it has no meaningful start node - hide that control for it.
  usesStart?: boolean
  // Only Bellman-Ford handles negative weights correctly (and can detect a
  // negative cycle) - see parseGraphText's ParseGraphTextOptions.
  allowsNegativeWeights?: boolean
  // Shortest-path algorithms search for a route from the start node to an
  // end node, so they get an "End node" picker and a result panel.
  usesTarget?: boolean
  // Unweighted algorithms can also be fed a Python-style adjacency list
  // (A: [B, C]); weighted ones need the edge-list format to carry weights.
  acceptsAdjacencyList?: boolean
}

export const GRAPH_ALGORITHMS: GraphAlgorithm[] = [
  { id: 'bfs', name: 'BFS', category: CATEGORY, run: bfs, acceptsAdjacencyList: true },
  { id: 'dfs', name: 'DFS', category: CATEGORY, run: dfs, acceptsAdjacencyList: true },
  {
    id: 'bfs-path',
    name: 'BFS Shortest Path',
    category: CATEGORY,
    run: bfsShortestPath,
    usesTarget: true,
    acceptsAdjacencyList: true,
  },
  {
    id: 'dfs-path',
    name: 'DFS Shortest Path',
    category: CATEGORY,
    run: dfsShortestPath,
    usesTarget: true,
    acceptsAdjacencyList: true,
  },
  { id: 'dijkstra', name: 'Dijkstra', category: CATEGORY, run: dijkstra },
  { id: 'bellman-ford', name: 'Bellman-Ford', category: CATEGORY, run: bellmanFord, allowsNegativeWeights: true },
  { id: 'prim', name: "Prim's MST", category: CATEGORY, run: prim },
  { id: 'kruskal', name: "Kruskal's MST", category: CATEGORY, run: kruskal, usesStart: false },
]
