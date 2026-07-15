import { setPaletteTheme, THEME_IDS, type ThemeId } from '../render/palette'

const STORAGE_KEY = 'algocanvas-theme'
const DEFAULT_THEME: ThemeId = 'dark'

export const THEME_OPTIONS: Array<{ id: ThemeId; label: string }> = [
  { id: 'dark', label: 'Dark' },
  { id: 'night', label: 'Night' },
]

export function loadTheme(): ThemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return (THEME_IDS as readonly string[]).includes(saved ?? '') ? (saved as ThemeId) : DEFAULT_THEME
}

export function saveTheme(themeId: ThemeId) {
  window.localStorage.setItem(STORAGE_KEY, themeId)
}

// Updates both the CSS custom properties (via the data-theme attribute -
// see index.css) and the canvas PALETTE object in one call, so callers
// never apply one without the other.
export function applyTheme(themeId: ThemeId) {
  document.documentElement.dataset.theme = themeId
  setPaletteTheme(themeId)
}
