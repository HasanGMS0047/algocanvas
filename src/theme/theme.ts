import { setPaletteColors } from '../render/palette'
import { DEFAULT_THEME_ID, THEME_PRESETS, type ThemeColors } from './themes'

const STORAGE_KEY = 'algocanvas-theme-v2'

export interface ThemeState {
  presetId: string
  // User color-picker edits layered on top of the preset - lets "Dark, but
  // with a red accent" persist without needing its own preset entry.
  overrides: Partial<ThemeColors>
}

const DEFAULT_STATE: ThemeState = { presetId: DEFAULT_THEME_ID, overrides: {} }

export function loadThemeState(): ThemeState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    if (typeof parsed.presetId !== 'string') return DEFAULT_STATE
    return { presetId: parsed.presetId, overrides: parsed.overrides ?? {} }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveThemeState(state: ThemeState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resolveTheme(state: ThemeState): { colors: ThemeColors; mode: 'light' | 'dark' } {
  const preset = THEME_PRESETS.find((t) => t.id === state.presetId) ?? THEME_PRESETS.find((t) => t.id === DEFAULT_THEME_ID)!
  return { colors: { ...preset.colors, ...state.overrides }, mode: preset.mode }
}

// Applies both the CSS custom properties (read by every component
// stylesheet) and the canvas PALETTE (read by every renderer) from one
// resolved color set, so callers never apply one without the other.
export function applyThemeState(state: ThemeState) {
  const { colors, mode } = resolveTheme(state)
  const root = document.documentElement.style

  root.setProperty('--color-bg', colors.bg)
  root.setProperty('--color-bg-secondary', colors.bgSecondary)
  root.setProperty('--color-panel', colors.panel)
  root.setProperty('--color-border', colors.border)
  root.setProperty('--color-text', colors.text)
  root.setProperty('--color-text-muted', colors.textMuted)
  root.setProperty('--color-accent-blue', colors.accentBlue)
  root.setProperty('--color-accent-purple', colors.accentPurple)
  root.setProperty('--color-accent-green', colors.accentGreen)
  root.setProperty('--color-accent-orange', colors.accentOrange)
  root.setProperty('--color-danger', colors.danger)

  document.documentElement.style.colorScheme = mode
  document.documentElement.dataset.themeMode = mode

  setPaletteColors(colors)
}
