import { Trash2, Plus, MessageSquareText, Clock3 } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { Button, Card, ScrollArea, Separator } from './ui'

export function ConversationList() {
  const conversations = useChatStore((state) => state.conversations)
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const setActiveConversation = useChatStore((state) => state.setActiveConversation)
  const createConversation = useChatStore((state) => state.createConversation)
  const deleteConversation = useChatStore((state) => state.deleteConversation)

  const dayMs = 24 * 60 * 60 * 1000
  const sections = [
    {
      title: 'Today',
      items: conversations.filter((conv) => Date.now() - conv.createdAt < dayMs),
    },
    {
      title: 'Earlier',
      items: conversations.filter((conv) => Date.now() - conv.createdAt >= dayMs),
    },
  ].filter((section) => section.items.length > 0)

  return (
    <Card className="flex h-full flex-col overflow-hidden bg-white/5">
      <div className="space-y-3 p-4 pb-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
            Chat History
          </p>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-text-secondary">
            <Clock3 className="h-3.5 w-3.5" />
            {conversations.length}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2 rounded-2xl border-white/10 bg-white/5 px-4 py-2.5 text-left shadow-none hover:bg-white/8"
          onClick={() => createConversation()}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4 pr-2">
        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm leading-6 text-text-secondary">
              No chat history yet. Start a new conversation to see it appear here.
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.title} className="space-y-2">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  {section.title}
                </p>

                <div className="space-y-1.5">
                  {section.items.map((conv) => {
                    const firstMessage = conv.messages[0]?.content || 'New conversation'
                    const preview =
                      firstMessage.substring(0, 42) +
                      (firstMessage.length > 42 ? '...' : '')
                    const isActive = activeConversationId === conv.id

                    return (
                      <div
                        key={conv.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveConversation(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setActiveConversation(conv.id)
                          }
                        }}
                        className={`group w-full cursor-pointer rounded-2xl border px-3 py-3 text-left transition-all outline-none ${
                          isActive
                            ? 'border-white/15 bg-white/10 text-text-primary shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
                            : 'border-transparent bg-transparent text-text-secondary hover:border-white/10 hover:bg-white/5 hover:text-text-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 rounded-xl border p-2 ${isActive ? 'border-white/10 bg-white/10' : 'border-white/10 bg-white/5'}`}>
                            <MessageSquareText className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-medium leading-5 text-inherit">
                                {preview}
                              </p>
                              <span className="shrink-0 text-[11px] text-text-muted">
                                {new Date(conv.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-1 text-xs leading-5 text-text-muted">
                              {conv.messages.length > 0
                                ? `${conv.messages.length} message${conv.messages.length > 1 ? 's' : ''}`
                                : 'Empty conversation'}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conv.id)
                            }}
                            className="mt-0.5 rounded-full p-2 text-text-muted opacity-0 transition-opacity hover:bg-white/8 hover:text-status-error group-hover:opacity-100"
                            aria-label="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
