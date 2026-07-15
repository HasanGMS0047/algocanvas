import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'
import { buildWeightedAdjacency } from './utils'

// Grows the MST one node at a time from `start`, always adding the
// cheapest edge that connects a node already in the tree to one that
// isn't. Linear scan of the frontier each round (fine at demo-graph
// scale), same simplicity tradeoff as dijkstra.ts's O(V^2) min-scan.
export function* prim(graph: GraphSpec = DEMO_GRAPH, start: string = DEMO_START): Generator<GraphStep> {
  const adjacency = buildWeightedAdjacency(graph)
  const inMst = new Set<string>([start])
  yield { type: 'visit', nodeId: start }

  while (inMst.size < graph.nodes.length) {
    let best: { from: string; to: string; weight: number } | null = null

    for (const nodeId of inMst) {
      for (const { to, weight } of adjacency.get(nodeId) ?? []) {
        if (inMst.has(to)) continue
        yield { type: 'visitEdge', from: nodeId, to }
        if (!best || weight < best.weight) {
          best = { from: nodeId, to, weight }
        }
      }
    }

    if (!best) break // remaining nodes are unreachable from the tree so far

    inMst.add(best.to)
    yield { type: 'acceptEdge', from: best.from, to: best.to }
    yield { type: 'visit', nodeId: best.to }
  }

  yield { type: 'done' }
}
