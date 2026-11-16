'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Camada de movimento refinada do site.
 * - Sem word-split lento nem cursor artificial escondendo o ponteiro nativo.
 * - Elementos visíveis na dobra inicial aparecem imediatamente sem atraso.
 * - Mantém barra de progresso de leitura, nav com estado de scroll, foco de luz
 *   sutil nos cards, magnetismo leve nos CTAs, letreiro ogham e contagem numérica.
 */

const STAGGER = ['.cards', '.cards-3', '.steps', '.proof-grid', '.calc-dashboard', '.cot-metrics'].join(',')
const SPOT = ['.card', '.calc-card', '.step', '.proof', '.lic-item', '.player', '.hero-showcase'].join(',')
const MAGNET = ['.btn', '.nav-cta', '.calc-btn', '.poster-btn'].join(',')

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

function countUp(el: HTMLElement, reduced: boolean) {
  if (el.dataset.counted) return
  el.dataset.counted = 'done'
  const node = Array.from(el.childNodes).find(
    n => n.nodeType === Node.TEXT_NODE && /\d/.test(n.textContent ?? ''),
  )
  if (!node) return
  const target = parseInt((node.textContent ?? '').replace(/\D/g, ''), 10)
  if (!Number.isFinite(target) || reduced) return
  const t0 = performance.now()
  const dur = 1100
  const frame = (now: number) => {
    const p = Math.min((now - t0) / dur, 1)
    node.textContent = String(Math.round(target * easeOutExpo(p)))
    if (p < 1) requestAnimationFrame(frame)
  }
  node.textContent = '0'
  requestAnimationFrame(frame)
}

export default function MotionLayer() {
  const pathname = usePathname()
  const parallax = useRef<{ el: HTMLElement; speed: number }[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    root.classList.add('motion-ready')

    const progress = document.createElement('div')
    progress.className = 'scroll-progress'
    progress.setAttribute('aria-hidden', 'true')
    document.body.appendChild(progress)

    const nav = document.querySelector('nav')
    let magnetEl: HTMLElement | null = null
    let lastY = -1
    let raf = 0

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const spot = target.closest<HTMLElement>(SPOT)
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
        spot.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
      }

      if (reduced) return

      const magnet = target.closest<HTMLElement>(MAGNET)
      if (magnetEl && magnetEl !== magnet) {
        magnetEl.style.removeProperty('--mag-x')
        magnetEl.style.removeProperty('--mag-y')
      }
      magnetEl = magnet
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        magnet.style.setProperty('--mag-x', `${dx * 0.14}px`)
        magnet.style.setProperty('--mag-y', `${dy * 0.2}px`)
      }
    }

    const clearMagnet = () => {
      if (!magnetEl) return
      magnetEl.style.removeProperty('--mag-x')
      magnetEl.style.removeProperty('--mag-y')
      magnetEl = null
    }

    const loop = () => {
      const y = scrollY
      if (y !== lastY) {
        const max = document.documentElement.scrollHeight - innerHeight
        progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`

        if (nav) {
          nav.classList.toggle('is-scrolled', y > 24)
        }

        if (!reduced) {
          for (const { el, speed } of parallax.current) {
            const r = el.getBoundingClientRect()
            if (r.bottom < -200 || r.top > innerHeight + 200) continue
            const off = (r.top + r.height / 2 - innerHeight / 2) * -speed
            el.style.transform = `translate3d(0,${off.toFixed(2)}px,0)`
          }
        }
        lastY = y
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', clearMagnet)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', clearMagnet)
      progress.remove()
      root.classList.remove('motion-ready')
    }
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.querySelectorAll<HTMLElement>(STAGGER).forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        ;(child as HTMLElement).style.setProperty('--stagger', `${Math.min(i * 65, 260)}ms`)
        child.classList.add('anim-rise')
      })
    })

    document
      .querySelectorAll<HTMLElement>('.reveal, .lic-controlbar, .calc-disclaimer, .cot-form, .cot-empty, .player')
      .forEach(el => el.classList.add('anim-rise'))

    const targets: { el: HTMLElement; speed: number }[] = []
    document.querySelectorAll<HTMLElement>('.rings3d').forEach(el => {
      targets.push({ el, speed: 0.08 })
    })
    parallax.current = targets

    document.querySelectorAll<HTMLElement>('.ogham-strip').forEach(strip => {
      if (strip.dataset.marquee) return
      const svg = strip.querySelector('svg')
      if (!svg || !svg.innerHTML) return
      strip.dataset.marquee = 'done'
      const track = document.createElement('div')
      track.className = 'ogham-track'
      strip.insertBefore(track, svg)
      track.appendChild(svg)
      track.appendChild(svg.cloneNode(true))
    })

    const animated = document.querySelectorAll<HTMLElement>('.anim-rise, .proof .num')
    if (reduced || !('IntersectionObserver' in window)) {
      animated.forEach(el => {
        el.classList.add('is-in', 'in')
        if (el.classList.contains('num')) countUp(el, true)
      })
      return
    }

    // Revela imediatamente o que já está no viewport inicial.
    animated.forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.96) {
        el.classList.add('is-in', 'in')
        if (el.classList.contains('num')) countUp(el, false)
      }
    })

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.classList.add('is-in', 'in')
          if (el.classList.contains('num')) countUp(el, false)
          io.unobserve(el)
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -3% 0px' },
    )
    animated.forEach(el => {
      if (!el.classList.contains('is-in')) io.observe(el)
    })

    return () => io.disconnect()
  }, [pathname])

  return null
}
