'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

function useScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = document.querySelectorAll('.reveal')
    if ('IntersectionObserver' in window && !reduced) {
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
        { threshold: .12 }
      )
      els.forEach(el => io.observe(el))
      return () => io.disconnect()
    } else {
      els.forEach(el => el.classList.add('in'))
    }
  }, [])
}

function useOghamNumerals() {
  useEffect(() => {
    document.querySelectorAll('.ogham-num').forEach(el => {
      const n = parseInt(el.getAttribute('data-strokes') || '1', 10)
      const w = 20 + n * 14
      const h = 64
      let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`
      s += `<line x1="6" y1="0" x2="6" y2="${h}" stroke="#2BA872" stroke-width="2"/>`
      for (let i = 0; i < n; i++) {
        const y = h / 2 - (n - 1) * 7 + i * 14
        s += `<line x1="6" y1="${y}" x2="${6 + n * 11 + 14}" y2="${y}" stroke="#E3B860" stroke-width="2.5"/>`
      }
      s += '</svg>'
      el.innerHTML = s
    })
  }, [])
}

function useOghamStrips() {
  useEffect(() => {
    document.querySelectorAll('.ogham-strip svg').forEach((svg, idx) => {
      const W = 1600, H = 44, mid = H / 2
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      let out = `<line x1="0" y1="${mid}" x2="${W}" y2="${mid}" stroke="rgba(120,200,165,.25)" stroke-width="1"/>`
      let x = 30
      let seed = 7 + idx * 13
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
      while (x < W - 30) {
        const strokes = 1 + Math.floor(rnd() * 5)
        const kind = Math.floor(rnd() * 3)
        for (let i = 0; i < strokes; i++) {
          const y1 = kind === 0 ? mid - 14 : (kind === 1 ? mid : mid - 11)
          const y2 = kind === 0 ? mid : (kind === 1 ? mid + 14 : mid + 11)
          out += `<line x1="${x + i * 7}" y1="${y1}" x2="${x + i * 7}" y2="${y2}" stroke="rgba(75,232,160,.6)" stroke-width="2"/>`
        }
        x += strokes * 7 + 26 + rnd() * 30
      }
      svg.innerHTML = out
    })
  }, [])
}

function useHeroCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('sigil') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let size = 0

    function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect()
      size = Math.max(rect.width, 10)
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', () => { resize(); if (reduced) draw(0) })

    const EMERALD = '75,232,160', GOLD = '227,184,96'

    function draw(t: number) {
      const c = size / 2, R = size * 0.30, ringR = size * 0.44
      ctx.clearRect(0, 0, size, size)

      ctx.save()
      ctx.translate(c, c)
      ctx.rotate(t * 0.00008)
      ctx.strokeStyle = `rgba(${EMERALD},.28)`
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, ringR - 9, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${EMERALD},.12)`; ctx.stroke()
      for (let i = 0; i < 72; i++) {
        const a = i / 72 * Math.PI * 2
        const long = (i % 6 === 0)
        const r1 = ringR - (long ? 16 : 8), r2 = ringR
        ctx.strokeStyle = long ? `rgba(${GOLD},.55)` : `rgba(${EMERALD},.3)`
        ctx.lineWidth = long ? 1.6 : 1
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1)
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2)
        ctx.stroke()
      }
      ctx.restore()

      if (!reduced) {
        for (let s = 0; s < 3; s++) {
          const a = t * 0.0004 + s * (Math.PI * 2 / 3)
          const x = c + Math.cos(a) * ringR, y = c + Math.sin(a) * ringR
          const g = ctx.createRadialGradient(x, y, 0, x, y, 9)
          g.addColorStop(0, `rgba(${GOLD},.9)`)
          g.addColorStop(1, `rgba(${GOLD},0)`)
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = 'rgba(255,244,220,.95)'
          ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill()
        }
      }

      const pulse = reduced ? 1 : (1 + 0.1 * Math.sin(t * 0.0009))
      const halo = ctx.createRadialGradient(c, c, 0, c, c, R * 1.1 * pulse)
      halo.addColorStop(0, `rgba(${GOLD},.16)`)
      halo.addColorStop(.6, `rgba(${EMERALD},.07)`)
      halo.addColorStop(1, `rgba(${GOLD},0)`)
      ctx.fillStyle = halo
      ctx.beginPath(); ctx.arc(c, c, R * 1.1 * pulse, 0, Math.PI * 2); ctx.fill()
    }

    if (reduced) { draw(0); return }
    let animId = 0
    const loop = (t: number) => { draw(t); animId = requestAnimationFrame(loop) }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])
}

