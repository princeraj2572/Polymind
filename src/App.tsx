import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { Toast } from './components/Toast'
import { HelpOverlay } from './components/HelpOverlay'
import { ChatPage } from './pages/ChatPage'
import { SettingsPage } from './pages/SettingsPage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useChatStore } from './stores/chatStore'

function AppContent() {
  const navigate = useNavigate()
  const createConversation = useChatStore((state) => state.createConversation)
  const [showHelp, setShowHelp] = useState(false)

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: () => {
        createConversation()
        navigate('/chat')
      },
    },
    {
      key: '/',
      ctrl: true,
      handler: () => {
        setShowHelp((prev) => !prev)
      },
    },
  ])

  return (
    <>
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
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
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
