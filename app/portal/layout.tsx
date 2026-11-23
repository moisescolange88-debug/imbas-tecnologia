import type { Metadata } from 'next'
import './portal.css'

export const metadata: Metadata = {
  title: 'Área do Cliente',
  description: 'Acesso dos clientes às ferramentas de cálculo e planejamento tributário da Imbas Tecnologia.',
  alternates: { canonical: '/portal' },
  robots: { index: false, follow: false },
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children
}
