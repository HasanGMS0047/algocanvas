import { useEffect, useRef, useState } from 'react'
import { resolveTheme, type ThemeState } from '../theme/theme'
import { THEME_PRESETS, type ThemeColors } from '../theme/themes'
import './ThemeManager.css'

interface ThemeManagerProps {
  themeState: ThemeState
  onPresetChange: (presetId: string) => void
  onColorOverride: (key: keyof ThemeColors, value: string) => void
  onResetOverrides: () => void
}

const COLOR_FIELDS: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: 'bg', label: 'Background' },
  { key: 'panel', label: 'Panel' },
  { key: 'text', label: 'Text' },
  { key: 'textMuted', label: 'Muted text' },
  { key: 'accentBlue', label: 'Accent 1' },
  { key: 'accentPurple', label: 'Accent 2' },
  { key: 'accentGreen', label: 'Success' },
  { key: 'danger', label: 'Danger' },
]

export function ThemeManager({ themeState, onPresetChange, onColorOverride, onResetOverrides }: ThemeManagerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { colors } = resolveTheme(themeState)
  const hasOverrides = Object.keys(themeState.overrides).length > 0

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="theme-manager" ref={containerRef}>
      <button
        type="button"
        className="theme-manager-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Theme"
      >
        <span className="theme-manager-swatch" style={{ background: colors.accentBlue }} />
        Theme
      </button>

      {open && (
        <div className="theme-manager-panel">
          <div className="theme-manager-presets">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`theme-preset-option${preset.id === themeState.presetId ? ' active' : ''}`}
                onClick={() => onPresetChange(preset.id)}
              >
                <span className="theme-preset-swatches">
                  <span style={{ background: preset.colors.bg }} />
                  <span style={{ background: preset.colors.accentBlue }} />
                  <span style={{ background: preset.colors.accentPurple }} />
                  <span style={{ background: preset.colors.accentGreen }} />
                </span>
                {preset.name}
              </button>
            ))}
          </div>

          <div className="theme-manager-colors">
            <p className="theme-manager-heading">Customize colors</p>
            {COLOR_FIELDS.map((field) => (
              <label key={field.key} className="theme-color-field">
                {field.label}
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={(e) => onColorOverride(field.key, e.target.value)}
                />
              </label>
            ))}
            {hasOverrides && (
              <button type="button" className="theme-reset-button" onClick={onResetOverrides}>
                Reset to preset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
