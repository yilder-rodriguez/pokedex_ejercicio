import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { TypeBadge } from '@/components/type-badge'
import { TYPE_COLORS, artworkUrl, capitalize, formatNumber } from '@/lib/pokemon'
import { prefersReducedMotion } from '@/lib/motion'
import type { SavedPokemon } from '@/lib/trainer-store'
import { cn } from '@/lib/utils'

type Props = {
  pokemon: SavedPokemon
  leaving: boolean
  index: number
  onOpen: () => void
}

export function BackpackCard({ pokemon, leaving, index, onOpen }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [src, setSrc] = useState(() => artworkUrl(pokemon.id))
  const color = TYPE_COLORS[pokemon.types[0] ?? ''] ?? '#ef4444'
  const name = capitalize(pokemon.name)

  const setTilt = (rx: number, ry: number) => {
    ref.current?.style.setProperty('--rx', `${rx}deg`)
    ref.current?.style.setProperty('--ry', `${ry}deg`)
  }

  const handleMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current || prefersReducedMotion()) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTilt(-y * 14, x * 14)
  }

  return (
    <li
      className={leaving ? 'bag-item-exit' : 'bag-item-enter'}
      style={{ '--delay': `${Math.min(index, 8) * 40}ms` } as CSSProperties}
    >
      <button
        ref={ref}
        type="button"
        onClick={onOpen}
        onPointerMove={handleMove}
        onPointerLeave={() => setTilt(0, 0)}
        aria-label={`${name}, ${formatNumber(pokemon.id)}. Ver detalles`}
        className="bag-card group flex w-full flex-col items-center gap-1 overflow-hidden rounded-xl border bg-card p-2 pb-3 text-center shadow-sm focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        style={{ '--type-color': color } as CSSProperties}
      >
        <span className="bag-card-art relative flex aspect-square w-full items-center justify-center rounded-lg">
          <span className="absolute top-1 left-1.5 font-mono text-[10px] font-bold text-muted-foreground">{formatNumber(pokemon.id)}</span>
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => src !== pokemon.sprite && setSrc(pokemon.sprite)}
            className={cn(
              'artwork-img size-[82%] object-contain transition-transform duration-300 group-hover:scale-110',
              src === pokemon.sprite && '[image-rendering:pixelated]',
            )}
          />
        </span>
        <span className="w-full truncate text-sm font-bold">{name}</span>
        <span className="flex flex-wrap justify-center gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </span>
      </button>
    </li>
  )
}
