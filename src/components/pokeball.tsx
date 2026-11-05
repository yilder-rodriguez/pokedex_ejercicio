import { cn } from '@/lib/utils'

export function Pokeball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('shrink-0', className)}>
      <circle cx="16" cy="16" r="14.5" fill="#fff" stroke="#1f2937" strokeWidth="2.5" />
      <path d="M1.5 16a14.5 14.5 0 0 1 29 0Z" fill="#ef4444" stroke="#1f2937" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="4.5" fill="#fff" stroke="#1f2937" strokeWidth="2.5" />
    </svg>
  )
}
