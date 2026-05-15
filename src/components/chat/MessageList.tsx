import { useEffect, useRef } from 'react'
import type { Message } from '../../types'
import { MessageBubble } from './MessageBubble'
import { MessageSkeleton } from '../Skeleton'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
  onCopyMessage?: (id: string) => void
  onRetryMessage?: (id: string) => void
  onPromptSelect?: (prompt: string) => void
}

const starterPrompts = [
  'Summarize my latest meeting notes',
  'Draft a concise project update',
  'Explain this code in simple terms',
]

export function MessageList({
  messages,
  isLoading = false,
  onCopyMessage,
  onRetryMessage,
  onPromptSelect,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-10">
        <Card className="mx-auto flex min-h-full w-full max-w-[896px] items-center justify-center border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
          <div className="w-full max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/75">
              PolyMind Chat
            </div>
            <p className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              What would you like to do?
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Start a conversation, compare models, or draft something quickly in one place.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {starterPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onPromptSelect?.(prompt)}
                  className="rounded-full border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <Card className="mx-auto flex w-full max-w-[896px] flex-col gap-4 border-white/10 bg-white/5 p-4 sm:p-5">
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
        {isLoading && <MessageSkeleton />}
        <div ref={messagesEndRef} />
      </Card>
    </div>
  )
}
