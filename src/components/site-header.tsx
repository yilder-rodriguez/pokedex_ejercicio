import { useTrainerStore } from '@/lib/trainer-store'
import { spriteUrl } from '@/lib/pokemon'
import { Pokeball } from '@/components/pokeball'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  const { activeTrainer } = useTrainerStore()

  return (
    <header className="border-b-4 border-zinc-900 bg-primary text-primary-foreground dark:border-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Pokeball className="size-10" />
          <div>
            <h1 className="text-2xl font-extrabold leading-none tracking-tight">Pokédex</h1>
            <p className="text-sm text-primary-foreground/80">Busca, captura y guarda</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeTrainer ? (
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/15 py-1 pr-4 pl-1">
              <img
                src={spriteUrl(activeTrainer.avatarId)}
                alt=""
                className="size-9 rounded-full bg-primary-foreground [image-rendering:pixelated]"
              />
              <div className="leading-tight">
                <p className="text-xs text-primary-foreground/80">Entrenador activo</p>
                <p className="max-w-32 truncate text-sm font-semibold">{activeTrainer.name}</p>
              </div>
            </div>
          ) : (
            <p className="hidden text-sm text-primary-foreground/80 sm:block">Sin entrenador activo</p>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