function useExplainerPlayer() {
  useEffect(() => {
    const player = document.getElementById('player')
    if (!player) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scenes: HTMLElement[] = [].slice.call(player.querySelectorAll('.scene'))
    const segs: HTMLElement[] = [].slice.call(player.querySelectorAll('.seg i'))
    const segBtns: HTMLElement[] = [].slice.call(player.querySelectorAll('.seg'))
    const titleEl = player.querySelector('.scene-title') as HTMLElement
    const poster = player.querySelector('.poster') as HTMLElement
    const btn = player.querySelector('.ctrl-btn') as HTMLElement
    const durs = [6000, 8000, 6000, 6000]
    const titles = ['1/4 · o fluxo manual', '2/4 · entra a ia', '3/4 · humano decide', '4/4 · o ganho']
    let idx = -1, playing = false, elapsed = 0, last: number | null = null, ended = false

    function fmt(v: number, dec: number) { return v.toFixed(dec).replace('.', ',') }

    function runCounters(scene: HTMLElement) {
      ;[].slice.call(scene.querySelectorAll('[data-to]')).forEach((el: HTMLElement) => {
        const from = parseFloat(el.getAttribute('data-from') || '0')
        const to = parseFloat(el.getAttribute('data-to')!)
        const dec = parseInt(el.getAttribute('data-dec') || '0', 10)
        const pre = el.getAttribute('data-pre') || ''
        const suf = el.getAttribute('data-suf') || ''
        if (reduced) { el.textContent = pre + fmt(to, dec) + suf; return }
        const t0 = performance.now(), dur = 1500
        const fr = (n: number) => {
          const p = Math.min((n - t0) / dur, 1)
          const e = 1 - Math.pow(1 - p, 3)
          el.textContent = pre + fmt(from + (to - from) * e, dec) + suf
          if (p < 1) requestAnimationFrame(fr)
        }
        requestAnimationFrame(fr)
      })
    }

    function setScene(i: number) {
      idx = i; elapsed = 0; ended = false
      scenes.forEach((s, k) => { s.classList.remove('active'); if (k === i) { void s.getBoundingClientRect(); s.classList.add('active') } })
      segs.forEach((s, k) => { s.style.width = k < i ? '100%' : '0' })
      titleEl.textContent = titles[i]
      if (i === 3) runCounters(scenes[3])
    }

    function finish() { ended = true; playing = false; btn.textContent = '↻'; poster.style.display = 'flex'; poster.querySelector('.poster-label')!.textContent = 'rever a explicação' }
    function play() { poster.style.display = 'none'; if (idx < 0 || ended) setScene(0); playing = true; btn.textContent = '❚❚' }
    function pause() { playing = false; btn.textContent = '▶' }

    poster.addEventListener('click', play)
    btn.addEventListener('click', () => { if (idx < 0 || ended) { play(); return } playing ? pause() : (playing = true, btn.textContent = '❚❚') })
    segBtns.forEach((s, k) => s.addEventListener('click', () => { poster.style.display = 'none'; setScene(k); playing = true; btn.textContent = '❚❚' }))

    if (reduced) {
      poster.style.display = 'none'; setScene(3)
      segs.forEach(s => { s.style.width = '100%' })
      titleEl.textContent = titles[3] + ' · use os capítulos'
      return
    }

    let animId = 0
    const tick = (now: number) => {
      if (last === null) last = now
      if (playing && !ended && idx >= 0) {
        elapsed += now - last
        const p = Math.min(elapsed / durs[idx], 1)
        segs[idx].style.width = (p * 100) + '%'
        if (p >= 1) { if (idx < scenes.length - 1) setScene(idx + 1); else finish() }
      }
      last = now
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => { if (!entries[0].isIntersecting && playing) pause() }, { threshold: .15 })
      io.observe(player)
    }

    return () => cancelAnimationFrame(animId)
  }, [])
}

