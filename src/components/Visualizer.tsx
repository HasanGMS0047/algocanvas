import { useCallback } from 'react'
import { usePlayer } from '../player/usePlayer'
import { AlgoCanvas } from './AlgoCanvas'
import { PlayerControls } from './PlayerControls'

interface VisualizerProps<T> {
  frames: T[]
  render: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: T) => void
}

export function Visualizer<T>({ frames, render }: VisualizerProps<T>) {
  const player = usePlayer({ frameCount: frames.length, msPerFrame: 500 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      render(ctx, width, height, frames[player.index])
    },
    [frames, player.index, render],
  )

  return (
    <>
      <AlgoCanvas draw={draw} />
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
