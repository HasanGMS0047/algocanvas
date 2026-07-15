import type { Frame } from '../algorithms/recordFrames'

export function explainSortStep(frame: Frame, algorithmId: string): string {
  const { step, array } = frame

  if (step.type === 'start') {
    return 'Starting with the array in its original order.'
  }
  if (step.type === 'done') {
    return 'Every element is now in its final sorted position.'
  }

  if (step.type === 'compare') {
    const [a, b] = step.indices
    const va = array[a]
    const vb = array[b]
    switch (algorithmId) {
      case 'bubble':
        return `Comparing neighbors at positions ${a} and ${b} (${va} vs ${vb}) - if the left one is bigger, they'll swap.`
      case 'selection':
        return `Checking whether ${vb} at position ${b} is smaller than the best candidate found so far (currently ${va}) for this pass.`
      case 'insertion':
        return `Comparing the element being inserted against its left neighbor (${vb} vs ${va}) to see if it still needs to move left.`
      case 'quick':
        return `Comparing ${va} against the pivot ${vb} to decide which side of the partition it belongs on.`
      case 'merge':
        return `Comparing the next candidates from the two sorted halves (${va} vs ${vb}) to see which one gets written next.`
      case 'heap':
        return `Comparing a parent and child in the heap (${va} vs ${vb}) to check whether the heap property still holds.`
      default:
        return `Comparing the values at positions ${a} and ${b}.`
    }
  }

  if (step.type === 'swap') {
    const [a, b] = step.indices
    switch (algorithmId) {
      case 'bubble':
        return `They were out of order, so swap positions ${a} and ${b} - the larger value bubbles one step toward the end.`
      case 'selection':
        return `Swapping the smallest remaining value into position ${a}, its correct sorted spot for this pass.`
      case 'insertion':
        return `Shifting the larger value one position to the right to make room for the value being inserted.`
      case 'quick':
        return `Swapping positions ${a} and ${b} to keep everything smaller than the pivot on the left side of the partition.`
      case 'heap':
        return `Swapping positions ${a} and ${b} - either moving the current maximum into its final sorted position, or continuing to sift a value down to restore the heap property.`
      default:
        return `Swapping the values at positions ${a} and ${b}.`
    }
  }

  if (step.type === 'overwrite') {
    return `Writing ${step.value} into position ${step.index} of the merged result.`
  }

  return ''
}
