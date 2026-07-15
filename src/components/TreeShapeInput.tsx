import { useEffect, useState } from 'react'
import './ArrayInput.css'

interface TreeShapeInputProps {
  value: string
  onChange: (text: string) => void
  error?: string
}

// A curated pool of small varied shapes for the Randomize button, rather
// than random values that would rarely land on interesting full/complete/
// perfect combinations.
const SAMPLE_SHAPES = [
  '1, 2, 3, 4, 5',
  '1, 2, 3',
  '1, null, 2, null, 3',
  '5, 3, 8, 1, 4, 7, 9',
  '1, 2, null, 3',
  '10, 5, 15, 2, 7, 12, 20',
]

export function TreeShapeInput({ value, onChange, error }: TreeShapeInputProps) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const commit = () => onChange(text)

  const randomize = () => {
    const shape = SAMPLE_SHAPES[Math.floor(Math.random() * SAMPLE_SHAPES.length)]
    onChange(shape)
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
        placeholder="Level-order shape, e.g. 1, 2, 3, null, null, 4, 5"
      />
      <button type="button" onClick={randomize}>
        Randomize
      </button>
      {error && <span className="array-input-error">{error}</span>}
    </div>
  )
}
