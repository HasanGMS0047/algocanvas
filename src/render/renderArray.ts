import type { Frame } from '../algorithms/recordFrames'

const COLOR_DEFAULT = '#3b82f6'
const COLOR_COMPARE = '#f59e0b'
const COLOR_SWAP = '#ef4444'
const COLOR_OVERWRITE = '#10b981'
const COLOR_TREE_EDGE = 'rgba(128, 128, 128, 0.35)'
const PADDING = 24
const GAP = 4

interface RenderArrayOptions {
  treeOverlay?: boolean
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
    step.type === 'swap' ? COLOR_SWAP : step.type === 'overwrite' ? COLOR_OVERWRITE : COLOR_COMPARE

  const n = array.length
  const barWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const max = Math.max(...array)
  const usableHeight = height - PADDING * 2 - 32

  const centerX = (i: number) => PADDING + i * (barWidth + GAP) + barWidth / 2
  const topY = (i: number) => height - PADDING - (array[i] / max) * usableHeight

  if (options.treeOverlay) {
    ctx.strokeStyle = COLOR_TREE_EDGE
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
    const y = height - PADDING - barHeight

    ctx.fillStyle = highlighted.includes(i) ? highlightColor : COLOR_DEFAULT
    ctx.fillRect(x, y, barWidth, barHeight)
  }

  ctx.fillStyle = '#888'
  ctx.font = '16px system-ui, sans-serif'
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
