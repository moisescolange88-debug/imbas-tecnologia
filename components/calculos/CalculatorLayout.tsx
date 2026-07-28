'use client'

import { ReactNode } from 'react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '80vh', padding: '60px 0' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
