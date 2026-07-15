import { useEffect, useMemo, useState } from 'react'
import { SORT_ALGORITHMS } from './algorithms'
import { BTREE_ALGORITHMS } from './algorithms/btree'
import { recordBTreeFrames } from './algorithms/btree/recordBTreeFrames'
import { DISTRIBUTION_ALGORITHMS } from './algorithms/distribution'
import { recordDistributionFrames } from './algorithms/distribution/recordDistributionFrames'
import { GRAPH_ALGORITHMS } from './algorithms/graph'
import { DEMO_GRAPH, DEMO_START } from './algorithms/graph/demoGraph'
import { parseGraphText } from './algorithms/graph/parseGraphText'
import { recordGraphFrames } from './algorithms/graph/recordGraphFrames'
import { graphToText } from './algorithms/graph/utils'
import { HASHTABLE_ALGORITHMS } from './algorithms/hashtable'
import { recordHashTableFrames } from './algorithms/hashtable/recordHashTableFrames'
import { recordFrames } from './algorithms/recordFrames'
import { SEARCH_ALGORITHMS } from './algorithms/search'
import { recordSearchFrames } from './algorithms/search/recordSearchFrames'
import { TREE_ALGORITHMS } from './algorithms/tree'
import { recordTreeFrames } from './algorithms/tree/recordTreeFrames'
import { TRIE_ALGORITHMS } from './algorithms/trie'
import { recordTrieFrames } from './algorithms/trie/recordTrieFrames'
import { AppHeader } from './components/AppHeader'
import { ArrayInput } from './components/ArrayInput'
import { GraphInput } from './components/GraphInput'
import { TargetInput } from './components/TargetInput'
import { Visualizer } from './components/Visualizer'
import { WordListInput } from './components/WordListInput'
import { avlPredictor } from './predict/avlPredictor'
import { quickSortPredictor } from './predict/quickSortPredictor'
import { renderArrayFrame } from './render/renderArray'
import { renderBTreeFrame } from './render/renderBTree'
import { renderBucketFrame } from './render/renderBuckets'
import { renderGraphFrame } from './render/renderGraph'
import { renderHashTableFrame } from './render/renderHashTable'
import { renderSearchFrame } from './render/renderSearch'
import { renderTreeFrame } from './render/renderTree'
import { renderTrieFrame } from './render/renderTrie'
import { useAlgorithmKind } from './useAlgorithmKind'
import { validateArray } from './validateArray'
import { validateWords } from './validateWords'

const DEFAULT_ARRAY = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
const TREE_SEQUENCE_MAX_LENGTH = 12
const ALL_ALGORITHMS = [
  ...SORT_ALGORITHMS,
  ...DISTRIBUTION_ALGORITHMS,
  ...SEARCH_ALGORITHMS,
  ...GRAPH_ALGORITHMS,
  ...TREE_ALGORITHMS,
  ...BTREE_ALGORITHMS,
  ...TRIE_ALGORITHMS,
  ...HASHTABLE_ALGORITHMS,
]
// Sorts, distribution sorts, and searches all edit the same "array of
// numbers" shape, so they share one ArrayInput row instead of each getting
// its own duplicate editor.
const NUMBER_ARRAY_IDS = new Set(
  [...SORT_ALGORITHMS, ...DISTRIBUTION_ALGORITHMS, ...SEARCH_ALGORITHMS].map((a) => a.id),
)
const SEARCH_IDS = new Set(SEARCH_ALGORITHMS.map((a) => a.id))
const TRIE_IDS = new Set(TRIE_ALGORITHMS.map((a) => a.id))
const DEFAULT_TRIE_WORDS = TRIE_ALGORITHMS[0].defaultWords
const GRAPH_IDS = new Set(GRAPH_ALGORITHMS.map((a) => a.id))
const DEFAULT_GRAPH_TEXT = graphToText(DEMO_GRAPH)

