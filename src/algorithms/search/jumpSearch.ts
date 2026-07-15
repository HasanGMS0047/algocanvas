import type { SearchStep } from './types'

// Requires array to already be sorted ascending. Probes the last element of
// each fixed-size block until one is >= target, then linear-scans that
// block only.
export function* jumpSearch(array: number[], target: number): Generator<SearchStep> {
  yield { type: 'start' }

  const n = array.length
  if (n === 0) {
    yield { type: 'notFound' }
    yield { type: 'done' }
    return
  }

  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)))
  let blockStart = 0

  while (blockStart < n) {
    const probeIndex = Math.min(blockStart + blockSize, n) - 1
    yield { type: 'probe', index: probeIndex, range: [blockStart, n - 1] }
    if (array[probeIndex] >= target) break
    blockStart += blockSize
  }

  const rangeEnd = Math.min(blockStart + blockSize, n)
  for (let i = blockStart; i < rangeEnd; i++) {
    yield { type: 'probe', index: i, range: [blockStart, n - 1] }
    if (array[i] === target) {
      yield { type: 'found', index: i }
      yield { type: 'done' }
      return
    }
    if (array[i] > target) break
  }

  yield { type: 'notFound' }
  yield { type: 'done' }
}
