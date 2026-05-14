import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const toastStyles = {
  success: {
    bg: 'bg-status-success/10',
    border: 'border-status-success',
    text: 'text-status-success',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-status-error/10',
    border: 'border-status-error',
    text: 'text-status-error',
    icon: AlertCircle,
  },
  warning: {
    bg: 'bg-status-warning/10',
    border: 'border-status-warning',
    text: 'text-status-warning',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-accent-primary/10',
    border: 'border-accent-primary',
    text: 'text-accent-primary',
    icon: InfoIcon,
  },
}

export function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type]
        const Icon = style.icon

        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.border} ${style.text} border rounded-lg px-4 py-3 flex items-start gap-3 max-w-sm animate-slideIn`}
          >
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
