import { TypeBadge } from '@/components/type-badge'
import { useCountUp } from '@/hooks/use-count-up'
import { MAX_POKEMON_ID } from '@/lib/pokemon'
import type { SavedPokemon } from '@/lib/trainer-store'

function mostFrequentType(backpack: SavedPokemon[]) {
  const counts = new Map<string, number>()
  for (const p of backpack) for (const t of p.types) counts.set(t, (counts.get(t) ?? 0) + 1)
  let best: string | null = null
  let max = 0
  for (const [type, count] of counts) {
    if (count > max) {
      best = type
      max = count
    }
  }
  return best
}

export function TrainerStats({ backpack }: { backpack: SavedPokemon[] }) {
  const total = backpack.length
  const shown = useCountUp(total)
  const topType = mostFrequentType(backpack)
  const percent = (total / MAX_POKEMON_ID) * 100

  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-muted px-3 py-2">
          <dt className="text-xs text-muted-foreground">Total Pokémon</dt>
          <dd className="font-mono text-xl font-bold tabular-nums">{shown}</dd>
        </div>
        <div className="rounded-xl bg-muted px-3 py-2">
          <dt className="text-xs text-muted-foreground">Tipo favorito</dt>
          <dd className="mt-1">{topType ? <TypeBadge type={topType} /> : <span className="text-sm text-muted-foreground">—</span>}</dd>
        </div>
      </dl>
      <div>
        <div className="mb-1 flex items-baseline justify-between text-xs">
          <span id="dex-progress-label" className="font-medium text-muted-foreground">
            Progreso de la Pokédex
          </span>
          <span className="font-mono tabular-nums">
            {total} / {MAX_POKEMON_ID}
          </span>
        </div>
        <div
          role="progressbar"
          aria-labelledby="dex-progress-label"
          aria-valuenow={total}
          aria-valuemin={0}
          aria-valuemax={MAX_POKEMON_ID}
          className="h-2.5 overflow-hidden rounded-full bg-secondary"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
            style={{ width: `${total > 0 ? Math.max(1.5, percent) : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
