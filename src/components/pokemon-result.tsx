import useSWR from 'swr'
import { Check, ChevronLeft, ChevronRight, Loader2, PackagePlus, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypeBadge } from '@/components/type-badge'
import { addToBackpack, useTrainerStore } from '@/lib/trainer-store'
import {
  MAX_POKEMON_ID,
  PokemonNotFoundError,
  STAT_LABELS,
  capitalize,
  fetchPokemon,
  formatNumber,
  getArtwork,
  type PokemonApiResponse,
} from '@/lib/pokemon'

type Props = {
  query: string
  onNavigate: (value: string) => void
}

export function PokemonResult({ query, onNavigate }: Props) {
  const { data, error, isLoading } = useSWR<PokemonApiResponse>(['pokemon', query], () => fetchPokemon(query), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
  })

  if (error && !isLoading) {
    const notFound = error instanceof PokemonNotFoundError
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-16 text-center shadow-sm">
        <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
        <p className="text-lg font-semibold">{notFound ? 'No encontramos ese Pokémon' : 'Algo salió mal'}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {notFound
            ? `"${query}" no existe en la Pokédex. Revisa el nombre (en inglés) o prueba con un número del 1 al ${MAX_POKEMON_ID}.`
            : error.message}
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border bg-card py-24 text-muted-foreground shadow-sm">
        <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        Buscando en la Pokédex...
      </div>
    )
  }

  return <PokemonCard pokemon={data} loading={isLoading} onNavigate={onNavigate} />
}

function PokemonCard({
  pokemon,
  loading,
  onNavigate,
}: {
  pokemon: PokemonApiResponse
  loading: boolean
  onNavigate: (value: string) => void
}) {
  const { activeTrainer } = useTrainerStore()
  const artwork = getArtwork(pokemon)
  const types = pokemon.types.map((t) => t.type.name)
  const alreadySaved = activeTrainer?.backpack.some((p) => p.id === pokemon.id) ?? false
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)

  const handleSave = () => {
    addToBackpack({
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.front_default ?? artwork,
      types,
    })
  }

  return (
    <article
      aria-busy={loading}
      className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-opacity aria-busy:opacity-60"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative flex flex-col items-center justify-center gap-2 bg-secondary/60 p-6 md:w-2/5">
          <span className="self-start font-mono text-sm font-bold text-muted-foreground">{formatNumber(pokemon.id)}</span>
          {artwork ? (
            <img
              src={artwork}
              alt={`Ilustración oficial de ${capitalize(pokemon.name)}`}
              className="aspect-square w-full max-w-64 object-contain drop-shadow-lg"
            />
          ) : (
            <div className="aspect-square w-full max-w-64" />
          )}
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              aria-label="Pokémon anterior"
              disabled={pokemon.id <= 1}
              onClick={() => onNavigate(String(pokemon.id - 1))}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Pokémon siguiente"
              disabled={pokemon.id >= MAX_POKEMON_ID}
              onClick={() => onNavigate(String(pokemon.id + 1))}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-balance">{capitalize(pokemon.name)}</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            <InfoTile label="Altura" value={`${(pokemon.height / 10).toFixed(1)} m`} />
            <InfoTile label="Peso" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
            <InfoTile label="Exp. base" value={pokemon.base_experience ?? '—'} />
          </dl>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Habilidades</h4>
            <ul className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <li key={a.ability.name} className="rounded-lg border px-2.5 py-1 text-sm">
                  {capitalize(a.ability.name)}
                  {a.is_hidden && <span className="ml-1 text-xs text-muted-foreground">(oculta)</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <h4 className="text-sm font-semibold text-muted-foreground">Estadísticas base</h4>
              <span className="font-mono text-xs text-muted-foreground">Total {totalStats}</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {pokemon.stats.map((s) => (
                <li key={s.stat.name} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 text-muted-foreground">{STAT_LABELS[s.stat.name] ?? s.stat.name}</span>
                  <span className="w-8 shrink-0 text-right font-mono font-bold">{s.base_stat}</span>
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"
                    role="meter"
                    aria-label={STAT_LABELS[s.stat.name] ?? s.stat.name}
                    aria-valuenow={s.base_stat}
                    aria-valuemin={0}
                    aria-valuemax={255}
                  >
                    <div
                      className={s.base_stat >= 100 ? 'h-full rounded-full bg-green-500' : s.base_stat >= 60 ? 'h-full rounded-full bg-amber-400' : 'h-full rounded-full bg-primary'}
                      style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t pt-4">
            <Button
              size="lg"
              className="h-11 rounded-xl text-base"
              disabled={!activeTrainer || alreadySaved}
              onClick={handleSave}
            >
              {alreadySaved ? <Check aria-hidden="true" /> : <PackagePlus aria-hidden="true" />}
              {alreadySaved ? 'Ya está en tu mochila' : 'Guardar en la mochila'}
            </Button>
            {!activeTrainer && (
              <p className="text-center text-sm text-muted-foreground">Crea o elige un entrenador para guardar Pokémon.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function InfoTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-mono text-base font-bold">{value}</dd>
    </div>
  )
}
