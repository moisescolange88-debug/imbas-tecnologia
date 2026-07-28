'use client'

import { useState, useCallback } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import ResultBox from '@/components/calculos/ResultBox'
import { calcularDecimoTerceiro } from '@/lib/engine'
import type { DecimoTerceiroResult } from '@/lib/engine/tipos'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function DecimoTerceiroPage() {
  const [resultado, setResultado] = useState<DecimoTerceiroResult | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const res = calcularDecimoTerceiro({
      salario: parseFloat(data.get('salario') as string) || 0,
      mesesTrabalhados: parseInt(data.get('meses') as string) || 0,
      dependentes: parseInt(data.get('dependentes') as string) || 0,
      adiantamentoPrimeiraParcela: parseFloat(data.get('adiantamento') as string) || 0,
    })
    setResultado(res)
  }, [])

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>13º Salário</h2>
          <p>Cálculo do décimo terceiro salário proporcional ou integral, com descontos de INSS e IRRF.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="calc-form-grid">
            <Input name="salario" label="Salário Base (R$)" type="number" step="0.01" prefix="R$" required />
            <Input name="meses" label="Meses Trabalhados (mín. 15 dias = 1 mês)" type="number" min="1" max="12" required />
            <Input name="dependentes" label="Dependentes (IRRF)" type="number" min="0" placeholder="0" />
            <Input name="adiantamento" label="1ª Parcela já recebida (R$)" type="number" step="0.01" prefix="R$" placeholder="0" />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="calc-btn calc-btn-primary">Calcular 13º</button>
          </div>
        </form>

        {resultado && (
          <div style={{ marginTop: 48 }}>
            <h3 className="calc-section-title">Resultado</h3>
            <div className="result-grid">
              <ResultBox label="13º Bruto" value={`R$ ${fmt(resultado.bruto)}`} highlight />
              <ResultBox label="1ª Parcela" value={`R$ ${fmt(resultado.primeiraParcela)}`} />
              <ResultBox label="INSS" value={`R$ ${fmt(resultado.inss)}`} negative />
              <ResultBox label="IRRF" value={`R$ ${fmt(resultado.irrf)}`} negative />
              <ResultBox label="Valor Líquido" value={`R$ ${fmt(resultado.liquido)}`} highlight />
            </div>
          </div>
        )}

        <div className="calc-disclaimer">
          <strong>Aviso:</strong> Cálculo estimativo. O INSS sobre o 13º é calculado de forma autônoma (alíquota integral sobre o valor). Consulte seu departamento pessoal.
        </div>
      </div>
    </CalculatorLayout>
  )
}
