import { create } from 'zustand'
import type { ModelDefinition } from '../types'

interface ModelStore {
  allModels: ModelDefinition[]
  availableModels: ModelDefinition[]
  selectedChatModel: string
  selectedImageModel: string

  // Actions
  setAllModels: (models: ModelDefinition[]) => void
  setAvailableModels: (models: ModelDefinition[]) => void
  selectModel: (type: 'chat' | 'image', modelId: string) => void
  refreshAvailability: (availableModelIds: string[]) => void
}

// Define all supported models
export const ALL_MODELS: ModelDefinition[] = [
  // Groq - Chat Models
  {
    id: 'groq-llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'groq',
    capabilities: ['chat'],
    maxTokens: 8000,
    description: 'Fast and capable open model',
  },
  {
    id: 'groq-mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'groq',
    capabilities: ['chat'],
    maxTokens: 32000,
    description: 'Mixture of experts model',
  },
  {
    id: 'groq-gemma-2-9b',
    name: 'Gemma 2 9B',
    provider: 'groq',
    capabilities: ['chat'],
    maxTokens: 8000,
    description: 'Efficient and lightweight',
  },

  // Google Gemini
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    capabilities: ['chat', 'vision'],
    maxTokens: 4000,
    description: 'Fast and cost-effective',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    capabilities: ['chat', 'vision'],
    maxTokens: 100000,
    description: 'Most capable Gemini model',
  },

  // Mistral
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'mistral',
    capabilities: ['chat'],
    maxTokens: 32000,
    description: 'Efficient open model',
  },

  // Image Models
  {
    id: 'pollinations',
    name: 'Pollinations',
    provider: 'pollinations',
    capabilities: ['image'],
    description: 'Free image generation (no key required)',
  },
  {
    id: 'huggingface-flux',
    name: 'HuggingFace FLUX',
    provider: 'huggingface',
    capabilities: ['image'],
    description: 'High quality image generation',
  },
]

export const useModelStore = create<ModelStore>((set) => ({
  allModels: ALL_MODELS,
  availableModels: [
    ALL_MODELS.find((m) => m.id === 'pollinations')!,
  ],
  selectedChatModel: 'groq-llama-3.3-70b',
  selectedImageModel: 'pollinations',

  setAllModels: (models) => {
    set({ allModels: models })
  },

  setAvailableModels: (models) => {
    set({ availableModels: models })
  },

  selectModel: (type, modelId) => {
    if (type === 'chat') {
      set({ selectedChatModel: modelId })
    } else {
      set({ selectedImageModel: modelId })
    }
  },

  refreshAvailability: (availableModelIds) => {
    set((state) => ({
      availableModels: state.allModels.filter((model) =>
        availableModelIds.includes(model.id)
      ),
    }))
  },
}))
