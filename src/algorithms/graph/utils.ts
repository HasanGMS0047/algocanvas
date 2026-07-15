import type { GraphSpec } from './types'

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
