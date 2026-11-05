import { useState, type CSSProperties } from 'react'
import { Pokeball } from '@/components/pokeball'
import { usePokemon } from '@/hooks/use-pokemon'
import { getTypeColor } from '@/lib/pokemon'

export function BackgroundWatermark({ query }: { query: string }) {
  const { data } = usePokemon(query)
  const artwork = data ? (data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default ?? '') : ''
  const color = data ? getTypeColor(data) : 'transparent'

  const [current, setCurrent] = useState(artwork)
  const [previous, setPrevious] = useState<string | null>(null)
  if (artwork !== current) {
    setPrevious(current)
    setCurrent(artwork)
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ '--wm-color': color } as CSSProperties}
    >
      <div className="watermark-tint absolute inset-0" />
      {previous !== null && previous !== current && (
        <WatermarkLayer key={`out-${previous}`} url={previous} className="watermark-out" />
      )}
      <WatermarkLayer key={`in-${current}`} url={current} className="watermark-in" />
    </div>
  )
}

function WatermarkLayer({ url, className }: { url: string; className: string }) {
  if (!url) {
    return (
      <div className={`watermark-layer watermark-pokeball ${className}`}>
        <Pokeball className="size-full" />
      </div>
    )
  }
  return <img src={url} alt="" decoding="async" className={`watermark-layer object-contain ${className}`} />
}
