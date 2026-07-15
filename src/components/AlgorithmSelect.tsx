import './AlgorithmSelect.css'

interface AlgorithmOption {
  id: string
  name: string
  category: string
}

interface AlgorithmSelectProps {
  algorithms: AlgorithmOption[]
  selectedId: string
  onChange: (id: string) => void
}

export function AlgorithmSelect({ algorithms, selectedId, onChange }: AlgorithmSelectProps) {
  const categories = [...new Set(algorithms.map((a) => a.category))]

  return (
    <select className="algorithm-select" value={selectedId} onChange={(e) => onChange(e.target.value)}>
      {categories.map((category) => (
        <optgroup key={category} label={category}>
          {algorithms
            .filter((a) => a.category === category)
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  )
}
