import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

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
    <div className="border-t border-white/8 bg-[#111111] px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto w-full max-w-[896px]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoResize
              className="min-h-[4rem] flex-1 border-0 bg-transparent px-2 text-[15px] leading-7 text-white placeholder:text-white/35 focus:ring-0"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !value.trim()}
              className="h-14 w-14 shrink-0 rounded-2xl bg-white text-[#111111] hover:bg-white/90"
            >
              {isLoading ? '...' : <Send size={20} />}
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-text-secondary">
            <span>Shift+Enter for a new line</span>
            <span>Press Ctrl+Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  )
}
