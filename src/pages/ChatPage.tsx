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
    <div className="min-h-screen bg-[#111111] text-text-primary">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_26%),linear-gradient(180deg,#131313_0%,#101010_45%,#0d0d0d_100%)]" />
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-0 md:grid-cols-[18rem_minmax(0,1fr)]">
        <Sidebar />
        <ContentArea>
          <TopBar title="Chat" actions={<ModelPicker />} />
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onPromptSelect={handleSubmitMessage}
          />
          <InputBar onSubmit={handleSubmitMessage} isLoading={isLoading} />
        </ContentArea>
      </div>
    </div>
  )
}
