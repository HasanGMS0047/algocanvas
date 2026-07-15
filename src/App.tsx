import { useCallback, useMemo, useState } from 'react'
import { SORT_ALGORITHMS } from './algorithms'
import { DISTRIBUTION_ALGORITHMS } from './algorithms/distribution'
import { recordDistributionFrames } from './algorithms/distribution/recordDistributionFrames'
import type { DistributionFrame } from './algorithms/distribution/types'
import { recordFrames } from './algorithms/recordFrames'
import type { Frame } from './algorithms/recordFrames'
import { TREE_ALGORITHMS } from './algorithms/tree'
import { recordTreeFrames } from './algorithms/tree/recordTreeFrames'
import type { TreeFrame } from './algorithms/tree/types'
import { AlgorithmSelect } from './components/AlgorithmSelect'
import { Visualizer } from './components/Visualizer'
import { renderArrayFrame } from './render/renderArray'
import { renderBucketFrame } from './render/renderBuckets'
import { renderTreeFrame } from './render/renderTree'

const DEMO_ARRAY = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
const ALL_ALGORITHMS = [...SORT_ALGORITHMS, ...DISTRIBUTION_ALGORITHMS, ...TREE_ALGORITHMS]

function App() {
  const [algorithmId, setAlgorithmId] = useState(ALL_ALGORITHMS[0].id)

  const sortAlgorithm = SORT_ALGORITHMS.find((a) => a.id === algorithmId)
  const distAlgorithm = DISTRIBUTION_ALGORITHMS.find((a) => a.id === algorithmId)
  const treeAlgorithm = TREE_ALGORITHMS.find((a) => a.id === algorithmId)

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

  const sortFrames = useMemo(
    () => (sortAlgorithm ? recordFrames(DEMO_ARRAY, sortAlgorithm.run) : null),
    [sortAlgorithm],
  )
  const distFrames = useMemo(
    () => (distAlgorithm ? recordDistributionFrames(distAlgorithm.demoArray, distAlgorithm.bucketCount, distAlgorithm.run) : null),
    [distAlgorithm],
  )
  const treeFrames = useMemo(() => (treeAlgorithm ? recordTreeFrames(treeAlgorithm.run) : null), [treeAlgorithm])

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <AlgorithmSelect algorithms={ALL_ALGORITHMS} selectedId={algorithmId} onChange={setAlgorithmId} />
      {sortFrames && <Visualizer key={algorithmId} frames={sortFrames} render={sortRender} />}
      {distFrames && <Visualizer key={algorithmId} frames={distFrames} render={distRender} />}
      {treeFrames && <Visualizer key={algorithmId} frames={treeFrames} render={treeRender} />}
    </div>
  )
}

export default App
