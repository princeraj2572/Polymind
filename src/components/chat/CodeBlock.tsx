import { Copy } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useState } from 'react'

interface CodeBlockProps {
  language?: string
  code: string
}

export function CodeBlock({ language = 'javascript', code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-3 rounded-lg overflow-hidden bg-black">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-hover border-b border-border-subtle">
        <span className="text-xs font-mono text-text-secondary">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-accent-primary text-bg-base rounded hover:bg-accent-glow transition-colors"
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          backgroundColor: '#0A0A0F',
          fontSize: '14px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
