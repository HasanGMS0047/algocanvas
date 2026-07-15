import { useEffect, useState } from 'react'
import './ArrayInput.css'

interface ArrayInputProps {
  value: number[]
  onChange: (value: number[]) => void
  error?: string
  placeholder?: string
  randomLengthRange?: [number, number]
  randomValueMax?: number
}

const DEFAULT_RANDOM_LENGTH_RANGE: [number, number] = [8, 10]
const DEFAULT_RANDOM_VALUE_MAX = 20

export function ArrayInput({
  value,
  onChange,
  error,
  placeholder = 'e.g. 8, 3, 9, 1, 6',
  randomLengthRange = DEFAULT_RANDOM_LENGTH_RANGE,
  randomValueMax = DEFAULT_RANDOM_VALUE_MAX,
}: ArrayInputProps) {
  const [text, setText] = useState(value.join(', '))
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    setText(value.join(', '))
    setParseError(null)
  }, [value])

  const commit = () => {
    const parts = text.split(/[,\s]+/).filter(Boolean)
    const parsed = parts.map(Number)

    if (parts.length === 0 || parsed.some((n) => Number.isNaN(n))) {
      setParseError('Enter numbers separated by commas or spaces.')
      return
    }

    setParseError(null)
    onChange(parsed)
  }

  const randomize = () => {
    const [min, max] = randomLengthRange
    const length = min + Math.floor(Math.random() * (max - min + 1))
    const random = Array.from({ length }, () => 1 + Math.floor(Math.random() * randomValueMax))
    onChange(random)
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
        placeholder={placeholder}
      />
      <button type="button" onClick={randomize}>
        Randomize
      </button>
      {(parseError ?? error) && <span className="array-input-error">{parseError ?? error}</span>}
    </div>
  )
}
