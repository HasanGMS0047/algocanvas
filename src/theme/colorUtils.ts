// Converts "#rrggbb" (or shorthand "#rgb") to "rgba(r, g, b, alpha)" - used
// to derive translucent glow/edge colors from a single accent color instead
// of hand-authoring a separate rgba string per theme.
export function hexToRgba(hex: string, alpha: number): string {
  let value = hex.replace('#', '')
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
