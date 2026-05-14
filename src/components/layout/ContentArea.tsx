import type { ReactNode } from 'react'

interface ContentAreaProps {
  children: ReactNode
}

export function ContentArea({ children }: ContentAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-bg-base overflow-hidden">
      {children}
    </div>
  )
}
