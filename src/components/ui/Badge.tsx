import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  size?: 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-900 text-status-success',
    error: 'bg-red-900 text-status-error',
    warning: 'bg-yellow-900 text-status-warning',
    info: 'bg-accent-muted text-accent-primary',
    neutral: 'bg-bg-hover text-text-secondary',
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  )
}
