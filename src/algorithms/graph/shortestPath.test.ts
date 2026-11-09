import { describe, expect, it } from 'vitest'
import { bfsShortestPath } from './bfsShortestPath'
import { DEMO_GRAPH } from './demoGraph'
import { dfsShortestPath } from './dfsShortestPath'
import { parseGraphText } from './parseGraphText'
import { recordGraphFrames } from './recordGraphFrames'
import type { GraphSpec } from './types'

const last = <T>(xs: T[]) => xs[xs.length - 1]
const run = (alg: typeof bfsShortestPath, graph: GraphSpec, s: string, t: string) =>
  last(recordGraphFrames(() => alg(graph, s, t)))

// Brute-force shortest hop count, to check both algorithms against.
function hopDistance(graph: GraphSpec, s: string, t: string): number | null {
  const adj = new Map<string, string[]>(graph.nodes.map((n) => [n.id, []]))
  for (const e of graph.edges) {
    adj.get(e.from)!.push(e.to)
    adj.get(e.to)!.push(e.from)
  }
  const dist = new Map([[s, 0]])
  const queue = [s]
  while (queue.length) {
    const current = queue.shift()!
    for (const next of adj.get(current)!) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(current)! + 1)
        queue.push(next)
      }
    }
  }
  return dist.get(t) ?? null
}

describe.each([
  ['bfsShortestPath', bfsShortestPath],
  ['dfsShortestPath', dfsShortestPath],
])('%s', (_name, alg) => {
  it('finds a fewest-edges path on the demo graph', () => {
    const { path } = run(alg, DEMO_GRAPH, 'A', 'F')
    expect(path[0]).toBe('A')
    expect(last(path)).toBe('F')
    expect(path.length - 1).toBe(hopDistance(DEMO_GRAPH, 'A', 'F'))
  })

  it('only returns paths made of real edges', () => {
    const { path } = run(alg, DEMO_GRAPH, 'A', 'F')
    for (let i = 0; i + 1 < path.length; i++) {
      expect(
        DEMO_GRAPH.edges.some(
          (e) => (e.from === path[i] && e.to === path[i + 1]) || (e.to === path[i] && e.from === path[i + 1]),
        ),
      ).toBe(true)
    }
  })

  it('returns a one-node path when start equals target', () => {
    expect(run(alg, DEMO_GRAPH, 'C', 'C').path).toEqual(['C'])
  })

  it('reports noPath (and an empty path) when the target is unreachable', () => {
    const { graph } = parseGraphText('A-B\nC-D')
    const frames = recordGraphFrames(() => alg(graph!, 'A', 'D'))
    expect(last(frames).path).toEqual([])
    expect(frames.some((f) => f.step.type === 'noPath')).toBe(true)
  })

  it('prefers the A-D shortcut over the longer A-B-C-D route', () => {
    const { graph } = parseGraphText('A-B\nB-C\nC-D\nA-D')
    expect(run(alg, graph!, 'A', 'D').path).toEqual(['A', 'D'])
  })

  it('agrees with a brute-force hop count on a cyclic graph, for every start/end pair', () => {
    const { graph } = parseGraphText('A-B\nA-C\nB-D\nC-D\nD-E\nE-F\nC-F\nB-F')
    for (const s of graph!.nodes) {
      for (const t of graph!.nodes) {
        const { path } = run(alg, graph!, s.id, t.id)
        expect(path.length - 1).toBe(hopDistance(graph!, s.id, t.id))
      }
    }
  })
})

describe('dfsShortestPath', () => {
  it('tracks its current path on the stack and returns to empty when done', () => {
    const frames = recordGraphFrames(() => dfsShortestPath(DEMO_GRAPH, 'A', 'F'))
    expect(frames.some((f) => f.stack.length > 1)).toBe(true)
    expect(last(frames).stack).toEqual([])
  })

  it('records strictly improving paths only', () => {
    const { graph } = parseGraphText('A-B\nB-C\nC-D\nA-D')
    const lengths = recordGraphFrames(() => dfsShortestPath(graph!, 'A', 'D'))
      .filter((f) => f.step.type === 'pathFound')
      .map((f) => f.path.length)
    expect(lengths.length).toBeGreaterThan(1)
    for (let i = 1; i < lengths.length; i++) expect(lengths[i]).toBeLessThan(lengths[i - 1])
  })
})

describe('bfsShortestPath', () => {
  it('stops as soon as the target is discovered', () => {
    const frames = recordGraphFrames(() => bfsShortestPath(DEMO_GRAPH, 'A', 'B'))
    expect(last(frames).visited).toEqual(['A', 'B'])
  })
})
