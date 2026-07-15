import type { SearchStep } from './types'

// Requires array to already be sorted ascending - the caller is responsible
// for that (see App.tsx, which sorts a copy before running this).
export function* binarySearch(array: number[], target: number): Generator<SearchStep> {
  yield { type: 'start' }

  let lo = 0
  let hi = array.length - 1

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    yield { type: 'probe', index: mid, range: [lo, hi] }

    if (array[mid] === target) {
      yield { type: 'found', index: mid }
      yield { type: 'done' }
      return
    }

    if (array[mid] < target) {
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  yield { type: 'notFound' }
  yield { type: 'done' }
}
