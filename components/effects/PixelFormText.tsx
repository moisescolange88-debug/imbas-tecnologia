'use client'

import { useEffect, useRef, useState } from 'react'

export interface PixelFormTextProps {
  text: string
  highlight?: string
  immediate?: boolean
  className?: string
  staggerMs?: number
}

export default function PixelFormText({
  text,
  highlight,
  immediate = false,
  className = '',
  staggerMs = 45,
}: PixelFormTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [formed, setFormed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFormed(true)
      return
    }
    if (immediate) {
      const id = window.requestAnimationFrame(() => setFormed(true))
      return () => window.cancelAnimationFrame(id)
    }
    if (!('IntersectionObserver' in window)) {
      setFormed(true)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.96) {
      setFormed(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setFormed(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -3% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])

  // Divide preservando espaços e identificando trecho em destaque
  const tokens = text.split(/(\s+)/)
  let wordIndex = 0

  return (
    <span ref={ref} className={`pf-wrap ${formed ? 'is-formed' : ''} ${className}`}>
      {tokens.map((tok, idx) => {
        if (/^\s+$/.test(tok)) return <span key={idx}>{tok}</span>
        const currentIdx = wordIndex++
        const isLit = highlight ? tok.toLowerCase().includes(highlight.toLowerCase()) : false
        const delay = Math.min(currentIdx * staggerMs, 420)
        return (
          <span
            key={idx}
            className={`pf-word ${isLit ? 'lit' : ''}`}
            style={{ ['--pf-delay' as string]: `${delay}ms` }}
          >
            {tok}
          </span>
        )
      })}
    </span>
  )
}
