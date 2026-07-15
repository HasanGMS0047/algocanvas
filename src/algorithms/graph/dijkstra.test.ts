import { describe, expect, it } from 'vitest'
import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import { dijkstra } from './dijkstra'
import { recordGraphFrames } from './recordGraphFrames'

// Independent shortest-path check (Bellman-Ford style relaxation over all
// edges, repeated |V|-1 times) - a different algorithm from Dijkstra itself,
// so this isn't just re-running the same code being tested.
function bruteForceShortestDistances(startId: string): Record<string, number> {
  const distances: Record<string, number> = {}
  for (const node of DEMO_GRAPH.nodes) distances[node.id] = Infinity
  distances[startId] = 0

  for (let i = 0; i < DEMO_GRAPH.nodes.length - 1; i++) {
    for (const edge of DEMO_GRAPH.edges) {
      const weight = edge.weight ?? 1
      if (distances[edge.from] + weight < distances[edge.to]) {
        distances[edge.to] = distances[edge.from] + weight
      }
      if (distances[edge.to] + weight < distances[edge.from]) {
        distances[edge.from] = distances[edge.to] + weight
      }
    }
  }

  return distances
}

describe('dijkstra', () => {
  it('matches the hand-traced final distances', () => {
    const frames = recordGraphFrames(dijkstra)
    const final = frames[frames.length - 1]
    expect(final.distances).toEqual({ A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 })
  })

  it('matches an independently computed shortest-path result (Bellman-Ford relaxation)', () => {
    const frames = recordGraphFrames(dijkstra)
    const final = frames[frames.length - 1]
    expect(final.distances).toEqual(bruteForceShortestDistances(DEMO_START))
  })

  it('finalizes (visits) every node exactly once', () => {
    const frames = recordGraphFrames(dijkstra)
    const final = frames[frames.length - 1]
    expect(final.visited.sort()).toEqual(DEMO_GRAPH.nodes.map((n) => n.id).sort())
  })
})
