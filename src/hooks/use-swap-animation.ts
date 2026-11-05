import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const EXIT_MS = 260

/** Keeps the previous item on screen while its exit animation plays, then swaps in the new one. */
export function useSwapAnimation<T extends { id: number }>(value: T | undefined) {
  const [shown, setShown] = useState(value)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!value) return
    if (!shown || shown.id === value.id || prefersReducedMotion()) {
      setShown(value)
      setLeaving(false)
      return
    }
    setLeaving(true)
    const timeout = window.setTimeout(() => {
      setShown(value)
      setLeaving(false)
    }, EXIT_MS)
    return () => window.clearTimeout(timeout)
    // `shown` is intentionally excluded: only a new incoming value should trigger a swap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return { shown: shown ?? value, leaving }
}
