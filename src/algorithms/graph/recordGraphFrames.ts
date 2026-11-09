import type { GraphFrame, GraphStep } from './types'

export function recordGraphFrames(run: () => Generator<GraphStep>): GraphFrame[] {
  const visited: string[] = []
  const distances: Record<string, number> = {}
  const mstEdges: Array<{ from: string; to: string }> = []
  let hasNegativeCycle = false
  let path: string[] = []
  let stack: string[] = []
  const frames: GraphFrame[] = [
    { step: { type: 'start' }, visited: [], distances: {}, mstEdges: [], hasNegativeCycle: false, path: [], stack: [] },
  ]

  for (const step of run()) {
    if (step.type === 'visit') {
      visited.push(step.nodeId)
      if (step.stack) stack = step.stack
    } else if (step.type === 'backtrack') {
      stack = step.stack
    } else if (step.type === 'pathFound') {
      path = step.path
    } else if (step.type === 'relax') {
      distances[step.nodeId] = step.distance
    } else if (step.type === 'acceptEdge') {
      mstEdges.push({ from: step.from, to: step.to })
    } else if (step.type === 'negativeCycle') {
      hasNegativeCycle = true
    }
    frames.push({ step, visited: [...visited], distances: { ...distances }, mstEdges: [...mstEdges], hasNegativeCycle, path, stack })
  }

  return frames
}
