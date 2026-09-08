import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import MotionLayer from '@/components/motion/MotionLayer'

/* PP Eiko e Basis Grotesque Pro são licenciadas. Os substitutos abaixo são os
   recomendados pelo sistema: serifada ultraleve (peso 300) para o display e
   neogrotesca para todo o resto. Trocar por PP Eiko/Basis é só mexer aqui. */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

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
  themeColor: '#1F9A66',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        {/* .reveal parte de opacity:0 e só aparece via IntersectionObserver.
            Sem JS, o site inteiro ficaria em branco — este reset garante o conteúdo. */}
        <noscript>
          <style>{'.reveal{opacity:1 !important;transform:none !important}'}</style>
        </noscript>
        <Nav />
        <main id="conteudo" style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
        {/* Depois do conteúdo: a camada varre o DOM já montado e vale para
            todas as rotas — inclusive as que tinham .reveal sem observer. */}
        <MotionLayer />
      </body>
    </html>
  )
}
