import type { LisStep } from './types'

export interface LisFrame {
  step: LisStep
  array: number[]
  dp: number[]
  lisIndices: number[]
}

export function recordLisFrames(array: number[], run: (array: number[]) => Generator<LisStep>): LisFrame[] {
  const dp = new Array(array.length).fill(1)
  const lisIndices: number[] = []
  const frames: LisFrame[] = [{ step: { type: 'start' }, array, dp: [...dp], lisIndices: [] }]

  for (const step of run(array)) {
    if (step.type === 'update') {
      dp[step.index] = step.length
    } else if (step.type === 'reconstruct') {
      lisIndices.push(step.index)
    }
    frames.push({ step, array, dp: [...dp], lisIndices: [...lisIndices] })
  }

  return frames
}
