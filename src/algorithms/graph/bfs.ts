import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphStep } from './types'
import { buildAdjacency } from './utils'

export function* bfs(): Generator<GraphStep> {
  const adjacency = buildAdjacency(DEMO_GRAPH)
  const visited = new Set<string>([DEMO_START])
  const queue: string[] = [DEMO_START]

  yield { type: 'visit', nodeId: DEMO_START }

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
