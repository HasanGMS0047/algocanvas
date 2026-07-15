import type { HashStep, HashTableFrame } from './types'

export function recordHashTableFrames(bucketCount: number, run: () => Generator<HashStep>): HashTableFrame[] {
  const buckets: number[][] = Array.from({ length: bucketCount }, () => [])
  const frames: HashTableFrame[] = [{ step: { type: 'start' }, buckets: cloneBuckets(buckets) }]

  for (const step of run()) {
    if (step.type === 'insert') {
      buckets[step.bucketIndex].push(step.key)
    } else if (step.type === 'delete') {
      const index = buckets[step.bucketIndex].indexOf(step.key)
      if (index !== -1) buckets[step.bucketIndex].splice(index, 1)
    }
    frames.push({ step, buckets: cloneBuckets(buckets) })
  }

  return frames
}

function cloneBuckets(buckets: number[][]): number[][] {
  return buckets.map((bucket) => [...bucket])
}
