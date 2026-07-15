import { DEMO_GRAPH } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'

// Unlike the other graph algorithms, Kruskal's has no meaningful "start"
// node - it processes edges in weight order regardless of where you'd
// begin, so `run` only takes a graph (see GraphAlgorithm.run's optional
// start param, and `usesStart: false` on this algorithm's registry entry).
export function* kruskal(graph: GraphSpec = DEMO_GRAPH): Generator<GraphStep> {
  const parent = new Map<string, string>()
  for (const node of graph.nodes) parent.set(node.id, node.id)

  function find(id: string): string {
    while (parent.get(id) !== id) id = parent.get(id)!
    return id
  }

  const touched = new Set<string>()
  function* markVisited(id: string): Generator<GraphStep> {
    if (!touched.has(id)) {
      touched.add(id)
      yield { type: 'visit', nodeId: id }
    }
  }

  const sortedEdges = [...graph.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1))

  for (const edge of sortedEdges) {
    yield { type: 'visitEdge', from: edge.from, to: edge.to }

    const rootFrom = find(edge.from)
    const rootTo = find(edge.to)
    if (rootFrom !== rootTo) {
      parent.set(rootFrom, rootTo)
      yield { type: 'acceptEdge', from: edge.from, to: edge.to }
      yield* markVisited(edge.from)
      yield* markVisited(edge.to)
    }
  }

  yield { type: 'done' }
}
