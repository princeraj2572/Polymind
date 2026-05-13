import { Trash2, Plus } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'
import { Button } from '../ui'

export function ConversationList() {
  const conversations = useChatStore((state) => state.conversations)
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const setActiveConversation = useChatStore((state) => state.setActiveConversation)
  const createConversation = useChatStore((state) => state.createConversation)
  const deleteConversation = useChatStore((state) => state.deleteConversation)

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        size="sm"
        className="w-full"
        onClick={() => createConversation()}
      >
        <Plus className="w-4 h-4" />
        New Chat
      </Button>

      <div className="space-y-1 mt-4">
        {conversations.map((conv) => {
          const firstMessage = conv.messages[0]?.content || 'New conversation'
          const preview = firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '')

          return (
            <div
              key={conv.id}
              className={`
                flex items-center gap-2 px-3 py-2 rounded cursor-pointer
                transition-colors group
                ${activeConversationId === conv.id
                  ? 'bg-accent-primary/20 text-text-primary'
                  : 'text-text-muted hover:bg-bg-hover'
                }
              `}
              onClick={() => setActiveConversation(conv.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{preview}</p>
                <p className="text-xs opacity-60">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteConversation(conv.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-status-error"
                aria-label="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
