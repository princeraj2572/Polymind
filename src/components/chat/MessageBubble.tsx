import type { Message } from '../../types'
import { Copy, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  message: Message
  onCopy?: () => void
  onRetry?: () => void
}

export function MessageBubble({ message, onCopy, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
          AI
        </div>
      )}
      <div
        className={`group w-full max-w-[85%] transition-transform duration-200 sm:max-w-[80%] lg:max-w-[72%] ${
          isUser ? 'rounded-3xl bg-[#1f2430] px-4 py-3 text-text-primary' : 'py-1 text-text-primary'
        }`}
      >
        {!isUser && (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
            {message.modelId || 'Assistant'}
          </p>
        )}
        <div className={`markdown-content prose max-w-none text-[15px] leading-7 ${isUser ? 'prose-invert text-text-primary' : 'prose-invert text-text-primary'}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-text-primary">
              {message.content}
            </p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
          {message.isStreaming && !isUser && (
            <span className="inline-block h-4 w-2 animate-blink bg-status-streaming align-middle" />
          )}
        </div>
        {!isUser && (
          <div className="mt-3 flex gap-2 opacity-60 transition-opacity group-hover:opacity-100">
            {onCopy && (
              <button
                onClick={onCopy}
                className="rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
                title="Copy"
              >
                <Copy size={16} className="text-text-secondary" />
              </button>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
                title="Retry"
              >
                <RotateCcw size={16} className="text-text-secondary" />
              </button>
            )}
            <button
              className="rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
              title="Like"
            >
              <ThumbsUp size={16} className="text-text-secondary" />
            </button>
            <button
              className="rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
              title="Dislike"
            >
              <ThumbsDown size={16} className="text-text-secondary" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
