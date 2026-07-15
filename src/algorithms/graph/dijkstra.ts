import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'
import { buildWeightedAdjacency } from './utils'

export function* dijkstra(graph: GraphSpec = DEMO_GRAPH, start: string = DEMO_START): Generator<GraphStep> {
  const adjacency = buildWeightedAdjacency(graph)
  const distances = new Map<string, number>()
  const finalized = new Set<string>()

  for (const node of graph.nodes) distances.set(node.id, Infinity)
  distances.set(start, 0)
  yield { type: 'relax', nodeId: start, distance: 0 }

  while (finalized.size < graph.nodes.length) {
    let current: string | null = null
    let currentDistance = Infinity
    for (const [id, distance] of distances) {
      if (!finalized.has(id) && distance < currentDistance) {
        current = id
        currentDistance = distance
      }
    }
    if (current === null) break // remaining nodes are unreachable

    finalized.add(current)
    yield { type: 'visit', nodeId: current }

    for (const { to, weight } of adjacency.get(current) ?? []) {
      yield { type: 'visitEdge', from: current, to }
      if (finalized.has(to)) continue

      const candidate = currentDistance + weight
      if (candidate < (distances.get(to) ?? Infinity)) {
        distances.set(to, candidate)
        yield { type: 'relax', nodeId: to, distance: candidate }
      }
    }
  }

  yield { type: 'done' }
}
