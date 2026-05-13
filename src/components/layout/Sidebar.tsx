import { Link } from 'react-router-dom'
import { MessageSquare, Image, Mic, Eye, Scales, Settings, Plus } from 'lucide-react'

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
  { label: 'Compare', icon: <Scales size={20} />, path: '/compare' },
]

export function Sidebar() {
  return (
    <div className="w-56 bg-bg-base border-r border-border-subtle h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border-subtle">
        <h1 className="text-xl font-bold text-accent-primary font-display">
          PolyMind
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button className="w-full flex items-center gap-2 px-4 py-2 bg-accent-primary text-bg-base rounded-lg hover:bg-accent-glow transition-colors font-medium text-sm">
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle space-y-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </div>
  )
}
