import { useSyncExternalStore } from 'react'

export type ToastTone = 'success' | 'info' | 'error'
export type Toast = { id: number; message: string; tone: ToastTone }

let toasts: Toast[] = []
let nextId = 1
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function toast(message: string, tone: ToastTone = 'success') {
  const id = nextId++
  toasts = [...toasts, { id, message, tone }].slice(-3)
  emit()
  window.setTimeout(() => dismissToast(id), 3200)
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => toasts,
  )
}
