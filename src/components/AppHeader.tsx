import { AlgorithmSelect } from './AlgorithmSelect'
import './AppHeader.css'

interface AlgorithmOption {
  id: string
  name: string
  category: string
}

interface AppHeaderProps {
  algorithms: AlgorithmOption[]
  selectedId: string
  onChange: (id: string) => void
}

export function AppHeader({ algorithms, selectedId, onChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <h1>AlgoCanvas</h1>
        <p>Understand algorithms by watching them think.</p>
      </div>
      <AlgorithmSelect algorithms={algorithms} selectedId={selectedId} onChange={onChange} />
    </header>
  )
}
