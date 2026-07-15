import './PlayerControls.css'

const MIN_SPEED = 0.25
const MAX_SPEED = 4
const SPEED_STEP = 0.25

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
    <div className="player-controls" title="Keyboard: Space play/pause · ←/→ step · Home/End jump to start/end">
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

      <div className="player-speed">
        <input
          type="range"
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={SPEED_STEP}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="player-speed-slider"
          aria-label="Playback speed"
        />
        <span className="player-speed-label">{speed.toFixed(2)}x</span>
      </div>
    </div>
  )
}
