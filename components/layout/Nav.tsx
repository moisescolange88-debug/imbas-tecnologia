'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/** Âncoras de seção da home — funcionam a partir de qualquer página. */
const sectionLinks = [
  { href: '/#solucoes', label: 'Soluções' },
  { href: '/#automacao', label: 'Como funciona' },
  { href: '/#metodo', label: 'Método' },
  { href: '/#porque', label: 'Por que Imbas' },
]

/** Ferramentas agrupadas num único menu, em vez de três CTAs concorrentes. */
const toolLinks = [
  {
    href: '/calculos',
    label: 'Calculadora trabalhista',
    hint: 'Rescisão, férias, 13º, FGTS e horas extras',
  },
  {
    href: '/calculos/reforma-tributaria',
    label: 'Simulador da Reforma Tributária',
    hint: 'CBS, IBS e IS — LC 214/2025',
  },
  {
    href: '/conhecimento/licenciamento',
    label: 'Licenças ANVISA e CETESB',
    hint: 'Base de conhecimento de licenciamento',
  },
  {
    href: '/conhecimento/cotacao',
    label: 'Cotação com IA',
    hint: 'Custos e prazos estimados por IA',
  },
]

const CONTATO =
  'mailto:contato@imbastecnologia.com.br?subject=Diagn%C3%B3stico%20gratuito%20%E2%80%94%20Imbas%20Tecnologia'

export default function Nav() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const toolsRef = useRef<HTMLLIElement>(null)
  const toolsBtnRef = useRef<HTMLButtonElement>(null)
  const focusFirstToolRef = useRef(false)

  const isTool = toolLinks.some(l => pathname === l.href)

  // Fecha tudo ao navegar.
  useEffect(() => {
    setOpen(false)
    setToolsOpen(false)
  }, [pathname])

  // Trava o scroll do fundo com o painel mobile aberto.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Abertura por teclado (ArrowDown) leva o foco ao primeiro item. Precisa
  // rodar depois do commit, quando o painel já perdeu o atributo hidden.
  useEffect(() => {
    if (!toolsOpen || !focusFirstToolRef.current) return
    focusFirstToolRef.current = false
    toolsRef.current?.querySelector<HTMLAnchorElement>('.nav-tool-link')?.focus()
  }, [toolsOpen])

  // Disclosure "Ferramentas": Escape devolve o foco ao gatilho; clique fora fecha.
  useEffect(() => {
    if (!toolsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setToolsOpen(false)
        toolsBtnRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false)
    }
    const onFocusIn = (e: FocusEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [toolsOpen])

  const mobileLinks = [...sectionLinks, ...toolLinks]

  return (
    <>
      <nav aria-label="Navegação principal">
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>

        <div className="nav-inner">
          <Link className="logo" href="/" aria-label="Imbas Tecnologia — início">
            <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="none" stroke="#15734A" strokeWidth="1.6">
                <circle cx="20" cy="14.5" r="8.5" />
                <circle cx="14.8" cy="23.5" r="8.5" />
                <circle cx="25.2" cy="23.5" r="8.5" />
              </g>
              <circle cx="20" cy="20.5" r="2.2" fill="#8E6614" />
            </svg>
            <span className="logo-text">
              <span className="logo-name">
                Imbas <em>Tecnologia</em>
              </span>
              <span className="logo-sub">conhecimento que ilumina</span>
            </span>
          </Link>

          <ul className="nav-links nav-links-desktop">
            {sectionLinks.map(l => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}

            <li className={`nav-tools ${toolsOpen ? 'is-open' : ''}`} ref={toolsRef}>
              <button
                ref={toolsBtnRef}
                type="button"
                className={`nav-tools-btn ${isTool ? 'is-current' : ''}`}
                aria-expanded={toolsOpen}
                aria-controls="nav-tools-panel"
                onClick={() => setToolsOpen(o => !o)}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    focusFirstToolRef.current = true
                    setToolsOpen(true)
                  }
                }}
              >
                Ferramentas
                <svg className="nav-tools-chevron" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div id="nav-tools-panel" className="nav-tools-panel" hidden={!toolsOpen}>
                <ul>
                  {toolLinks.map(l => (
                    <li key={l.href}>
                      <Link
                        className={`nav-tool-link ${pathname === l.href ? 'is-active' : ''}`}
                        href={l.href}
                        aria-current={pathname === l.href ? 'page' : undefined}
                      >
                        <span className="nav-tool-label">{l.label}</span>
                        <span className="nav-tool-hint">{l.hint}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li>
              <a className="nav-cta" href={CONTATO}>
                Falar com a Imbas
              </a>
            </li>
          </ul>

          <button
            className="nav-burger"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="nav-mobile"
            onClick={() => setOpen(o => !o)}
          >
            <span className={`burger-bar ${open ? 'open' : ''}`}></span>
            <span className={`burger-bar ${open ? 'open' : ''}`}></span>
            <span className={`burger-bar ${open ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Fica FORA do <nav> de propósito: o backdrop-filter da barra cria um
          bloco de contenção, e um position:fixed aqui dentro se ancoraria nos
          73px do header em vez da viewport. */}
      <div id="nav-mobile" className={`nav-mobile ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="nav-mobile-backdrop" onClick={() => setOpen(false)}></div>
        <div className="nav-mobile-panel">
          <div className="nav-mobile-header">
            <span className="eyebrow">Menu</span>
            <button className="nav-mobile-close" aria-label="Fechar menu" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
          <ul className="nav-mobile-list">
            {mobileLinks.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`nav-mobile-link ${pathname === l.href ? 'is-active' : ''}`}
                  aria-current={pathname === l.href ? 'page' : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-mobile-cta">
            <a className="btn btn-gold" href={CONTATO}>
              Falar com a Imbas
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
