'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import ResultBox from '@/components/calculos/ResultBox'
import { projetarTransicao, calcularCBS, calcularIBS, calcularSplitPayment, getAliquotaCBS, getAliquotaIBS, TABELA_TRANSICAO, ALIQUOTAS_REDUZIDAS, IMPOSTO_SELETIVO } from '@/lib/engine/reforma-tributaria'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtPct(v: number) { return v.toFixed(2).replace('.', ',') + '%' }

const categoriasOptions = ALIQUOTAS_REDUZIDAS.map(c => ({ value: c.categoria, label: `${c.nome} (${fmtPct(c.aliquotaEfetiva)})` }))

export default function ReformaTributariaPage() {
  const [projecao, setProjecao] = useState<any[] | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const receita = parseFloat(data.get('receita') as string) || 0
    const pisCofins = parseFloat(data.get('pisCofins') as string) || 9.25
    const icms = parseFloat(data.get('icms') as string) || 18
    const iss = parseFloat(data.get('iss') as string) || 3
    const categoria = data.get('categoria') as string

    const proj = projetarTransicao({
      receitaBrutaAnual: receita,
      aliquotaPISCOFINSAtual: pisCofins,
      aliquotaICMSAtual: icms,
      aliquotaISSAtual: iss,
      aliquotaReduzida: categoria !== 'padrao' ? categoria : undefined,
    })
    setProjecao(proj)
  }

  return (
    <CalculatorLayout>
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 32 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Calculadora Trabalhista</p>
          <h2>Reforma Tributária — CBS / IBS / IS</h2>
          <p>Projeção completa da transição tributária 2026-2033 conforme LC 214/2025. Compare o sistema atual com o novo IVA Dual.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16, marginBottom: 32 }}>
          {TABELA_TRANSICAO.map(a => (
            <div key={a.ano} className="result-box" style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', color: 'var(--gold)' }}>{a.ano}</span>
              <div style={{ marginTop: 8, fontSize: '.85rem', color: 'var(--mist)' }}>
                <div>CBS: <strong style={{ color: 'var(--emerald)' }}>{fmtPct(a.cbs)}</strong></div>
                <div>IBS: <strong style={{ color: 'var(--emerald)' }}>{fmtPct(a.ibs)}</strong></div>
                <div style={{ fontSize: '.72rem', color: 'var(--mist-dim)', marginTop: 6 }}>{a.observacao}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="calc-section-title">Projeção de Carga Tributária</h3>
        <form onSubmit={handleSubmit}>
          <div className="calc-form-grid">
            <Input name="receita" label="Receita Bruta Anual (R$)" type="number" step="0.01" prefix="R$" required />
            <Select name="categoria" label="Categoria (alíquota reduzida)" options={categoriasOptions} defaultValue="padrao" />
            <Input name="pisCofins" label="PIS+Cofins atual (%)" type="number" step="0.01" placeholder="9,25" />
            <Input name="icms" label="ICMS atual (%)" type="number" step="0.01" placeholder="18,00" />
            <Input name="iss" label="ISS atual (%)" type="number" step="0.01" placeholder="3,00" />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="calc-btn calc-btn-primary">Projetar Transição</button>
          </div>
        </form>

        {projecao && (
          <div style={{ marginTop: 48 }}>
            <h3 className="calc-section-title">Resultado — Comparativo 2026 a 2033</h3>
            <div className="result-grid">
              <ResultBox label="Sistema Atual (médio)" value={`R$ ${fmt(projecao[0].totalAtual)}`} />
              <ResultBox label="Ano de Teste 2026" value={`R$ ${fmt(projecao[0].totalNovo)}`} />
              <ResultBox label="Consolidado 2033" value={`R$ ${fmt(projecao[7].totalNovo)}`} highlight />
              <ResultBox label="Diferença 2033 vs Atual" value={`R$ ${fmt(projecao[7].diferenca)}`} negative={projecao[7].diferenca > 0} highlight />
            </div>

            <div className="results-table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Ano</th>
                    <th className="th-valor">CBS</th>
                    <th className="th-valor">IBS</th>
                    <th className="th-valor">Total Novo</th>
                    <th className="th-valor">Sistema Atual</th>
                    <th className="th-valor">Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {projecao.map(p => (
                    <tr key={p.ano}>
                      <td><strong>{p.ano}</strong></td>
                      <td className="td-valor">R$ {fmt(p.cbsDevido)}</td>
                      <td className="td-valor">R$ {fmt(p.ibsDevido)}</td>
                      <td className="td-valor">R$ {fmt(p.totalNovo)}</td>
                      <td className="td-valor">R$ {fmt(p.totalAtual)}</td>
                      <td className="td-valor" style={{ color: p.diferenca > 0 ? '#C4704D' : 'var(--emerald)' }}>
                        {p.diferenca > 0 ? '+' : ''}R$ {fmt(p.diferenca)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, fontSize: '.82rem', color: 'var(--mist-dim)' }}>
              * CBS+IBS calculado com a categoria selecionada. O sistema atual considera PIS/Cofins + ICMS + ISS proporcionais ao ano.
            </div>
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <h3 className="calc-section-title">Imposto Seletivo (IS)</h3>
          <p style={{ color: 'var(--mist)', marginBottom: 16, fontSize: '.95rem' }}>
            O Imposto Seletivo (imposto do pecado) incide sobre produtos nocivos à saúde e ao meio ambiente a partir de 2027. Não permite crédito tributário.
          </p>
          <div className="results-table-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th className="th-valor">Início</th>
                  <th className="th-valor">Alíquota</th>
                </tr>
              </thead>
              <tbody>
                {IMPOSTO_SELETIVO.map(item => (
                  <tr key={item.categoria}>
                    <td>{item.nome}</td>
                    <td className="td-valor">{item.inicio}</td>
                    <td className="td-valor" style={{ color: 'var(--gold)' }}>{item.aliquotaEstimada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-disclaimer">
          <strong>Fontes oficiais:</strong> Lei Complementar 214/2025, Lei Complementar 227/2026, Receita Federal do Brasil, Comitê Gestor do IBS. Dados de alíquotas reduzidas conforme art. 125 e Anexo I da LC 214/2025. A projeção é uma estimativa — alíquotas definitivas serão fixadas por Resolução do Senado. Consulte um contador ou advogado tributarista.
        </div>
      </div>
    </CalculatorLayout>
  )
}
