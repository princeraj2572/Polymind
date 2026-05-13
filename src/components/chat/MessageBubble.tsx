import { Message } from '../../types'
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
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-accent-primary text-bg-base'
            : 'bg-bg-elevated text-text-primary border-l-2 border-accent-primary'
        }`}
      >
        {!isUser && (
          <p className="text-xs text-text-secondary mb-1 font-mono">
            {message.modelId || 'Assistant'}
          </p>
        )}
        <div className="text-sm leading-relaxed markdown-content">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown className="prose prose-invert max-w-none text-sm">
              {message.content}
            </ReactMarkdown>
          )}
          {message.isStreaming && !isUser && (
            <span className="inline-block w-2 h-4 ml-1 bg-status-streaming animate-blink" />
          )}
        </div>
        {!isUser && (
          <div className="flex gap-2 mt-2">
            {onCopy && (
              <button
                onClick={onCopy}
                className="p-1 hover:bg-bg-hover rounded transition-colors"
                title="Copy"
              >
                <Copy size={16} className="text-text-secondary" />
              </button>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="p-1 hover:bg-bg-hover rounded transition-colors"
                title="Retry"
              >
                <RotateCcw size={16} className="text-text-secondary" />
              </button>
            )}
            <button
              className="p-1 hover:bg-bg-hover rounded transition-colors"
              title="Like"
            >
              <ThumbsUp size={16} className="text-text-secondary" />
            </button>
            <button
              className="p-1 hover:bg-bg-hover rounded transition-colors"
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
