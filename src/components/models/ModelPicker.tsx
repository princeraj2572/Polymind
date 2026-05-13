import { useModelStore } from '../../stores/modelStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export function ModelPicker() {
  const { allModels, selectedChatModel, selectModel } = useModelStore()
  const { apiKeys } = useSettingsStore()
  const [isOpen, setIsOpen] = useState(false)

  const chatModels = allModels.filter((m) => m.capabilities.includes('chat'))
  const selected = chatModels.find((m) => m.id === selectedChatModel)

  // Group by provider
  const byProvider = chatModels.reduce(
    (acc, model) => {
      if (!acc[model.provider]) acc[model.provider] = []
      acc[model.provider].push(model)
      return acc
    },
    {} as Record<string, typeof chatModels>
  )

  const handleSelect = (modelId: string) => {
    selectModel('chat', modelId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border-default rounded-lg text-text-primary hover:bg-bg-hover transition-colors text-sm"
      >
        <span className="font-mono">{selected?.name || 'Select model'}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {Object.entries(byProvider).map(([provider, models]) => (
              <div key={provider}>
                <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {provider}
                </p>
                {models.map((model) => {
                  const hasKey = apiKeys[model.provider]
                  const isSelected = model.id === selectedChatModel

                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model.id)}
                      disabled={!hasKey && model.provider !== 'pollinations'}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-accent-primary text-bg-base'
                          : hasKey || model.provider === 'pollinations'
                            ? 'text-text-primary hover:bg-bg-hover'
                            : 'text-text-muted opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{model.name}</p>
                        {model.description && (
                          <p className="text-xs opacity-75">{model.description}</p>
                        )}
                      </div>
                      {isSelected && <Check size={16} />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
