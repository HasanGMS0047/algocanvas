import { useEffect, useRef } from 'react'

type Draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => void

interface AlgoCanvasProps {
  draw?: Draw
}

export function AlgoCanvas({ draw }: AlgoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sizeRef = useRef({ width: 0, height: 0 })
  // The ResizeObserver callback below is created once at mount (empty deps,
  // so it never picks up a new `draw` closure) but can fire at any later
  // render when the canvas's own box size changes - e.g. a sibling panel
  // appearing shrinks it. Reading through a ref keeps that stale closure
  // pointed at the current draw function instead of the mount-time one.
  const drawRef = useRef(draw)
  drawRef.current = draw

  const redraw = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { width, height } = sizeRef.current
    ctx.clearRect(0, 0, width, height)
    drawRef.current?.(ctx, width, height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const { width, height } = canvas.getBoundingClientRect()
      sizeRef.current = { width, height }
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      redraw()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(redraw)

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', flex: '1 1 auto', minHeight: 0 }} />
}
