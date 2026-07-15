import type { SearchStep } from './types'

export function* linearSearch(array: number[], target: number): Generator<SearchStep> {
  yield { type: 'start' }

  for (let i = 0; i < array.length; i++) {
    yield { type: 'probe', index: i, range: [i, array.length - 1] }
    if (array[i] === target) {
      yield { type: 'found', index: i }
      yield { type: 'done' }
      return
    }
  }

  yield { type: 'notFound' }
  yield { type: 'done' }
}
