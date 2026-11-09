import type { GraphNodeSpec, GraphSpec } from './types'

// Undirected adjacency: each edge is pushed onto both endpoints' lists, in
// edge-array order, so traversal order is deterministic and reproducible.
export function buildAdjacency(graph: GraphSpec): Map<string, string[]> {
  const map = new Map<string, string[]>()
  if (graph.adjacency) {
    for (const node of graph.nodes) map.set(node.id, [...(graph.adjacency[node.id] ?? [])])
    return map
  }
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
  const lines = graph.edges.map((e) =>
    e.weight !== undefined ? `${e.from}-${e.to}:${e.weight}` : `${e.from}-${e.to}`,
  )
  // A node with no edges can only be written as a bare id on its own line.
  const connected = new Set(graph.edges.flatMap((e) => [e.from, e.to]))
  for (const node of graph.nodes) if (!connected.has(node.id)) lines.push(node.id)
  return lines.join('\n')
}

// Python-dict-style view of the graph: one "node: [neighbours]" line per
// node, listing every neighbour (the graph is undirected, so each edge
// shows up under both endpoints).
export function graphToAdjacencyText(graph: GraphSpec): string {
  const adjacency = buildAdjacency(graph)
  return graph.nodes.map((n) => `${n.id}: [${(adjacency.get(n.id) ?? []).join(', ')}]`).join('\n')
}

// Re-attaches weights from a previous version of the graph to edges that
// still exist - so a round trip through the (unweighted) adjacency-list view
// doesn't silently wipe the weights Dijkstra etc. rely on.
export function mergeWeights(graph: GraphSpec, previous: GraphSpec | null): GraphSpec {
  if (!previous) return graph
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)
  const weights = new Map(previous.edges.map((e) => [key(e.from, e.to), e.weight]))
  return {
    ...graph,
    edges: graph.edges.map((e) => ({ ...e, weight: e.weight ?? weights.get(key(e.from, e.to)) })),
  }
}
