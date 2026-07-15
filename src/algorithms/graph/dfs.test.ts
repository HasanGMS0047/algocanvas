import { describe, expect, it } from 'vitest'
import { DEMO_GRAPH } from './demoGraph'
import { dfs } from './dfs'
import { recordGraphFrames } from './recordGraphFrames'

describe('dfs', () => {
  it('visits every node exactly once, in the hand-traced order', () => {
    const frames = recordGraphFrames(dfs)
    const final = frames[frames.length - 1]
    expect(final.visited).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
  })

  it('visits all nodes in the demo graph (nothing left unreached)', () => {
    const frames = recordGraphFrames(dfs)
    const final = frames[frames.length - 1]
    expect(new Set(final.visited)).toEqual(new Set(DEMO_GRAPH.nodes.map((n) => n.id)))
  })
})
