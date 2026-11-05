import { useSyncExternalStore } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'pokedex-theme'
const listeners = new Set<() => void>()

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

let currentTheme: Theme = typeof window === 'undefined' ? 'light' : (readStoredTheme() ?? systemTheme())

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function setTheme(theme: Theme) {
  currentTheme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage may be unavailable (private mode); the theme still applies for this session.
  }
  const root = document.documentElement
  if (!prefersReducedMotion()) {
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 400)
  }
  applyTheme(theme)
  emit()
}

if (typeof window !== 'undefined') {
  applyTheme(currentTheme)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (readStoredTheme()) return
    currentTheme = systemTheme()
    applyTheme(currentTheme)
    emit()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => 'light' as Theme,
  )
  return { theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}
