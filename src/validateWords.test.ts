import { describe, expect, it } from 'vitest'
import { validateWords } from './validateWords'

describe('validateWords', () => {
  it('accepts a normal word list', () => {
    expect(validateWords(['cat', 'car', 'card'])).toEqual({ valid: true })
  })

  it('rejects an empty list', () => {
    expect(validateWords([]).valid).toBe(false)
  })

  it('rejects more than 8 words', () => {
    const words = Array.from({ length: 9 }, (_, i) => `w${i}`)
    expect(validateWords(words).valid).toBe(false)
  })

  it('rejects an empty-string word', () => {
    expect(validateWords(['cat', '']).valid).toBe(false)
  })

  it('rejects a word longer than 12 characters', () => {
    expect(validateWords(['thisWordIsWayTooLong']).valid).toBe(false)
  })

  it('rejects words with non-letter characters', () => {
    expect(validateWords(['cat3']).valid).toBe(false)
    expect(validateWords(["ca-t"]).valid).toBe(false)
  })
})
