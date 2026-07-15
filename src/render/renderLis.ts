import type { LisFrame } from '../algorithms/dp/recordLisFrames'
import { PALETTE } from './palette'

const PADDING = 24
const GAP = 4
const LABEL_HEIGHT = 18

export function renderLisFrame(ctx: CanvasRenderingContext2D, width: number, height: number, frame: LisFrame) {
  const { array, step, dp, lisIndices } = frame
  const n = array.length
  const barWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const max = Math.max(...array, 1)
  const barBottom = height - PADDING - LABEL_HEIGHT
  const usableHeight = barBottom - PADDING - 32

  const compareIndices = step.type === 'compare' ? [step.i, step.j] : []
  const activeIndex = step.type === 'update' || step.type === 'reconstruct' ? step.index : null
  const lisSet = new Set(lisIndices)

  for (let i = 0; i < n; i++) {
    const value = array[i]
    const barHeight = (value / max) * usableHeight
    const x = PADDING + i * (barWidth + GAP)
    const y = barBottom - barHeight

    ctx.fillStyle = lisSet.has(i)
      ? PALETTE.found
      : i === activeIndex
        ? PALETTE.swap
        : compareIndices.includes(i)
          ? PALETTE.compare
          : PALETTE.default
    ctx.fillRect(x, y, barWidth, barHeight)

    ctx.fillStyle = PALETTE.textMuted
    ctx.font = "11px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`dp=${dp[i]}`, x + barWidth / 2, barBottom + 2)
  }

  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame), width / 2, PADDING / 2)
}

function describeStep(frame: LisFrame): string {
  const { step, array } = frame
  switch (step.type) {
    case 'start':
      return 'start'
    case 'compare':
      return `is arr[${step.j}]=${array[step.j]} < arr[${step.i}]=${array[step.i]}?`
    case 'update':
      return `dp[${step.index}] = ${step.length}`
    case 'reconstruct':
      return `index ${step.index} (value ${array[step.index]}) is part of the LIS`
    case 'done':
      return 'done'
  }
}
