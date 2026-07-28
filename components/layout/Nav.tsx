'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/#solucoes', label: 'Solucoes' },
  { href: '/#automacao', label: 'Como funciona' },
  { href: '/#metodo', label: 'Metodo' },
  { href: '/#porque', label: 'Por que Imbas' },
]

const calcLinks = [
  { href: '/', label: '← Site institucional' },
  { href: '/calculos', label: 'Calculadora Trabalhista' },
  { href: '/calculos/reforma-tributaria', label: 'Reforma Tributaria' },
  { href: '/solucoes/reforma-tributaria', label: 'Sobre a Reforma' },
]

export default function Nav() {
  const pathname = usePathname()
  const isSubPage = pathname.startsWith('/calculos') || pathname.startsWith('/solucoes')

  return (
    <nav>
      <div className="nav-inner">
        <Link className="logo" href="/" aria-label="Imbas Tecnologia — inicio">
          <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
            <g fill="none" stroke="#4BE8A0" strokeWidth="1.6">
              <circle cx="20" cy="14.5" r="8.5"/>
              <circle cx="14.8" cy="23.5" r="8.5"/>
              <circle cx="25.2" cy="23.5" r="8.5"/>
            </g>
            <circle cx="20" cy="20.5" r="2.2" fill="#E3B860"/>
          </svg>
          <span>
            <span className="logo-name">Imbas <em>Tecnologia</em></span>
            {!isSubPage && <span className="logo-sub">conhecimento que ilumina</span>}
          </span>
        </Link>
        <ul className="nav-links">
          {isSubPage ? (
            calcLinks.map(l => {
              const isActive = pathname === l.href && l.href !== '/'
              return (
                <li key={l.href}>
                  {l.href === '/' ? (
                    <a className="nav-cta" href="/">{l.label}</a>
                  ) : (
                    <Link href={l.href} style={{ color: isActive ? 'var(--emerald)' : undefined }}>
                      {l.label}
                    </Link>
                  )}
                </li>
              )
            })
          ) : (
            <>
              {links.map(l => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
              <li>
                <Link className="nav-cta" href="/calculos">
                  Calculadora<span className="cta-long"> trabalhista</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
