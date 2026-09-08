import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cálculo de horas extras + DSR",
  description: "Hora extra com adicional, reflexo no DSR, adicional noturno e integração nas demais verbas.",
  alternates: { canonical: "/calculos/horas-extras" },
  openGraph: { title: "Cálculo de horas extras + DSR", description: "Hora extra com adicional, reflexo no DSR, adicional noturno e integração nas demais verbas.", url: "/calculos/horas-extras" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
