import { TextareaHTMLAttributes, useEffect, useRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  autoResize?: boolean
}

export function Textarea({
  label,
  error,
  autoResize = true,
  className = '',
  ...props
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!autoResize || !ref.current) return

    const resize = () => {
      if (ref.current) {
        ref.current.style.height = 'auto'
        ref.current.style.height = `${ref.current.scrollHeight}px`
      }
    }

    ref.current.addEventListener('input', resize)
    resize()

    return () => ref.current?.removeEventListener('input', resize)
  }, [autoResize])

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
