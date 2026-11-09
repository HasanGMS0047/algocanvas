import { useEffect, useState } from 'react'
import { parseGraphText } from '../algorithms/graph/parseGraphText'
import { graphToAdjacencyText } from '../algorithms/graph/utils'
import './GraphInput.css'

export type GraphInputMode = 'edges' | 'adjacency'

interface GraphInputProps {
  value: string
  onChange: (text: string) => void
  error?: string
  startNode: string
  onStartNodeChange: (id: string) => void
  nodeIds: string[]
  showStartNode?: boolean
  // Shortest-path algorithms also pick an end node.
  showEndNode?: boolean
  endNode?: string
  onEndNodeChange?: (id: string) => void
  // Which text format `value` is in. The adjacency-list toggle is only
  // offered when the selected algorithm can use it.
  mode: GraphInputMode
  onModeChange: (mode: GraphInputMode) => void
  allowAdjacency: boolean
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
  showEndNode = false,
  endNode,
  onEndNodeChange,
  mode,
  onModeChange,
  allowAdjacency,
}: GraphInputProps) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const commit = () => {
    if (text !== value) onChange(text)
  }

  const randomize = () => {
    const edgeText = randomGraphText()
    const graph = parseGraphText(edgeText).graph
    onChange(mode === 'adjacency' && graph ? graphToAdjacencyText(graph) : edgeText)
  }

  return (
    <div className="graph-input">
      <textarea
        className="graph-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        rows={4}
        spellCheck={false}
        aria-label={mode === 'adjacency' ? 'Graph as an adjacency list' : 'Graph as an edge list'}
        placeholder={
          mode === 'adjacency'
            ? 'One node per line, like Python:\nA: [B, C]\nB: [C, D]'
            : 'One edge per line: A-B or A-B:4'
        }
      />
      <div className="graph-input-side">
        {(showStartNode || showEndNode) && (
          <div className="graph-input-row">
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
            {showEndNode && (
              <label className="graph-input-start">
                End node
                <select value={endNode} onChange={(e) => onEndNodeChange?.(e.target.value)}>
                  {nodeIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}
        <div className="graph-input-row">
          {allowAdjacency && (
            <div className="graph-input-mode" role="group" aria-label="Input format">
              <button type="button" aria-pressed={mode === 'edges'} onClick={() => onModeChange('edges')}>
                Edge list
              </button>
              <button type="button" aria-pressed={mode === 'adjacency'} onClick={() => onModeChange('adjacency')}>
                Adjacency list
              </button>
            </div>
          )}
          <button type="button" onClick={randomize}>
            Randomize
          </button>
        </div>
        {mode === 'adjacency' && (
          <span className="graph-input-hint">Python dicts work too: {"{'A': ['B', 'C']}"}</span>
        )}
        {error && <span className="graph-input-error">{error}</span>}
      </div>
    </div>
  )
}
