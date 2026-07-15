import { describe, expect, it } from 'vitest'
import { recordTrieFrames } from './recordTrieFrames'
import { trie } from './trie'
import type { TrieNodeSpec } from './types'

function collectWords(node: TrieNodeSpec | null, prefix = '', out: string[] = []): string[] {
  if (!node) return out
  if (node.isEnd) out.push(prefix)
  for (const child of node.children) collectWords(child, prefix + child.char, out)
  return out
}

describe('trie', () => {
  it('contains exactly the inserted words', () => {
    const frames = recordTrieFrames(trie)
    const final = frames[frames.length - 1].root
    expect(collectWords(final).sort()).toEqual(['car', 'card', 'cat', 'do', 'dog'])
  })

  it('shares prefixes rather than duplicating nodes (cat/car/card share "ca")', () => {
    const frames = recordTrieFrames(trie)
    const final = frames[frames.length - 1].root!
    const c = final.children.find((n) => n.char === 'c')!
    const a = c.children.find((n) => n.char === 'a')!
    // "ca" itself was never inserted as a word.
    expect(a.isEnd).toBe(false)
    expect(a.children.map((n) => n.char).sort()).toEqual(['r', 't'])
  })

  it('a word that is also a prefix of another word is marked end-of-word AND has children', () => {
    const frames = recordTrieFrames(trie)
    const final = frames[frames.length - 1].root!
    const d = final.children.find((n) => n.char === 'd')!
    const o = d.children.find((n) => n.char === 'o')!
    expect(o.isEnd).toBe(true) // "do" is a complete word
    expect(o.children.map((n) => n.char)).toEqual(['g']) // and a prefix of "dog"
  })

  it('search finds an inserted word', () => {
    const frames = recordTrieFrames(trie)
    const foundSteps = frames.map((f) => f.step).filter((s) => s.type === 'found')
    expect(foundSteps).toEqual([{ type: 'found', word: 'car', snapshot: expect.anything() }])
  })

  it('search distinguishes "no path" from "valid prefix but not a word"', () => {
    const frames = recordTrieFrames(trie)
    const notFoundSteps = frames
      .map((f) => f.step)
      .filter((s) => s.type === 'notFound')
      .map((s) => (s.type === 'notFound' ? { word: s.word, reason: s.reason } : null))

    expect(notFoundSteps).toEqual([
      { word: 'ca', reason: 'not-a-word' },
      { word: 'cow', reason: 'no-path' },
    ])
  })
})
