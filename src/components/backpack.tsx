import { Backpack as BackpackIcon, X } from 'lucide-react'
import { TypeBadge } from '@/components/type-badge'
import { removeFromBackpack, useTrainerStore } from '@/lib/trainer-store'
import { capitalize, formatNumber } from '@/lib/pokemon'

export function Backpack({ onSelect }: { onSelect: (id: number) => void }) {
  const { activeTrainer } = useTrainerStore()
  if (!activeTrainer) return null

  const items = [...activeTrainer.backpack].sort((a, b) => a.id - b.id)

  return (
    <section aria-labelledby="backpack-title" className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="backpack-title" className="flex items-center gap-2 text-lg font-bold">
          <BackpackIcon aria-hidden="true" className="size-5 text-primary" />
          Mochila de {activeTrainer.name}
        </h2>
        <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-bold text-accent-foreground">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Tu mochila está vacía. Busca un Pokémon y pulsa &quot;Guardar en la mochila&quot;.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {items.map((p) => (
            <li key={p.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className="flex w-full flex-col items-center gap-1 rounded-xl border bg-secondary/40 p-2 text-center transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <img src={p.sprite} alt="" className="size-16 [image-rendering:pixelated]" loading="lazy" />
                <span className="font-mono text-[10px] text-muted-foreground">{formatNumber(p.id)}</span>
                <span className="w-full truncate text-sm font-semibold">{capitalize(p.name)}</span>
                <span className="flex flex-wrap justify-center gap-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </span>
              </button>
              <button
                type="button"
                onClick={() => removeFromBackpack(p.id)}
                aria-label={`Liberar a ${capitalize(p.name)}`}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:bg-destructive hover:text-white focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
