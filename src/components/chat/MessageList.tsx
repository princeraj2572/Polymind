import { useEffect, useRef } from 'react'
import { Message } from '../../types'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: Message[]
  onCopyMessage?: (id: string) => void
  onRetryMessage?: (id: string) => void
}

export function MessageList({
  messages,
  onCopyMessage,
  onRetryMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-2">
            Start a conversation
          </p>
          <p className="text-text-muted text-sm">
            Send a message to begin
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onCopy={() => {
            navigator.clipboard.writeText(message.content)
            onCopyMessage?.(message.id)
          }}
          onRetry={() => onRetryMessage?.(message.id)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