function App() {
  const [algorithmId, setAlgorithmId] = useState(ALL_ALGORITHMS[0].id)
  const [customArray, setCustomArray] = useState<number[]>(DEFAULT_ARRAY)
  const [customTreeSequence, setCustomTreeSequence] = useState<number[] | null>(null)
  const [customWords, setCustomWords] = useState<string[]>(DEFAULT_TRIE_WORDS)
  const [customGraphText, setCustomGraphText] = useState<string | null>(null)
  const [customStartNode, setCustomStartNode] = useState<string | null>(null)
  const [customTarget, setCustomTarget] = useState<number | null>(null)

  const validation = useMemo(() => validateArray(customArray, algorithmId), [customArray, algorithmId])
  const effectiveArray = validation.valid ? customArray : DEFAULT_ARRAY

  // Each tree/B-tree algorithm has its own curated default sequence (chosen
  // to demonstrate specific rotation/split/fixup cases). Reset to "use that
  // default" whenever the algorithm changes, rather than carrying one
  // algorithm's custom sequence over to another.
  const treeDefault =
    TREE_ALGORITHMS.find((a) => a.id === algorithmId)?.defaultSequence ??
    BTREE_ALGORITHMS.find((a) => a.id === algorithmId)?.defaultSequence

  useEffect(() => {
    setCustomTreeSequence(null)
  }, [algorithmId])

  const treeValidation = useMemo(
    () => (treeDefault ? validateArray(customTreeSequence ?? treeDefault, algorithmId, { maxLength: TREE_SEQUENCE_MAX_LENGTH }) : null),
    [customTreeSequence, treeDefault, algorithmId],
  )
  const effectiveTreeSequence = useMemo(() => {
    if (!treeDefault) return undefined
    const candidate = customTreeSequence ?? treeDefault
    return treeValidation?.valid ? candidate : treeDefault
  }, [customTreeSequence, treeDefault, treeValidation])

  const sort = useAlgorithmKind(
    algorithmId,
    SORT_ALGORITHMS,
    (a) => recordFrames(effectiveArray, a.run),
    (ctx, w, h, frame, a) => renderArrayFrame(ctx, w, h, frame, { treeOverlay: a.treeOverlay }),
    [effectiveArray],
  )
  const dist = useAlgorithmKind(
    algorithmId,
    DISTRIBUTION_ALGORITHMS,
    (a) => {
      const bucketCount = a.id === 'counting' ? Math.max(...effectiveArray) + 1 : a.bucketCount
      return recordDistributionFrames(effectiveArray, bucketCount, a.run)
    },
    renderBucketFrame,
    [effectiveArray],
  )
  const searchAlgorithm = SEARCH_ALGORITHMS.find((a) => a.id === algorithmId)
  const searchArray = useMemo(
    () => (searchAlgorithm?.requiresSorted ? [...effectiveArray].sort((a, b) => a - b) : effectiveArray),
    [effectiveArray, searchAlgorithm],
  )
  const effectiveTarget = customTarget ?? searchArray[Math.floor(searchArray.length / 2)] ?? 0

  const search = useAlgorithmKind(
    algorithmId,
    SEARCH_ALGORITHMS,
    (a) => recordSearchFrames(searchArray, effectiveTarget, a.run),
    renderSearchFrame,
    [searchArray, effectiveTarget],
  )

  const graphParse = useMemo(
    () => (customGraphText !== null ? parseGraphText(customGraphText) : null),
    [customGraphText],
  )
  const effectiveGraph = graphParse?.graph ?? DEMO_GRAPH
  const effectiveStart = useMemo(() => {
    if (customStartNode && effectiveGraph.nodes.some((n) => n.id === customStartNode)) return customStartNode
    return effectiveGraph.nodes[0]?.id ?? DEMO_START
  }, [customStartNode, effectiveGraph])

  const graph = useAlgorithmKind(
    algorithmId,
    GRAPH_ALGORITHMS,
    (a) => recordGraphFrames(() => a.run(effectiveGraph, effectiveStart)),
    (ctx, w, h, frame) => renderGraphFrame(ctx, w, h, frame, effectiveGraph),
    [effectiveGraph, effectiveStart],
  )
  const tree = useAlgorithmKind(
    algorithmId,
    TREE_ALGORITHMS,
    (a) => recordTreeFrames(() => a.run(effectiveTreeSequence)),
    renderTreeFrame,
    [effectiveTreeSequence],
  )
  const bTree = useAlgorithmKind(
    algorithmId,
    BTREE_ALGORITHMS,
    (a) => recordBTreeFrames(() => a.run(effectiveTreeSequence)),
    renderBTreeFrame,
    [effectiveTreeSequence],
  )
  const wordsValidation = useMemo(() => validateWords(customWords), [customWords])
  const effectiveWords = wordsValidation.valid ? customWords : DEFAULT_TRIE_WORDS

  const trie = useAlgorithmKind(
    algorithmId,
    TRIE_ALGORITHMS,
    (a) => recordTrieFrames(() => a.run(effectiveWords)),
    renderTrieFrame,
    [effectiveWords],
  )
  const hashTable = useAlgorithmKind(
    algorithmId,
    HASHTABLE_ALGORITHMS,
    (a) => recordHashTableFrames(a.bucketCount, a.run),
    renderHashTableFrame,
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <AppHeader algorithms={ALL_ALGORITHMS} selectedId={algorithmId} onChange={setAlgorithmId} />
      {NUMBER_ARRAY_IDS.has(algorithmId) && (
        <ArrayInput value={customArray} onChange={setCustomArray} error={validation.error} />
      )}
      {SEARCH_IDS.has(algorithmId) && <TargetInput value={effectiveTarget} onChange={setCustomTarget} />}
      {treeDefault && (
        <ArrayInput
          value={customTreeSequence ?? treeDefault}
          onChange={setCustomTreeSequence}
          error={treeValidation?.error}
          placeholder="Insert sequence, e.g. 8, 3, 10, 1, 6"
          randomLengthRange={[6, 9]}
          randomValueMax={50}
        />
      )}
      {TRIE_IDS.has(algorithmId) && (
        <WordListInput value={customWords} onChange={setCustomWords} error={wordsValidation.error} />
      )}
      {GRAPH_IDS.has(algorithmId) && (
        <GraphInput
          value={customGraphText ?? DEFAULT_GRAPH_TEXT}
          onChange={setCustomGraphText}
          error={graphParse?.error}
          startNode={effectiveStart}
          onStartNodeChange={setCustomStartNode}
          nodeIds={effectiveGraph.nodes.map((n) => n.id)}
          showStartNode={GRAPH_ALGORITHMS.find((a) => a.id === algorithmId)?.usesStart ?? true}
        />
      )}
      {sort && (
        <Visualizer
          key={algorithmId}
          frames={sort.frames}
          render={sort.render}
          predictor={algorithmId === 'quick' ? quickSortPredictor : undefined}
        />
      )}
      {dist && <Visualizer key={algorithmId} frames={dist.frames} render={dist.render} />}
      {search && <Visualizer key={algorithmId} frames={search.frames} render={search.render} />}
      {graph && <Visualizer key={algorithmId} frames={graph.frames} render={graph.render} />}
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
