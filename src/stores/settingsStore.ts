import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  apiKeys: Record<string, string>
  defaultChatModel: string
  defaultImageModel: string
  theme: 'dark' | 'light'
  systemPrompt: string
  streamingEnabled: boolean

  // Actions
  setApiKey: (provider: string, key: string) => void
  removeApiKey: (provider: string) => void
  setDefaultModel: (type: 'chat' | 'image', modelId: string) => void
  setTheme: (theme: 'dark' | 'light') => void
  setSystemPrompt: (prompt: string) => void
  setStreamingEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      apiKeys: {},
      defaultChatModel: 'groq-llama-3.3-70b',
      defaultImageModel: 'pollinations',
      theme: 'dark',
      systemPrompt: 'You are a helpful AI assistant.',
      streamingEnabled: true,

      setApiKey: (provider, key) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key,
          },
        }))
      },

      removeApiKey: (provider) => {
        set((state) => {
          const newKeys = { ...state.apiKeys }
          delete newKeys[provider]
          return { apiKeys: newKeys }
        })
      },

      setDefaultModel: (type, modelId) => {
        if (type === 'chat') {
          set({ defaultChatModel: modelId })
        } else {
          set({ defaultImageModel: modelId })
        }
      },

      setTheme: (theme) => {
        set({ theme })
      },

      setSystemPrompt: (prompt) => {
        set({ systemPrompt: prompt })
      },

      setStreamingEnabled: (enabled) => {
        set({ streamingEnabled: enabled })
      },
    }),
    {
      name: 'polymind-settings',
      version: 1,
    }
  )
)
