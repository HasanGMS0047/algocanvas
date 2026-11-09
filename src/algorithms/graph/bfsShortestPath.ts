import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'
import { buildAdjacency } from './utils'

// BFS finds the path with the fewest edges: it explores in rings of equal
// distance from the start, so the first time the target is discovered is
// necessarily via a shortest path - no need to look any further.
export function* bfsShortestPath(
  graph: GraphSpec = DEMO_GRAPH,
  start: string = DEMO_START,
  target: string = graph.nodes[graph.nodes.length - 1]?.id ?? start,
): Generator<GraphStep> {
  const adjacency = buildAdjacency(graph)
  const parent = new Map<string, string | null>([[start, null]])
  const queue: string[] = [start]

  yield { type: 'visit', nodeId: start }

  const pathTo = (node: string): string[] => {
    const path: string[] = []
    for (let n: string | null = node; n !== null; n = parent.get(n) ?? null) path.unshift(n)
    return path
  }

  if (start === target) {
    yield { type: 'pathFound', path: [start] }
    yield { type: 'done' }
    return
  }

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const neighbor of adjacency.get(current) ?? []) {
      yield { type: 'visitEdge', from: current, to: neighbor }
      if (parent.has(neighbor)) continue

      parent.set(neighbor, current)
      queue.push(neighbor)
      yield { type: 'visit', nodeId: neighbor }

      if (neighbor === target) {
        yield { type: 'pathFound', path: pathTo(target) }
        yield { type: 'done' }
        return
      }
    }
  }

  yield { type: 'noPath' }
  yield { type: 'done' }
}
