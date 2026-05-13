import { useEffect } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  preventDefault?: boolean
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = (shortcut.ctrl || false) === (event.ctrlKey || event.metaKey)
        const shiftMatches = (shortcut.shift || false) === event.shiftKey
        const altMatches = (shortcut.alt || false) === event.altKey

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault()
          }
          shortcut.handler()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
