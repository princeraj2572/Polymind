import type { ReactNode } from 'react'

interface ContentAreaProps {
  children: ReactNode
}

export function ContentArea({ children }: ContentAreaProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#111111]">
      {children}
    </div>
  )
}
