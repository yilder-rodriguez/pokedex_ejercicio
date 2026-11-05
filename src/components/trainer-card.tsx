import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pokeball } from '@/components/pokeball'
import { TrainerAvatar } from '@/components/trainer-avatar'
import { TrainerStats } from '@/components/trainer-stats'
import { deleteTrainer, genderLabel, type Trainer } from '@/lib/trainer-store'
import { toast } from '@/lib/toast-store'

const dateFormat = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' })

export function TrainerCard({ trainer, onEdit }: { trainer: Trainer; onEdit: () => void }) {
  const [confirming, setConfirming] = useState(false)

  const handleDelete = () => {
    deleteTrainer(trainer.id)
    toast(`Perfil de ${trainer.name} eliminado`, 'info')
  }

  return (
    <article aria-label={`Credencial de ${trainer.name}`} className="card-enter overflow-hidden rounded-2xl border bg-card shadow-md">
      <div className="relative flex items-center justify-between overflow-hidden bg-primary px-4 py-2 text-primary-foreground">
        <span className="text-xs font-bold tracking-widest uppercase">Licencia de Entrenador</span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold text-accent-foreground uppercase">Activo</span>
        <Pokeball className="pointer-events-none absolute -right-4 -bottom-6 size-20 opacity-15" />
      </div>

      <div className="flex items-center gap-4 p-4">
        <TrainerAvatar
          photo={trainer.photo}
          avatarId={trainer.avatarId}
          alt={`Foto de ${trainer.name}`}
          className="size-20 border-4 border-card shadow-md ring-2 ring-primary"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-extrabold tracking-tight">{trainer.name}</h3>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
            <dt className="text-muted-foreground">Región</dt>
            <dd className="font-semibold">{trainer.region}</dd>
            <dt className="text-muted-foreground">Género</dt>
            <dd className="font-semibold">{genderLabel(trainer.gender)}</dd>
            <dt className="text-muted-foreground">Desde</dt>
            <dd className="font-semibold">{dateFormat.format(trainer.createdAt)}</dd>
            <dt className="text-muted-foreground">Capturados</dt>
            <dd className="font-mono font-semibold">{trainer.backpack.length}</dd>
          </dl>
        </div>
      </div>

      <div className="border-t px-4 py-4">
        <TrainerStats backpack={trainer.backpack} />
      </div>

      <div className="flex items-center gap-2 border-t bg-muted/40 px-4 py-3">
        {confirming ? (
          <>
            <p className="flex-1 text-xs font-medium">¿Eliminar perfil y mochila?</p>
            <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} autoFocus>
              Eliminar
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Pencil aria-hidden="true" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} aria-label={`Eliminar a ${trainer.name}`}>
              <Trash2 aria-hidden="true" />
              Eliminar
            </Button>
          </>
        )}
      </div>
    </article>
  )
}
