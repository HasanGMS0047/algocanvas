import { hexToRgba } from '../theme/colorUtils'
import type { ThemeColors } from '../theme/themes'
import { DEFAULT_THEME_ID, THEME_PRESETS } from '../theme/themes'

// Shared color system for every canvas renderer, matching the app's active
// theme. Semantic names, not literal colors, so a renderer asks for what a
// highlight *means* (compare, found, rotate...) rather than picking its own
// hex value. Derived from the same ThemeColors used for the CSS custom
// properties (see theme/theme.ts) so the UI chrome and the canvas always
// agree, including for fully custom (color-picker-edited) themes.
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

function derivePalette(colors: ThemeColors): PaletteColors {
  return {
    default: colors.accentBlue,
    compare: colors.accentOrange,
    swap: colors.danger,
    found: colors.accentGreen,
    structural: colors.accentPurple,
    edge: hexToRgba(colors.accentBlue, 0.25),
    text: colors.text,
    textMuted: colors.textMuted,
  }
}

const defaultColors = THEME_PRESETS.find((t) => t.id === DEFAULT_THEME_ID)!.colors

// A single mutable object (not reassigned, just mutated in place) so every
// renderer can `import { PALETTE }` once and read current values at draw
// time - switching themes only needs to update these properties, not push
// a new object through every renderer's props.
export const PALETTE: PaletteColors = derivePalette(defaultColors)

export function setPaletteColors(colors: ThemeColors) {
  Object.assign(PALETTE, derivePalette(colors))
}
