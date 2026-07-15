// Shared color system for every canvas renderer, matching the app's active
// theme (src/index.css / src/theme). Semantic names, not literal colors, so
// a renderer asks for what a highlight *means* (compare, found, rotate...)
// rather than picking its own hex value.
export interface PaletteColors {
  default: string
  compare: string
  swap: string
  found: string
  structural: string
  edge: string
  text: string
  textMuted: string
}

export const THEME_IDS = ['dark', 'night'] as const
export type ThemeId = (typeof THEME_IDS)[number]

const THEME_PALETTES: Record<ThemeId, PaletteColors> = {
  dark: {
    default: '#00c8ff', // idle element (bar, node, key) - neon cyan
    compare: '#ff2ec4', // being examined right now - neon magenta
    swap: '#ff5050', // swap / delete / removed - hot red
    found: '#9dff45', // success, insert, found, end-of-word - neon lime
    structural: '#b06bff', // rotation / split / structural change - neon violet
    edge: 'rgba(0, 229, 255, 0.22)', // connecting lines, glowing cyan, muted
    text: '#eafeff',
    textMuted: '#7a8699',
  },
  night: {
    default: '#00a8c2',
    compare: '#d922a8',
    swap: '#e0304f',
    found: '#7dd93a',
    structural: '#8a5cff',
    edge: 'rgba(0, 184, 204, 0.18)',
    text: '#d8f7ff',
    textMuted: '#5c6b7a',
  },
}

// A single mutable object (not reassigned, just mutated in place) so every
// renderer can `import { PALETTE }` once and read current values at draw
// time - switching themes only needs to update these properties, not push
// a new object through every renderer's props.
export const PALETTE: PaletteColors = { ...THEME_PALETTES.dark }

export function setPaletteTheme(themeId: string) {
  Object.assign(PALETTE, THEME_PALETTES[themeId as ThemeId] ?? THEME_PALETTES.dark)
}
