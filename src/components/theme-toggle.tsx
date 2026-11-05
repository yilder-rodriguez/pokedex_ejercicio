import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Activar modo claro' : 'Activar modo oscuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25 focus-visible:ring-3 focus-visible:ring-primary-foreground/60 focus-visible:outline-none"
    >
      <Sun
        aria-hidden="true"
        className={cn(
          'absolute size-5 transition-all duration-300 motion-reduce:transition-none',
          isDark ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute size-5 transition-all duration-300 motion-reduce:transition-none',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0',
        )}
      />
    </button>
  )
}
