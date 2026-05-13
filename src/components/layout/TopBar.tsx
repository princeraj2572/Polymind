import { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  actions?: ReactNode
}

export function TopBar({ title, actions }: TopBarProps) {
  return (
    <div className="h-16 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6">
      {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  )
}
