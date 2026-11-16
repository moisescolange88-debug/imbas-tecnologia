'use client'

import { useEffect, useRef } from 'react'

export interface PixelMatrixWordProps {
  text: string
  highlightChar?: string
  className?: string
  pitch?: number
  cellSize?: number
}

interface PixelParticle {
  tx: number
  ty: number
  x: number
  y: number
  vx: number
  vy: number
  isHighlight: boolean
  seed: number
}

export default function PixelMatrixWord({
  text,
  highlightChar = '·',
  className = '',
  pitch = 6,
  cellSize = 5,
}: PixelMatrixWordProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let particles: PixelParticle[] = []
    let assembled = reduced
    let pointerX = -9999
    let pointerY = -9999
    let pointerActive = false
    let rafId = 0
    let startTime = performance.now()

    function buildParticles() {
      if (!wrap || !canvas || !ctx) return
      const rect = wrap.getBoundingClientRect()
      width = Math.max(240, Math.floor(rect.width))
      height = Math.max(90, Math.floor(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Offscreen rasterização do texto para amostrar a matriz de pixels
      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const octx = off.getContext('2d')
      if (!octx) return

      const fontSize = Math.min(height * 0.78, width / Math.max(2.6, text.length * 0.56))
      octx.clearRect(0, 0, width, height)
      octx.font = `600 ${fontSize}px "Space Grotesk", Arial, Helvetica, sans-serif`
      octx.textBaseline = 'middle'
      octx.textAlign = 'left'

      // Calcula posição de cada caractere para identificar o destaque (ex.: '·')
      const totalWidth = octx.measureText(text).width
      const startX = Math.max(6, (width - totalWidth) * 0.04)
      const centerY = height * 0.52

      // Encontra a faixa X do caractere destaque
      let hlStart = -1
      let hlEnd = -1
      if (highlightChar) {
        const idx = text.indexOf(highlightChar)
        if (idx >= 0) {
          hlStart = startX + octx.measureText(text.slice(0, idx)).width - 2
          hlEnd = startX + octx.measureText(text.slice(0, idx + highlightChar.length)).width + 2
        }
      }

      octx.fillStyle = '#FFFFFF'
      octx.fillText(text, startX, centerY)

      const img = octx.getImageData(0, 0, width, height).data
      const next: PixelParticle[] = []

      for (let py = 0; py < height; py += pitch) {
        for (let px = 0; px < width; px += pitch) {
          const sx = Math.min(width - 1, Math.floor(px + cellSize * 0.5))
          const sy = Math.min(height - 1, Math.floor(py + cellSize * 0.5))
          const alpha = img[(sy * width + sx) * 4 + 3]
          if (alpha > 85) {
            const seed = ((px * 73856093) ^ (py * 19349663)) >>> 0
            const angle = (seed % 360) * (Math.PI / 180)
            const spread = reduced ? 0 : 38 + (seed % 95)
            next.push({
              tx: px,
              ty: py,
              x: reduced ? px : px + Math.cos(angle) * spread,
              y: reduced ? py : py + Math.sin(angle) * spread,
              vx: 0,
              vy: 0,
              isHighlight: hlStart >= 0 && px >= hlStart && px <= hlEnd,
              seed: (seed % 1000) / 1000,
            })
          }
        }
      }

      particles = next
      startTime = performance.now()
    }

    function scatter(cx: number, cy: number, radius = 96, power = 14) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.hypot(dx, dy)
        if (dist < radius && dist > 0.01) {
          const force = (1 - dist / radius) * power
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }
    }

    buildParticles()

    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => buildParticles()) : null
    ro?.observe(wrap)

    let isInView = false
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            entries => {
              isInView = entries[0].isIntersecting
              if (isInView) {
                assembled = true
                startTime = performance.now()
              }
            },
            { threshold: 0.2 },
          )
        : null
    io?.observe(wrap)

    // Pulso suave periódico quando visível (ótimo para mobile sem hover)
    let waveIdx = 0
    const shimmerTimer = !reduced
      ? window.setInterval(() => {
          if (!isInView || document.hidden || width < 10) return
          waveIdx = (waveIdx + 1) % 3
          const rx = width * (0.18 + waveIdx * 0.28)
          const ry = height * 0.5
          scatter(rx, ry, 72, 9)
        }, 4800)
      : 0

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      pointerX = e.clientX - r.left
      pointerY = e.clientY - r.top
      pointerActive = true
    }
    const onLeave = () => {
      pointerActive = false
    }
    const onClick = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      scatter(e.clientX - r.left, e.clientY - r.top, 140, 22)
    }

    wrap.addEventListener('pointermove', onMove, { passive: true })
    wrap.addEventListener('pointerleave', onLeave)
    wrap.addEventListener('click', onClick)

    function tick(now: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const elapsed = now - startTime

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (assembled) {
          const delay = p.seed * 260
          if (elapsed > delay || reduced) {
            const dx = p.tx - p.x
            const dy = p.ty - p.y
            p.vx = p.vx * 0.78 + dx * 0.16
            p.vy = p.vy * 0.78 + dy * 0.16
          }
        }

        if (pointerActive && !reduced) {
          const pdx = p.x - pointerX
          const pdy = p.y - pointerY
          const pdist = Math.hypot(pdx, pdy)
          if (pdist < 64 && pdist > 0.1) {
            const rep = (1 - pdist / 64) * 3.8
            p.vx += (pdx / pdist) * rep
            p.vy += (pdy / pdist) * rep
          }
        }

        p.x += p.vx
        p.y += p.vy

        const disp = Math.hypot(p.x - p.tx, p.y - p.ty)
        const pulse = Math.sin(now * 0.002 + p.seed * 6.28) * 0.5 + 0.5

        if (p.isHighlight || disp > 6) {
          const mix = Math.min(1, p.isHighlight ? 1 : disp / 26)
          const alpha = 0.68 + 0.32 * mix
          ctx.fillStyle = `rgba(217,253,120,${alpha.toFixed(3)})`
        } else {
          const alpha = 0.82 + 0.16 * pulse
          ctx.fillStyle = `rgba(240,241,223,${alpha.toFixed(3)})`
        }

        ctx.fillRect(p.x, p.y, cellSize, cellSize)
      }

      if (!reduced) {
        rafId = requestAnimationFrame(tick)
      }
    }

    tick(performance.now())

    return () => {
      cancelAnimationFrame(rafId)
      window.clearInterval(shimmerTimer)
      ro?.disconnect()
      io?.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('click', onClick)
    }
  }, [cellSize, highlightChar, pitch, text])

  return (
    <div ref={wrapRef} className={`pixel-matrix-word ${className}`}>
      <span className="sr-only">{text}</span>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
