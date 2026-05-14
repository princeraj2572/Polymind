import { BaseAdapter } from './base'
import type { Message, ChatOptions } from '../types'

export class GroqAdapter extends BaseAdapter {
  id = 'groq'
  name = 'Groq'
  provider = 'groq'

  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  protected getApiKey(): string | null {
    return this.apiKey || null
  }

  async validateKey(key: string): Promise<boolean> {
    if (!key) return false

    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  async *chat(
    messages: Message[],
    options: ChatOptions
  ): AsyncGenerator<string> {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured')
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: options.systemPrompt || 'You are a helpful assistant.',
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          stream: true,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1024,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${error}`)
    }

    if (!response.body) {
      throw new Error('No response body from Groq')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const json = JSON.parse(data)
              const content = json.choices?.[0]?.delta?.content
              if (content) {
                yield this.sanitizeText(content)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }

        buffer = lines[lines.length - 1]
      }

      if (buffer.trim().startsWith('data: ')) {
        const data = buffer.trim().slice(6)
        if (data !== '[DONE]') {
          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content
            if (content) {
              yield this.sanitizeText(content)
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}
