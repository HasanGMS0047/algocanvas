import { useEffect, useState } from 'react'
import './ArrayInput.css'

interface TargetInputProps {
  value: number
  onChange: (value: number) => void
}

export function TargetInput({ value, onChange }: TargetInputProps) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  const commit = () => {
    const parsed = Number(text)
    if (text.trim() !== '' && Number.isFinite(parsed)) {
      onChange(parsed)
    } else {
      setText(String(value))
    }
  }

  return (
    <div className="array-input">
      <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        Search for
        <input
          type="text"
          className="array-input-field"
          style={{ flex: '0 1 120px', minWidth: 80 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
          }}
        />
      </label>
    </div>
  )
}
