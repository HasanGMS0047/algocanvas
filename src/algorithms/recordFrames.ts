import type { SortStep } from './types'

export interface Frame {
  step: SortStep
  array: number[]
}

export function recordFrames(input: number[], run: (arr: number[]) => Generator<SortStep>): Frame[] {
  const array = [...input]
  const frames: Frame[] = [{ step: { type: 'start' }, array: [...array] }]

  for (const step of run(input)) {
    if (step.type === 'swap') {
      const [a, b] = step.indices
      ;[array[a], array[b]] = [array[b], array[a]]
    }
    frames.push({ step, array: [...array] })
  }

  return frames
}
