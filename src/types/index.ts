export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
  modelId?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface ModelDefinition {
  id: string
  name: string
  provider: string
  capabilities: ('chat' | 'vision' | 'image' | 'embedding')[]
  maxTokens?: number
  description?: string
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export interface ImageOptions {
  width?: number
  height?: number
  steps?: number
  seed?: number
  negativePrompt?: string
}
