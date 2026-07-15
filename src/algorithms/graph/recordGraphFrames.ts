import type { GraphFrame, GraphStep } from './types'

export function recordGraphFrames(run: () => Generator<GraphStep>): GraphFrame[] {
  const visited: string[] = []
  const distances: Record<string, number> = {}
  const frames: GraphFrame[] = [{ step: { type: 'start' }, visited: [], distances: {} }]

  for (const step of run()) {
    if (step.type === 'visit') {
      visited.push(step.nodeId)
    } else if (step.type === 'relax') {
      distances[step.nodeId] = step.distance
    }
    frames.push({ step, visited: [...visited], distances: { ...distances } })
  }

  return frames
}
