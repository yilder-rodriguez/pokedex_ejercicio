import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { ImageOff, Sparkles } from 'lucide-react'
import { capitalize, getImageCandidates, isPixelSprite, type PokemonApiResponse } from '@/lib/pokemon'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function PokemonArtwork({ pokemon, color }: { pokemon: PokemonApiResponse; color: string }) {
  const [shiny, setShiny] = useState(false)
  const [back, setBack] = useState(false)

  const canShowBack = Boolean(pokemon.sprites.back_default)
  const canShowShiny = getImageCandidates(pokemon, { shiny: true, back: false }).length > 0
  const showBack = back && canShowBack
  const candidates = getImageCandidates(pokemon, { shiny: shiny && canShowShiny, back: showBack })
  const name = capitalize(pokemon.name)
  const alt = `${name}${shiny ? ' variocolor' : ''}, vista ${showBack ? 'trasera' : 'frontal'}`

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <TiltStage color={color}>
        <ArtworkImage key={candidates.join('|')} candidates={candidates} alt={alt} />
      </TiltStage>

      <div className="flex flex-wrap justify-center gap-2">
        <Segmented
          label="Variante"
          options={[
            { value: false, label: 'Normal' },
            { value: true, label: 'Shiny', icon: <Sparkles aria-hidden="true" className="size-3.5" /> },
          ]}
          value={shiny}
          onChange={setShiny}
          disabled={!canShowShiny}
        />
        {canShowBack && (
          <Segmented
            label="Vista"
            options={[
              { value: false, label: 'Frente' },
              { value: true, label: 'Espalda' },
            ]}
            value={back}
            onChange={setBack}
          />
        )}
      </div>
    </div>
  )
}

function TiltStage({ color, children }: { color: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const setTilt = (rx: number, ry: number) => {
    ref.current?.style.setProperty('--rx', `${rx}deg`)
    ref.current?.style.setProperty('--ry', `${ry}deg`)
  }

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion()) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    const strength = event.pointerType === 'mouse' ? 22 : 10
    setTilt(-y * strength, x * strength)
  }

  return (
    <div
      ref={ref}
      className="tilt-scene"
      style={{ '--glow': color } as CSSProperties}
      onPointerMove={handleMove}
      onPointerLeave={() => setTilt(0, 0)}
      onPointerCancel={() => setTilt(0, 0)}
    >
      <div className="tilt-shadow" aria-hidden="true" />
      <div className="tilt-card">
        <div className="tilt-glow" aria-hidden="true" />
        <div className="tilt-float">{children}</div>
      </div>
    </div>
  )
}

function ArtworkImage({ candidates, alt }: { candidates: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const src = candidates[index]

  if (!src) {
    return (
      <div role="img" aria-label={`${alt}: imagen no disponible`} className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <ImageOff aria-hidden="true" className="size-10" />
        <span className="text-sm">Imagen no disponible</span>
      </div>
    )
  }

  return (
    <>
      {!loaded && <div aria-hidden="true" className="absolute inset-[14%] animate-pulse rounded-full bg-muted" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false)
          setIndex((i) => i + 1)
        }}
        className={cn(
          'artwork-img relative size-full object-contain transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          isPixelSprite(src) && '[image-rendering:pixelated]',
        )}
      />
    </>
  )
}

type Option = { value: boolean; label: string; icon?: ReactNode }

function Segmented({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string
  options: Option[]
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full border bg-card p-0.5 shadow-sm">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:opacity-50',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
