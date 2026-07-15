import { describe, expect, it } from 'vitest'
import { longestIncreasingSubsequence } from './longestIncreasingSubsequence'

// Independent check: try every subsequence (via bitmask, fine for small n),
// keep the strictly increasing ones, and take the longest - brute force,
// not a re-run of the DP itself.
function bruteForceLisLength(arr: number[]): number {
  const n = arr.length
  let best = 0
  for (let mask = 0; mask < 1 << n; mask++) {
    const seq: number[] = []
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) seq.push(arr[i])
    }
    let increasing = true
    for (let i = 1; i < seq.length; i++) {
      if (seq[i] <= seq[i - 1]) {
        increasing = false
        break
      }
    }
    if (increasing) best = Math.max(best, seq.length)
  }
  return best
}

function reconstructedValues(arr: number[]) {
  const steps = [...longestIncreasingSubsequence(arr)]
  return steps.filter((s) => s.type === 'reconstruct').map((s) => (s.type === 'reconstruct' ? arr[s.index] : -1))
}

function isStrictlyIncreasing(values: number[]) {
  return values.every((v, i) => i === 0 || v > values[i - 1])
}

describe('longestIncreasingSubsequence', () => {
  it('finds the hand-traced LIS on the classic example', () => {
    const arr = [10, 9, 2, 5, 3, 7, 101, 18]
    expect(reconstructedValues(arr)).toEqual([2, 5, 7, 101])
  })

  it('reconstructed subsequence length matches an independent brute-force search', () => {
    const cases = [
      [10, 9, 2, 5, 3, 7, 101, 18],
      [1, 2, 3, 4],
      [4, 3, 2, 1],
      [3, 3, 3],
      [7, 2, 8, 1, 3, 4, 10, 6],
    ]
    for (const arr of cases) {
      expect(reconstructedValues(arr).length).toBe(bruteForceLisLength(arr))
    }
  })

  it('the reconstructed subsequence is always strictly increasing and a true subsequence of the input', () => {
    const arr = [7, 2, 8, 1, 3, 4, 10, 6]
    expect(isStrictlyIncreasing(reconstructedValues(arr))).toBe(true)
  })

  it('handles a fully increasing array (the whole array is the LIS)', () => {
    expect(reconstructedValues([1, 2, 3, 4])).toEqual([1, 2, 3, 4])
  })

  it('handles a fully decreasing array (LIS length 1)', () => {
    expect(reconstructedValues([4, 3, 2, 1])).toEqual([4])
  })

  it('handles all-equal values (strict increase required, LIS length 1)', () => {
    expect(reconstructedValues([3, 3, 3])).toEqual([3])
  })

  it('handles a single-element array', () => {
    expect(reconstructedValues([5])).toEqual([5])
  })

  it('handles an empty array without crashing', () => {
    const steps = [...longestIncreasingSubsequence([])]
    expect(steps.find((s) => s.type === 'reconstruct')).toBeUndefined()
    expect(steps[steps.length - 1]).toEqual({ type: 'done' })
  })
})
