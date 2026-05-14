import { BaseAdapter } from './base'
import { Message, ChatOptions } from '../types'

export class GeminiAdapter extends BaseAdapter {
  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async *chat(messages: Message[], options: ChatOptions): AsyncGenerator<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${options.model}:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: options.temperature,
            maxOutputTokens: options.maxTokens,
          },
          systemInstruction: {
            parts: [{ text: options.systemPrompt }],
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
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
          if (line.startsWith(']')) continue
          if (line === '') continue

          try {
            const chunk = JSON.parse(line)
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) yield text
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      // Process remaining buffer
      if (buffer) {
        try {
          const chunk = JSON.parse(buffer)
          const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) yield text
        } catch (e) {
          // Ignore parse errors for leftover buffer
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async validateKey(key: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash?key=${key}`
      )
      return response.ok
    } catch {
      return false
    }
  }
}
