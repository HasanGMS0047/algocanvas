import { useEffect, useState } from 'react'
import './ArrayInput.css'

interface WordListInputProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

// A curated pool (not random letters) so any random subset still shares
// meaningful prefixes - the whole point of visualizing a trie.
const SAMPLE_WORDS = ['cat', 'car', 'card', 'cot', 'cop', 'dog', 'do', 'dot', 'dodge', 'code']

export function WordListInput({ value, onChange, error }: WordListInputProps) {
  const [text, setText] = useState(value.join(', '))
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    setText(value.join(', '))
    setParseError(null)
  }, [value])

  const commit = () => {
    const words = text
      .split(/[,\s]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())

    if (words.length === 0) {
      setParseError('Enter words separated by commas or spaces.')
      return
    }

    setParseError(null)
    onChange(words)
  }

  const randomize = () => {
    const count = 4 + Math.floor(Math.random() * 3)
    const shuffled = [...SAMPLE_WORDS].sort(() => Math.random() - 0.5)
    onChange(shuffled.slice(0, count))
  }

  return (
    <div className="array-input">
      <input
        type="text"
        className="array-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
        }}
        placeholder="e.g. cat, car, card, dog, do"
      />
      <button type="button" onClick={randomize}>
        Randomize
      </button>
      {(parseError ?? error) && <span className="array-input-error">{parseError ?? error}</span>}
    </div>
  )
}
