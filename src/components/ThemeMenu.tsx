import type { ThemeId } from '../render/palette'
import { THEME_OPTIONS } from '../theme/theme'
import './ThemeMenu.css'

interface ThemeMenuProps {
  themeId: ThemeId
  onChange: (themeId: ThemeId) => void
}

export function ThemeMenu({ themeId, onChange }: ThemeMenuProps) {
  return (
    <select
      className="theme-menu"
      value={themeId}
      onChange={(e) => onChange(e.target.value as ThemeId)}
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
