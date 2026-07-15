import { PALETTE } from './palette'

const MIN_INSIDE_HEIGHT = 18
const LABEL_FONT = "11px 'Inter', system-ui, sans-serif"

// Draws a bar's value inside it, near the top, if the bar is tall enough to
// hold the label - otherwise there's no room, so it goes just above the bar
// instead (using the normal text color rather than white, since it's no
// longer sitting on top of a solid-colored bar).
export function drawBarValue(ctx: CanvasRenderingContext2D, centerX: number, barTop: number, barHeight: number, value: number) {
  ctx.font = LABEL_FONT
  ctx.textAlign = 'center'
  if (barHeight >= MIN_INSIDE_HEIGHT) {
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'top'
    ctx.fillText(String(value), centerX, barTop + 3)
  } else {
    ctx.fillStyle = PALETTE.text
    ctx.textBaseline = 'bottom'
    ctx.fillText(String(value), centerX, barTop - 2)
  }
}

// Draws the array index below the bar's shared baseline.
export function drawBarIndex(ctx: CanvasRenderingContext2D, centerX: number, baselineY: number, index: number) {
  ctx.fillStyle = PALETTE.textMuted
  ctx.font = LABEL_FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(String(index), centerX, baselineY + 2)
}
