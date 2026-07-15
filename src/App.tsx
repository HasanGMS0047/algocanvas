import { useState } from 'react'
import { SORT_ALGORITHMS } from './algorithms'
import { BTREE_ALGORITHMS } from './algorithms/btree'
import { recordBTreeFrames } from './algorithms/btree/recordBTreeFrames'
import { DISTRIBUTION_ALGORITHMS } from './algorithms/distribution'
import { recordDistributionFrames } from './algorithms/distribution/recordDistributionFrames'
import { HASHTABLE_ALGORITHMS } from './algorithms/hashtable'
import { recordHashTableFrames } from './algorithms/hashtable/recordHashTableFrames'
import { recordFrames } from './algorithms/recordFrames'
import { TREE_ALGORITHMS } from './algorithms/tree'
import { recordTreeFrames } from './algorithms/tree/recordTreeFrames'
import { TRIE_ALGORITHMS } from './algorithms/trie'
import { recordTrieFrames } from './algorithms/trie/recordTrieFrames'
import { AppHeader } from './components/AppHeader'
import { Visualizer } from './components/Visualizer'
import { avlPredictor } from './predict/avlPredictor'
import { quickSortPredictor } from './predict/quickSortPredictor'
import { renderArrayFrame } from './render/renderArray'
import { renderBTreeFrame } from './render/renderBTree'
import { renderBucketFrame } from './render/renderBuckets'
import { renderHashTableFrame } from './render/renderHashTable'
import { renderTreeFrame } from './render/renderTree'
import { renderTrieFrame } from './render/renderTrie'
import { useAlgorithmKind } from './useAlgorithmKind'

const DEMO_ARRAY = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
const ALL_ALGORITHMS = [
  ...SORT_ALGORITHMS,
  ...DISTRIBUTION_ALGORITHMS,
  ...TREE_ALGORITHMS,
  ...BTREE_ALGORITHMS,
  ...TRIE_ALGORITHMS,
  ...HASHTABLE_ALGORITHMS,
]

function App() {
  const [algorithmId, setAlgorithmId] = useState(ALL_ALGORITHMS[0].id)

  const sort = useAlgorithmKind(
    algorithmId,
    SORT_ALGORITHMS,
    (a) => recordFrames(DEMO_ARRAY, a.run),
    (ctx, w, h, frame, a) => renderArrayFrame(ctx, w, h, frame, { treeOverlay: a.treeOverlay }),
  )
  const dist = useAlgorithmKind(
    algorithmId,
    DISTRIBUTION_ALGORITHMS,
    (a) => recordDistributionFrames(a.demoArray, a.bucketCount, a.run),
    renderBucketFrame,
  )
  const tree = useAlgorithmKind(algorithmId, TREE_ALGORITHMS, (a) => recordTreeFrames(a.run), renderTreeFrame)
  const bTree = useAlgorithmKind(algorithmId, BTREE_ALGORITHMS, (a) => recordBTreeFrames(a.run), renderBTreeFrame)
  const trie = useAlgorithmKind(algorithmId, TRIE_ALGORITHMS, (a) => recordTrieFrames(a.run), renderTrieFrame)
  const hashTable = useAlgorithmKind(
    algorithmId,
    HASHTABLE_ALGORITHMS,
    (a) => recordHashTableFrames(a.bucketCount, a.run),
    renderHashTableFrame,
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <AppHeader algorithms={ALL_ALGORITHMS} selectedId={algorithmId} onChange={setAlgorithmId} />
      {sort && (
        <Visualizer
          key={algorithmId}
          frames={sort.frames}
          render={sort.render}
          predictor={algorithmId === 'quick' ? quickSortPredictor : undefined}
        />
      )}
      {dist && <Visualizer key={algorithmId} frames={dist.frames} render={dist.render} />}
      {tree && (
        <Visualizer
          key={algorithmId}
          frames={tree.frames}
          render={tree.render}
          predictor={algorithmId === 'avl' ? avlPredictor : undefined}
        />
      )}
      {bTree && <Visualizer key={algorithmId} frames={bTree.frames} render={bTree.render} />}
      {trie && <Visualizer key={algorithmId} frames={trie.frames} render={trie.render} />}
      {hashTable && <Visualizer key={algorithmId} frames={hashTable.frames} render={hashTable.render} />}
    </div>
  )
}

export default App
