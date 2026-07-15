import { describe, expect, it } from 'vitest'
import { hashTable, TABLE_SIZE } from './hashtable'
import { recordHashTableFrames } from './recordHashTableFrames'

describe('hashTable', () => {
  it('chains colliding keys into the same bucket and keeps others separate', () => {
    const frames = recordHashTableFrames(TABLE_SIZE, hashTable)
    // Right after all inserts (the frame where 8, the last insert, lands).
    const afterInserts = frames.find((f) => f.step.type === 'insert' && f.step.key === 8)!
    expect(afterInserts.buckets).toEqual([[], [8], [], [10, 3, 17], [], [], [6, 20]])
  })

  it('search finds an existing key after walking past earlier chain entries', () => {
    const frames = recordHashTableFrames(TABLE_SIZE, hashTable)
    const foundSteps = frames.map((f) => f.step).filter((s) => s.type === 'found')
    expect(foundSteps).toEqual([{ type: 'found', key: 17, bucketIndex: 3 }])
  })

  it('reports a key that hashes into a busy bucket but was never inserted as not found', () => {
    const frames = recordHashTableFrames(TABLE_SIZE, hashTable)
    const notFoundSteps = frames.map((f) => f.step).filter((s) => s.type === 'notFound')
    expect(notFoundSteps).toEqual([{ type: 'notFound', target: 24, bucketIndex: 3 }])
  })

  it('deleting a middle-of-chain key splices it out and preserves order', () => {
    const frames = recordHashTableFrames(TABLE_SIZE, hashTable)
    const final = frames[frames.length - 1]
    expect(final.buckets).toEqual([[], [8], [], [10, 17], [], [], [6, 20]])
  })
})
