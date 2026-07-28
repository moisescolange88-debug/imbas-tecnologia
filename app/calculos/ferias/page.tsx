'use client'

import { useState, useCallback } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import ResultBox from '@/components/calculos/ResultBox'
import { calcularFerias } from '@/lib/engine'
import type { FeriasResult } from '@/lib/engine/tipos'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function FeriasPage() {
  const [resultado, setResultado] = useState<FeriasResult | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const res = calcularFerias({
      salario: parseFloat(data.get('salario') as string) || 0,
      mesesTrabalhados: parseInt(data.get('mesesTrabalhados') as string) || 0,
      diasFerias: parseInt(data.get('diasFerias') as string) || 30,
      abonoPecuniario: parseInt(data.get('abono') as string) || 0,
      dependentes: parseInt(data.get('dependentes') as string) || 0,
    })
    setResultado(res)
  }, [])

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>Férias + 1/3 Constitucional</h2>
          <p>Cálculo de férias individuais com 1/3, abono pecuniário e descontos.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="calc-form-grid">
            <Input name="salario" label="Salário Base (R$)" type="number" step="0.01" prefix="R$" required />
            <Input name="mesesTrabalhados" label="Meses Trabalhados (no período aquisitivo)" type="number" min="0" max="12" placeholder="12" />
            <Input name="diasFerias" label="Dias de Férias" type="number" min="1" max="30" placeholder="30" />
            <Input name="abono" label="Abono Pecuniário (dias — máx 10)" type="number" min="0" max="10" placeholder="0" />
            <Input name="dependentes" label="Dependentes (IRRF)" type="number" min="0" placeholder="0" />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="calc-btn calc-btn-primary">Calcular Férias</button>
          </div>
        </form>

        {resultado && (
          <div style={{ marginTop: 48 }}>
            <h3 className="calc-section-title">Resultado</h3>
            <div className="result-grid">
              <ResultBox label="Férias" value={`R$ ${fmt(resultado.ferias)}`} highlight />
              <ResultBox label="1/3 Constitucional" value={`R$ ${fmt(resultado.tercoConstitucional)}`} highlight />
              <ResultBox label="Abono Pecuniário" value={`R$ ${fmt(resultado.abonoPecuniario)}`} />
              <ResultBox label="1/3 Abono" value={`R$ ${fmt(resultado.tercoAbono)}`} />
              <ResultBox label="INSS" value={`R$ ${fmt(resultado.inss)}`} negative />
              <ResultBox label="IRRF" value={`R$ ${fmt(resultado.irrf)}`} negative />
              <ResultBox label="Valor Líquido" value={`R$ ${fmt(resultado.liquido)}`} highlight />
            </div>
          </div>
        )}

        <div className="calc-disclaimer">
          <strong>Aviso:</strong> Cálculo para férias individuais. Para férias coletivas ou proporcionais em rescisão, use o módulo de rescisão. Baseado nas tabelas de 2026.
        </div>
      </div>
    </CalculatorLayout>
  )
}
