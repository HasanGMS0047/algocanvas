import { useMemo, useState } from 'react'
import { SORT_ALGORITHMS } from './algorithms'
import { recordFrames } from './algorithms/recordFrames'
import { AlgorithmSelect } from './components/AlgorithmSelect'
import { SortVisualizer } from './components/SortVisualizer'

const DEMO_ARRAY = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]

function App() {
  const [algorithmId, setAlgorithmId] = useState(SORT_ALGORITHMS[0].id)
  const algorithm = SORT_ALGORITHMS.find((a) => a.id === algorithmId) ?? SORT_ALGORITHMS[0]

  const frames = useMemo(() => recordFrames(DEMO_ARRAY, algorithm.run), [algorithm])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AlgorithmSelect algorithms={SORT_ALGORITHMS} selectedId={algorithmId} onChange={setAlgorithmId} />
      <SortVisualizer key={algorithmId} frames={frames} />
    </div>
  )
}

export default App
