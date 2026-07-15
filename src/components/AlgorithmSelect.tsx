import type { SortAlgorithm } from '../algorithms'
import './AlgorithmSelect.css'

interface AlgorithmSelectProps {
  algorithms: SortAlgorithm[]
  selectedId: string
  onChange: (id: string) => void
}

export function AlgorithmSelect({ algorithms, selectedId, onChange }: AlgorithmSelectProps) {
  return (
    <select className="algorithm-select" value={selectedId} onChange={(e) => onChange(e.target.value)}>
      {algorithms.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  )
}
