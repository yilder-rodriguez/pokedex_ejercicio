import { TYPE_STYLES } from '@/lib/pokemon'
import { cn } from '@/lib/utils'

export function TypeBadge({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' }) {
  const style = TYPE_STYLES[type] ?? { label: type, className: 'bg-muted text-foreground' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        style.className,
      )}
    >
      {style.label}
    </span>
  )
}
