import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Textarea } from '../ui/Textarea'

interface InputBarProps {
  onSubmit: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function InputBar({
  onSubmit,
  isLoading = false,
  placeholder = 'Type a message... (Ctrl+Enter to send)',
}: InputBarProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return
    onSubmit(value)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="p-6 border-t border-border-subtle bg-bg-surface">
      <div className="flex gap-3">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoResize
          className="min-h-12"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="px-4 py-2 bg-accent-primary text-bg-base rounded-lg hover:bg-accent-glow disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center h-fit"
        >
          {isLoading ? '...' : <Send size={20} />}
        </button>
      </div>
    </div>
  )
}
