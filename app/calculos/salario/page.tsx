'use client'

import { useState, useCallback } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import ResultBox from '@/components/calculos/ResultBox'
import { calcularSalarioLiquido } from '@/lib/engine'
import type { SalarioLiquidoResult } from '@/lib/engine/tipos'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function SalarioPage() {
  const [resultado, setResultado] = useState<SalarioLiquidoResult | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const res = calcularSalarioLiquido({
      salarioBruto: parseFloat(data.get('salarioBruto') as string) || 0,
      adicionais: parseFloat(data.get('adicionais') as string) || 0,
      horasExtras: parseFloat(data.get('horasExtras') as string) || 0,
      dsr: parseFloat(data.get('dsr') as string) || 0,
      dependentes: parseInt(data.get('dependentes') as string) || 0,
      valeTransporte: data.get('valeTransporte') === 'sim',
    })
    setResultado(res)
  }, [])

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>Salário Líquido</h2>
          <p>Calcule o salário líquido a partir do bruto com adicionais e descontos.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="calc-form-grid">
            <Input name="salarioBruto" label="Salário Bruto (R$)" type="number" step="0.01" prefix="R$" required />
            <Input name="adicionais" label="Adicionais (R$)" type="number" step="0.01" prefix="R$" placeholder="0" />
            <Input name="horasExtras" label="Horas Extras (R$)" type="number" step="0.01" prefix="R$" placeholder="0" />
            <Input name="dsr" label="DSR (R$)" type="number" step="0.01" prefix="R$" placeholder="0" />
            <Input name="dependentes" label="Dependentes (IRRF)" type="number" min="0" placeholder="0" />
            <select name="valeTransporte" className="calc-input calc-select calc-field" style={{ width: '100%', marginTop: 23 }}>
              <option value="nao">Vale Transporte: Não</option>
              <option value="sim">Vale Transporte: Sim</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="calc-btn calc-btn-primary">Calcular</button>
          </div>
        </form>

        {resultado && (
          <div style={{ marginTop: 48 }}>
            <h3 className="calc-section-title">Resultado</h3>
            <div className="result-grid">
              <ResultBox label="Base de Cálculo" value={`R$ ${fmt(resultado.baseCalculo)}`} highlight />
              <ResultBox label="INSS" value={`R$ ${fmt(resultado.inss)}`} negative />
              <ResultBox label="IRRF" value={`R$ ${fmt(resultado.irrf)}`} negative />
              <ResultBox label="Vale Transporte" value={`R$ ${fmt(resultado.valeTransporte)}`} negative />
              <ResultBox label="Total Descontos" value={`R$ ${fmt(resultado.totalDescontos)}`} negative />
              <ResultBox label="Salário Líquido" value={`R$ ${fmt(resultado.liquido)}`} highlight />
            </div>
          </div>
        )}

        <div className="calc-disclaimer">
          <strong>Aviso:</strong> Cálculo estimativo baseado nas tabelas oficiais de 2026. Outros descontos (pensão, planos de saúde, faltas) não considerados. Consulte seu departamento pessoal para o valor exato.
        </div>
      </div>
    </CalculatorLayout>
  )
}
