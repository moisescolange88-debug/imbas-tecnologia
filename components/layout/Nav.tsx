'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/** Âncoras de seção da home — funcionam a partir de qualquer página. */
const sectionLinks = [
  { href: '/#automacao', label: 'Como funciona' },
  { href: '/#metodo', label: 'Método' },
  { href: '/#porque', label: 'Por que Imbas' },
]

/** Soluções e serviços especializados */
const solutionLinks = [
  {
    href: '/solucoes/dossie-societario',
    label: 'Dossiê Societário',
    hint: 'Reconstituição histórica, quadro societário e atos da Junta',
  },
  {
    href: '/solucoes/gestao-documental',
    label: 'Gestão Documental',
    hint: 'Cadastro de fornecedores, certidões e homologação SICAF',
  },
  {
    href: '/solucoes/reforma-tributaria',
    label: 'Reforma Tributária',
    hint: 'Transição CBS, IBS, IS — LC 214/2025',
  },
  {
    href: '/#solucoes',
    label: 'Ver todas as soluções',
    hint: 'IA para contabilidade, advocacia e marketplaces',
  },
]

/** Ferramentas agrupadas */
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

const CONTATO = '/contato'

export default function Nav() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  const solutionsRef = useRef<HTMLLIElement>(null)
  const solutionsBtnRef = useRef<HTMLButtonElement>(null)

  const toolsRef = useRef<HTMLLIElement>(null)
  const toolsBtnRef = useRef<HTMLButtonElement>(null)

  const isSolution = solutionLinks.some(l => pathname === l.href)
  const isTool = toolLinks.some(l => pathname === l.href)

  // Fecha tudo ao navegar.
  useEffect(() => {
    setOpen(false)
    setSolutionsOpen(false)
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

  // Fechamento e acessibilidade do menu Soluções
  useEffect(() => {
    if (!solutionsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSolutionsOpen(false)
        solutionsBtnRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (!solutionsRef.current?.contains(e.target as Node)) setSolutionsOpen(false)
    }
    const onFocusIn = (e: FocusEvent) => {
      if (!solutionsRef.current?.contains(e.target as Node)) setSolutionsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [solutionsOpen])

  // Fechamento e acessibilidade do menu Ferramentas
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

  const mobileLinks = [
    { href: '/', label: 'Início' },
    { href: '/solucoes/dossie-societario', label: 'Dossiê Societário' },
    { href: '/solucoes/gestao-documental', label: 'Gestão Documental' },
    { href: '/solucoes/reforma-tributaria', label: 'Reforma Tributária' },
    { href: '/#solucoes', label: 'Todas as Soluções' },
    ...sectionLinks,
    { href: '/calculos', label: 'Calculadora Trabalhista' },
    { href: '/conhecimento/licenciamento', label: 'Licenças ANVISA & CETESB' },
    { href: '/conhecimento/cotacao', label: 'Cotação com IA' },
    { href: '/contato', label: 'Contato & Diagnóstico' },
  ]

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
            {/* Soluções Dropdown */}
            <li className={`nav-tools ${solutionsOpen ? 'is-open' : ''}`} ref={solutionsRef}>
              <button
                ref={solutionsBtnRef}
                type="button"
                className={`nav-tools-btn ${isSolution ? 'is-current' : ''}`}
                aria-expanded={solutionsOpen}
                aria-controls="nav-solutions-panel"
                onClick={() => {
                  setSolutionsOpen(o => !o)
                  setToolsOpen(false)
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSolutionsOpen(true)
                  }
                }}
              >
                Soluções
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

              <div id="nav-solutions-panel" className="nav-tools-panel nav-tools-panel--left" hidden={!solutionsOpen}>
                <ul>
                  {solutionLinks.map(l => (
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

            {sectionLinks.map(l => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}

            {/* Ferramentas Dropdown */}
            <li className={`nav-tools ${toolsOpen ? 'is-open' : ''}`} ref={toolsRef}>
              <button
                ref={toolsBtnRef}
                type="button"
                className={`nav-tools-btn ${isTool ? 'is-current' : ''}`}
                aria-expanded={toolsOpen}
                aria-controls="nav-tools-panel"
                onClick={() => {
                  setToolsOpen(o => !o)
                  setSolutionsOpen(false)
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
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
              <Link className="nav-cta" href={CONTATO}>
                Falar com a Imbas
              </Link>
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
            <Link className="btn btn-gold" href={CONTATO}>
              Falar com a Imbas
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
