import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cálculo de férias + 1/3",
  description: "Férias proporcionais, vencidas, 1/3 constitucional e abono pecuniário, com INSS e IRRF.",
  alternates: { canonical: "/calculos/ferias" },
  openGraph: { title: "Cálculo de férias + 1/3", description: "Férias proporcionais, vencidas, 1/3 constitucional e abono pecuniário, com INSS e IRRF.", url: "/calculos/ferias" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
