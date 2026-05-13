import { Sidebar, TopBar, ContentArea } from '../components/layout'
import { MessageList, InputBar } from '../components/chat'
import { ModelPicker } from '../components/models'
import { useChat } from '../hooks/useChat'
import { useConversation } from '../hooks/useConversation'

export function ChatPage() {
  const { messages, isLoading, error, sendMessage, clearError } = useChat()
  useConversation() // Auto-create first conversation

  const handleSubmitMessage = async (content: string) => {
    clearError()
    await sendMessage(content)
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
          isLoading={isLoading}
        />
      </ContentArea>
    </div>
  )
}
