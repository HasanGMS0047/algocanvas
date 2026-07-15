import { useCallback, useMemo, useState } from 'react'
import { SORT_ALGORITHMS } from './algorithms'
import { BTREE_ALGORITHMS } from './algorithms/btree'
import { recordBTreeFrames } from './algorithms/btree/recordBTreeFrames'
import type { BTreeFrame } from './algorithms/btree/types'
import { DISTRIBUTION_ALGORITHMS } from './algorithms/distribution'
import { recordDistributionFrames } from './algorithms/distribution/recordDistributionFrames'
import type { DistributionFrame } from './algorithms/distribution/types'
import { HASHTABLE_ALGORITHMS } from './algorithms/hashtable'
import { recordHashTableFrames } from './algorithms/hashtable/recordHashTableFrames'
import type { HashTableFrame } from './algorithms/hashtable/types'
import { recordFrames } from './algorithms/recordFrames'
import type { Frame } from './algorithms/recordFrames'
import { TREE_ALGORITHMS } from './algorithms/tree'
import { recordTreeFrames } from './algorithms/tree/recordTreeFrames'
import type { TreeFrame } from './algorithms/tree/types'
import { TRIE_ALGORITHMS } from './algorithms/trie'
import { recordTrieFrames } from './algorithms/trie/recordTrieFrames'
import type { TrieFrame } from './algorithms/trie/types'
import { AlgorithmSelect } from './components/AlgorithmSelect'
import { Visualizer } from './components/Visualizer'
import { renderArrayFrame } from './render/renderArray'
import { renderBTreeFrame } from './render/renderBTree'
import { renderBucketFrame } from './render/renderBuckets'
import { renderHashTableFrame } from './render/renderHashTable'
import { renderTreeFrame } from './render/renderTree'
import { renderTrieFrame } from './render/renderTrie'

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

  const sortAlgorithm = SORT_ALGORITHMS.find((a) => a.id === algorithmId)
  const distAlgorithm = DISTRIBUTION_ALGORITHMS.find((a) => a.id === algorithmId)
  const treeAlgorithm = TREE_ALGORITHMS.find((a) => a.id === algorithmId)
  const bTreeAlgorithm = BTREE_ALGORITHMS.find((a) => a.id === algorithmId)
  const trieAlgorithm = TRIE_ALGORITHMS.find((a) => a.id === algorithmId)
  const hashTableAlgorithm = HASHTABLE_ALGORITHMS.find((a) => a.id === algorithmId)

  const sortRender = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, frame: Frame) => {
      renderArrayFrame(ctx, width, height, frame, { treeOverlay: sortAlgorithm?.treeOverlay })
    },
    [sortAlgorithm],
  )

  const distRender = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: DistributionFrame) => {
    renderBucketFrame(ctx, width, height, frame)
  }, [])

  const treeRender = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: TreeFrame) => {
    renderTreeFrame(ctx, width, height, frame)
  }, [])

  const bTreeRender = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: BTreeFrame) => {
    renderBTreeFrame(ctx, width, height, frame)
  }, [])

  const trieRender = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: TrieFrame) => {
    renderTrieFrame(ctx, width, height, frame)
  }, [])

  const hashTableRender = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, frame: HashTableFrame) => {
      renderHashTableFrame(ctx, width, height, frame)
    },
    [],
  )

  const sortFrames = useMemo(
    () => (sortAlgorithm ? recordFrames(DEMO_ARRAY, sortAlgorithm.run) : null),
    [sortAlgorithm],
  )
  const distFrames = useMemo(
    () => (distAlgorithm ? recordDistributionFrames(distAlgorithm.demoArray, distAlgorithm.bucketCount, distAlgorithm.run) : null),
    [distAlgorithm],
  )
  const treeFrames = useMemo(() => (treeAlgorithm ? recordTreeFrames(treeAlgorithm.run) : null), [treeAlgorithm])
  const bTreeFrames = useMemo(
    () => (bTreeAlgorithm ? recordBTreeFrames(bTreeAlgorithm.run) : null),
    [bTreeAlgorithm],
  )
  const trieFrames = useMemo(() => (trieAlgorithm ? recordTrieFrames(trieAlgorithm.run) : null), [trieAlgorithm])
  const hashTableFrames = useMemo(
    () => (hashTableAlgorithm ? recordHashTableFrames(hashTableAlgorithm.bucketCount, hashTableAlgorithm.run) : null),
    [hashTableAlgorithm],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <AlgorithmSelect algorithms={ALL_ALGORITHMS} selectedId={algorithmId} onChange={setAlgorithmId} />
      {sortFrames && <Visualizer key={algorithmId} frames={sortFrames} render={sortRender} />}
      {distFrames && <Visualizer key={algorithmId} frames={distFrames} render={distRender} />}
      {treeFrames && <Visualizer key={algorithmId} frames={treeFrames} render={treeRender} />}
      {bTreeFrames && <Visualizer key={algorithmId} frames={bTreeFrames} render={bTreeRender} />}
      {trieFrames && <Visualizer key={algorithmId} frames={trieFrames} render={trieRender} />}
      {hashTableFrames && <Visualizer key={algorithmId} frames={hashTableFrames} render={hashTableRender} />}
    </div>
  )
}

export default App
