'use client'

import CalculatorLayout from '@/components/calculos/CalculatorLayout'

const calculos = [
  {
    href: '/calculos/rescisao',
    title: 'Rescisão Contratual',
    desc: 'Cálculo completo de verbas rescisórias para todos os 10 tipos de dispensa',
  },
  {
    href: '/calculos/salario',
    title: 'Salário Líquido',
    desc: 'Salário bruto, adicionais, horas extras, DSR e descontos de INSS e IRRF',
  },
  {
    href: '/calculos/ferias',
    title: 'Férias + 1/3',
    desc: 'Cálculo de férias proporcionais, vencidas, 1/3 constitucional e abono pecuniário',
  },
  {
    href: '/calculos/decimo-terceiro',
    title: '13º Salário',
    desc: 'Décimo terceiro proporcional ou integral, com INSS e IRRF',
  },
  {
    href: '/calculos/horas-extras',
    title: 'Horas Extras + DSR',
    desc: 'Cálculo de hora extra com adicional, DSR e reflexos',
  },
  {
    href: '/calculos/fgts',
    title: 'FGTS + Multa',
    desc: 'Depósitos mensais de FGTS e multa de 40% (sem justa causa)',
  },
]

export default function CalculosPage() {
  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 48 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>Cálculos trabalhistas completos e precisos.</h2>
          <p>Baseados na CLT, súmulas do TST e tabelas oficiais de 2026. Selecione o tipo de cálculo abaixo.</p>
        </div>

        <div className="calc-dashboard">
          {calculos.map(calc => (
            <a key={calc.href} href={calc.href} className="calc-card">
              <h3>{calc.title}</h3>
              <p>{calc.desc}</p>
            </a>
          ))}
        </div>

        <div className="calc-disclaimer">
          <strong>Importante:</strong> Os cálculos são baseados nas tabelas oficiais de 2026 (INSS, IRRF, salário mínimo) e nas regras da CLT e súmulas do TST. Os valores são estimativos e podem variar conforme convenções coletivas, decisões judiciais específicas e particularidades do caso concreto. Consulte sempre um profissional especializado para cálculos definitivos.
        </div>
      </div>
    </CalculatorLayout>
  )
}
