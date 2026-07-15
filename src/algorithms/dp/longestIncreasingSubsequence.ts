import type { LisStep } from './types'

// Classic O(n^2) DP: dp[i] = length of the longest increasing subsequence
// ending exactly at index i. prev[i] tracks the predecessor index so the
// actual subsequence (not just its length) can be reconstructed at the end.
export function* longestIncreasingSubsequence(array: number[]): Generator<LisStep> {
  const n = array.length
  if (n === 0) {
    yield { type: 'done' }
    return
  }

  const dp = new Array(n).fill(1)
  const prev = new Array(n).fill(-1)

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      yield { type: 'compare', i, j }
      if (array[j] < array[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1
        prev[i] = j
        yield { type: 'update', index: i, length: dp[i] }
      }
    }
  }

  let maxIndex = 0
  for (let i = 1; i < n; i++) {
    if (dp[i] > dp[maxIndex]) maxIndex = i
  }

  const path: number[] = []
  for (let cur = maxIndex; cur !== -1; cur = prev[cur]) {
    path.push(cur)
  }
  path.reverse()

  for (const index of path) {
    yield { type: 'reconstruct', index }
  }

  yield { type: 'done' }
}
