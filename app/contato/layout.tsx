import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato & Diagnóstico Empresarial · Imbas Tecnologia',
  description: 'Fale com os especialistas da Imbas Tecnologia. Solicite diagnóstico para Dossiê Societário, Gestão Documental de Fornecedores e soluções de inteligência artificial.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato & Diagnóstico Empresarial · Imbas Tecnologia',
    description: 'Solicite análise de Dossiê Societário, Gestão Documental de Fornecedores e automação inteligente para sua empresa.',
    url: '/contato',
  },
}

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children
}
