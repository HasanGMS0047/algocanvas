import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphStep } from './types'
import { buildAdjacency } from './utils'

export function* dfs(): Generator<GraphStep> {
  const adjacency = buildAdjacency(DEMO_GRAPH)
  const visited = new Set<string>()

  yield* visitNode(DEMO_START)
  yield { type: 'done' }

  function* visitNode(nodeId: string): Generator<GraphStep> {
    visited.add(nodeId)
    yield { type: 'visit', nodeId }

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      yield { type: 'visitEdge', from: nodeId, to: neighbor }
      if (!visited.has(neighbor)) {
        yield* visitNode(neighbor)
      }
    }
  }
}
