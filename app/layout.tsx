import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Imbas Tecnologia — Transformação Digital com IA',
  description: 'Transformação digital com inteligência artificial para escritórios de contabilidade, advocacia, empresas de marketplace e de serviços.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
