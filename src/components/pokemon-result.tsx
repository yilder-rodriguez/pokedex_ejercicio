import { Loader2, SearchX } from 'lucide-react'
import { PokemonCard } from '@/components/pokemon-card'
import { usePokemon } from '@/hooks/use-pokemon'
import { useSwapAnimation } from '@/hooks/use-swap-animation'
import { MAX_POKEMON_ID, PokemonNotFoundError } from '@/lib/pokemon'

type Props = {
  query: string
  onNavigate: (value: string) => void
}

export function PokemonResult({ query, onNavigate }: Props) {
  const { data, error, isLoading } = usePokemon(query)
  const { shown, leaving } = useSwapAnimation(data)

  if (error && !isLoading) {
    const notFound = error instanceof PokemonNotFoundError
    return (
      <div role="alert" className="card-enter flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-16 text-center shadow-sm">
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

  if (!shown) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border bg-card py-24 text-muted-foreground shadow-sm">
        <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        Buscando en la Pokédex...
      </div>
    )
  }

  return (
    <div className={leaving ? 'card-exit' : undefined}>
      <PokemonCard key={shown.id} pokemon={shown} loading={isLoading} onNavigate={onNavigate} />
    </div>
  )
}
