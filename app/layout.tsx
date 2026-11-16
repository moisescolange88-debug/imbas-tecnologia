import type { Metadata, Viewport } from 'next'
import '@/lib/reactive-pixel-field/src/styles.css'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import MotionLayer from '@/components/motion/MotionLayer'

const SITE = 'https://imbas-tecnologia.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Imbas Tecnologia — Transformação Digital com IA',
    template: '%s · Imbas Tecnologia',
  },
  description:
    'Transformação digital com IA para escritórios de contabilidade, advocacia, empresas de marketplace e de serviços. Base de conhecimento de licenças ANVISA e CETESB com cotação por IA.',
  keywords: ['ANVISA', 'CETESB', 'licenciamento', 'licenciamento ambiental', 'AFE', 'CBFP', 'LO', 'LI', 'LP', 'cotação', 'IA'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Imbas Tecnologia',
    title: 'Imbas Tecnologia — Transformação Digital com IA',
    description:
      'Automatizamos o repetitivo para que sua equipe exerça o que nenhuma máquina tem: julgamento.',
    url: SITE,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10110F',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <noscript>
          <style>{'.reveal,.anim-rise{opacity:1 !important;transform:none !important}'}</style>
        </noscript>
        <Nav />
        <main id="conteudo" style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
        <MotionLayer />
      </body>
    </html>
  )
}
