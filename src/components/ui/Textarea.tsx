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
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/60 focus:border-accent-primary/40 transition-all resize-none ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-status-error">{error}</span>}
      </div>
    )
  }
)
