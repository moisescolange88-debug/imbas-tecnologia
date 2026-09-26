import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Calculadora de Imposto Futuro & Reforma Tributária (CBS/IBS/IS)",
  description: "Simule o impacto da LC 214/2025 e LC 227/2026 no seu negócio: projeção ano a ano de 2026 a 2033, CBS, IBS, Split Payment e Imposto Seletivo.",
  alternates: { canonical: "/calculos/reforma-tributaria" },
  openGraph: {
    title: "Calculadora de Imposto Futuro & Reforma Tributária (CBS/IBS/IS)",
    description: "Simule o impacto da LC 214/2025 e LC 227/2026 no seu negócio: projeção ano a ano de 2026 a 2033, CBS, IBS, Split Payment e Imposto Seletivo.",
    url: "/calculos/reforma-tributaria",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
