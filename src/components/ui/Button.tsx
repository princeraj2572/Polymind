import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-sans font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary'

  const variantStyles = {
    primary:
      'bg-accent-primary text-bg-base hover:bg-accent-glow focus:ring-accent-primary',
    secondary:
      'bg-bg-elevated border border-border-default text-text-primary hover:bg-bg-hover',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-surface',
    danger: 'bg-status-error text-white hover:bg-red-600',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  )
}
