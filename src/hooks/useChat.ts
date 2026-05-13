import { useCallback, useState } from 'react'
import { useChatStore } from '../stores/chatStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useModelStore } from '../stores/modelStore'
import { adapterRegistry } from '../adapters'

export function useChat() {
  const {
    activeConversationId,
    conversations,
    isStreaming,
    addMessage,
    appendChunk,
    finalizeMessage,
  } = useChatStore()

  const { systemPrompt } = useSettingsStore()
  const { selectedChatModel } = useModelStore()

  const [error, setError] = useState<string>('')
  const [isSending, setIsSending] = useState(false)

  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const messages = activeConv?.messages || []

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId || !content.trim()) return

      setError('')
      setIsSending(true)

      try {
        // Add user message
        const userId = Math.random().toString(36).slice(2, 11)
        addMessage({
          id: userId,
          role: 'user',
          content: content.trim(),
          timestamp: Date.now(),
        })

        // Get adapter
        const adapter = adapterRegistry.getAdapter(selectedChatModel)
        if (!adapter) {
          throw new Error(`No adapter found for model: ${selectedChatModel}`)
        }

        if (!adapter.isAvailable()) {
          throw new Error(`API key not configured for ${adapter.provider}`)
        }

        // Create assistant message
        const assistantId = Math.random().toString(36).slice(2, 11)
        addMessage({
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
          modelId: selectedChatModel,
        })

        // Stream response
        const stream = adapter.chat(messages, { systemPrompt })
        for await (const chunk of stream) {
          appendChunk(assistantId, chunk)
        }

        finalizeMessage(assistantId)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to send message'
        setError(msg)
        console.error(err)
      } finally {
        setIsSending(false)
      }
    },
    [
      activeConversationId,
      selectedChatModel,
      systemPrompt,
      messages,
      addMessage,
      appendChunk,
      finalizeMessage,
    ]
  )

  return {
    messages,
    isLoading: isSending || isStreaming,
    error,
    sendMessage,
    clearError: () => setError(''),
  }
}
