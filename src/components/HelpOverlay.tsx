import { X } from 'lucide-react'

interface Shortcut {
  key: string
  description: string
}

const shortcuts: Shortcut[] = [
  { key: 'Ctrl/Cmd + K', description: 'Create new chat' },
  { key: 'Ctrl/Cmd + Enter', description: 'Send message' },
  { key: 'Ctrl/Cmd + /', description: 'Show keyboard shortcuts' },
]

interface HelpOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="bg-bg-base border border-border-subtle rounded-lg p-6 max-w-md max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex gap-3">
              <div className="px-2 py-1 bg-bg-hover rounded font-mono text-sm text-accent-primary min-w-fit">
                {shortcut.key}
              </div>
              <p className="text-text-secondary text-sm">{shortcut.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border-subtle">
          <p className="text-xs text-text-muted">
            Press{' '}
            <span className="px-1 py-0.5 bg-bg-hover rounded font-mono text-accent-primary">
              Ctrl/Cmd + /
            </span>{' '}
            to toggle this help
          </p>
        </div>
      </div>
    </div>
  )
}
