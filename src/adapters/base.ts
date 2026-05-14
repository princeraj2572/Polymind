import type { Message, ChatOptions, ImageOptions } from '../types'

export abstract class BaseAdapter {
  abstract id: string
  abstract name: string
  abstract provider: string

  abstract chat(
    messages: Message[],
    options: ChatOptions
  ): AsyncGenerator<string>

  abstract validateKey(key: string): Promise<boolean>

  isAvailable(): boolean {
    return !!this.getApiKey()
  }

  protected abstract getApiKey(): string | null

  async generateImage?(
    prompt: string,
    options: ImageOptions
  ): Promise<string>

  async transcribe?(audioBlob: Blob): Promise<string>

  protected async *handleStream(
    response: Response
  ): AsyncGenerator<string> {
    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        yield decoder.decode(value, { stream: true })
      }
    } finally {
      reader.releaseLock()
    }
  }

  protected sanitizeText(text: string): string {
    return text.replace(/\x00/g, '')
  }
}
