import type { SearchStep } from './types'

// Requires array to already be sorted ascending. Estimates the probe
// position by linear interpolation between the range's endpoints instead of
// always taking the midpoint - faster than binary search on uniformly
// distributed data, same worst case otherwise.
export function* interpolationSearch(array: number[], target: number): Generator<SearchStep> {
  yield { type: 'start' }

  let lo = 0
  let hi = array.length - 1

  while (lo <= hi && target >= array[lo] && target <= array[hi]) {
    if (array[hi] === array[lo]) {
      yield { type: 'probe', index: lo, range: [lo, hi] }
      if (array[lo] === target) {
        yield { type: 'found', index: lo }
        yield { type: 'done' }
        return
      }
      break
    }

    const pos = lo + Math.floor(((target - array[lo]) * (hi - lo)) / (array[hi] - array[lo]))
    yield { type: 'probe', index: pos, range: [lo, hi] }

    if (array[pos] === target) {
      yield { type: 'found', index: pos }
      yield { type: 'done' }
      return
    }

    if (array[pos] < target) {
      lo = pos + 1
    } else {
      hi = pos - 1
    }
  }

  yield { type: 'notFound' }
  yield { type: 'done' }
}
