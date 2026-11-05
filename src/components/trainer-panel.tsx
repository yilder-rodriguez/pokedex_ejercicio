import { useState, type FormEvent } from 'react'
import { Plus, Trash2, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AVATAR_IDS, REGIONS, createTrainer, deleteTrainer, setActiveTrainer, useTrainerStore } from '@/lib/trainer-store'
import { spriteUrl } from '@/lib/pokemon'
import { cn } from '@/lib/utils'

export function TrainerPanel() {
  const { trainers, activeTrainerId } = useTrainerStore()
  const [showForm, setShowForm] = useState(false)
  const formOpen = showForm || trainers.length === 0

  return (
    <section aria-labelledby="trainers-title" className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="trainers-title" className="flex items-center gap-2 text-lg font-bold">
          <UserRound aria-hidden="true" className="size-5 text-primary" />
          Entrenadores
        </h2>
        {trainers.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowForm((v) => !v)} aria-expanded={formOpen}>
            {formOpen ? <X aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {formOpen ? 'Cancelar' : 'Nuevo'}
          </Button>
        )}
      </div>

      {trainers.length > 0 && (
        <ul className="flex flex-col gap-2">
          {trainers.map((t) => {
            const active = t.id === activeTrainerId
            return (
              <li key={t.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTrainer(t.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex flex-1 items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                    active ? 'border-primary bg-primary/5' : 'hover:bg-muted',
                  )}
                >
                  <img
                    src={spriteUrl(t.avatarId)}
                    alt=""
                    className="size-10 rounded-full bg-secondary [image-rendering:pixelated]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.region} · {t.backpack.length} Pokémon
                    </span>
                  </span>
                  {active && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase">
                      Activo
                    </span>
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Eliminar a ${t.name}`}
                  onClick={() => {
                    if (confirm(`¿Eliminar el perfil de ${t.name} y su mochila?`)) deleteTrainer(t.id)
                  }}
                >
                  <Trash2 aria-hidden="true" className="text-muted-foreground" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      {formOpen && <TrainerForm onCreated={() => setShowForm(false)} isFirst={trainers.length === 0} />}
    </section>
  )
}

function TrainerForm({ onCreated, isFirst }: { onCreated: () => void; isFirst: boolean }) {
  const [name, setName] = useState('')
  const [region, setRegion] = useState(REGIONS[0])
  const [avatarId, setAvatarId] = useState(AVATAR_IDS[0])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    createTrainer({ name, region, avatarId })
    setName('')
    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-3', !isFirst && 'mt-4 border-t pt-4')}>
      {isFirst && (
        <p className="text-sm text-muted-foreground">
          Crea tu perfil de entrenador para empezar a guardar Pokémon en tu mochila.
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trainer-name" className="text-sm font-medium">
          Nombre
        </label>
        <input
          id="trainer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={20}
          placeholder="Ash Ketchum"
          className="h-10 rounded-lg border bg-background px-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trainer-region" className="text-sm font-medium">
          Región de origen
        </label>
        <select
          id="trainer-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-10 rounded-lg border bg-background px-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Avatar</legend>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_IDS.map((id) => (
            <label
              key={id}
              className={cn(
                'flex cursor-pointer items-center justify-center rounded-xl border bg-secondary/50 p-1 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                avatarId === id ? 'border-primary bg-primary/10' : 'hover:bg-muted',
              )}
            >
              <input
                type="radio"
                name="avatar"
                value={id}
                checked={avatarId === id}
                onChange={() => setAvatarId(id)}
                className="sr-only"
              />
              <img src={spriteUrl(id)} alt={`Avatar ${id}`} className="size-12 [image-rendering:pixelated]" />
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" className="h-10 rounded-lg">
        Crear entrenador
      </Button>
    </form>
  )
}
