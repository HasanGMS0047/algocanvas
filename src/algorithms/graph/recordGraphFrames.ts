import type { GraphFrame, GraphStep } from './types'

export function recordGraphFrames(run: () => Generator<GraphStep>): GraphFrame[] {
  const visited: string[] = []
  const distances: Record<string, number> = {}
  const mstEdges: Array<{ from: string; to: string }> = []
  let hasNegativeCycle = false
  const frames: GraphFrame[] = [
    { step: { type: 'start' }, visited: [], distances: {}, mstEdges: [], hasNegativeCycle: false },
  ]

  for (const step of run()) {
    if (step.type === 'visit') {
      visited.push(step.nodeId)
    } else if (step.type === 'relax') {
      distances[step.nodeId] = step.distance
    } else if (step.type === 'acceptEdge') {
      mstEdges.push({ from: step.from, to: step.to })
    } else if (step.type === 'negativeCycle') {
      hasNegativeCycle = true
    }
    frames.push({ step, visited: [...visited], distances: { ...distances }, mstEdges: [...mstEdges], hasNegativeCycle })
  }

  return frames
}
