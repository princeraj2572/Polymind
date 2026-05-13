import { useCallback, useEffect } from 'react'
import { useChatStore } from '../stores/chatStore'

export function useConversation() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    setActiveConversation,
    clearConversation,
  } = useChatStore()

  const activeConv = conversations.find((c) => c.id === activeConversationId)

  // Auto-create first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation()
    }
  }, [])

  const newChat = useCallback(() => {
    createConversation()
  }, [createConversation])

  const switchConversation = useCallback(
    (id: string) => {
      setActiveConversation(id)
    },
    [setActiveConversation]
  )

  const clear = useCallback(() => {
    clearConversation()
  }, [clearConversation])

  return {
    conversations,
    activeConversation: activeConv,
    activeConversationId,
    newChat,
    switchConversation,
    clearConversation: clear,
  }
}
