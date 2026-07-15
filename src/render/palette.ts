// Shared color system for every canvas renderer, matching the app's dark
// theme (src/index.css). Semantic names, not literal colors, so a renderer
// asks for what a highlight *means* (compare, found, rotate...) rather than
// picking its own hex value - this replaces the ad hoc per-renderer
// constants each renderer previously defined independently.
export const PALETTE = {
  default: '#4f8bff', // idle element (bar, node, key) - accent blue
  compare: '#f79009', // being examined right now - accent orange
  swap: '#f04438', // swap / delete / removed - danger red
  found: '#32d583', // success, insert, found, end-of-word - accent green
  structural: '#7c5cfc', // rotation / split / structural change - accent purple
  edge: 'rgba(161, 161, 170, 0.35)', // connecting lines, muted
  text: '#ffffff',
  textMuted: '#a1a1aa',
} as const
