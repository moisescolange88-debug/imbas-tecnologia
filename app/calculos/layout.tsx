import type { Metadata } from 'next'

export const metadata: Metadata = {
  // default + template: sem o template, um title em string reseta o do layout
  // raiz e as calculadoras filhas perderiam o sufixo da marca.
  title: {
    default: 'Calculadora trabalhista e Reforma Tributária',
    template: '%s · Imbas Tecnologia',
  },
  description: "Calculadora trabalhista gratuita: rescisão, salário líquido, férias, 13º, horas extras, FGTS e simulador da Reforma Tributária (CBS/IBS/IS).",
  alternates: { canonical: "/calculos" },
  openGraph: { title: "Calculadora trabalhista e Reforma Tributária", description: "Calculadora trabalhista gratuita: rescisão, salário líquido, férias, 13º, horas extras, FGTS e simulador da Reforma Tributária (CBS/IBS/IS).", url: "/calculos" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
