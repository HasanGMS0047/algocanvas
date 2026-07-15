import { useCallback, useMemo } from 'react'
import { bubbleSort } from './algorithms/bubbleSort'
import { recordFrames } from './algorithms/recordFrames'
import { AlgoCanvas } from './components/AlgoCanvas'
import { PlayerControls } from './components/PlayerControls'
import { usePlayer } from './player/usePlayer'
import { renderArrayFrame } from './render/renderArray'

const DEMO_ARRAY = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]

function App() {
  const frames = useMemo(() => recordFrames(DEMO_ARRAY, bubbleSort), [])
  const player = usePlayer({ frameCount: frames.length, msPerFrame: 500 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      renderArrayFrame(ctx, width, height, frames[player.index])
    },
    [frames, player.index],
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
    </div>
  )
}

export default App
