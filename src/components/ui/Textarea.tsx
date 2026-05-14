import type { TextareaHTMLAttributes } from 'react'
import { useEffect, useRef, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  autoResize?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      autoResize = true,
      className = '',
      ...props
    },
    externalRef
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const ref = externalRef || internalRef

    useEffect(() => {
      if (!autoResize || !ref || typeof ref === 'function') return

      const resize = () => {
        if (ref && typeof ref !== 'function' && ref.current) {
          ref.current.style.height = 'auto'
          ref.current.style.height = `${ref.current.scrollHeight}px`
        }
      }

      const textarea = ref && typeof ref !== 'function' ? ref.current : null
      if (textarea) {
        textarea.addEventListener('input', resize)
        resize()

        return () => textarea.removeEventListener('input', resize)
      }
    }, [autoResize, ref])

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`px-3 py-2 text-base bg-bg-surface border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all resize-none ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-status-error">{error}</span>}
      </div>
    )
  }
)
