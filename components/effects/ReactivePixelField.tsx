'use client'

import { useEffect, useRef } from 'react'
import { mountReactivePixelField } from '@/lib/reactive-pixel-field/src/reactive-pixel-field.js'
import savedOptions from '@/lib/reactive-pixel-field/reactive-pixel-field.options.js'

export interface ReactivePixelFieldProps {
  className?: string
  ariaLabel?: string
  gridSize?: number
  fillSize?: number
  autoCrawler?: boolean
  onStatsChange?: (stats: { ripples: number; bursts: number }) => void
}

export default function ReactivePixelField({
  className = '',
  ariaLabel = 'Campo de pixels reativo da Imbas Tecnologia',
  gridSize,
  fillSize,
  autoCrawler,
  onStatsChange,
}: ReactivePixelFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const onStatsRef = useRef(onStatsChange)
  onStatsRef.current = onStatsChange

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const options = {
      ...savedOptions,
      ariaLabel,
      ...(gridSize !== undefined ? { gridSize } : {}),
      ...(fillSize !== undefined ? { fillSize } : {}),
      ...(autoCrawler !== undefined ? { autoCrawler } : {}),
    }

    const controller = mountReactivePixelField(root, options)

    const syncStats = () => {
      const state = controller.getState()
      onStatsRef.current?.({
        ripples: state.pulseCount ?? 0,
        bursts: state.burstCount ?? 0,
      })
    }

    root.addEventListener('ntpixel:pulse', syncStats)
    root.addEventListener('ntpixel:burst', syncStats)

    return () => {
      root.removeEventListener('ntpixel:pulse', syncStats)
      root.removeEventListener('ntpixel:burst', syncStats)
      controller.destroy()
    }
  }, [ariaLabel, autoCrawler, fillSize, gridSize])

  return <div ref={rootRef} className={className} aria-label={ariaLabel} />
}
