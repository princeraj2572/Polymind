import { BaseAdapter } from './base'
import type { Message, ChatOptions } from '../types'

export class MistralAdapter extends BaseAdapter {
  id = 'mistral'
  name = 'Mistral AI'
  provider = 'mistral'

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
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages: [{ role: 'user', content: 'test' }],
        }),
      })
      return response.ok || response.status === 400 // 400 is expected for test
    } catch {
      return false
    }
  }

  async *chat(messages: Message[], options: ChatOptions): AsyncGenerator<string> {
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

    try {
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
    } finally {
      reader.releaseLock()
    }
  }
}
