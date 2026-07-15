import type { BTreeFrame } from '../algorithms/btree/types'

export function explainBTreeStep(frame: BTreeFrame, _algorithmId: string): string {
  const { step } = frame

  switch (step.type) {
    case 'start':
      return 'Starting with an empty B-Tree.'
    case 'visit':
      return step.path.length === 0
        ? 'Looking at the root node to find where the next key belongs.'
        : `Descending into the child at path [${step.path.join(', ')}] to find where the next key belongs.`
    case 'insertKey':
      return `This node isn't full, so insert ${step.key} directly into it, keeping its keys in sorted order.`
    case 'split':
      return `This node is full (it already has the maximum number of keys), so split it: the median key ${step.medianKey} moves up into the parent, and the remaining keys divide into two nodes.`
    case 'done':
      return 'Done.'
    default:
      return ''
  }
}
