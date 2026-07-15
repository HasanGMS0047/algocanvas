import type { TrieFrame } from '../algorithms/trie/types'

export function explainTrieStep(frame: TrieFrame, _algorithmId: string): string {
  const { step } = frame

  switch (step.type) {
    case 'start':
      return 'Starting with an empty trie.'
    case 'visit':
      return `Following the path for "${step.path}" - moving one character deeper into the trie.`
    case 'createNode':
      return `No node exists yet for "${step.path}", so create one.`
    case 'markEnd':
      return `"${step.path}" is now marked as a complete word (this node ends a word, even if it also has children for longer words).`
    case 'found':
      return `Found "${step.word}" - the path exists and ends on a node marked as a complete word.`
    case 'notFound':
      return step.reason === 'no-path'
        ? `"${step.word}" is not in the trie - the path itself doesn't exist past some point.`
        : `"${step.word}" is not in the trie - the path exists (it's a prefix of other words), but this node was never marked as a complete word.`
    case 'done':
      return 'Done.'
    default:
      return ''
  }
}
