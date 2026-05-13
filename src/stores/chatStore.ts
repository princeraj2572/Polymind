import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, Message } from '../types'

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  streamingMessageId: string | null

  // Actions
  createConversation: () => void
  setActiveConversation: (id: string) => void
  addMessage: (message: Message) => void
  appendChunk: (messageId: string, chunk: string) => void
  finalizeMessage: (messageId: string) => void
  clearConversation: () => void
  deleteConversation: (id: string) => void
}

const generateId = () => Math.random().toString(36).slice(2, 11)

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
  conversations: [],
  activeConversationId: null,
  isStreaming: false,
  streamingMessageId: null,

  createConversation: () => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: newConv.id,
    }))
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id })
  },

  addMessage: (message) => {
    set((state) => {
      if (!state.activeConversationId) return state
      return {
        conversations: state.conversations.map((conv) =>
          conv.id === state.activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                updatedAt: Date.now(),
              }
            : conv
        ),
        isStreaming: message.role === 'assistant' ? true : state.isStreaming,
        streamingMessageId: message.role === 'assistant' ? message.id : state.streamingMessageId,
      }
    })
  },

  appendChunk: (messageId, chunk) => {
    set((state) => {
      if (!state.activeConversationId) return state
      return {
        conversations: state.conversations.map((conv) =>
          conv.id === state.activeConversationId
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === messageId
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                ),
              }
            : conv
        ),
      }
    })
  },

  finalizeMessage: (messageId) => {
    set({
      isStreaming: false,
      streamingMessageId: null,
    })
  },

  clearConversation: () => {
    set((state) => {
      if (!state.activeConversationId) return state
      return {
        conversations: state.conversations.map((conv) =>
          conv.id === state.activeConversationId
            ? { ...conv, messages: [] }
            : conv
        ),
      }
    })
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const newConversations = state.conversations.filter((c) => c.id !== id)
      let newActiveId = state.activeConversationId

      // If deleting active conversation, switch to another one
      if (id === state.activeConversationId) {
        newActiveId = newConversations.length > 0 ? newConversations[0].id : null
      }

      return {
        conversations: newConversations,
        activeConversationId: newActiveId,
      }
    })
  },
    }),
    {
      name: 'polymind-chat',
      version: 1,
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
)