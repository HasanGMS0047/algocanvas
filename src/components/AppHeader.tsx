import type { ThemeId } from '../render/palette'
import { AlgorithmSelect } from './AlgorithmSelect'
import './AppHeader.css'
import { ThemeMenu } from './ThemeMenu'

interface AlgorithmOption {
  id: string
  name: string
  category: string
}

interface AppHeaderProps {
  algorithms: AlgorithmOption[]
  selectedId: string
  onChange: (id: string) => void
  themeId: ThemeId
  onThemeChange: (themeId: ThemeId) => void
}

export function AppHeader({ algorithms, selectedId, onChange, themeId, onThemeChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <h1>AlgoCanvas</h1>
        <p>Understand algorithms by watching them think.</p>
      </div>
      <div className="app-controls">
        <ThemeMenu themeId={themeId} onChange={onThemeChange} />
        <AlgorithmSelect algorithms={algorithms} selectedId={selectedId} onChange={onChange} />
      </div>
    </header>
  )
}
