import type { DistributionFrame, DistributionStep } from './types'

export function recordDistributionFrames(
  input: number[],
  bucketCount: number,
  run: (arr: number[]) => Generator<DistributionStep>,
): DistributionFrame[] {
  const array = [...input]
  const buckets: number[][] = Array.from({ length: bucketCount }, () => [])
  const frames: DistributionFrame[] = [
    { step: { type: 'start' }, array: [...array], buckets: cloneBuckets(buckets) },
  ]

  for (const step of run(input)) {
    if (step.type === 'place') {
      buckets[step.bucketIndex].push(step.value)
    } else if (step.type === 'sortBucket') {
      buckets[step.bucketIndex] = [...step.values]
    } else if (step.type === 'write') {
      array[step.toIndex] = step.value
      buckets[step.fromBucket].shift()
    }
    frames.push({ step, array: [...array], buckets: cloneBuckets(buckets) })
  }

  return frames
}

function cloneBuckets(buckets: number[][]): number[][] {
  return buckets.map((bucket) => [...bucket])
}
