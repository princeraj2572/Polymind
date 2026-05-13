import { BaseAdapter } from './base'
import { Message, ChatOptions } from '../types'

export class MistralAdapter extends BaseAdapter {
  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async chat(messages: Message[], options: ChatOptions): Promise<AsyncGenerator<string>> {
    return this.handleStream(async () => {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(
          `Mistral API error: ${error.message || response.statusText}`
        )
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line === '' || line === '[DONE]') continue
          if (!line.startsWith('data: ')) continue

          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) yield content
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      // Process remaining buffer
      if (buffer && buffer !== '[DONE]') {
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6)
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) yield content
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    })
  }

  async validateKey(key: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}
