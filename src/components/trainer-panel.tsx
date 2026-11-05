import { useState } from 'react'
import { Plus, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrainerAvatar } from '@/components/trainer-avatar'
import { TrainerCard } from '@/components/trainer-card'
import { TrainerForm } from '@/components/trainer-form'
import { setActiveTrainer, useTrainerStore } from '@/lib/trainer-store'

type View = 'card' | 'create' | 'edit'

export function TrainerPanel() {
  const { trainers, activeTrainer } = useTrainerStore()
  const [view, setView] = useState<View>('card')
  const others = trainers.filter((t) => t.id !== activeTrainer?.id)
  const effectiveView: View = trainers.length === 0 ? 'create' : view === 'edit' && !activeTrainer ? 'card' : view

  return (
    <section aria-labelledby="trainers-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="trainers-title" className="flex items-center gap-2 text-lg font-bold">
          <UserRound aria-hidden="true" className="size-5 text-primary" />
          Entrenadores
        </h2>
        {trainers.length > 0 && effectiveView !== 'edit' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView((v) => (v === 'create' ? 'card' : 'create'))}
            aria-expanded={effectiveView === 'create'}
          >
            {effectiveView === 'create' ? <X aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {effectiveView === 'create' ? 'Cancelar' : 'Nuevo'}
          </Button>
        )}
      </div>

      {effectiveView === 'create' && (
        <div className="card-enter rounded-2xl border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-bold">Nuevo entrenador</h3>
          <TrainerForm
            intro={trainers.length === 0 ? 'Crea tu perfil de entrenador para empezar a guardar Pokémon en tu mochila.' : undefined}
            onDone={() => setView('card')}
            onCancel={trainers.length > 0 ? () => setView('card') : undefined}
          />
        </div>
      )}

      {effectiveView === 'edit' && activeTrainer && (
        <div className="card-enter rounded-2xl border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-bold">Editar a {activeTrainer.name}</h3>
          <TrainerForm key={activeTrainer.id} trainer={activeTrainer} onDone={() => setView('card')} onCancel={() => setView('card')} />
        </div>
      )}

      {effectiveView === 'card' && activeTrainer && <TrainerCard key={activeTrainer.id} trainer={activeTrainer} onEdit={() => setView('edit')} />}

      {others.length > 0 && effectiveView === 'card' && (
        <div className="rounded-2xl border bg-card p-3 shadow-sm">
          <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">Cambiar de entrenador</p>
          <ul className="flex flex-col gap-1">
            {others.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveTrainer(t.id)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                >
                  <TrainerAvatar photo={t.photo} avatarId={t.avatarId} className="size-9" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.region} · {t.backpack.length} Pokémon
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
