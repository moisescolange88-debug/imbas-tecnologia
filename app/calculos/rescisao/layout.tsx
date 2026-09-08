import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cálculo de rescisão contratual",
  description: "Calcule verbas rescisórias para os 10 tipos de dispensa: aviso prévio, saldo de salário, férias, 13º, FGTS e multa de 40%.",
  alternates: { canonical: "/calculos/rescisao" },
  openGraph: { title: "Cálculo de rescisão contratual", description: "Calcule verbas rescisórias para os 10 tipos de dispensa: aviso prévio, saldo de salário, férias, 13º, FGTS e multa de 40%.", url: "/calculos/rescisao" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
