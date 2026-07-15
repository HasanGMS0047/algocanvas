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
}

export type GraphStep =
  | { type: 'start' }
  | { type: 'visit'; nodeId: string }
  | { type: 'visitEdge'; from: string; to: string }
  | { type: 'relax'; nodeId: string; distance: number }
  | { type: 'done' }

export interface GraphFrame {
  step: GraphStep
  visited: string[]
  distances: Record<string, number>
}
