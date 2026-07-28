'use client'

import { useState, useCallback } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import ResultBox from '@/components/calculos/ResultBox'
import { calcularFGTSCompleto } from '@/lib/engine'
import { MULTA_FGTS_SEM_JUSTA_CAUSA, MULTA_FGTS_PDI } from '@/lib/engine/tables'
import type { FGTSResult } from '@/lib/engine/tipos'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function FGTSPage() {
  const [resultado, setResultado] = useState<FGTSResult | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const salario = parseFloat(data.get('salario') as string) || 0
    const meses = parseInt(data.get('meses') as string) || 0
    const multaTipo = parseInt(data.get('multaTipo') as string) || MULTA_FGTS_SEM_JUSTA_CAUSA
    const res = calcularFGTSCompleto(salario, meses, 0, 0, multaTipo)
    setResultado(res)
  }, [])

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>FGTS + Multa</h2>
          <p>Calcule os depósitos mensais de FGTS e a multa rescisória (40% ou 20%).</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="calc-form-grid">
            <Input name="salario" label="Salário Base (R$)" type="number" step="0.01" prefix="R$" required />
            <Input name="meses" label="Meses de Serviço" type="number" min="1" required />
            <select name="multaTipo" className="calc-input calc-select calc-field" style={{ width: '100%' }}>
              <option value={MULTA_FGTS_SEM_JUSTA_CAUSA}>Multa: 40% (sem justa causa)</option>
              <option value={MULTA_FGTS_PDI}>Multa: 20% (PDI)</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="calc-btn calc-btn-primary">Calcular FGTS</button>
          </div>
        </form>

        {resultado && (
          <div style={{ marginTop: 48 }}>
            <h3 className="calc-section-title">Resultado</h3>
            <div className="result-grid">
              <ResultBox label="Depósitos Mensais" value={`R$ ${fmt(resultado.depositosMensais)}`} />
              <ResultBox label="Total Depositado" value={`R$ ${fmt(resultado.totalDepositado)}`} highlight />
              <ResultBox label="Valor da Multa" value={`R$ ${fmt(resultado.multa)}`} highlight />
              <ResultBox label="Total (Depósito + Multa)" value={`R$ ${fmt(resultado.totalComMulta)}`} highlight />
            </div>
          </div>
        )}

        <div className="calc-disclaimer">
          <strong>Aviso:</strong> Estimativa baseada em 8% do salário mensal × meses de serviço. O valor real pode divergir do extrato da conta vinculada do FGTS, que considera variações salariais, 13º, férias, horas extras e reajustes. Para o valor exato, consulte o extrato da Caixa.
        </div>
      </div>
    </CalculatorLayout>
  )
}
