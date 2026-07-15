import type { HashStep } from './types'

export const TABLE_SIZE = 7

// 10, 3, and 17 all hash to bucket 3 (a 3-way collision); 6 and 20 collide
// at bucket 6; 8 lands alone at bucket 1 - a mix of chain lengths.
const INSERT_KEYS = [10, 3, 17, 6, 20, 8]
const SEARCH_HIT = 17 // 3rd in its chain, so search must walk past 2 others
const SEARCH_MISS = 24 // hashes to a busy bucket (3) but was never inserted
const DELETE_KEY = 3 // sits in the middle of bucket 3's chain, forcing a splice

function hash(key: number): number {
  return key % TABLE_SIZE
}

export function* hashTable(): Generator<HashStep> {
  const buckets: number[][] = Array.from({ length: TABLE_SIZE }, () => [])

  for (const key of INSERT_KEYS) {
    const bucketIndex = hash(key)
    yield { type: 'hash', key, bucketIndex }
    buckets[bucketIndex].push(key)
    yield { type: 'insert', key, bucketIndex }
  }

  yield* search(buckets, SEARCH_HIT)
  yield* search(buckets, SEARCH_MISS)
  yield* remove(buckets, DELETE_KEY)

  yield { type: 'done' }
}

function* search(buckets: number[][], target: number): Generator<HashStep> {
  const bucketIndex = hash(target)
  yield { type: 'hash', key: target, bucketIndex }

  for (const key of buckets[bucketIndex]) {
    yield { type: 'compare', key, target, bucketIndex }
    if (key === target) {
      yield { type: 'found', key, bucketIndex }
      return
    }
  }

  yield { type: 'notFound', target, bucketIndex }
}

function* remove(buckets: number[][], target: number): Generator<HashStep> {
  const bucketIndex = hash(target)
  yield { type: 'hash', key: target, bucketIndex }

  for (const key of buckets[bucketIndex]) {
    yield { type: 'compare', key, target, bucketIndex }
    if (key === target) {
      buckets[bucketIndex] = buckets[bucketIndex].filter((k) => k !== target)
      yield { type: 'delete', key, bucketIndex }
      return
    }
  }

  yield { type: 'notFound', target, bucketIndex }
}
