'use client'

import { useState, useCallback } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import ResultBox from '@/components/calculos/ResultBox'
import { calcularHorasExtras } from '@/lib/engine'
import type { HoraExtraResult } from '@/lib/engine/tipos'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function HorasExtrasPage() {
  const [resultado, setResultado] = useState<HoraExtraResult | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const res = calcularHorasExtras({
      salario: parseFloat(data.get('salario') as string) || 0,
      horasExtras: parseFloat(data.get('horasExtras') as string) || 0,
      adicionalPercentual: parseInt(data.get('adicional') as string) || 50,
    })
    setResultado(res)
  }, [])

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>Horas Extras + DSR</h2>
          <p>Calcule o valor das horas extras com adicional e o reflexo no DSR (Descanso Semanal Remunerado).</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="calc-form-grid">
            <Input name="salario" label="Salário Base (R$)" type="number" step="0.01" prefix="R$" required />
            <Input name="horasExtras" label="Quantidade de Horas Extras no Mês" type="number" step="0.5" min="0" required />
            <Input name="adicional" label="Adicional (%)" type="number" min="0" max="200" placeholder="50" />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="calc-btn calc-btn-primary">Calcular</button>
          </div>
        </form>

        {resultado && (
          <div style={{ marginTop: 48 }}>
            <h3 className="calc-section-title">Resultado</h3>
            <div className="result-grid">
              <ResultBox label="Valor Hora Normal" value={`R$ ${fmt(resultado.valorHoraNormal)}`} />
              <ResultBox label="Valor Hora Extra" value={`R$ ${fmt(resultado.valorHoraExtra)}`} highlight />
              <ResultBox label="Total Horas Extras" value={`R$ ${fmt(resultado.totalHorasExtras)}`} />
              <ResultBox label="DSR s/ Horas Extras" value={`R$ ${fmt(resultado.dsrHorasExtras)}`} />
              <ResultBox label="Total (HE + DSR)" value={`R$ ${fmt(resultado.totalComDSR)}`} highlight />
            </div>
          </div>
        )}

        <div className="calc-disclaimer">
          <strong>Aviso:</strong> Cálculo com base no adicional mínimo de 50% (art. 59 CLT). Convenções coletivas podem estabelecer percentuais maiores (60%, 80%, 100%). DSR calculado sobre 22 dias úteis e 5 domingos/feriados (referência).
        </div>
      </div>
    </CalculatorLayout>
  )
}
