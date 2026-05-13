import { useNavigate } from 'react-router-dom'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { Toast } from './components/Toast'
import { ChatPage } from './pages/ChatPage'
import { SettingsPage } from './pages/SettingsPage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useChatStore } from './stores/chatStore'

function AppContent() {
  const navigate = useNavigate()
  const createConversation = useChatStore((state) => state.createConversation)

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: () => {
        createConversation()
        navigate('/chat')
      },
    },
  ])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      {/* Placeholder routes for future phases */}
      <Route path="/image" element={<ChatPage />} />
      <Route path="/voice" element={<ChatPage />} />
      <Route path="/vision" element={<ChatPage />} />
      <Route path="/compare" element={<ChatPage />} />
    </Routes>
  )
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toast />
    </ToastProvider>
  )
}

export default App
