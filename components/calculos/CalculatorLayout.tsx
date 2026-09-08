'use client'

import { ReactNode } from 'react'

/**
 * Envolve todas as páginas de /calculos. O respiro no topo vive aqui, e não
 * repetido em cada página: sem ele o título encostava na barra fixa.
 */
export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return <div className="calc-page">{children}</div>
}
