import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'
import { buildAdjacency } from './utils'

export function* dfs(graph: GraphSpec = DEMO_GRAPH, start: string = DEMO_START): Generator<GraphStep> {
  const adjacency = buildAdjacency(graph)
  const visited = new Set<string>()

  yield* visitNode(start)
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
