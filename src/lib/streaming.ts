export async function* parseSSEStream(
  response: Response
): AsyncGenerator<string> {
  if (!response.body) {
    throw new Error('No response body')
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

      // Process complete lines
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim()
        if (line && line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data !== '[DONE]') {
            yield data
          }
        }
      }

      // Keep incomplete line in buffer
      buffer = lines[lines.length - 1]
    }

    // Process any remaining data
    if (buffer.trim().startsWith('data: ')) {
      const data = buffer.trim().slice(6)
      if (data !== '[DONE]') {
        yield data
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export function sanitizeStreamText(text: string): string {
  return text.replace(/\x00/g, '').replace(/\\n/g, '\n')
}

export class StreamError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = 'StreamError'
  }
}

export async function handleStreamResponse(
  response: Response
): Promise<void> {
  if (!response.ok) {
    const text = await response.text()
    throw new StreamError(
      response.status,
      `API request failed: ${text || response.statusText}`
    )
  }
}
