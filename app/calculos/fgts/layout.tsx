import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cálculo de FGTS + multa de 40%",
  description: "Depósitos mensais de FGTS, saldo acumulado e multa rescisória de 40% na dispensa sem justa causa.",
  alternates: { canonical: "/calculos/fgts" },
  openGraph: { title: "Cálculo de FGTS + multa de 40%", description: "Depósitos mensais de FGTS, saldo acumulado e multa rescisória de 40% na dispensa sem justa causa.", url: "/calculos/fgts" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
