import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Reforma Tributária: prepare sua empresa para 2026-2033",
  description: "A LC 214/2025 substitui PIS, Cofins, IPI, ICMS e ISS por CBS, IBS e IS. Projeções, simulações e planejamento tributário para a transição.",
  alternates: { canonical: "/solucoes/reforma-tributaria" },
  openGraph: { title: "Reforma Tributária: prepare sua empresa para 2026-2033", description: "A LC 214/2025 substitui PIS, Cofins, IPI, ICMS e ISS por CBS, IBS e IS. Projeções, simulações e planejamento tributário para a transição.", url: "/solucoes/reforma-tributaria" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
