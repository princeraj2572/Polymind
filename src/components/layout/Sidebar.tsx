import { Link } from 'react-router-dom'
import { MessageSquare, Image, Mic, Eye, Scale, Settings } from 'lucide-react'
import { ConversationList } from '../ConversationList'
import { Separator } from '../ui'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
}

const navItems: NavItem[] = [
  { label: 'Chat', icon: <MessageSquare size={20} />, path: '/chat' },
  { label: 'Image', icon: <Image size={20} />, path: '/image' },
  { label: 'Voice', icon: <Mic size={20} />, path: '/voice' },
  { label: 'Vision', icon: <Eye size={20} />, path: '/vision' },
  { label: 'Compare', icon: <Scale size={20} />, path: '/compare' },
]

export function Sidebar() {
  return (
    <aside className="flex w-[18rem] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0f0f0f]">
      <div className="space-y-3 px-4 py-4">
        <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
          PolyMind
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-text-primary font-display">
          PolyMind
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Your chat workspace.
        </p>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden px-3 py-3">
        <ConversationList />
      </div>

      <Separator />

      <nav className="space-y-1 px-3 py-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <Separator />

      <div className="p-3">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  )
}
