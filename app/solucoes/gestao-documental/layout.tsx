import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestão Documental e Cadastro de Fornecedores · Imbas Tecnologia',
  description: 'Mantenha sua empresa preparada para vender, faturar e renovar contratos. Centralização de exigências, controle de certidões e homologação em portais de clientes e SICAF.',
  keywords: [
    'gestão documental de fornecedores',
    'cadastro e homologação de fornecedores',
    'controle de certidões empresariais',
    'homologação de fornecedores',
    'SICAF',
    'certidões negativas',
    'CNDT',
    'FGTS',
    'matriz documental',
  ],
  alternates: { canonical: '/solucoes/gestao-documental' },
  openGraph: {
    title: 'Gestão Documental e Cadastro de Fornecedores · Imbas Tecnologia',
    description: 'Organizamos documentos, controlamos vencimentos e acompanhamos cadastros de fornecedores para que sua empresa nunca perca uma oportunidade.',
    url: '/solucoes/gestao-documental',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
