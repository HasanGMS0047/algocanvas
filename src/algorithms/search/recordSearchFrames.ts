import type { SearchStep } from './types'

export interface SearchFrame {
  step: SearchStep
  array: number[]
  target: number
  range: [number, number]
  foundIndex: number | null
}

export function recordSearchFrames(
  array: number[],
  target: number,
  run: (array: number[], target: number) => Generator<SearchStep>,
): SearchFrame[] {
  const frames: SearchFrame[] = []
  let range: [number, number] = [0, array.length - 1]
  let foundIndex: number | null = null

  for (const step of run(array, target)) {
    if (step.type === 'probe') range = step.range
    if (step.type === 'found') foundIndex = step.index
    frames.push({ step, array, target, range, foundIndex })
  }

  return frames
}
