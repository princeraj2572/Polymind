import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[size]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={`relative bg-bg-elevated rounded-lg shadow-lg max-h-[90vh] overflow-y-auto ${sizeClass}`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border-subtle">
            <h2 className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-bg-hover rounded-lg transition-colors"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
