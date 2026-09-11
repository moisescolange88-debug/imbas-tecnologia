import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dossiê Societário e Histórico Empresarial · Imbas Tecnologia',
  description: 'Reconstrução do histórico formal da empresa: linha do tempo, atos societários arquivados, certidões da Junta Comercial, sócios e divergências registrais.',
  keywords: [
    'dossiê societário',
    'histórico empresarial',
    'levantamento de documentos empresariais',
    'atos societários',
    'junta comercial',
    'quadro societário',
    'apuração de haveres',
    'perícia societária',
  ],
  alternates: { canonical: '/solucoes/dossie-societario' },
  openGraph: {
    title: 'Dossiê Societário e Histórico Empresarial · Imbas Tecnologia',
    description: 'Conheça a trajetória registral da empresa e encontre as informações necessárias para tomar decisões com mais segurança.',
    url: '/solucoes/dossie-societario',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
