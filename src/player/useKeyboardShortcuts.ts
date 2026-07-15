import { useEffect, useRef } from 'react'

interface KeyboardShortcutHandlers {
  onPlayPause: () => void
  onStepForward: () => void
  onStepBack: () => void
  onReset: () => void
  onJumpToEnd: () => void
}

// Skip when focus is in a form control so shortcuts don't fight native
// behavior (e.g. arrow keys navigating the algorithm <select>, or Space
// re-triggering a focused button).
const INTERACTIVE_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'])

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement
      if (target instanceof HTMLElement && INTERACTIVE_TAGS.has(target.tagName)) return

      const h = handlersRef.current
      switch (e.key) {
        case ' ':
          e.preventDefault()
          h.onPlayPause()
          break
        case 'ArrowRight':
          e.preventDefault()
          h.onStepForward()
          break
        case 'ArrowLeft':
          e.preventDefault()
          h.onStepBack()
          break
        case 'Home':
          e.preventDefault()
          h.onReset()
          break
        case 'End':
          e.preventDefault()
          h.onJumpToEnd()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
