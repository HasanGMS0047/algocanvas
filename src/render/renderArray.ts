import type { Frame } from '../algorithms/recordFrames'
import { drawBarIndex, drawBarValue } from './barLabels'
import { PALETTE } from './palette'

const PADDING = 24
const GAP = 4
const LABEL_HEIGHT = 16

interface RenderArrayOptions {
  treeOverlay?: boolean
  showValues?: boolean
}

export function renderArrayFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: Frame,
  options: RenderArrayOptions = {},
) {
  const { array, step } = frame
  const highlighted: number[] =
    step.type === 'compare' || step.type === 'swap' ? step.indices : step.type === 'overwrite' ? [step.index] : []
  const highlightColor =
    step.type === 'swap' ? PALETTE.swap : step.type === 'overwrite' ? PALETTE.found : PALETTE.compare

  const n = array.length
  const barWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const max = Math.max(...array)
  const barBottom = height - PADDING - (options.showValues ? LABEL_HEIGHT : 0)
  const usableHeight = barBottom - PADDING - 32

  const centerX = (i: number) => PADDING + i * (barWidth + GAP) + barWidth / 2
  const topY = (i: number) => barBottom - (array[i] / max) * usableHeight

  if (options.treeOverlay) {
    ctx.strokeStyle = PALETTE.edge
    ctx.lineWidth = 1
    for (let i = 0; i < n; i++) {
      const left = 2 * i + 1
      const right = 2 * i + 2
      if (left < n) drawLine(ctx, centerX(i), topY(i), centerX(left), topY(left))
      if (right < n) drawLine(ctx, centerX(i), topY(i), centerX(right), topY(right))
    }
  }

  for (let i = 0; i < n; i++) {
    const value = array[i]
    const barHeight = (value / max) * usableHeight
    const x = PADDING + i * (barWidth + GAP)
    const y = barBottom - barHeight

    ctx.fillStyle = highlighted.includes(i) ? highlightColor : PALETTE.default
    ctx.fillRect(x, y, barWidth, barHeight)

    if (options.showValues) {
      drawBarValue(ctx, x + barWidth / 2, y, barHeight, value)
      drawBarIndex(ctx, x + barWidth / 2, barBottom, i)
    }
  }

  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(step), width / 2, PADDING / 2)
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function describeStep(step: Frame['step']): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'compare':
      return `compare(${step.indices[0]}, ${step.indices[1]})`
    case 'swap':
      return `swap(${step.indices[0]}, ${step.indices[1]})`
    case 'overwrite':
      return `overwrite(${step.index} = ${step.value})`
    case 'done':
      return 'done'
  }
}
