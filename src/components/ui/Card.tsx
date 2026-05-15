import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 text-text-primary shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
