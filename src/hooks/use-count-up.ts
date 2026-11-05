import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    const from = valueRef.current
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
