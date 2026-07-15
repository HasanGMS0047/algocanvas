import type { GraphNodeSpec, GraphSpec } from './types'

// Undirected adjacency: each edge is pushed onto both endpoints' lists, in
// edge-array order, so traversal order is deterministic and reproducible.
export function buildAdjacency(graph: GraphSpec): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const node of graph.nodes) map.set(node.id, [])
  for (const edge of graph.edges) {
    map.get(edge.from)!.push(edge.to)
    map.get(edge.to)!.push(edge.from)
  }
  return map
}

export function buildWeightedAdjacency(graph: GraphSpec): Map<string, Array<{ to: string; weight: number }>> {
  const map = new Map<string, Array<{ to: string; weight: number }>>()
  for (const node of graph.nodes) map.set(node.id, [])
  for (const edge of graph.edges) {
    const weight = edge.weight ?? 1
    map.get(edge.from)!.push({ to: edge.to, weight })
    map.get(edge.to)!.push({ to: edge.from, weight })
  }
  return map
}

// Places nodes evenly around a circle - no manual x/y placement needed for
// user-defined graphs, unlike the hand-placed DEMO_GRAPH layout.
export function circularLayout(nodeIds: string[]): GraphNodeSpec[] {
  if (nodeIds.length === 1) {
    return [{ id: nodeIds[0], x: 0.5, y: 0.5 }]
  }
  const radius = 0.38
  return nodeIds.map((id, i) => {
    const angle = (i / nodeIds.length) * Math.PI * 2 - Math.PI / 2
    return { id, x: 0.5 + radius * Math.cos(angle), y: 0.5 + radius * Math.sin(angle) }
  })
}

// Inverse of parseGraphText's line format - used to seed the editor with
// the demo graph's edges as editable starting text.
export function graphToText(graph: GraphSpec): string {
  return graph.edges
    .map((e) => (e.weight !== undefined ? `${e.from}-${e.to}:${e.weight}` : `${e.from}-${e.to}`))
    .join('\n')
}
