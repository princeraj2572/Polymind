import { useEffect, useState } from 'react'
import { Sidebar, TopBar, ContentArea } from '../components/layout'
import { MessageList, InputBar } from '../components/chat'
import { ModelPicker } from '../components/models'
import { useChatStore } from '../stores/chatStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useModelStore } from '../stores/modelStore'
import { adapterRegistry } from '../adapters'

export function ChatPage() {
  const {
    conversations,
    activeConversationId,
    isStreaming,
    createConversation,
    setActiveConversation,
    addMessage,
    appendChunk,
    finalizeMessage,
  } = useChatStore()

  const { streamingEnabled, systemPrompt } = useSettingsStore()
  const { selectedChatModel } = useModelStore()

  const [error, setError] = useState<string>('')
  const [isSending, setIsSending] = useState(false)

  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const messages = activeConv?.messages || []

  // Auto-create first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation()
    }
  }, [])

  const handleSubmitMessage = async (content: string) => {
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
      if (streamingEnabled) {
        const stream = adapter.chat(messages, { systemPrompt })
        for await (const chunk of stream) {
          appendChunk(assistantId, chunk)
        }
      }

      finalizeMessage(assistantId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send message'
      setError(msg)
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-screen bg-bg-base">
      <Sidebar />
      <ContentArea>
        <TopBar title="Chat" actions={<ModelPicker />} />
        {error && (
          <div className="px-6 py-3 bg-status-error/10 border-b border-status-error text-status-error text-sm">
            {error}
          </div>
        )}
        <MessageList messages={messages} />
        <InputBar
          onSubmit={handleSubmitMessage}
          isLoading={isSending || isStreaming}
        />
      </ContentArea>
    </div>
  )
}
