import { useMemo, useState } from 'react'
import { Backpack as BackpackIcon } from 'lucide-react'
import { BackpackCard } from '@/components/backpack-card'
import { PokemonModal } from '@/components/pokemon-modal'
import { Pokeball } from '@/components/pokeball'
import { useCountUp } from '@/hooks/use-count-up'
import { removeFromBackpack, useTrainerStore, type SavedPokemon } from '@/lib/trainer-store'
import { TYPE_STYLES, capitalize } from '@/lib/pokemon'
import { toast } from '@/lib/toast-store'
import { cn } from '@/lib/utils'

type SortKey = 'numero' | 'nombre' | 'fecha'

const SORTERS: Record<SortKey, (a: SavedPokemon, b: SavedPokemon) => number> = {
  numero: (a, b) => a.id - b.id,
  nombre: (a, b) => a.name.localeCompare(b.name),
  fecha: (a, b) => b.savedAt - a.savedAt,
}

const EXIT_MS = 280

const selectClass =
  'h-9 min-w-0 flex-1 rounded-lg border bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30'

export function Backpack({ onSelect }: { onSelect: (id: number) => void }) {
  const { activeTrainer } = useTrainerStore()
  const [sort, setSort] = useState<SortKey>('numero')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [openId, setOpenId] = useState<number | null>(null)
  const [leaving, setLeaving] = useState<Set<number>>(() => new Set())

  const backpack = activeTrainer?.backpack ?? []
  const count = useCountUp(backpack.length)

  const availableTypes = useMemo(() => [...new Set(backpack.flatMap((p) => p.types))].sort(), [backpack])
  const activeFilter = availableTypes.includes(typeFilter) ? typeFilter : 'todos'
  const items = useMemo(
    () => backpack.filter((p) => activeFilter === 'todos' || p.types.includes(activeFilter)).sort(SORTERS[sort]),
    [backpack, activeFilter, sort],
  )
  const openPokemon = backpack.find((p) => p.id === openId) ?? null

  if (!activeTrainer) return null

  const release = (pokemon: SavedPokemon) => {
    setOpenId(null)
    setLeaving((prev) => new Set(prev).add(pokemon.id))
    window.setTimeout(() => {
      removeFromBackpack(pokemon.id)
      setLeaving((prev) => {
        const next = new Set(prev)
        next.delete(pokemon.id)
        return next
      })
      toast(`${capitalize(pokemon.name)} ha sido liberado`, 'info')
    }, EXIT_MS)
  }

  return (
    <section aria-labelledby="backpack-title" className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 id="backpack-title" className="flex min-w-0 items-center gap-2 text-lg font-bold">
          <BackpackIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
          <span className="truncate">Mochila de {activeTrainer.name}</span>
        </h2>
        <span
          key={backpack.length}
          aria-label={`${backpack.length} Pokémon`}
          className="count-pop rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-bold text-accent-foreground tabular-nums"
        >
          {count}
        </span>
      </div>

      {backpack.length === 0 ? (
        <EmptyBackpack />
      ) : (
        <>
          <div className="mb-3 flex gap-2">
            <label className="sr-only" htmlFor="backpack-sort">
              Ordenar por
            </label>
            <select id="backpack-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
              <option value="numero">Ordenar: Número</option>
              <option value="nombre">Ordenar: Nombre</option>
              <option value="fecha">Ordenar: Más recientes</option>
            </select>
            <label className="sr-only" htmlFor="backpack-filter">
              Filtrar por tipo
            </label>
            <select id="backpack-filter" value={activeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
              <option value="todos">Todos los tipos</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {TYPE_STYLES[t]?.label ?? t}
                </option>
              ))}
            </select>
          </div>

          <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2')}>
            {items.map((p, i) => (
              <BackpackCard key={p.id} pokemon={p} index={i} leaving={leaving.has(p.id)} onOpen={() => setOpenId(p.id)} />
            ))}
          </ul>
        </>
      )}

      {openPokemon && (
        <PokemonModal pokemon={openPokemon} onClose={() => setOpenId(null)} onRelease={release} onView={onSelect} />
      )}
    </section>
  )
}

function EmptyBackpack() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-10 text-center">
      <div className="empty-bob relative">
        <div aria-hidden="true" className="absolute inset-0 scale-150 rounded-full bg-primary/10 blur-xl" />
        <Pokeball className="relative size-16" />
      </div>
      <p className="font-bold text-balance">Tu mochila está vacía, ¡sal a capturar!</p>
      <p className="max-w-60 text-sm text-pretty text-muted-foreground">
        Busca un Pokémon y pulsa &quot;Guardar en la mochila&quot; para añadirlo aquí.
      </p>
    </div>
  )
}
