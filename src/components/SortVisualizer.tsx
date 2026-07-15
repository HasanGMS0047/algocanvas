import { useCallback } from 'react'
import type { Frame } from '../algorithms/recordFrames'
import { usePlayer } from '../player/usePlayer'
import { renderArrayFrame } from '../render/renderArray'
import { AlgoCanvas } from './AlgoCanvas'
import { PlayerControls } from './PlayerControls'

interface SortVisualizerProps {
  frames: Frame[]
  treeOverlay?: boolean
}

export function SortVisualizer({ frames, treeOverlay }: SortVisualizerProps) {
  const player = usePlayer({ frameCount: frames.length, msPerFrame: 500 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      renderArrayFrame(ctx, width, height, frames[player.index], { treeOverlay })
    },
    [frames, player.index, treeOverlay],
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
