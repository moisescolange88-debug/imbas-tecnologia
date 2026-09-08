import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cálculo de 13º salário",
  description: "Décimo terceiro proporcional ou integral, com primeira e segunda parcela, INSS e IRRF.",
  alternates: { canonical: "/calculos/decimo-terceiro" },
  openGraph: { title: "Cálculo de 13º salário", description: "Décimo terceiro proporcional ou integral, com primeira e segunda parcela, INSS e IRRF.", url: "/calculos/decimo-terceiro" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
