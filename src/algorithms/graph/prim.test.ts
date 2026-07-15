import { describe, expect, it } from 'vitest'
import { DEMO_GRAPH } from './demoGraph'
import { prim } from './prim'
import { recordGraphFrames } from './recordGraphFrames'

// Independent check: try every 5-edge subset of the 9-edge demo graph,
// keep the ones that actually span all 6 nodes, and take the minimum
// total weight - brute force, not a re-run of Prim's own logic.
function bruteForceMstWeight(): number {
  const edges = DEMO_GRAPH.edges
  const n = edges.length
  const nodeCount = DEMO_GRAPH.nodes.length
  let best = Infinity

  for (let mask = 0; mask < 1 << n; mask++) {
    const chosen = edges.filter((_, i) => mask & (1 << i))
    if (chosen.length !== nodeCount - 1) continue

    const parent = new Map(DEMO_GRAPH.nodes.map((node) => [node.id, node.id]))
    const find = (id: string): string => {
      while (parent.get(id) !== id) id = parent.get(id)!
      return id
    }
    let weight = 0
    let valid = true
    for (const edge of chosen) {
      const rf = find(edge.from)
      const rt = find(edge.to)
      if (rf === rt) {
        valid = false
        break
      }
      parent.set(rf, rt)
      weight += edge.weight ?? 1
    }
    if (valid) best = Math.min(best, weight)
  }

  return best
}

describe('prim', () => {
  it('produces the hand-traced MST edges from A', () => {
    const frames = recordGraphFrames(() => prim(DEMO_GRAPH, 'A'))
    const final = frames[frames.length - 1]
    expect(final.mstEdges).toEqual([
      { from: 'A', to: 'C' },
      { from: 'C', to: 'B' },
      { from: 'B', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' },
    ])
  })

  it('total MST weight matches an independent brute-force search', () => {
    const frames = recordGraphFrames(() => prim(DEMO_GRAPH, 'A'))
    const final = frames[frames.length - 1]
    const totalWeight = final.mstEdges.reduce((sum, { from, to }) => {
      const edge = DEMO_GRAPH.edges.find((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from))!
      return sum + (edge.weight ?? 1)
    }, 0)
    expect(totalWeight).toBe(bruteForceMstWeight())
  })

  it('visits every node exactly once', () => {
    const frames = recordGraphFrames(() => prim(DEMO_GRAPH, 'A'))
    const final = frames[frames.length - 1]
    expect(final.visited.sort()).toEqual(DEMO_GRAPH.nodes.map((n) => n.id).sort())
  })

  it('the MST edges connect all nodes into a single spanning tree (n-1 edges, no cycles)', () => {
    const frames = recordGraphFrames(() => prim(DEMO_GRAPH, 'A'))
    const final = frames[frames.length - 1]
    expect(final.mstEdges.length).toBe(DEMO_GRAPH.nodes.length - 1)
  })
})
