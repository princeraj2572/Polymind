import { BaseAdapter } from './base'
import { GroqAdapter } from './groq'
import { GeminiAdapter } from './gemini'
import { MistralAdapter } from './mistral'
import { useSettingsStore } from '../stores/settingsStore'

class AdapterRegistry {
  private adapters: Map<string, BaseAdapter> = new Map()

  register(providerId: string, adapter: BaseAdapter): void {
    this.adapters.set(providerId, adapter)
  }

  getAdapter(modelId: string): BaseAdapter | null {
    const provider = this.extractProvider(modelId)
    return this.adapters.get(provider) || null
  }

  private extractProvider(modelId: string): string {
    // Models are named like: 'groq-llama-3.3-70b', 'gemini-2.0-flash'
    const parts = modelId.split('-')
    return parts[0]
  }

  getAllAdapters(): BaseAdapter[] {
    return Array.from(this.adapters.values())
  }

  refreshAdapters(): void {
    const settings = useSettingsStore.getState()
    this.adapters.clear()

    // Register Groq adapter if key exists
    if (settings.apiKeys.groq) {
      this.register('groq', new GroqAdapter(settings.apiKeys.groq))
    } else {
      this.register('groq', new GroqAdapter(''))
    }

    // Register Gemini adapter if key exists
    if (settings.apiKeys.gemini) {
      this.register('gemini', new GeminiAdapter(settings.apiKeys.gemini))
    } else {
      this.register('gemini', new GeminiAdapter(''))
    }

    // Register Mistral adapter if key exists
    if (settings.apiKeys.mistral) {
      this.register('mistral', new MistralAdapter(settings.apiKeys.mistral))
    } else {
      this.register('mistral', new MistralAdapter(''))
    }
  }
}

export const adapterRegistry = new AdapterRegistry()
adapterRegistry.refreshAdapters()

export { BaseAdapter }
