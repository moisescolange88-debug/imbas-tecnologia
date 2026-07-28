'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/#solucoes', label: 'Soluções' },
  { href: '/#automacao', label: 'Como funciona' },
  { href: '/#metodo', label: 'Método' },
  { href: '/#porque', label: 'Por que Imbas' },
]

export default function Nav() {
  const pathname = usePathname()
  const isCalculator = pathname.startsWith('/calculos')

  return (
    <nav>
      <div className="nav-inner">
        <Link className="logo" href="/" aria-label="Imbas Tecnologia — início">
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
            {!isCalculator && <span className="logo-sub">conhecimento que ilumina</span>}
          </span>
        </Link>
        <ul className="nav-links">
          {isCalculator ? (
            <li><a className="nav-cta" href="/">← Site institucional</a></li>
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
