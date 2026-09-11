'use client'

import { useEffect } from 'react'

export function useOghamNumerals() {
  useEffect(() => {
    document.querySelectorAll('.ogham-num').forEach(el => {
      const n = parseInt(el.getAttribute('data-strokes') || '1', 10)
      const w = 20 + n * 14
      const h = 64
      let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`
      s += `<line x1="6" y1="0" x2="6" y2="${h}" stroke="#15734A" stroke-width="2"/>`
      for (let i = 0; i < n; i++) {
        const y = h / 2 - (n - 1) * 7 + i * 14
        s += `<line x1="6" y1="${y}" x2="${6 + n * 11 + 14}" y2="${y}" stroke="#B4841C" stroke-width="2.5"/>`
      }
      s += '</svg>'
      el.innerHTML = s
    })
  }, [])
}

export function useOghamStrips() {
  useEffect(() => {
    document.querySelectorAll('.ogham-strip svg').forEach((svg, idx) => {
      const W = 1600, H = 44, mid = H / 2
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      let out = `<line x1="0" y1="${mid}" x2="${W}" y2="${mid}" stroke="rgba(31,154,102,.30)" stroke-width="1"/>`
      let x = 30
      let seed = 7 + idx * 13
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
      while (x < W - 30) {
        const strokes = 1 + Math.floor(rnd() * 5)
        const kind = Math.floor(rnd() * 3)
        for (let i = 0; i < strokes; i++) {
          const y1 = kind === 0 ? mid - 14 : (kind === 1 ? mid : mid - 11)
          const y2 = kind === 0 ? mid : (kind === 1 ? mid + 14 : mid + 11)
          out += `<line x1="${x + i * 7}" y1="${y1}" x2="${x + i * 7}" y2="${y2}" stroke="rgba(31,154,102,.65)" stroke-width="2"/>`
        }
        x += strokes * 7 + 26 + rnd() * 30
      }
      svg.innerHTML = out
    })
  }, [])
}
