import type { HashTableFrame } from '../algorithms/hashtable/types'

export function explainHashTableStep(frame: HashTableFrame, _algorithmId: string): string {
  const { step } = frame

  switch (step.type) {
    case 'start':
      return 'Starting with an empty hash table.'
    case 'hash':
      return `Hashing ${step.key}: key % table size sends it to bucket ${step.bucketIndex}.`
    case 'insert':
      return `Inserting ${step.key} into bucket ${step.bucketIndex}'s chain, appended after anything already there.`
    case 'compare':
      return `Walking bucket ${step.bucketIndex}'s chain, comparing ${step.key} against the target ${step.target}.`
    case 'found':
      return `Found ${step.key} in bucket ${step.bucketIndex}'s chain.`
    case 'notFound':
      return `${step.target} is not in bucket ${step.bucketIndex}'s chain - reached the end without a match.`
    case 'delete':
      return `Removing ${step.key} from bucket ${step.bucketIndex}'s chain, splicing it out and reconnecting the rest.`
    case 'done':
      return 'Done.'
    default:
      return ''
  }
}
