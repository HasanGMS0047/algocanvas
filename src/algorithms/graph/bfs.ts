import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'
import { buildAdjacency } from './utils'

export function* bfs(graph: GraphSpec = DEMO_GRAPH, start: string = DEMO_START): Generator<GraphStep> {
  const adjacency = buildAdjacency(graph)
  const visited = new Set<string>([start])
  const queue: string[] = [start]

  yield { type: 'visit', nodeId: start }

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const neighbor of adjacency.get(current) ?? []) {
      yield { type: 'visitEdge', from: current, to: neighbor }
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        yield { type: 'visit', nodeId: neighbor }
      }
    }
  }

  yield { type: 'done' }
}
