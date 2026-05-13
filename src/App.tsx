import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ChatPage } from './pages/ChatPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
