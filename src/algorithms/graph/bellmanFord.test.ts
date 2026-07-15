import { describe, expect, it } from 'vitest'
import { bellmanFord } from './bellmanFord'
import { DEMO_GRAPH, DEMO_START } from './demoGraph'
import { recordGraphFrames } from './recordGraphFrames'

describe('bellmanFord', () => {
  it('matches the hand-traced (and Dijkstra-verified) final distances on the demo graph', () => {
    const frames = recordGraphFrames(() => bellmanFord(DEMO_GRAPH, DEMO_START))
    const final = frames[frames.length - 1]
    expect(final.distances).toEqual({ A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 })
    expect(final.hasNegativeCycle).toBe(false)
  })

  it('finalizes (visits) every node on the demo graph, matching Dijkstra', () => {
    const frames = recordGraphFrames(() => bellmanFord(DEMO_GRAPH, DEMO_START))
    const final = frames[frames.length - 1]
    expect(final.visited.sort()).toEqual(DEMO_GRAPH.nodes.map((n) => n.id).sort())
  })

  it('computes shortest paths correctly on an independent small graph', () => {
    // P-Q-R (2+3=5) beats the direct P-R edge (10).
    const graph = {
      nodes: [
        { id: 'P', x: 0, y: 0 },
        { id: 'Q', x: 0.5, y: 0 },
        { id: 'R', x: 1, y: 1 },
      ],
      edges: [
        { from: 'P', to: 'Q', weight: 2 },
        { from: 'Q', to: 'R', weight: 3 },
        { from: 'P', to: 'R', weight: 10 },
      ],
    }
    const frames = recordGraphFrames(() => bellmanFord(graph, 'P'))
    const final = frames[frames.length - 1]
    expect(final.distances).toEqual({ P: 0, Q: 2, R: 5 })
    expect(final.hasNegativeCycle).toBe(false)
  })

  it('detects a negative cycle (a single negative edge is one, in this undirected model)', () => {
    const graph = {
      nodes: [
        { id: 'X', x: 0.2, y: 0.5 },
        { id: 'Y', x: 0.8, y: 0.5 },
      ],
      edges: [{ from: 'X', to: 'Y', weight: -5 }],
    }
    const frames = recordGraphFrames(() => bellmanFord(graph, 'X'))
    const final = frames[frames.length - 1]
    expect(final.hasNegativeCycle).toBe(true)
    // No visited nodes are reported once a negative cycle makes distances unreliable.
    expect(final.visited).toEqual([])
  })

  it('does not false-positive a negative cycle on an all-positive graph with a cycle', () => {
    // A-B-C-A is a genuine cycle, but every edge is positive, so it must
    // never be reported as a negative cycle.
    const graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 1, y: 0 },
        { id: 'C', x: 0.5, y: 1 },
      ],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'C', to: 'A', weight: 1 },
      ],
    }
    const frames = recordGraphFrames(() => bellmanFord(graph, 'A'))
    const final = frames[frames.length - 1]
    expect(final.hasNegativeCycle).toBe(false)
    expect(final.distances).toEqual({ A: 0, B: 1, C: 1 })
  })
})
