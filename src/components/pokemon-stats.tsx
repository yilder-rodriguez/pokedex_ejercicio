import type { CSSProperties } from 'react'
import { useCountUp } from '@/hooks/use-count-up'
import { STAT_LABELS, type PokemonApiResponse } from '@/lib/pokemon'

export function PokemonStats({ stats }: { stats: PokemonApiResponse['stats'] }) {
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0)

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground">Estadísticas base</h4>
        <span className="font-mono text-xs text-muted-foreground">
          Total <AnimatedNumber value={total} />
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {stats.map((s, i) => {
          const label = STAT_LABELS[s.stat.name] ?? s.stat.name
          return (
            <li key={s.stat.name} className="flex items-center gap-3 text-sm">
              <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
              <span className="w-8 shrink-0 text-right font-mono font-bold">
                <AnimatedNumber value={s.base_stat} />
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"
                role="meter"
                aria-label={label}
                aria-valuenow={s.base_stat}
                aria-valuemin={0}
                aria-valuemax={255}
              >
                <div
                  className={
                    s.base_stat >= 100
                      ? 'stat-bar h-full rounded-full bg-green-500'
                      : s.base_stat >= 60
                        ? 'stat-bar h-full rounded-full bg-amber-400'
                        : 'stat-bar h-full rounded-full bg-primary'
                  }
                  style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%`, '--delay': `${i * 60}ms` } as CSSProperties}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const display = useCountUp(value)
  return <span className="tabular-nums">{display}</span>
}
