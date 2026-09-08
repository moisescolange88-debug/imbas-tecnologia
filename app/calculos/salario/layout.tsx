import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cálculo de salário líquido",
  description: "Salário bruto para líquido com adicionais, horas extras, DSR e descontos de INSS e IRRF pelas tabelas vigentes.",
  alternates: { canonical: "/calculos/salario" },
  openGraph: { title: "Cálculo de salário líquido", description: "Salário bruto para líquido com adicionais, horas extras, DSR e descontos de INSS e IRRF pelas tabelas vigentes.", url: "/calculos/salario" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
