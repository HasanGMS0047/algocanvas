import { describe, expect, it } from 'vitest'
import { bfs } from './bfs'
import { DEMO_GRAPH } from './demoGraph'
import { recordGraphFrames } from './recordGraphFrames'

describe('bfs', () => {
  it('visits every node exactly once, in the hand-traced order', () => {
    const frames = recordGraphFrames(bfs)
    const final = frames[frames.length - 1]
    expect(final.visited).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
  })

  it('visits all nodes in the demo graph (nothing left unreached)', () => {
    const frames = recordGraphFrames(bfs)
    const final = frames[frames.length - 1]
    expect(new Set(final.visited)).toEqual(new Set(DEMO_GRAPH.nodes.map((n) => n.id)))
  })

  it('never visits a node before it has been reached via an edge from an already-visited node', () => {
    const frames = recordGraphFrames(bfs)
    const visitedSoFar = new Set<string>()
    for (const frame of frames) {
      if (frame.step.type === 'visit') {
        const { nodeId } = frame.step
        if (visitedSoFar.size > 0) {
          // must have been reached via some edge from the graph
          const reachable = DEMO_GRAPH.edges.some(
            (e) =>
              (e.from === nodeId && visitedSoFar.has(e.to)) || (e.to === nodeId && visitedSoFar.has(e.from)),
          )
          expect(reachable).toBe(true)
        }
        visitedSoFar.add(nodeId)
      }
    }
  })
})
