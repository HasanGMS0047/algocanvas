import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePlayerOptions {
  frameCount: number
  msPerFrame?: number
}

export function usePlayer({ frameCount, msPerFrame = 900 }: UsePlayerOptions) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const indexRef = useRef(index)
  indexRef.current = index

  useEffect(() => {
    if (!isPlaying) return

    let rafId: number
    let lastTime: number | undefined
    let accumulated = 0
    const interval = msPerFrame / speed

    const tick = (time: number) => {
      if (lastTime === undefined) lastTime = time
      accumulated += time - lastTime
      lastTime = time

      let next = indexRef.current
      while (accumulated >= interval && next < frameCount - 1) {
        next += 1
        accumulated -= interval
      }

      if (next !== indexRef.current) {
        indexRef.current = next
        setIndex(next)
      }

      if (next >= frameCount - 1) {
        setIsPlaying(false)
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isPlaying, speed, msPerFrame, frameCount])

  const play = useCallback(() => {
    if (indexRef.current >= frameCount - 1) {
      indexRef.current = 0
      setIndex(0)
    }
    setIsPlaying(true)
  }, [frameCount])

  const pause = useCallback(() => setIsPlaying(false), [])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => Math.min(i + 1, frameCount - 1))
  }, [frameCount])

  const stepBack = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const seek = useCallback(
    (target: number) => {
      setIsPlaying(false)
      setIndex(Math.min(Math.max(target, 0), frameCount - 1))
    },
    [frameCount],
  )

  const reset = useCallback(() => {
    setIsPlaying(false)
    setIndex(0)
  }, [])

  return { index, isPlaying, speed, play, pause, stepForward, stepBack, seek, reset, setSpeed }
}
