import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { dismissToast, useToasts } from '@/lib/toast-store'
import { cn } from '@/lib/utils'

const ICONS = { success: CircleCheck, info: Info, error: CircleAlert }

export function Toaster() {
  const toasts = useToasts()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:right-4 sm:left-auto sm:items-end"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone]
        return (
          <div
            key={t.id}
            role="status"
            className="toast-enter pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg"
          >
            <Icon
              aria-hidden="true"
              className={cn(
                'size-5 shrink-0',
                t.tone === 'success' && 'text-green-600 dark:text-green-400',
                t.tone === 'info' && 'text-primary',
                t.tone === 'error' && 'text-destructive',
              )}
            />
            <p className="flex-1 font-medium">{t.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Cerrar aviso"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
