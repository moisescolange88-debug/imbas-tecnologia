'use client'

import { useState, useCallback } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import ResultBox from '@/components/calculos/ResultBox'
import ResultsTable from '@/components/calculos/ResultsTable'
import SummaryBar from '@/components/calculos/SummaryBar'
import { calcularRescisao } from '@/lib/engine'
import { TIPO_RESCISAO_LABEL } from '@/lib/engine/tipos'
import type { TipoRescisao, RescisaoResult } from '@/lib/engine/tipos'

const tiposOptions = (Object.entries(TIPO_RESCISAO_LABEL) as [TipoRescisao, string][]).map(
  ([value, label]) => ({ value, label })
)

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function RescisaoPage() {
  const [resultado, setResultado] = useState<RescisaoResult | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const salario = parseFloat(data.get('salario') as string) || 0
    const diasTrabalhados = parseInt(data.get('diasTrabalhados') as string) || 0
    const dependentes = parseInt(data.get('dependentes') as string) || 0

    if (salario <= 0) return

    const res = calcularRescisao({
      tipo: (data.get('tipo') as TipoRescisao) || 'sem-justa-causa',
      salario,
      dataAdmissao: (data.get('dataAdmissao') as string) || '',
      dataDemissao: (data.get('dataDemissao') as string) || '',
      diasTrabalhadosUltimoMes: diasTrabalhados,
      avisoIndenizado: data.get('avisoPrevio') === 'indenizado',
      avisoTrabalhado: data.get('avisoPrevio') === 'trabalhado',
      dependentes,
    })

    setResultado(res)
  }, [])

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>Cálculo de Rescisão Contratual</h2>
          <p>Preencha os dados do contrato e do desligamento para calcular todas as verbas rescisórias devidas.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="calc-section-title">1. Dados do Contrato</h3>
          <div className="calc-form-grid">
            <Select
              name="tipo"
              label="Tipo de Rescisão"
              options={tiposOptions}
              defaultValue="sem-justa-causa"
            />
            <Input
              name="salario"
              label="Salário Base (R$)"
              type="number"
              step="0.01"
              min="0"
              prefix="R$"
              placeholder="3000,00"
              required
            />
            <Input
              name="dataAdmissao"
              label="Data de Admissão"
              type="date"
              required
            />
            <Input
              name="dataDemissao"
              label="Data da Demissão"
              type="date"
              required
            />
          </div>

          <h3 className="calc-section-title">2. Verbas Finais</h3>
          <div className="calc-form-grid">
            <Input
              name="diasTrabalhados"
              label="Dias Trabalhados no Último Mês"
              type="number"
              min="0"
              max="31"
              placeholder="15"
            />
            <Select
              name="avisoPrevio"
              label="Aviso Prévio"
              options={[
                { value: 'indenizado', label: 'Indenizado' },
                { value: 'trabalhado', label: 'Trabalhado' },
                { value: 'nenhum', label: 'Nenhum / Não se aplica' },
              ]}
              defaultValue="indenizado"
            />
            <Input
              name="dependentes"
              label="Dependentes (IRRF)"
              type="number"
              min="0"
              max="99"
              placeholder="0"
            />
          </div>

          <div style={{ marginTop: 28 }}>
            <button type="submit" className="calc-btn calc-btn-primary">
              Calcular Rescisão
            </button>
          </div>
        </form>

        {resultado && (
          <>
            <div style={{ marginTop: 48 }}>
              <div className="calc-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                Resultado
                <span className="calc-badge">{TIPO_RESCISAO_LABEL[resultado.tipo]}</span>
              </div>

              <SummaryBar
                bruto={`R$ ${fmt(resultado.totais.bruto)}`}
                descontos={`R$ ${fmt(resultado.totais.descontos)}`}
                liquido={`R$ ${fmt(resultado.totais.liquido)}`}
              />

              <div className="result-grid">
                <ResultBox label="INSS" value={`R$ ${fmt(resultado.descontos.inss)}`} negative />
                <ResultBox label="IRRF" value={`R$ ${fmt(resultado.descontos.irrf)}`} negative />
              </div>
            </div>

            <h3 className="calc-section-title">Detalhamento das Verbas</h3>
            <ResultsTable
              items={resultado.detalhamento.map(v => ({
                nome: v.nome,
                valor: `R$ ${fmt(v.valor)}`,
                descricao: v.descricao,
              }))}
            />
          </>
        )}

        <div className="calc-disclaimer">
          <strong>Aviso importante:</strong> Este cálculo é uma estimativa automatizada baseada nas tabelas oficiais de 2026, CLT e súmulas do TST. Valores reais podem variar conforme convenção coletiva, acordos individuais, decisões judiciais e particularidades do caso. O FGTS é estimado com base no salário e tempo de serviço — o valor exato depende do extrato da conta vinculada. Consulte um contador ou advogado trabalhista para cálculos com validade jurídica.
        </div>
      </div>
    </CalculatorLayout>
  )
}
