import { useEffect, useRef } from 'react'

type Draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => void

interface AlgoCanvasProps {
  draw?: Draw
}

export function AlgoCanvas({ draw }: AlgoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sizeRef = useRef({ width: 0, height: 0 })

  const redraw = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { width, height } = sizeRef.current
    ctx.clearRect(0, 0, width, height)
    draw?.(ctx, width, height)
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
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(redraw)

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', flex: '1 1 auto', minHeight: 0 }} />
}