export default function HomePage() {
  useScrollReveal()
  useOghamNumerals()
  useOghamStrips()
  useHeroCanvas()
  useExplainerPlayer()

  return (
    <>
      {/* HERO */}
      <header className="hero" id="topo">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow"><span className="glyph">ᚔᚋᚁᚐᚄ</span> imbas · irlandês antigo · «conhecimento que ilumina»</p>
            <h1>Todo escritório guarda um saber antigo. Nós o tornamos <span className="lit">clarividente</span>.</h1>
            <p className="lede">A Imbas Tecnologia conduz a <strong>transformação digital com inteligência artificial</strong> de escritórios de contabilidade, advocacia, empresas de marketplace e de serviços — automatizando o repetitivo para que sua equipe exerça o que nenhuma máquina tem: julgamento.</p>
            <div className="hero-actions">
              <a className="btn btn-gold" href="#contato">Iniciar a transformação</a>
              <a className="btn btn-ghost" href="#metodo">Conhecer o método</a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <canvas id="sigil"></canvas>
            <img className="knot3d" src="/render-knot.webp" alt="" />
          </div>
        </div>
        <div className="scroll-hint">descer</div>
      </header>

      <div className="ogham-strip" aria-hidden="true"><svg preserveAspectRatio="none"></svg></div>

      {/* ETYMOLOGY */}
      <section className="etym reveal">
        <div className="wrap etym-inner">
          <div>
            <div className="etym-word">im<span className="dot">·</span>bas</div>
            <div className="etym-phon">/ˈim.bas/ · substantivo</div>
            <div className="etym-ogham" aria-hidden="true">ᚔᚋᚁᚐᚄ</div>
          </div>
          <div className="etym-def">
            <span className="cls">Etimologia · tradição celta</span>
            <p>Na Irlanda antiga, <em>imbas forosnai</em> era o dom supremo dos poetas: <em>a iluminação súbita</em> — enxergar, num instante, o que estava oculto nos fatos.</p>
            <p>É exatamente isso que a inteligência artificial bem aplicada faz pelos seus dados: revela o que sempre esteve lá, esperando ser visto.</p>
          </div>
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section className="section-pad" id="solucoes">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚄ</span> Soluções</p>
            <h2>Quatro ofícios, uma mesma alquimia: seus dados transformados em vantagem.</h2>
            <p>Cada prática tem seus próprios rituais. Desenhamos a IA em torno deles — nunca o contrário.</p>
          </div>
          <div className="cards">
            <article className="card reveal">
              <svg className="sigil" viewBox="0 0 52 52" aria-hidden="true">
                <g fill="none" stroke="#4BE8A0" strokeWidth="1.5">
                  <path d="M8 40 L8 22 M18 40 L18 14 M28 40 L28 26 M38 40 L38 10"/>
                  <path d="M4 44 L48 44"/>
                </g>
                <circle cx="38" cy="10" r="3" fill="#E3B860"/>
              </svg>
              <h3>Contabilidade clarividente</h3>
              <span className="card-tag">Escritórios contábeis</span>
              <p>O fechamento deixa de ser maratona. A IA assume o lançamento e a conferência; seu time assume a análise e o conselho ao cliente.</p>
              <ul>
                <li>Classificação e conciliação automatizadas por IA</li>
                <li>Leitura inteligente de documentos fiscais</li>
                <li>Previsão de fluxo de caixa e alertas de anomalia</li>
                <li>Relatórios que o cliente entende — gerados em minutos</li>
              </ul>
            </article>
            <article className="card reveal">
              <svg className="sigil" viewBox="0 0 52 52" aria-hidden="true">
                <g fill="none" stroke="#4BE8A0" strokeWidth="1.5">
                  <path d="M26 6 L26 46 M10 14 L42 14"/>
                  <path d="M10 14 L4 28 A8 6 0 0 0 16 28 Z M42 14 L36 28 A8 6 0 0 0 48 28 Z"/>
                </g>
                <circle cx="26" cy="6" r="3" fill="#E3B860"/>
              </svg>
              <h3>Advocacia aumentada</h3>
              <span className="card-tag">Escritórios de advocacia</span>
              <p>Horas de pesquisa viram minutos. A tese continua sua — a IA cuida de encontrar, resumir e vigiar o que a sustenta.</p>
              <ul>
                <li>Pesquisa jurisprudencial assistida por IA</li>
                <li>Análise e resumo de peças e contratos</li>
                <li>Gestão inteligente de prazos e intimações</li>
                <li>Minutas iniciais geradas com o estilo do escritório</li>
              </ul>
            </article>
            <article className="card reveal">
              <svg className="sigil" viewBox="0 0 52 52" aria-hidden="true">
                <g fill="none" stroke="#4BE8A0" strokeWidth="1.5">
                  <circle cx="26" cy="26" r="17"/>
                  <path d="M26 9 L26 26 L38 34"/>
                  <path d="M9 26 L3 26 M43 26 L49 26 M26 43 L26 49"/>
                </g>
                <circle cx="26" cy="26" r="3" fill="#E3B860"/>
              </svg>
              <h3>Transformação sob medida</h3>
              <span className="card-tag">Empresas de serviços</span>
              <p>Para negócios que sentem que trabalham para os próprios sistemas — e não o contrário. Redesenhamos a operação com IA no centro.</p>
              <ul>
                <li>Diagnóstico de maturidade digital</li>
                <li>Integração de sistemas e eliminação de retrabalho</li>
                <li>Copilotos de IA treinados no seu negócio</li>
                <li>Capacitação da equipe para a nova operação</li>
              </ul>
            </article>
            <article className="card reveal">
              <svg className="sigil" viewBox="0 0 52 52" aria-hidden="true">
                <g fill="none" stroke="#4BE8A0" strokeWidth="1.5">
                  <path d="M8 20 L11 8 L41 8 L44 20"/>
                  <path d="M8 20 Q11 26 14 20 Q17 26 20 20 Q23 26 26 20 Q29 26 32 20 Q35 26 38 20 Q41 26 44 20"/>
                  <path d="M11 24 L11 44 L41 44 L41 24"/>
                  <path d="M18 44 L18 32 L26 32 L26 44"/>
                </g>
                <circle cx="35" cy="34" r="3" fill="#E3B860"/>
              </svg>
              <h3>Marketplace autônomo</h3>
              <span className="card-tag">Empresas de marketplace</span>
              <p>Vender em cinco canais não pode custar cinco operações. A IA concilia, integra e responde — enquanto seu time cuida de crescer.</p>
              <ul>
                <li>Conciliação de repasses, taxas e comissões por canal</li>
                <li>Integração de pedidos, estoque e emissão fiscal</li>
                <li>Precificação dinâmica assistida por IA</li>
                <li>Atendimento e pós-venda automatizados</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* EXPLAINER */}
      <section className="explainer section-pad" id="automacao">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚂ</span> Como funciona</p>
            <h2>A anatomia de uma automação — e o que ela devolve à sua empresa.</h2>
            <p>Aperte o play: em 26 segundos você entende o caminho que um documento percorre e o tamanho do ganho no processo.</p>
          </div>
          <div className="player reveal" id="player">
            <svg className="stage" viewBox="0 0 960 540" aria-label="Diagrama animado: como funciona uma automação com IA">
              {/* CENA 1 */}
              <g className="scene" id="sc1">
                <text className="t-mono" x="480" y="80" textAnchor="middle">HOJE · O FLUXO MANUAL</text>
                <g className="a-doc" style={{ animationDelay: '.2s' }}>
                  <rect x="110" y="170" width="96" height="120" className="nodebox"/>
                </g>
                <g className="a-doc" style={{ animationDelay: '.55s' }}>
                  <rect x="124" y="182" width="96" height="120" className="nodebox"/>
                </g>
                <g className="a-doc" style={{ animationDelay: '.9s' }}>
                  <rect x="138" y="194" width="96" height="120" className="nodebox"/>
                  <line x1="152" y1="222" x2="220" y2="222" className="sketch"/>
                  <line x1="152" y1="244" x2="220" y2="244" className="sketch"/>
                  <line x1="152" y1="266" x2="204" y2="266" className="sketch"/>
                </g>
                <text className="t-dim" x="186" y="340" textAnchor="middle">notas · extratos · peças</text>
                <path d="M280 244 L380 244" className="wire a-flow"/>
                <g className="a-fade" style={{ animationDelay: '.7s' }}>
                  <circle cx="470" cy="140" r="30" className="sketch"/>
                  <g className="a-hand" style={{ transformOrigin: '470px 140px' }}>
                    <line x1="470" y1="140" x2="470" y2="118" stroke="#C4704D" strokeWidth="2.4"/>
                  </g>
                  <circle cx="470" cy="230" r="18" className="sketch"/>
                  <path d="M430 300 Q470 258 510 300" className="sketch"/>
                </g>
                <g className="a-fade" style={{ animationDelay: '1.4s' }}>
                  <text className="t-pain" x="600" y="196" fontSize="17">✕</text>
                  <text className="t-b" x="626" y="196">8 minutos por documento</text>
                </g>
                <g className="a-fade" style={{ animationDelay: '2s' }}>
                  <text className="t-pain" x="600" y="240" fontSize="17">✕</text>
                  <text className="t-b" x="626" y="240">retrabalho e redigitação</text>
                </g>
                <g className="a-fade" style={{ animationDelay: '2.6s' }}>
                  <text className="t-pain" x="600" y="284" fontSize="17">✕</text>
                  <text className="t-b" x="626" y="284">erros silenciosos</text>
                </g>
                <text className="t-cap a-fade" style={{ animationDelay: '3.4s' }} x="480" y="470" textAnchor="middle">Hoje: sua equipe gasta horas digitando o que uma IA lê em segundos.</text>
              </g>
              {/* CENA 2 */}
              <g className="scene" id="sc2">
                <text className="t-mono" x="480" y="120" textAnchor="middle">PIPELINE DE AUTOMAÇÃO · RODA 24/7</text>
                <g className="a-node" style={{ animationDelay: '.2s' }}>
                  <rect x="40" y="200" width="190" height="88" className="nodebox"/>
                  <text className="t-h" x="135" y="238" textAnchor="middle">Documentos</text>
                  <text className="t-dim" x="135" y="262" textAnchor="middle">notas, extratos, peças</text>
                </g>
                <path d="M230 244 L270 244" className="wire a-flow"/>
                <circle cx="228" cy="244" r="4" fill="#E3B860" className="a-dot" style={{ animationDelay: '.4s' }}/>
                <g className="a-node" style={{ animationDelay: '.9s' }}>
                  <rect x="270" y="200" width="190" height="88" className="nodebox"/>
                  <text className="t-h" x="365" y="238" textAnchor="middle">IA lê e entende</text>
                  <text className="t-dim" x="365" y="262" textAnchor="middle">visão + linguagem natural</text>
                </g>
                <path d="M460 244 L500 244" className="wire a-flow"/>
                <circle cx="458" cy="244" r="4" fill="#E3B860" className="a-dot" style={{ animationDelay: '1.1s' }}/>
                <g className="a-node" style={{ animationDelay: '1.6s' }}>
                  <rect x="500" y="200" width="190" height="88" className="nodebox"/>
                  <text className="t-h" x="595" y="238" textAnchor="middle">Classifica e valida</text>
                  <text className="t-dim" x="595" y="262" textAnchor="middle">com as regras do escritório</text>
                </g>
                <path d="M690 244 L730 244" className="wire a-flow"/>
                <circle cx="688" cy="244" r="4" fill="#E3B860" className="a-dot" style={{ animationDelay: '1.8s' }}/>
                <g className="a-node" style={{ animationDelay: '2.3s' }}>
                  <rect x="730" y="200" width="190" height="88" className="nodebox"/>
                  <text className="t-h" x="825" y="238" textAnchor="middle">Lança no sistema</text>
                  <text className="t-dim" x="825" y="262" textAnchor="middle">ERP · contábil · jurídico</text>
                </g>
                <text className="t-cap a-fade" style={{ animationDelay: '3s' }} x="480" y="440" textAnchor="middle">Da caixa de entrada ao sistema — em segundos, sem mãos humanas no caminho.</text>
              </g>
              {/* CENA 3 */}
              <g className="scene" id="sc3">
                <text className="t-mono" x="480" y="100" textAnchor="middle">ONDE ENTRA A SUA EQUIPE</text>
                <g className="a-node" style={{ animationDelay: '.2s' }}>
                  <rect x="60" y="200" width="190" height="88" className="nodebox"/>
                  <text className="t-h" x="155" y="238" textAnchor="middle">IA processa</text>
                  <text className="t-dim" x="155" y="262" textAnchor="middle">cada documento</text>
                </g>
                <path d="M250 244 C420 244 460 168 600 168" className="wire a-flow"/>
                <path d="M250 244 C420 244 460 320 600 320" className="wire a-flow"/>
                <g className="a-node" style={{ animationDelay: '1s' }}>
                  <rect x="600" y="130" width="300" height="76" className="nodebox"/>
                  <circle cx="638" cy="168" r="15" fill="none" stroke="#E3B860" strokeWidth="1.6"/>
                  <path d="M631 168 l5 6 l10 -12" stroke="#E3B860" strokeWidth="2" fill="none"/>
                  <text className="t-h" x="668" y="164">≈ 95% · automático</text>
                  <text className="t-dim" x="668" y="186">conferido, lançado, arquivado</text>
                </g>
                <g className="a-node" style={{ animationDelay: '1.7s' }}>
                  <rect x="600" y="282" width="300" height="76" className="nodebox"/>
                  <circle cx="638" cy="313" r="9" className="sketch"/>
                  <path d="M624 342 Q638 326 652 342" className="sketch"/>
                  <text className="t-h" x="668" y="316">≈ 5% · exceções</text>
                  <text className="t-dim" x="668" y="338">vão para a sua equipe decidir</text>
                </g>
                <text className="t-cap a-fade" style={{ animationDelay: '2.6s' }} x="480" y="470" textAnchor="middle">Sua equipe sai da digitação — e entra na decisão.</text>
              </g>
              {/* CENA 4 */}
              <g className="scene" id="sc4">
                <text className="t-mono" x="480" y="120" textAnchor="middle">O GANHO NO PROCESSO · MÉDIA APÓS 6 MESES</text>
                <line x1="330" y1="200" x2="330" y2="330" stroke="rgba(120,200,165,.18)"/>
                <line x1="630" y1="200" x2="630" y2="330" stroke="rgba(120,200,165,.18)"/>
                <g className="a-fade" style={{ animationDelay: '.2s' }}>
                  <text className="t-big" x="180" y="256" textAnchor="middle" data-from="0" data-to="70" data-pre="−" data-suf="%">−0%</text>
                  <text className="t-b" x="180" y="296" textAnchor="middle">tempo em tarefas repetitivas</text>
                  <text className="t-dim" x="180" y="322" textAnchor="middle">120 h → 36 h por mês</text>
                </g>
                <g className="a-fade" style={{ animationDelay: '.5s' }}>
                  <text className="t-big" x="480" y="256" textAnchor="middle" data-from="4.20" data-to="0.60" data-pre="R$ " data-dec="2">R$ 4,20</text>
                  <text className="t-b" x="480" y="296" textAnchor="middle">custo por lançamento</text>
                  <text className="t-dim" x="480" y="322" textAnchor="middle">antes: R$ 4,20</text>
                </g>
                <g className="a-fade" style={{ animationDelay: '.8s' }}>
                  <text className="t-big" x="780" y="256" textAnchor="middle" data-from="0" data-to="3" data-suf="×">0×</text>
                  <text className="t-b" x="780" y="296" textAnchor="middle">capacidade de atendimento</text>
                  <text className="t-dim" x="780" y="322" textAnchor="middle">sem contratar mais ninguém</text>
                </g>
                <text className="t-cap a-fade" style={{ animationDelay: '1.6s' }} x="480" y="440" textAnchor="middle">Números médios de referência — no diagnóstico, medimos os seus antes de prometer.</text>
              </g>
            </svg>

            <button className="poster" aria-label="Assistir a explicação animada">
              <span className="poster-btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="currentColor"/></svg></span>
              <span className="poster-label">assistir · como funciona · 26 s</span>
            </button>

            <div className="controls">
              <button className="ctrl-btn" aria-label="Reproduzir ou pausar">▶</button>
              <div className="segs">
                <button className="seg" aria-label="Cena 1: o fluxo manual"><i></i></button>
                <button className="seg" aria-label="Cena 2: entra a IA"><i></i></button>
                <button className="seg" aria-label="Cena 3: humano decide"><i></i></button>
                <button className="seg" aria-label="Cena 4: o ganho"><i></i></button>
              </div>
              <span className="scene-title">diagrama · 26 s</span>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section className="method section-pad" id="metodo">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚋ</span> Método</p>
            <h2>Quatro passos, gravados como se grava em pedra.</h2>
            <p>Sem projetos infinitos. Cada etapa entrega valor antes da próxima começar — e o número de traços no glifo ogham marca onde você está.</p>
          </div>
          <div className="steps reveal">
            <div className="step">
              <div className="ogham-num" data-strokes="1" aria-hidden="true"></div>
              <span className="step-name">Passo um</span>
              <h3>Escuta</h3>
              <p>Mapeamos sua operação real — não a do organograma. Onde o tempo escorre, onde o erro nasce, onde a IA paga o próprio custo primeiro.</p>
            </div>
            <div className="step">
              <div className="ogham-num" data-strokes="2" aria-hidden="true"></div>
              <span className="step-name">Passo dois</span>
              <h3>Desenho</h3>
              <p>Arquitetura da solução: quais processos automatizar, quais sistemas integrar, quais salvaguardas de segurança e sigilo profissional aplicar.</p>
            </div>
            <div className="step">
              <div className="ogham-num" data-strokes="3" aria-hidden="true"></div>
              <span className="step-name">Passo três</span>
              <h3>Implantação</h3>
              <p>Entrega em ciclos curtos, começando pelo processo de maior impacto. Sua equipe valida cada ciclo antes de avançarmos.</p>
            </div>
            <div className="step">
              <div className="ogham-num" data-strokes="4" aria-hidden="true"></div>
              <span className="step-name">Passo quatro</span>
              <h3>Iluminação</h3>
              <p>Treinamento, acompanhamento e evolução contínua. A tecnologia fica; a dependência de consultoria, não.</p>
            </div>
          </div>
          <p className="method-note reveal">— os glifos acima são numerais em <b>ogham</b>, o alfabeto de traços dos celtas: um traço, um passo.</p>
        </div>
      </section>

      {/* PROOF */}
      <section className="section-pad" id="porque">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚁ</span> Por que Imbas</p>
            <h2>Resultados que se medem — e uma promessa que se cumpre.</h2>
          </div>
          <div className="proof-grid reveal">
            <div className="proof">
              <div className="num">70<small>%</small></div>
              <p>menos tempo em tarefas repetitivas de lançamento, conferência e pesquisa nos primeiros seis meses.</p>
            </div>
            <div className="proof">
              <div className="num">90<small> dias</small></div>
              <p>até o primeiro processo automatizado em produção — valor entregue antes do projeto terminar.</p>
            </div>
            <div className="proof">
              <div className="num">100<small>%</small></div>
              <p>de aderência a sigilo profissional e LGPD: seus dados e os dos seus clientes nunca saem do seu controle.</p>
            </div>
          </div>
          <div className="proof-quote reveal">
            <blockquote>
              <p>«A tecnologia não substitui o julgamento do contador nem a tese do advogado. Ela devolve a vocês o tempo para exercê-los.»</p>
              <cite>— Princípio fundador da Imbas Tecnologia</cite>
            </blockquote>
            <img className="rings3d" src="/render-rings.webp" alt="Três anéis entrelaçados em metal esmeralda e ouro — símbolo da trindade celta em 3D" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-final" id="contato">
        <div className="wrap reveal">
          <p className="eyebrow"><span className="glyph">ᚐ</span> Contato</p>
          <h2>Pronto para acender o <span className="lit">imbas</span> do seu escritório?</h2>
          <p>Agende um diagnóstico gratuito de 45 minutos. Saímos da conversa com um mapa honesto: o que automatizar primeiro, quanto custa e quanto retorna.</p>
          <a className="btn btn-gold" href="mailto:contato@imbastecnologia.com.br?subject=Diagn%C3%B3stico%20gratuito%20%E2%80%94%20Imbas%20Tecnologia">Agendar diagnóstico gratuito</a>
        </div>
      </section>
    </>
  )
}
