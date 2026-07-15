import type { LisFrame } from '../algorithms/dp/recordLisFrames'

export function explainLisStep(frame: LisFrame, _algorithmId: string): string {
  const { step, array } = frame

  switch (step.type) {
    case 'start':
      return 'dp[i] will track the length of the longest increasing subsequence ending exactly at index i. Every element is a subsequence of length 1 by itself, so dp starts out all 1s.'
    case 'compare':
      return `Checking whether arr[${step.j}]=${array[step.j]} is smaller than arr[${step.i}]=${array[step.i]} - if so, the subsequence ending at ${step.j} could extend to ${step.i}.`
    case 'update':
      return `Extending through index ${step.index}: dp[${step.index}] improves to ${step.length}.`
    case 'reconstruct':
      return `Walking back through the dp table: index ${step.index} (value ${array[step.index]}) is part of the longest increasing subsequence.`
    case 'done':
      return 'Done - the highlighted values form the longest increasing subsequence.'
    default:
      return ''
  }
}
