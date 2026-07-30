import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Licenças ANVISA e CETESB",
  description: "Base de conhecimento de licenciamento sanitário e ambiental: requisitos, documentos, prazos, custos estimados e fundamentação legal.",
  alternates: { canonical: "/conhecimento/licenciamento" },
  openGraph: { title: "Licenças ANVISA e CETESB", description: "Base de conhecimento de licenciamento sanitário e ambiental: requisitos, documentos, prazos, custos estimados e fundamentação legal.", url: "/conhecimento/licenciamento" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
