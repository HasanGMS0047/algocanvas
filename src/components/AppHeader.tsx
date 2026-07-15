import type { ThemeState } from '../theme/theme'
import type { ThemeColors } from '../theme/themes'
import { AlgorithmSelect } from './AlgorithmSelect'
import './AppHeader.css'
import { ThemeManager } from './ThemeManager'

interface AlgorithmOption {
  id: string
  name: string
  category: string
}

interface AppHeaderProps {
  algorithms: AlgorithmOption[]
  selectedId: string
  onChange: (id: string) => void
  themeState: ThemeState
  onThemePresetChange: (presetId: string) => void
  onThemeColorOverride: (key: keyof ThemeColors, value: string) => void
  onThemeResetOverrides: () => void
}

export function AppHeader({
  algorithms,
  selectedId,
  onChange,
  themeState,
  onThemePresetChange,
  onThemeColorOverride,
  onThemeResetOverrides,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <h1>AlgoCanvas</h1>
        <p>Understand algorithms by watching them think.</p>
      </div>
      <div className="app-controls">
        <ThemeManager
          themeState={themeState}
          onPresetChange={onThemePresetChange}
          onColorOverride={onThemeColorOverride}
          onResetOverrides={onThemeResetOverrides}
        />
        <AlgorithmSelect algorithms={algorithms} selectedId={selectedId} onChange={onChange} />
      </div>
    </header>
  )
}
