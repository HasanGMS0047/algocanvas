import type { TreeFrame } from '../algorithms/tree/types'

export function explainTreeStep(frame: TreeFrame, algorithmId: string): string {
  const { step } = frame

  switch (step.type) {
    case 'start':
      return 'Starting with an empty tree.'
    case 'done':
      return 'Done.'
    case 'insert': {
      if (algorithmId === 'binary-tree') {
        return `Placing ${step.value} into its hand-picked spot in the demo tree.`
      }
      const location = step.parentValue === null ? 'as the root' : `as ${step.parentValue}'s ${step.side} child`
      if (algorithmId === 'rb') {
        return `Inserting ${step.value} ${location} as a new red node - new nodes always start red and get fixed up afterward if that breaks a red-black rule.`
      }
      return `Inserting ${step.value} ${location}.`
    }
    case 'compare':
      return `Comparing ${step.target} against ${step.value}: ${
        step.target < step.value ? 'smaller, so go left' : step.target > step.value ? 'larger, so go right' : "equal - this is the node"
      }.`
    case 'found':
      return `Found ${step.value} in the tree.`
    case 'notFound':
      return `${step.target} is not in the tree - reached a dead end without a match.`
    case 'replace':
      return `${step.value} has two children, so replace its value with ${step.withValue} (its in-order successor, the smallest value in its right subtree) before removing the successor's old spot.`
    case 'remove':
      return `Removing ${step.value}, which has at most one child, so its remaining child (if any) takes its place.`
    case 'rotate':
      return `Rotating ${step.direction} around ${step.pivotValue} to restore balance.`
    case 'recolor':
      return `Recoloring ${step.value} ${step.color} to keep the red-black properties satisfied.`
    case 'classify':
      return `This tree is ${step.full ? '' : 'not '}full, ${step.complete ? '' : 'not '}complete, and ${step.perfect ? '' : 'not '}perfect.`
    default:
      return ''
  }
}
