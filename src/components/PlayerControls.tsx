import './PlayerControls.css'

const SPEEDS = [0.5, 1, 1.5, 2, 4]

interface PlayerControlsProps {
  index: number
  frameCount: number
  isPlaying: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBack: () => void
  onSeek: (index: number) => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
}

export function PlayerControls({
  index,
  frameCount,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onSeek,
  onReset,
  onSpeedChange,
}: PlayerControlsProps) {
  return (
    <div className="player-controls">
      <button type="button" onClick={onReset}>
        Reset
      </button>
      <button type="button" onClick={onStepBack} disabled={index === 0}>
        ◀ Step
      </button>
      <button type="button" onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button type="button" onClick={onStepForward} disabled={index === frameCount - 1}>
        Step ▶
      </button>

      <input
        type="range"
        min={0}
        max={frameCount - 1}
        value={index}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="player-scrub"
      />

      <span className="player-position">
        {index + 1} / {frameCount}
      </span>

      <select value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))}>
        {SPEEDS.map((s) => (
          <option key={s} value={s}>
            {s}x
          </option>
        ))}
      </select>
    </div>
  )
}
