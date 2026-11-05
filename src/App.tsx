import { useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { PokemonSearch } from '@/components/pokemon-search'
import { PokemonResult } from '@/components/pokemon-result'
import { TrainerPanel } from '@/components/trainer-panel'
import { Backpack } from '@/components/backpack'
import { BackgroundWatermark } from '@/components/background-watermark'
import { Toaster } from '@/components/toaster'
import { normalizeQuery } from '@/lib/pokemon'

export default function App() {
  const [query, setQuery] = useState('pikachu')

  const search = (value: string) => {
    const normalized = normalizeQuery(value)
    if (normalized) setQuery(normalized)
  }

  return (
    <div className="relative isolate min-h-dvh bg-background font-sans text-foreground">
      <BackgroundWatermark query={query} />
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:py-10">
        <section aria-labelledby="pokedex-title" className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 id="pokedex-title" className="sr-only">
            Buscador de Pokémon
          </h2>
          <PokemonSearch onSearch={search} />
          <PokemonResult query={query} onNavigate={search} />
        </section>
        <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-6 lg:w-96">
          <TrainerPanel />
          <Backpack onSelect={(id) => search(String(id))} />
        </aside>
      </main>
      <Toaster />
    </div>
  )
}
