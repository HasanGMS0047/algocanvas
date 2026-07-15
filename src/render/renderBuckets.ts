import type { DistributionFrame, DistributionStep } from '../algorithms/distribution/types'
import { PALETTE } from './palette'

const PADDING = 24
const GAP = 6

export function renderBucketFrame(ctx: CanvasRenderingContext2D, width: number, height: number, frame: DistributionFrame) {
  const { array, buckets, step } = frame
  const highlight = getHighlight(step)

  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(step), width / 2, 4)

  const arrayAreaHeight = height * 0.5
  drawArray(ctx, width, arrayAreaHeight, array, highlight.arrayIndex, step.type === 'write')

  const bucketAreaY = arrayAreaHeight + 24
  const bucketAreaHeight = height - bucketAreaY - PADDING
  drawBuckets(ctx, width, bucketAreaY, bucketAreaHeight, buckets, highlight.bucketIndex)
}

function drawArray(
  ctx: CanvasRenderingContext2D,
  width: number,
  areaHeight: number,
  array: number[],
  highlightIndex: number | undefined,
  isWrite: boolean,
) {
  const n = array.length
  const barWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const max = Math.max(...array)
  const usableHeight = areaHeight - PADDING - 24

  for (let i = 0; i < n; i++) {
    const value = array[i]
    const barHeight = (value / max) * usableHeight
    const x = PADDING + i * (barWidth + GAP)
    const y = areaHeight - barHeight

    ctx.fillStyle = i === highlightIndex ? (isWrite ? PALETTE.found : PALETTE.compare) : PALETTE.default
    ctx.fillRect(x, y, barWidth, barHeight)
  }
}

function drawBuckets(
  ctx: CanvasRenderingContext2D,
  width: number,
  y0: number,
  areaHeight: number,
  buckets: number[][],
  activeBucket: number | undefined,
) {
  const n = buckets.length
  const colWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const innerHeight = areaHeight - 20

  for (let b = 0; b < n; b++) {
    const x = PADDING + b * (colWidth + GAP)
    const isActive = b === activeBucket

    ctx.strokeStyle = isActive ? PALETTE.compare : PALETTE.edge
    ctx.lineWidth = isActive ? 2 : 1
    ctx.strokeRect(x, y0, colWidth, innerHeight)

    ctx.fillStyle = PALETTE.textMuted
    ctx.font = "12px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(String(b), x + colWidth / 2, y0 + innerHeight + 4)

    ctx.fillStyle = PALETTE.text
    ctx.font = "13px 'Inter', system-ui, sans-serif"
    buckets[b].forEach((value, idx) => {
      ctx.fillText(String(value), x + colWidth / 2, y0 + 4 + idx * 16)
    })
  }
}

function getHighlight(step: DistributionStep): { arrayIndex?: number; bucketIndex?: number } {
  switch (step.type) {
    case 'place':
      return { arrayIndex: step.fromIndex, bucketIndex: step.bucketIndex }
    case 'write':
      return { arrayIndex: step.toIndex, bucketIndex: step.fromBucket }
    case 'sortBucket':
      return { bucketIndex: step.bucketIndex }
    default:
      return {}
  }
}

function describeStep(step: DistributionStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'place':
      return `place ${step.value} → bucket ${step.bucketIndex}`
    case 'sortBucket':
      return `sort bucket ${step.bucketIndex}`
    case 'write':
      return `write ${step.value} → index ${step.toIndex}`
    case 'done':
      return 'done'
  }
}
