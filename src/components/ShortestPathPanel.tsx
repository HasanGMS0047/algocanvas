import type { GraphFrame } from '../algorithms/graph/types'
import './ShortestPathPanel.css'

interface ShortestPathPanelProps {
  frame: GraphFrame
  algorithmId: string
  start: string
  target: string
}

// The "answer" strip for the shortest-path algorithms: shows the route as
// it's found and, once the animation finishes, the final shortest path.
export function ShortestPathPanel({ frame, algorithmId, start, target }: ShortestPathPanelProps) {
  const done = frame.step.type === 'done'
  const hasPath = frame.path.length > 0
  const noPath = !hasPath && (frame.step.type === 'noPath' || done)
  const isDfs = algorithmId === 'dfs-path'
  const hops = frame.path.length - 1

  let label = 'Shortest path'
  if (!hasPath) label = noPath ? 'No path' : 'Searching'
  else if (isDfs && !done) label = 'Best path so far'

  const state = noPath ? 'none' : hasPath ? (isDfs && !done ? 'partial' : 'found') : 'searching'

  return (
    <div className="path-panel" data-state={state} role="status" aria-live="polite">
      <span className="path-panel-label">{label}</span>
      {hasPath ? (
        <>
          <ol className="path-panel-route" aria-label={frame.path.join(' to ')}>
            {frame.path.map((id, i) => (
              <li key={`${id}-${i}`}>
                {i > 0 && <span className="path-panel-arrow" aria-hidden="true">→</span>}
                <span className="path-panel-node">{id}</span>
              </li>
            ))}
          </ol>
          <span className="path-panel-length">
            {hops === 0 ? 'start is the end' : `${hops} edge${hops === 1 ? '' : 's'}`}
          </span>
        </>
      ) : (
        <span className="path-panel-text">
          {noPath
            ? `${target} can't be reached from ${start}.`
            : `Looking for a route from ${start} to ${target}…`}
        </span>
      )}
    </div>
  )
}
