export interface ThemeColors {
  bg: string
  bgSecondary: string
  panel: string
  border: string
  text: string
  textMuted: string
  // Semantic accents, shared by the UI chrome (CSS custom properties) and
  // the canvas PALETTE (see render/palette.ts) - one set of colors drives
  // both instead of maintaining them separately per theme.
  accentBlue: string // primary UI accent; canvas "default/idle" color
  accentPurple: string // secondary UI accent; canvas "structural" color
  accentGreen: string // canvas "found/success" color
  accentOrange: string // canvas "compare/active" color
  danger: string // canvas "swap/delete/error" color
}

export interface ThemeDefinition {
  id: string
  name: string
  mode: 'light' | 'dark'
  colors: ThemeColors
}

export const THEME_PRESETS: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    mode: 'light',
    colors: {
      bg: '#f4f5f9',
      bgSecondary: '#ffffff',
      panel: '#ffffff',
      border: '#dde1e8',
      text: '#1a1d23',
      textMuted: '#5c6370',
      accentBlue: '#2563eb',
      accentPurple: '#7c3aed',
      accentGreen: '#15803d',
      accentOrange: '#c2410c',
      danger: '#dc2626',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    mode: 'dark',
    colors: {
      bg: '#09090b',
      bgSecondary: '#111113',
      panel: '#18181b',
      border: '#27272a',
      text: '#ffffff',
      textMuted: '#a1a1aa',
      accentBlue: '#4f8bff',
      accentPurple: '#7c5cfc',
      accentGreen: '#32d583',
      accentOrange: '#f79009',
      danger: '#f04438',
    },
  },
  {
    id: 'night',
    name: 'Night',
    mode: 'dark',
    colors: {
      bg: '#030308',
      bgSecondary: '#07070f',
      panel: '#0b0b16',
      border: '#1c1c2e',
      text: '#e5e7eb',
      textMuted: '#7d8590',
      accentBlue: '#3f6fd1',
      accentPurple: '#6247c9',
      accentGreen: '#279c68',
      accentOrange: '#d97a06',
      danger: '#c53328',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    mode: 'dark',
    colors: {
      bg: '#06141f',
      bgSecondary: '#0a1d2c',
      panel: '#0d2436',
      border: '#193b52',
      text: '#e3f6ff',
      textMuted: '#7fa8c0',
      accentBlue: '#22d3ee',
      accentPurple: '#38bdf8',
      accentGreen: '#2dd4bf',
      accentOrange: '#fb923c',
      danger: '#f87171',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    mode: 'dark',
    colors: {
      bg: '#1a0f14',
      bgSecondary: '#20141a',
      panel: '#26161d',
      border: '#402531',
      text: '#ffe9e0',
      textMuted: '#b98a91',
      accentBlue: '#fb7185',
      accentPurple: '#a78bfa',
      accentGreen: '#fbbf24',
      accentOrange: '#f472b6',
      danger: '#ef4444',
    },
  },
]

export const DEFAULT_THEME_ID = 'dark'
