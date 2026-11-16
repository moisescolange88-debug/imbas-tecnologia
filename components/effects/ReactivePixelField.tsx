'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { mountReactivePixelField } from '@/lib/reactive-pixel-field/src/reactive-pixel-field.js'
import savedOptions from '@/lib/reactive-pixel-field/reactive-pixel-field.options.js'

export interface ReactivePixelFieldHandle {
  pulse: (x?: number, y?: number, strength?: number) => void
  burst: (x?: number, y?: number) => void
}

export interface ReactivePixelFieldProps {
  className?: string
  ariaLabel?: string
  gridSize?: number
  fillSize?: number
  autoCrawler?: boolean
  onStatsChange?: (stats: { ripples: number; bursts: number }) => void
}

const ReactivePixelField = forwardRef<ReactivePixelFieldHandle, ReactivePixelFieldProps>(
  function ReactivePixelField(
    {
      className = '',
      ariaLabel = 'Campo de pixels reativo da Imbas Tecnologia',
      gridSize,
      fillSize,
      autoCrawler,
      onStatsChange,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null)
    const controllerRef = useRef<ReturnType<typeof mountReactivePixelField> | null>(null)
    const onStatsRef = useRef(onStatsChange)
    onStatsRef.current = onStatsChange

    useImperativeHandle(ref, () => ({
      pulse(x = 0.5, y = 0.5, strength = 1.15) {
        controllerRef.current?.pulse(x, y, strength)
      },
      burst(x = 0.5, y = 0.5) {
        controllerRef.current?.burst(x, y)
      },
    }))

    useEffect(() => {
      const root = rootRef.current
      if (!root) return

      const isMobileViewport = window.innerWidth < 768
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const options = {
        ...savedOptions,
        ariaLabel,
        // Em telas pequenas/touch, aumenta presença do padrão e alcance das ondas
        ambientIntensity: isMobileViewport ? 0.92 : savedOptions.ambientIntensity,
        waveRadius: isMobileViewport ? 0.68 : savedOptions.waveRadius,
        ...(gridSize !== undefined ? { gridSize } : {}),
        ...(fillSize !== undefined ? { fillSize } : {}),
        ...(autoCrawler !== undefined ? { autoCrawler } : {}),
      }

      const controller = mountReactivePixelField(root, options)
      controllerRef.current = controller

      const syncStats = () => {
        const state = controller.getState()
        onStatsRef.current?.({
          ripples: state.pulseCount ?? 0,
          bursts: state.burstCount ?? 0,
        })
      }

      root.addEventListener('ntpixel:pulse', syncStats)
      root.addEventListener('ntpixel:burst', syncStats)

      // Pulso inicial suave ao carregar para o campo já nascer vivo no desktop e celular
      let welcomeTimer1 = 0
      let welcomeTimer2 = 0
      if (!reducedMotion) {
        welcomeTimer1 = window.setTimeout(() => {
          controller.pulse(0.76, 0.34, 1.05)
        }, 280)
        welcomeTimer2 = window.setTimeout(() => {
          controller.pulse(0.24, 0.72, 0.9)
        }, 980)
      }

      // Em dispositivos touch (onde o núcleo desabilita autoCrawler por finePointer),
      // mantém ondas automáticas suaves enquanto visível na tela.
      let mobileCrawlerTimer = 0
      let isVisible = true
      let io: IntersectionObserver | null = null
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(entries => {
          isVisible = entries[0]?.isIntersecting ?? true
        })
        io.observe(root)
      }

      if (isCoarsePointer && !reducedMotion && options.autoCrawler !== false) {
        let step = 0
        mobileCrawlerTimer = window.setInterval(() => {
          if (!isVisible || document.hidden) return
          step += 1
          const nx = 0.22 + ((Math.sin(step * 1.9) + 1) * 0.5) * 0.56
          const ny = 0.24 + ((Math.cos(step * 1.3) + 1) * 0.5) * 0.52
          if (step % 4 === 0) {
            controller.burst(nx, ny)
          } else {
            controller.pulse(nx, ny, 0.95)
          }
        }, 4200)
      }

      // Suporte a tap e double-tap no celular SEM bloquear o scroll nativo (touchMode: "scroll")
      let touchStartX = 0
      let touchStartY = 0
      let touchStartTime = 0
      let lastTapTime = 0

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) {
          touchStartTime = 0
          return
        }
        const t = e.touches[0]
        touchStartX = t.clientX
        touchStartY = t.clientY
        touchStartTime = performance.now()
      }

      const onTouchEnd = (e: TouchEvent) => {
        if (!touchStartTime || e.changedTouches.length !== 1) return
        const target = e.target as HTMLElement | null
        if (target && target.closest('a,button,input,select,textarea,[role="tab"]')) return

        const t = e.changedTouches[0]
        const dt = performance.now() - touchStartTime
        const dist = Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY)
        touchStartTime = 0

        // Só dispara se foi um toque intencional (não um swipe de scroll)
        if (dt > 340 || dist > 14) return

        const rect = root.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return
        const nx = Math.min(0.98, Math.max(0.02, (t.clientX - rect.left) / rect.width))
        const ny = Math.min(0.98, Math.max(0.02, (t.clientY - rect.top) / rect.height))

        const now = performance.now()
        if (now - lastTapTime < 340) {
          controller.burst(nx, ny)
          lastTapTime = 0
        } else {
          controller.pulse(nx, ny, 1.15)
          lastTapTime = now
        }
      }

      root.addEventListener('touchstart', onTouchStart, { passive: true })
      root.addEventListener('touchend', onTouchEnd, { passive: true })

      return () => {
        window.clearTimeout(welcomeTimer1)
        window.clearTimeout(welcomeTimer2)
        window.clearInterval(mobileCrawlerTimer)
        io?.disconnect()
        root.removeEventListener('touchstart', onTouchStart)
        root.removeEventListener('touchend', onTouchEnd)
        root.removeEventListener('ntpixel:pulse', syncStats)
        root.removeEventListener('ntpixel:burst', syncStats)
        controllerRef.current = null
        controller.destroy()
      }
    }, [ariaLabel, autoCrawler, fillSize, gridSize])

    return <div ref={rootRef} className={className} aria-label={ariaLabel} />
  },
)

export default ReactivePixelField
