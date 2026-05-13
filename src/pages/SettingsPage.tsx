import { useState } from 'react'
import { Sidebar, TopBar, ContentArea } from '../components/layout'
import { Button, Input, Badge } from '../components/ui'
import { useSettingsStore } from '../stores/settingsStore'
import { useModelStore, ALL_MODELS } from '../stores/modelStore'
import { Eye, EyeOff } from 'lucide-react'

export function SettingsPage() {
  const { apiKeys, setApiKey, removeApiKey } = useSettingsStore()
  const { refreshAvailability } = useModelStore()

  const [newKeys, setNewKeys] = useState<Record<string, string>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const providers = Array.from(
    new Set(ALL_MODELS.map((m) => m.provider).filter((p) => p !== 'pollinations'))
  )

  const handleSetKey = (provider: string) => {
    const key = newKeys[provider]
    if (key.trim()) {
      setApiKey(provider, key)
      setNewKeys({ ...newKeys, [provider]: '' })

      // Refresh available models
      const availableIds = ALL_MODELS
        .filter((m) => {
          if (m.provider === 'pollinations') return true
          const k = apiKeys[m.provider] || (m.provider === provider ? key : '')
          return !!k
        })
        .map((m) => m.id)
      refreshAvailability(availableIds)
    }
  }

  const handleRemoveKey = (provider: string) => {
    removeApiKey(provider)

    // Refresh available models
    const newApiKeys = { ...apiKeys }
    delete newApiKeys[provider]

    const availableIds = ALL_MODELS
      .filter((m) => {
        if (m.provider === 'pollinations') return true
        return !!newApiKeys[m.provider]
      })
      .map((m) => m.id)
    refreshAvailability(availableIds)
  }

  return (
    <div className="flex h-screen bg-bg-base">
      <Sidebar />
      <ContentArea>
        <TopBar title="Settings" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            {/* API Keys Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                API Keys
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Your API keys are stored locally in your browser. Never sent to any
                server.
              </p>

              <div className="space-y-4">
                {providers.map((provider) => {
                  const hasKey = !!apiKeys[provider]
                  const newKey = newKeys[provider] || ''
                  const isShowing = showKeys[provider]

                  return (
                    <div
                      key={provider}
                      className="p-4 bg-bg-elevated rounded-lg border border-border-subtle"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary capitalize">
                            {provider}
                          </h3>
                          {hasKey && (
                            <Badge variant="success" size="sm">
                              Active
                            </Badge>
                          )}
                          {!hasKey && (
                            <Badge variant="neutral" size="sm">
                              Not set
                            </Badge>
                          )}
                        </div>
                      </div>

                      {hasKey ? (
                        <div className="flex gap-2 items-end">
                          <Input
                            type={isShowing ? 'text' : 'password'}
                            value={apiKeys[provider]}
                            disabled
                            className="flex-1"
                          />
                          <button
                            onClick={() =>
                              setShowKeys({
                                ...showKeys,
                                [provider]: !isShowing,
                              })
                            }
                            className="p-2 hover:bg-bg-hover rounded transition-colors"
                          >
                            {isShowing ? (
                              <EyeOff size={18} className="text-text-secondary" />
                            ) : (
                              <Eye size={18} className="text-text-secondary" />
                            )}
                          </button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveKey(provider)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder={`Enter ${provider} API key`}
                            value={newKey}
                            onChange={(e) =>
                              setNewKeys({
                                ...newKeys,
                                [provider]: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSetKey(provider)}
                            disabled={!newKey.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 bg-accent-muted rounded-lg border border-accent-primary/20 text-accent-primary text-sm">
              <p className="font-semibold mb-2">Security Note</p>
              <p>
                All API keys are stored only in your browser's localStorage. PolyMind
                never sends your keys to any server. You have full control over your
                credentials.
              </p>
            </div>
          </div>
        </div>
      </ContentArea>
    </div>
  )
}
