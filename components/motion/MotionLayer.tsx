'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Camada de movimento do site. Vive no layout raiz, então vale para todas as
 * rotas — inclusive as que só tinham `.reveal` no HTML e nenhum observer para
 * ligá-lo (o conteúdo delas ficava preso em opacity:0).
 *
 * Regras da casa:
 *  - tudo que anima passa por transform/opacity, nunca por layout;
 *  - `prefers-reduced-motion` desliga movimento e entrega o site estático;
 *  - um único listener de ponteiro e um único laço de scroll servem a página
 *    inteira, em vez de um por elemento.
 */

/** Alvos cujo texto é quebrado em palavras mascaradas. */
const SPLIT = [
  '.hero h1',
  '.section-head h2',
  '.cta-final h2',
  '.etym-word',
  'blockquote p',
].join(',')

/** Grupos cujos filhos entram em cascata. */
const STAGGER = ['.cards', '.steps', '.proof-grid', '.calc-dashboard', '.cot-metrics'].join(',')

/** Superfícies que ganham o foco de luz sob o cursor. */
const SPOT = ['.card', '.calc-card', '.step', '.proof', '.lic-item', '.player'].join(',')

/** Controles que se aproximam do cursor. */
const MAGNET = ['.btn', '.nav-cta', '.calc-btn', '.poster-btn'].join(',')

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Envolve cada palavra em `<span class="w"><span class="w-i">…</span></span>`,
 * descendo pelos filhos para não destruir <em>, <span class="lit"> etc.
 */
function splitWords(el: HTMLElement) {
  if (el.dataset.split) return
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? ''
        if (!text.trim()) continue
        const frag = document.createDocumentFragment()
        // O split guarda os separadores para os espaços não sumirem.
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
            continue
          }
          const mask = document.createElement('span')
          mask.className = 'w'
          const inner = document.createElement('span')
          inner.className = 'w-i'
          inner.textContent = part
          mask.appendChild(inner)
          frag.appendChild(mask)
        }
        node.replaceChild(frag, child)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child)
      }
    }
  }
  walk(el)
  el.querySelectorAll<HTMLElement>('.w-i').forEach((w, i) => {
    w.style.transitionDelay = `${Math.min(i * 42, 900)}ms`
  })
  el.dataset.split = 'done'
  el.classList.add('is-split')
}

