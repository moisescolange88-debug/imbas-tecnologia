import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Simulador da Reforma Tributária (CBS/IBS/IS)",
  description: "Simule o impacto da LC 214/2025 no seu negócio: CBS, IBS e Imposto Seletivo ano a ano, de 2026 a 2033.",
  alternates: { canonical: "/calculos/reforma-tributaria" },
  openGraph: { title: "Simulador da Reforma Tributária (CBS/IBS/IS)", description: "Simule o impacto da LC 214/2025 no seu negócio: CBS, IBS e Imposto Seletivo ano a ano, de 2026 a 2033.", url: "/calculos/reforma-tributaria" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
