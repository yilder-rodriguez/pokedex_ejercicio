import { useEffect, useRef, type CSSProperties } from 'react'
import { Loader2, Search, Unlock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypeBadge } from '@/components/type-badge'
import { PokemonStats } from '@/components/pokemon-stats'
import { usePokemon } from '@/hooks/use-pokemon'
import { TYPE_COLORS, artworkUrl, capitalize, formatNumber } from '@/lib/pokemon'
import type { SavedPokemon } from '@/lib/trainer-store'

type Props = {
  pokemon: SavedPokemon
  onClose: () => void
  onRelease: (pokemon: SavedPokemon) => void
  onView: (id: number) => void
}

const dateFormat = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'long', year: 'numeric' })

export function PokemonModal({ pokemon, onClose, onRelease, onView }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const { data, isLoading } = usePokemon(String(pokemon.id))
  const color = TYPE_COLORS[pokemon.types[0] ?? ''] ?? '#ef4444'
  const name = capitalize(pokemon.name)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby="pokemon-modal-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="modal-enter m-auto w-[min(92vw,28rem)] overflow-hidden rounded-2xl border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      style={{ '--type-color': color } as CSSProperties}
    >
      <div className="artwork-panel relative flex flex-col items-center bg-secondary/60 px-6 pt-6 pb-4">
        <span className="self-start font-mono text-sm font-bold text-muted-foreground">{formatNumber(pokemon.id)}</span>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Cerrar"
          className="absolute top-3 right-3 rounded-full bg-card/80 p-1.5 text-muted-foreground shadow-sm hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
        <img
          src={artworkUrl(pokemon.id)}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = pokemon.sprite
          }}
          className="artwork-img size-48 object-contain"
        />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h2 id="pokemon-modal-title" className="text-2xl font-extrabold tracking-tight">
            {name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Capturado el {dateFormat.format(pokemon.savedAt)}</p>
        </div>

        {data && data.id === pokemon.id ? (
          <PokemonStats stats={data.stats} />
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            {isLoading ? 'Cargando estadísticas...' : 'No se pudieron cargar las estadísticas.'}
          </p>
        )}

        <div className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="h-10 flex-1 rounded-lg"
            onClick={() => {
              onView(pokemon.id)
              ref.current?.close()
            }}
          >
            <Search aria-hidden="true" />
            Ver en Pokédex
          </Button>
          <Button variant="destructive" className="h-10 flex-1 rounded-lg" onClick={() => onRelease(pokemon)}>
            <Unlock aria-hidden="true" />
            Liberar
          </Button>
        </div>
      </div>
    </dialog>
  )
}
