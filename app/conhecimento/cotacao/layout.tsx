import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cotação de licenciamento com IA",
  description: "Gere uma estimativa de custos e prazos para o licenciamento da sua empresa, cruzando a base de licenças com IA.",
  alternates: { canonical: "/conhecimento/cotacao" },
  openGraph: { title: "Cotação de licenciamento com IA", description: "Gere uma estimativa de custos e prazos para o licenciamento da sua empresa, cruzando a base de licenças com IA.", url: "/conhecimento/cotacao" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
