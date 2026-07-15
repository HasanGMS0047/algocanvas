import { useCallback } from 'react'
import { AlgoCanvas } from './components/AlgoCanvas'
import { PlayerControls } from './components/PlayerControls'
import { fakeFrames } from './player/fakeFrames'
import { usePlayer } from './player/usePlayer'

function App() {
  const player = usePlayer({ frameCount: fakeFrames.length, msPerFrame: 800 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = '#888'
      ctx.font = '24px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(fakeFrames[player.index], width / 2, height / 2)
    },
    [player.index],
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AlgoCanvas draw={draw} />
      <PlayerControls
        index={player.index}
        frameCount={fakeFrames.length}
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
