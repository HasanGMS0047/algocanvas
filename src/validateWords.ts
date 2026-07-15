export interface WordsValidation {
  valid: boolean
  error?: string
}

const MAX_WORDS = 8
const MAX_WORD_LENGTH = 12

export function validateWords(words: string[]): WordsValidation {
  if (words.length === 0) {
    return { valid: false, error: 'Enter at least one word.' }
  }
  if (words.length > MAX_WORDS) {
    return { valid: false, error: `Use ${MAX_WORDS} words or fewer so the trie stays readable.` }
  }
  if (words.some((w) => w.length === 0)) {
    return { valid: false, error: 'Words cannot be empty.' }
  }
  if (words.some((w) => w.length > MAX_WORD_LENGTH)) {
    return { valid: false, error: `Each word must be ${MAX_WORD_LENGTH} characters or fewer.` }
  }
  if (words.some((w) => !/^[a-zA-Z]+$/.test(w))) {
    return { valid: false, error: 'Words must use letters only.' }
  }
  return { valid: true }
}
