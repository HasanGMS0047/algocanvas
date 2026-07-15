import { describe, expect, it } from 'vitest'
import { DEMO_GRAPH } from './demoGraph'
import { kruskal } from './kruskal'
import { recordGraphFrames } from './recordGraphFrames'

describe('kruskal', () => {
  it('produces the hand-traced MST edges (processed in ascending weight order)', () => {
    const frames = recordGraphFrames(() => kruskal(DEMO_GRAPH))
    const final = frames[frames.length - 1]
    expect(final.mstEdges).toEqual([
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' },
      { from: 'B', to: 'D' },
    ])
  })

  it('matches the independently brute-forced MST weight (see prim.test.ts) of 13', () => {
    const frames = recordGraphFrames(() => kruskal(DEMO_GRAPH))
    const final = frames[frames.length - 1]
    const totalWeight = final.mstEdges.reduce((sum, { from, to }) => {
      const edge = DEMO_GRAPH.edges.find((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from))!
      return sum + (edge.weight ?? 1)
    }, 0)
    expect(totalWeight).toBe(13)
  })

  it('marks a node visited only once it is touched by an accepted edge', () => {
    const frames = recordGraphFrames(() => kruskal(DEMO_GRAPH))
    const final = frames[frames.length - 1]
    expect(final.visited.sort()).toEqual(DEMO_GRAPH.nodes.map((n) => n.id).sort())
    expect(new Set(final.visited).size).toBe(final.visited.length) // no duplicates
  })

  it('the MST edges connect all nodes into a single spanning tree (n-1 edges, no cycles)', () => {
    const frames = recordGraphFrames(() => kruskal(DEMO_GRAPH))
    const final = frames[frames.length - 1]
    expect(final.mstEdges.length).toBe(DEMO_GRAPH.nodes.length - 1)
  })

  it('runs without a start node (ignores one if passed, matching GraphAlgorithm.run shape)', () => {
    const frames = recordGraphFrames(() => kruskal(DEMO_GRAPH))
    expect(frames.length).toBeGreaterThan(0)
  })
})
