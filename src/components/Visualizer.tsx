import { useCallback, useEffect, useState } from 'react'
import { usePlayer } from '../player/usePlayer'
import { useKeyboardShortcuts } from '../player/useKeyboardShortcuts'
import type { Predictor } from '../predict/types'
import { AlgoCanvas } from './AlgoCanvas'
import { PlayerControls } from './PlayerControls'
import { PredictionPanel, PredictionToggle } from './PredictionPanel'

interface VisualizerProps<T> {
  frames: T[]
  render: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: T) => void
  predictor?: Predictor<T>
}

export function Visualizer<T>({ frames, render, predictor }: VisualizerProps<T>) {
  const player = usePlayer({ frameCount: frames.length, msPerFrame: 500 })
  const [predictModeEnabled, setPredictModeEnabled] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  useKeyboardShortcuts({
    onPlayPause: () => (player.isPlaying ? player.pause() : player.play()),
    onStepForward: player.stepForward,
    onStepBack: player.stepBack,
    onReset: player.reset,
    onJumpToEnd: () => player.seek(frames.length - 1),
  })

  // A fresh question every time we land on a decision frame, however we got
  // there (step, play, scrub, or toggling predict mode on while already on one).
  useEffect(() => {
    setSelectedOptionId(null)
  }, [player.index])

  useEffect(() => {
    if (!predictModeEnabled || !predictor) return
    if (predictor(frames[player.index])) player.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.index, predictModeEnabled])

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      render(ctx, width, height, frames[player.index])
    },
    [frames, player.index, render],
  )

  const prediction = predictModeEnabled && predictor ? predictor(frames[player.index]) : null

  return (
    <>
      {predictor && <PredictionToggle enabled={predictModeEnabled} onChange={setPredictModeEnabled} />}
      <AlgoCanvas draw={draw} />
      {prediction && (
        <PredictionPanel
          prediction={prediction}
          selectedOptionId={selectedOptionId}
          onSelect={setSelectedOptionId}
          onContinue={player.stepForward}
        />
      )}
      <PlayerControls
        index={player.index}
        frameCount={frames.length}
        isPlaying={player.isPlaying}
        speed={player.speed}
        onPlay={player.play}
        onPause={player.pause}
        onStepForward={player.stepForward}
        onStepBack={player.stepBack}
        onSeek={player.seek}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
      />
    </>
  )
}
