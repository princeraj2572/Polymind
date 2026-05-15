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
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-white/8"
      >
        <span className="max-w-[12rem] truncate font-medium">{selected?.name || 'Select model'}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 max-h-96 overflow-y-auto rounded-3xl border border-white/10 bg-[#181818]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <div className="p-1">
            {Object.entries(byProvider).map(([provider, models]) => (
              <div key={provider}>
                <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
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
                      className={`w-full rounded-2xl px-3 py-3 text-left text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-white text-[#111111]'
                          : hasKey || model.provider === 'pollinations'
                            ? 'text-text-primary hover:bg-white/8'
                            : 'cursor-not-allowed text-text-muted opacity-50'
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