/** Conta de 0 até o número já escrito no elemento, uma vez só. */
function countUp(el: HTMLElement, reduced: boolean) {
  if (el.dataset.counted) return
  el.dataset.counted = 'done'
  const node = Array.from(el.childNodes).find(
    n => n.nodeType === Node.TEXT_NODE && /\d/.test(n.textContent ?? ''),
  )
  if (!node) return
  const target = parseInt((node.textContent ?? '').replace(/\D/g, ''), 10)
  if (!Number.isFinite(target)) return
  if (reduced) return
  const t0 = performance.now()
  const dur = 1400
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
  /** Alvos de parallax, relidos a cada rota mas consumidos por um laço único. */
  const parallax = useRef<{ el: HTMLElement; speed: number }[]>([])

  /* ---------- Uma vez por sessão: cursor, grão, progresso, scroll ---------- */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const root = document.documentElement
    root.classList.add('motion-ready')

    const made: HTMLElement[] = []
    const make = (className: string) => {
      const el = document.createElement('div')
      el.className = className
      el.setAttribute('aria-hidden', 'true')
      document.body.appendChild(el)
      made.push(el)
      return el
    }

    // Grão de filme: textura, não cor. Fora em reduced motion e no celular,
    // onde uma camada animada de tela cheia não paga o que custa.
    if (!reduced && innerWidth >= 768) make('grain')
    const progress = make('scroll-progress')

    let cursor: HTMLElement | null = null
    if (finePointer && !reduced) {
      cursor = make('cursor')
      root.classList.add('has-cursor')
    }

    const nav = document.querySelector('nav')
    const pointer = { x: innerWidth / 2, y: innerHeight / 2 }
    const ring = { x: pointer.x, y: pointer.y }
    let magnetEl: HTMLElement | null = null
    let lastY = scrollY
    let raf = 0

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY

      const target = e.target as HTMLElement | null
      if (!target) return

      if (cursor) {
        const interactive = target.closest('a,button,summary,[role="button"],input,select,textarea')
        cursor.classList.toggle('is-active', !!interactive)
      }

      // Foco de luz: um listener para todas as superfícies.
      const spot = target.closest<HTMLElement>(SPOT)
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
        spot.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
      }

      if (reduced) return

      // Ímã: o controle se desloca em direção ao cursor e volta ao sair.
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
        magnet.style.setProperty('--mag-x', `${dx * 0.22}px`)
        magnet.style.setProperty('--mag-y', `${dy * 0.32}px`)
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
      const max = document.documentElement.scrollHeight - innerHeight

      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`

      if (nav) {
        nav.classList.toggle('is-scrolled', y > 24)
        // Só esconde depois do herói, e sempre reaparece ao subir.
        nav.classList.toggle('is-hidden', y > 320 && y > lastY + 4)
      }
      lastY = y

      if (!reduced) {
        for (const { el, speed } of parallax.current) {
          const r = el.getBoundingClientRect()
          if (r.bottom < -200 || r.top > innerHeight + 200) continue
          const off = (r.top + r.height / 2 - innerHeight / 2) * -speed
          el.style.transform = `translate3d(0,${off.toFixed(2)}px,0)`
        }
        if (cursor) {
          ring.x = lerp(ring.x, pointer.x, 0.18)
          ring.y = lerp(ring.y, pointer.y, 0.18)
          cursor.style.transform = `translate3d(${ring.x}px,${ring.y}px,0) translate(-50%,-50%)`
        }
        // O sigilo do herói acompanha o ponteiro de leve.
        const visual = document.querySelector<HTMLElement>('.hero-visual')
        if (visual) {
          const tx = (pointer.x / innerWidth - 0.5) * 18
          const ty = (pointer.y / innerHeight - 0.5) * 18
          visual.style.translate = `${tx.toFixed(2)}px ${ty.toFixed(2)}px`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', () => cursor?.classList.add('is-down'), { passive: true })
    window.addEventListener('pointerup', () => cursor?.classList.remove('is-down'), { passive: true })
    window.addEventListener('blur', clearMagnet)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', clearMagnet)
      made.forEach(el => el.remove())
      root.classList.remove('motion-ready', 'has-cursor')
    }
  }, [])

  /* ---------- A cada rota: varre o DOM novo e arma as entradas ---------- */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.querySelectorAll<HTMLElement>(SPLIT).forEach(splitWords)

    document.querySelectorAll<HTMLElement>(STAGGER).forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        ;(child as HTMLElement).style.setProperty('--stagger', `${i * 90}ms`)
        child.classList.add('anim-rise')
      })
    })

    // Ritmo de entrada para tudo o que não é grupo nem título.
    document
      .querySelectorAll<HTMLElement>('.reveal, .lic-controlbar, .calc-disclaimer, .cot-form, .cot-empty, .player')
      .forEach(el => el.classList.add('anim-rise'))

    const targets: { el: HTMLElement; speed: number }[] = []
    document.querySelectorAll<HTMLElement>('.hero-visual').forEach(el => {
      targets.push({ el, speed: 0.06 })
    })
    document.querySelectorAll<HTMLElement>('.rings3d').forEach(el => {
      targets.push({ el, speed: 0.1 })
    })
    parallax.current = targets

    // Faixa ogham vira letreiro contínuo: duplica o SVG já desenhado e desliza.
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

    const animated = document.querySelectorAll<HTMLElement>('.anim-rise, .is-split, .proof .num')
    if (reduced || !('IntersectionObserver' in window)) {
      animated.forEach(el => {
        el.classList.add('is-in', 'in')
        if (el.classList.contains('num')) countUp(el, true)
      })
      return
    }

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          // `.in` continua existindo para as regras antigas de .reveal.
          el.classList.add('is-in', 'in')
          if (el.classList.contains('num')) countUp(el, false)
          io.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    animated.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
