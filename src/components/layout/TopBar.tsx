import type { ReactNode } from 'react'
import { Badge } from '../ui/Badge'

interface TopBarProps {
  title?: string
  actions?: ReactNode
}

export function TopBar({ title, actions }: TopBarProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-white/8 bg-[#111111]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[896px] items-center justify-between px-4 sm:px-0">
        <div className="flex items-center gap-3">
          {title && <h2 className="text-sm font-semibold tracking-[0.22em] text-white/85 uppercase">{title}</h2>}
          <Badge variant="neutral" size="sm">Live</Badge>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
