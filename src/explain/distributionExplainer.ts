import type { DistributionFrame } from '../algorithms/distribution/types'

export function explainDistributionStep(frame: DistributionFrame, algorithmId: string): string {
  const { step } = frame

  if (step.type === 'start') return 'Starting with the array in its original order.'
  if (step.type === 'done') return 'Every element has been written back in sorted order.'

  if (step.type === 'place') {
    switch (algorithmId) {
      case 'counting':
        return `Counting an occurrence of ${step.value}: incrementing the count in bucket ${step.bucketIndex} (buckets are indexed directly by value).`
      case 'radix':
        return `Looking at one digit of ${step.value} and dropping it into bucket ${step.bucketIndex}, the value of that digit.`
      case 'bucket':
        return `Placing ${step.value} into bucket ${step.bucketIndex} based on which range of values it falls into.`
      default:
        return `Placing ${step.value} into bucket ${step.bucketIndex}.`
    }
  }

  if (step.type === 'sortBucket') {
    return `Bucket ${step.bucketIndex} has more than one value, so sort just that small bucket (${step.values.join(', ')}) before writing it back out.`
  }

  if (step.type === 'write') {
    switch (algorithmId) {
      case 'counting':
        return `Writing ${step.value} back into the array - each count in bucket ${step.fromBucket} becomes that many copies of the value, in order.`
      case 'radix':
        return `Writing ${step.value} back into the array in the order the buckets were visited (0 through 9), ready for the next digit pass.`
      case 'bucket':
        return `Writing ${step.value} from bucket ${step.fromBucket} back into its position - buckets are emptied in order, so this keeps everything sorted.`
      default:
        return `Writing ${step.value} into position ${step.toIndex}.`
    }
  }

  return ''
}
