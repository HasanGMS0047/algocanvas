import { describe, expect, it } from 'vitest'
import { SORT_ALGORITHMS } from '../algorithms'
import { BTREE_ALGORITHMS } from '../algorithms/btree'
import { recordBTreeFrames } from '../algorithms/btree/recordBTreeFrames'
import { DISTRIBUTION_ALGORITHMS } from '../algorithms/distribution'
import { recordDistributionFrames } from '../algorithms/distribution/recordDistributionFrames'
import { DP_ALGORITHMS } from '../algorithms/dp'
import { recordLisFrames } from '../algorithms/dp/recordLisFrames'
import { GRAPH_ALGORITHMS } from '../algorithms/graph'
import { recordGraphFrames } from '../algorithms/graph/recordGraphFrames'
import { HASHTABLE_ALGORITHMS } from '../algorithms/hashtable'
import { recordHashTableFrames } from '../algorithms/hashtable/recordHashTableFrames'
import { recordFrames } from '../algorithms/recordFrames'
import { SEARCH_ALGORITHMS } from '../algorithms/search'
import { recordSearchFrames } from '../algorithms/search/recordSearchFrames'
import { TREE_ALGORITHMS } from '../algorithms/tree'
import { recordTreeFrames } from '../algorithms/tree/recordTreeFrames'
import { TRIE_ALGORITHMS } from '../algorithms/trie'
import { recordTrieFrames } from '../algorithms/trie/recordTrieFrames'
import { explainBTreeStep } from './btreeExplainer'
import { explainDistributionStep } from './distributionExplainer'
import { explainGraphStep } from './graphExplainer'
import { explainHashTableStep } from './hashTableExplainer'
import { explainLisStep } from './lisExplainer'
import { explainSearchStep } from './searchExplainer'
import { explainSortStep } from './sortExplainer'
import { explainTreeStep } from './treeExplainer'
import { explainTrieStep } from './trieExplainer'

const DEMO_ARRAY = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
const SORTED_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8]

describe('explainers produce a non-empty sentence for every step of every real algorithm run', () => {
  it('sorts', () => {
    for (const algo of SORT_ALGORITHMS) {
      const frames = recordFrames(DEMO_ARRAY, algo.run)
      for (const frame of frames) {
        expect(explainSortStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('distribution sorts', () => {
    for (const algo of DISTRIBUTION_ALGORITHMS) {
      const bucketCount = algo.id === 'counting' ? Math.max(...DEMO_ARRAY) + 1 : algo.bucketCount
      const frames = recordDistributionFrames(DEMO_ARRAY, bucketCount, algo.run)
      for (const frame of frames) {
        expect(explainDistributionStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('searches', () => {
    for (const algo of SEARCH_ALGORITHMS) {
      const array = algo.requiresSorted ? SORTED_ARRAY : DEMO_ARRAY
      const target = array[Math.floor(array.length / 2)]
      const frames = recordSearchFrames(array, target, algo.run)
      for (const frame of frames) {
        expect(explainSearchStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
      // Also exercise the notFound branch.
      const missFrames = recordSearchFrames(array, -999, algo.run)
      for (const frame of missFrames) {
        expect(explainSearchStep(frame, algo.id).length, `${algo.id} ${frame.step.type} (miss)`).toBeGreaterThan(0)
      }
    }
  })

  it('graphs', () => {
    for (const algo of GRAPH_ALGORITHMS) {
      const frames = recordGraphFrames(() => algo.run())
      for (const frame of frames) {
        expect(explainGraphStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('trees', () => {
    for (const algo of TREE_ALGORITHMS) {
      const frames = recordTreeFrames(() => algo.run())
      for (const frame of frames) {
        expect(explainTreeStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('b-tree', () => {
    for (const algo of BTREE_ALGORITHMS) {
      const frames = recordBTreeFrames(() => algo.run())
      for (const frame of frames) {
        expect(explainBTreeStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('trie', () => {
    for (const algo of TRIE_ALGORITHMS) {
      const frames = recordTrieFrames(() => algo.run())
      for (const frame of frames) {
        expect(explainTrieStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('hash table', () => {
    for (const algo of HASHTABLE_ALGORITHMS) {
      const frames = recordHashTableFrames(algo.bucketCount, algo.run)
      for (const frame of frames) {
        expect(explainHashTableStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })

  it('dp (lis)', () => {
    for (const algo of DP_ALGORITHMS) {
      const frames = recordLisFrames(DEMO_ARRAY, algo.run)
      for (const frame of frames) {
        expect(explainLisStep(frame, algo.id).length, `${algo.id} ${frame.step.type}`).toBeGreaterThan(0)
      }
    }
  })
})
