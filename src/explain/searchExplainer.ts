import type { SearchFrame } from '../algorithms/search/recordSearchFrames'

export function explainSearchStep(frame: SearchFrame, algorithmId: string): string {
  const { step, array, target } = frame

  if (step.type === 'start') return `Searching for ${target} in the array.`
  if (step.type === 'found') return `Found ${target} at index ${step.index}.`
  if (step.type === 'notFound') return `${target} is not in the array - the search space narrowed to nothing without a match.`
  if (step.type === 'done') return 'Search finished.'

  const value = array[step.index]
  switch (algorithmId) {
    case 'linear-search':
      return `Checking index ${step.index} (value ${value}) - linear search just walks left to right until it finds the target or runs out of array.`
    case 'binary-search': {
      const verdict = value < target ? 'too small, so the target must be to the right' : value > target ? 'too large, so the target must be to the left' : "that's a match"
      return `Checking the midpoint of the current range, index ${step.index} (value ${value}) - ${verdict}.`
    }
    case 'jump-search':
      return `Checking index ${step.index} (value ${value}) - either the boundary of the next fixed-size block, or a step within the block once the right block is found.`
    case 'interpolation-search':
      return `Estimating where ${target} should sit based on its value relative to the range's endpoints, and checking index ${step.index} (value ${value}).`
    default:
      return `Checking index ${step.index} (value ${value}).`
  }
}
