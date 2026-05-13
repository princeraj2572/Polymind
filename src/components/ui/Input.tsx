import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 text-base bg-bg-surface border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-status-error">{error}</span>}
    </div>
  )
}
