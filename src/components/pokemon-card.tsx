import type { CSSProperties } from 'react'
import { Check, ChevronLeft, ChevronRight, PackagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypeBadge } from '@/components/type-badge'
import { Pokeball } from '@/components/pokeball'
import { PokemonArtwork } from '@/components/pokemon-artwork'
import { PokemonStats } from '@/components/pokemon-stats'
import { addToBackpack, useTrainerStore } from '@/lib/trainer-store'
import { MAX_POKEMON_ID, capitalize, formatNumber, getArtwork, getTypeColor, type PokemonApiResponse } from '@/lib/pokemon'

type Props = {
  pokemon: PokemonApiResponse
  loading: boolean
  onNavigate: (value: string) => void
}

export function PokemonCard({ pokemon, loading, onNavigate }: Props) {
  const { activeTrainer } = useTrainerStore()
  const types = pokemon.types.map((t) => t.type.name)
  const color = getTypeColor(pokemon)
  const alreadySaved = activeTrainer?.backpack.some((p) => p.id === pokemon.id) ?? false

  const handleSave = () => {
    addToBackpack({
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.front_default ?? getArtwork(pokemon),
      types,
    })
  }

  return (
    <article
      aria-busy={loading}
      className="card-enter overflow-hidden rounded-2xl border bg-card shadow-sm transition-opacity aria-busy:opacity-60"
      style={{ '--type-color': color } as CSSProperties}
    >
      <div className="flex flex-col md:flex-row">
        <div className="artwork-panel relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-secondary/60 p-6 md:w-2/5">
          <div aria-hidden="true" className="pokeflash">
            <Pokeball className="size-24" />
          </div>
          <span className="relative self-start font-mono text-sm font-bold text-muted-foreground">{formatNumber(pokemon.id)}</span>
          <PokemonArtwork pokemon={pokemon} color={color} />
          <div className="relative flex w-full items-center justify-between">
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

          <PokemonStats stats={pokemon.stats} />

          <div className="mt-auto flex flex-col gap-2 border-t pt-4">
            <Button size="lg" className="h-11 rounded-xl text-base" disabled={!activeTrainer || alreadySaved} onClick={handleSave}>
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
