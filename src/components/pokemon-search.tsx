import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SUGGESTIONS = ['pikachu', 'charizard', '150', 'gengar', '448', 'eevee']

export function PokemonSearch({ onSearch }: { onSearch: (value: string) => void }) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(value)
  }

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex gap-2" role="search">
        <label htmlFor="pokemon-query" className="sr-only">
          Nombre o número del Pokémon
        </label>
        <div className="relative flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="pokemon-query"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nombre o número, ej. Pikachu o 25"
            autoComplete="off"
            className="h-11 w-full rounded-xl border bg-background pr-3 pl-9 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <Button type="submit" className="h-11 rounded-xl px-5 text-base">
          Buscar
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Prueba:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setValue(s)
              onSearch(s)
            }}
            className="rounded-full bg-secondary px-3 py-1 text-sm font-medium capitalize transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
          >
            {/^\d+$/.test(s) ? `#${s}` : s}
          </button>
        ))}
      </div>
    </div>
  )
}
