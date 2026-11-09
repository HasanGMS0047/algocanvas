import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'
import { buildAdjacency } from './utils'

// Plain DFS finds *a* path, not the shortest one - the first route it stumbles
// on depends entirely on neighbour order. To get the shortest path with DFS
// you have to keep going: on reaching the target, remember the path if it's
// the best so far, then backtrack and try every other route. Branches that
// are already as long as the best path can't win, so they're skipped.
export function* dfsShortestPath(
  graph: GraphSpec = DEMO_GRAPH,
  start: string = DEMO_START,
  target: string = graph.nodes[graph.nodes.length - 1]?.id ?? start,
): Generator<GraphStep> {
  const adjacency = buildAdjacency(graph)
  const onPath = new Set<string>()
  let best: string[] | null = null

  yield* explore(start, [start])

  if (!best) yield { type: 'noPath' }
  yield { type: 'done' }

  function* explore(node: string, path: string[]): Generator<GraphStep> {
    onPath.add(node)
    yield { type: 'visit', nodeId: node, stack: path }

    if (node === target) {
      best = path
      yield { type: 'pathFound', path }
    } else {
      for (const neighbor of adjacency.get(node) ?? []) {
        yield { type: 'visitEdge', from: node, to: neighbor }
        if (onPath.has(neighbor)) continue
        // Going to `neighbor` makes the path path.length + 1 nodes long;
        // that only helps if it's strictly shorter than the best so far.
        if (best && path.length + 1 >= best.length) continue
        yield* explore(neighbor, [...path, neighbor])
      }
    }

    onPath.delete(node)
    yield { type: 'backtrack', nodeId: node, stack: path.slice(0, -1) }
  }
}
