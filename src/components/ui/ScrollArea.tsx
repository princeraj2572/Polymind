import type { HTMLAttributes, ReactNode } from 'react'

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function ScrollArea({ children, className = '', ...props }: ScrollAreaProps) {
  return (
    <div
      className={`min-h-0 overflow-y-auto overscroll-contain ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
