import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import type { GraphSpec, GraphStep } from './types'

// Relaxes every edge |V|-1 times (no priority queue, unlike Dijkstra) -
// slower, but correct even with negative weights, and can detect a
// negative cycle with one extra pass. Runs on the same undirected graph
// model as the other graph algorithms; note that in an undirected graph
// any single negative-weight edge is itself a trivial negative cycle
// (crossing it back and forth keeps decreasing the total), so a negative
// edge here will always be reported as one - directed edges would be
// needed to demonstrate negative weights *without* a cycle.
export function* bellmanFord(graph: GraphSpec = DEMO_GRAPH, start: string = DEMO_START): Generator<GraphStep> {
  const distances = new Map<string, number>()
  for (const node of graph.nodes) distances.set(node.id, Infinity)
  distances.set(start, 0)
  yield { type: 'relax', nodeId: start, distance: 0 }

  const nodeCount = graph.nodes.length
  for (let pass = 0; pass < nodeCount - 1; pass++) {
    let anyUpdate = false

    for (const edge of graph.edges) {
      const weight = edge.weight ?? 1
      yield { type: 'visitEdge', from: edge.from, to: edge.to }

      const distFrom = distances.get(edge.from)!
      const distTo = distances.get(edge.to)!

      if (distFrom !== Infinity && distFrom + weight < distTo) {
        distances.set(edge.to, distFrom + weight)
        anyUpdate = true
        yield { type: 'relax', nodeId: edge.to, distance: distFrom + weight }
      }
      if (distTo !== Infinity && distTo + weight < distFrom) {
        distances.set(edge.from, distTo + weight)
        anyUpdate = true
        yield { type: 'relax', nodeId: edge.from, distance: distTo + weight }
      }
    }

    if (!anyUpdate) break
  }

  let hasNegativeCycle = false
  for (const edge of graph.edges) {
    const weight = edge.weight ?? 1
    const distFrom = distances.get(edge.from)!
    const distTo = distances.get(edge.to)!
    if ((distFrom !== Infinity && distFrom + weight < distTo) || (distTo !== Infinity && distTo + weight < distFrom)) {
      hasNegativeCycle = true
      break
    }
  }

  if (hasNegativeCycle) {
    yield { type: 'negativeCycle' }
  } else {
    for (const node of graph.nodes) {
      if (distances.get(node.id) !== Infinity) {
        yield { type: 'visit', nodeId: node.id }
      }
    }
  }

  yield { type: 'done' }
}
