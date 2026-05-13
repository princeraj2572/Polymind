import { useEffect } from 'react'
import { Sidebar, TopBar, ContentArea } from '../components/layout'
import { MessageList, InputBar } from '../components/chat'
import { ModelPicker } from '../components/models'
import { useChat } from '../hooks/useChat'
import { useConversation } from '../hooks/useConversation'
import { useToast } from '../context/ToastContext'

export function ChatPage() {
  const { messages, isLoading, error, sendMessage, clearError } = useChat()
  const { showToast } = useToast()
  useConversation() // Auto-create first conversation

  // Show error as toast when it appears
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
      clearError()
    }
  }, [error, showToast, clearError])

  const handleSubmitMessage = async (content: string) => {
    await sendMessage(content)
  }

  return (
    <div className="flex h-screen bg-bg-base">
      <Sidebar />
      <ContentArea>
        <TopBar title="Chat" actions={<ModelPicker />} />
        <MessageList messages={messages} />
        <InputBar
          onSubmit={handleSubmitMessage}
          isLoading={isLoading}
        />
      </ContentArea>
    </div>
  )
}
