export interface GraphNodeSpec {
  id: string
  // Normalized [0,1] layout position - fixed, not physics-based, since the
  // demo graph is small enough to hand-place.
  x: number
  y: number
}

export interface GraphEdgeSpec {
  from: string
  to: string
  weight?: number
}

export interface GraphSpec {
  nodes: GraphNodeSpec[]
  edges: GraphEdgeSpec[]
  // Neighbour order exactly as the user wrote it in an adjacency list
  // (symmetric - every edge appears on both endpoints). When absent,
  // neighbour order is derived from edge-array order (see buildAdjacency).
  adjacency?: Record<string, string[]>
}

export type GraphStep =
  | { type: 'start' }
  // `stack` (shortest-path DFS only) is the path from the start to nodeId.
  | { type: 'visit'; nodeId: string; stack?: string[] }
  // Shortest-path DFS only: nodeId was fully explored and is being left;
  // `stack` is the path after leaving it.
  | { type: 'backtrack'; nodeId: string; stack: string[] }
  // Shortest-path algorithms only: a (new best) start->target path.
  | { type: 'pathFound'; path: string[] }
  | { type: 'noPath' }
  | { type: 'visitEdge'; from: string; to: string }
  | { type: 'relax'; nodeId: string; distance: number }
  | { type: 'acceptEdge'; from: string; to: string }
  | { type: 'negativeCycle' }
  | { type: 'done' }

export interface GraphFrame {
  step: GraphStep
  visited: string[]
  distances: Record<string, number>
  mstEdges: Array<{ from: string; to: string }>
  hasNegativeCycle: boolean
  // Best start->target path found so far (shortest-path algorithms).
  path: string[]
  // DFS's current path from the start (shortest-path DFS only).
  stack: string[]
}
