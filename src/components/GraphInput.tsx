import { useEffect, useState } from 'react'
import './GraphInput.css'

interface GraphInputProps {
  value: string
  onChange: (text: string) => void
  error?: string
  startNode: string
  onStartNodeChange: (id: string) => void
  nodeIds: string[]
  showStartNode?: boolean
}

// Attaches each new node to a random earlier one (guaranteeing a connected
// graph) then adds one extra edge for a cycle, rather than a fully random
// adjacency which could easily produce unreachable nodes.
function randomGraphText(): string {
  const pool = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const count = 5 + Math.floor(Math.random() * 2)
  const chosen = pool.slice(0, count)
  const lines: string[] = []

  for (let i = 1; i < chosen.length; i++) {
    const parent = chosen[Math.floor(Math.random() * i)]
    const weight = 1 + Math.floor(Math.random() * 9)
    lines.push(`${parent}-${chosen[i]}:${weight}`)
  }

  const a = chosen[Math.floor(Math.random() * chosen.length)]
  const rest = chosen.filter((id) => id !== a)
  const b = rest[Math.floor(Math.random() * rest.length)]
  const alreadyConnected = lines.some((l) => l.startsWith(`${a}-${b}:`) || l.startsWith(`${b}-${a}:`))
  if (!alreadyConnected) {
    lines.push(`${a}-${b}:${1 + Math.floor(Math.random() * 9)}`)
  }

  return lines.join('\n')
}

export function GraphInput({
  value,
  onChange,
  error,
  startNode,
  onStartNodeChange,
  nodeIds,
  showStartNode = true,
}: GraphInputProps) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const commit = () => onChange(text)

  return (
    <div className="graph-input">
      <textarea
        className="graph-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        rows={4}
        placeholder="One edge per line: A-B or A-B:4"
      />
      <div className="graph-input-side">
        {showStartNode && (
          <label className="graph-input-start">
            Start node
            <select value={startNode} onChange={(e) => onStartNodeChange(e.target.value)}>
              {nodeIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="button" onClick={() => onChange(randomGraphText())}>
          Randomize
        </button>
        {error && <span className="graph-input-error">{error}</span>}
      </div>
    </div>
  )
}
