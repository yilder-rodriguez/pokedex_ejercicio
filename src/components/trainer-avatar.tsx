import { spriteUrl } from '@/lib/pokemon'
import { cn } from '@/lib/utils'

type Props = {
  photo: string | null
  avatarId: number
  alt?: string
  className?: string
}

export function TrainerAvatar({ photo, avatarId, alt = '', className }: Props) {
  return (
    <img
      src={photo ?? spriteUrl(avatarId)}
      alt={alt}
      className={cn(
        'shrink-0 rounded-full bg-secondary',
        photo ? 'object-cover' : 'object-contain [image-rendering:pixelated]',
        className,
      )}
    />
  )
}
