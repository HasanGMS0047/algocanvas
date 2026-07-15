import type { HashStep, HashTableFrame } from '../algorithms/hashtable/types'

const PADDING = 24
const GAP = 8
const BUCKET_AREA_Y = 48
const COLOR_HASH = '#f59e0b'
const COLOR_COMPARE = '#f59e0b'
const COLOR_INSERT = '#10b981'
const COLOR_FOUND = '#10b981'
const COLOR_DELETE = '#ef4444'

export function renderHashTableFrame(ctx: CanvasRenderingContext2D, width: number, height: number, frame: HashTableFrame) {
  ctx.fillStyle = '#888'
  ctx.font = '16px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame.step), width / 2, 4)

  const { buckets } = frame
  const n = buckets.length
  const colWidth = (width - PADDING * 2 - GAP * (n - 1)) / n
  const bucketAreaHeight = height - BUCKET_AREA_Y - 24

  const highlight = getHighlight(frame.step)

  for (let b = 0; b < n; b++) {
    const x = PADDING + b * (colWidth + GAP)
    const isActive = highlight?.bucketIndex === b

    ctx.strokeStyle = isActive ? highlight!.color : 'rgba(128, 128, 128, 0.4)'
    ctx.lineWidth = isActive ? 2 : 1
    ctx.strokeRect(x, BUCKET_AREA_Y, colWidth, bucketAreaHeight)

    ctx.fillStyle = '#888'
    ctx.font = '12px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(String(b), x + colWidth / 2, BUCKET_AREA_Y + bucketAreaHeight + 4)

    ctx.font = '13px system-ui, sans-serif'
    buckets[b].forEach((key, idx) => {
      const keyHighlighted = isActive && highlight!.key === key
      ctx.fillStyle = keyHighlighted ? highlight!.color : '#555'
      ctx.fillText(String(key), x + colWidth / 2, BUCKET_AREA_Y + 6 + idx * 18)
    })
  }
}

function getHighlight(step: HashStep): { bucketIndex: number; key?: number; color: string } | undefined {
  switch (step.type) {
    case 'hash':
      return { bucketIndex: step.bucketIndex, color: COLOR_HASH }
    case 'insert':
      return { bucketIndex: step.bucketIndex, key: step.key, color: COLOR_INSERT }
    case 'compare':
      return { bucketIndex: step.bucketIndex, key: step.key, color: COLOR_COMPARE }
    case 'found':
      return { bucketIndex: step.bucketIndex, key: step.key, color: COLOR_FOUND }
    case 'delete':
      return { bucketIndex: step.bucketIndex, key: step.key, color: COLOR_DELETE }
    case 'notFound':
      return { bucketIndex: step.bucketIndex, color: COLOR_COMPARE }
    default:
      return undefined
  }
}

function describeStep(step: HashStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'hash':
      return `hash(${step.key}) = ${step.bucketIndex}`
    case 'insert':
      return `insert ${step.key} into bucket ${step.bucketIndex}`
    case 'compare':
      return `compare ${step.key} vs ${step.target}`
    case 'found':
      return `found ${step.key}`
    case 'notFound':
      return `${step.target} not found`
    case 'delete':
      return `delete ${step.key}`
    case 'done':
      return 'done'
  }
}
