import type { SearchFrame } from '../algorithms/search/recordSearchFrames'
import { PALETTE } from './palette'

const PADDING = 24
const GAP = 4
const LABEL_HEIGHT = 16
const DIMMED = 'rgba(79, 139, 255, 0.18)'

interface RenderSearchOptions {
  showValues?: boolean
}

export function renderSearchFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: SearchFrame,
  options: RenderSearchOptions = {},
) {
  const { array, step, range, foundIndex } = frame
  const n = array.length
  const barWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const max = Math.max(...array, 1)
  const barBottom = height - PADDING - (options.showValues ? LABEL_HEIGHT : 0)
  const usableHeight = barBottom - PADDING - 32

  const activeProbe = step.type === 'probe' ? step.index : null

  for (let i = 0; i < n; i++) {
    const value = array[i]
    const barHeight = (value / max) * usableHeight
    const x = PADDING + i * (barWidth + GAP)
    const y = barBottom - barHeight

    const inRange = i >= range[0] && i <= range[1]
    ctx.fillStyle =
      i === foundIndex
        ? PALETTE.found
        : i === activeProbe
          ? PALETTE.compare
          : inRange
            ? PALETTE.default
            : DIMMED

    ctx.fillRect(x, y, barWidth, barHeight)

    if (options.showValues) {
      ctx.fillStyle = PALETTE.text
      ctx.font = "11px 'Inter', system-ui, sans-serif"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(String(value), x + barWidth / 2, barBottom + 2)
    }
  }

  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame), width / 2, PADDING / 2)
}

function describeStep(frame: SearchFrame): string {
  const { step, array, target } = frame
  switch (step.type) {
    case 'start':
      return `searching for ${target}`
    case 'probe':
      return `check index ${step.index} (value ${array[step.index]})`
    case 'found':
      return `found ${target} at index ${step.index}`
    case 'notFound':
      return `${target} not found`
    case 'done':
      return 'done'
  }
}
