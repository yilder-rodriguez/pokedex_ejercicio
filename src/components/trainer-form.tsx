import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ImageUp, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrainerAvatar } from '@/components/trainer-avatar'
import {
  AVATAR_IDS,
  DEFAULT_GENDER,
  GENDERS,
  REGIONS,
  createTrainer,
  updateTrainer,
  type Gender,
  type Trainer,
} from '@/lib/trainer-store'
import { resizeToSquare } from '@/lib/image'
import { spriteUrl } from '@/lib/pokemon'
import { toast } from '@/lib/toast-store'
import { cn } from '@/lib/utils'

type PhotoMode = 'avatar' | 'upload'

type Props = {
  trainer?: Trainer
  intro?: string
  onDone: () => void
  onCancel?: () => void
}

const fieldClass =
  'h-10 rounded-lg border bg-background px-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30'

export function TrainerForm({ trainer, intro, onDone, onCancel }: Props) {
  const uid = useId()
  const isEdit = Boolean(trainer)
  const [name, setName] = useState(trainer?.name ?? '')
  const [region, setRegion] = useState(trainer?.region ?? REGIONS[0])
  const [gender, setGender] = useState<Gender>(trainer?.gender ?? DEFAULT_GENDER)
  const [avatarId, setAvatarId] = useState(trainer?.avatarId ?? AVATAR_IDS[0])
  const [photo, setPhoto] = useState<string | null>(trainer?.photo ?? null)
  const [mode, setMode] = useState<PhotoMode>(trainer?.photo ? 'upload' : 'avatar')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    const input = { name, region, gender, avatarId, photo: mode === 'upload' ? photo : null }
    try {
      if (trainer) {
        updateTrainer(trainer.id, input)
        toast(`Perfil de ${name.trim()} actualizado`)
      } else {
        createTrainer(input)
        toast(`¡Bienvenido, ${name.trim()}!`)
      }
      onDone()
    } catch (error) {
      toast((error as Error).message, 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {intro && <p className="text-sm text-muted-foreground">{intro}</p>}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-name`} className="text-sm font-medium">
          Nombre
        </label>
        <input
          id={`${uid}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={20}
          placeholder="Ash Ketchum"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-region`} className="text-sm font-medium">
            Región
          </label>
          <select id={`${uid}-region`} value={region} onChange={(e) => setRegion(e.target.value)} className={cn(fieldClass, 'px-2')}>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium">Género</legend>
          <div className="flex h-10 rounded-lg border bg-background p-0.5">
            {GENDERS.map((g) => (
              <label
                key={g.value}
                className={cn(
                  'flex flex-1 cursor-pointer items-center justify-center rounded-md text-xs font-semibold transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                  gender === g.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <input
                  type="radio"
                  name={`${uid}-gender`}
                  value={g.value}
                  checked={gender === g.value}
                  onChange={() => setGender(g.value)}
                  className="sr-only"
                />
                {g.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Foto</legend>
        <div role="tablist" aria-label="Tipo de foto" className="flex rounded-lg bg-muted p-0.5">
          {(['avatar', 'upload'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'avatar' ? 'Avatar prediseñado' : 'Subir imagen'}
            </button>
          ))}
        </div>

        {mode === 'avatar' ? (
          <AvatarGrid name={`${uid}-avatar`} value={avatarId} onChange={setAvatarId} />
        ) : (
          <PhotoUpload photo={photo} avatarId={avatarId} onChange={setPhoto} />
        )}
      </fieldset>

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" className="h-10 flex-1 rounded-lg" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" className="h-10 flex-1 rounded-lg">
          {isEdit ? 'Guardar cambios' : 'Crear entrenador'}
        </Button>
      </div>
    </form>
  )
}

function AvatarGrid({ name, value, onChange }: { name: string; value: number; onChange: (id: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {AVATAR_IDS.map((id) => (
        <label
          key={id}
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-xl border bg-secondary/50 p-1 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
            value === id ? 'border-primary bg-primary/10' : 'hover:bg-muted',
          )}
        >
          <input type="radio" name={name} value={id} checked={value === id} onChange={() => onChange(id)} className="sr-only" />
          <img src={spriteUrl(id)} alt={`Avatar ${id}`} className="size-12 [image-rendering:pixelated]" />
        </label>
      ))}
    </div>
  )
}

function PhotoUpload({
  photo,
  avatarId,
  onChange,
}: {
  photo: string | null
  avatarId: number
  onChange: (photo: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError(null)
    setProcessing(true)
    try {
      onChange(await resizeToSquare(file))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-dashed p-3">
      <div className="relative">
        <TrainerAvatar
          photo={photo}
          avatarId={avatarId}
          alt={photo ? 'Vista previa de tu foto' : 'Sin foto: se usará tu avatar'}
          className="size-20 border-4 border-card shadow-md ring-2 ring-primary"
        />
        {processing && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
        <Button type="button" variant="outline" size="sm" disabled={processing} onClick={() => inputRef.current?.click()}>
          <ImageUp aria-hidden="true" />
          {photo ? 'Cambiar imagen' : 'Elegir imagen'}
        </Button>
        {photo && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <Trash2 aria-hidden="true" />
            Quitar
          </Button>
        )}
        <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')} role={error ? 'alert' : undefined}>
          {error ?? 'Se recorta al centro y se reduce a 256 px.'}
        </p>
      </div>
    </div>
  )
}
