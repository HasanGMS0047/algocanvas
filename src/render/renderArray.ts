import type { Frame } from '../algorithms/recordFrames'

const COLOR_DEFAULT = '#3b82f6'
const COLOR_COMPARE = '#f59e0b'
const COLOR_SWAP = '#ef4444'
const PADDING = 24
const GAP = 4

export function renderArrayFrame(ctx: CanvasRenderingContext2D, width: number, height: number, frame: Frame) {
  const { array, step } = frame
  const highlighted: number[] = step.type === 'compare' || step.type === 'swap' ? step.indices : []
  const highlightColor = step.type === 'swap' ? COLOR_SWAP : COLOR_COMPARE

  const n = array.length
  const barWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const max = Math.max(...array)
  const usableHeight = height - PADDING * 2 - 32

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

function describeStep(step: Frame['step']): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'compare':
      return `compare(${step.indices[0]}, ${step.indices[1]})`
    case 'swap':
      return `swap(${step.indices[0]}, ${step.indices[1]})`
    case 'done':
      return 'done'
  }
}
