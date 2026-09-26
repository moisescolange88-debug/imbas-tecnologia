'use client'

import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/calculos/CalculatorLayout'
import ResultBox from '@/components/calculos/ResultBox'
import {
  projetarTransicao,
  calcularSplitPayment,
  TABELA_TRANSICAO,
  ALIQUOTAS_REDUZIDAS,
  IMPOSTO_SELETIVO,
  CategoriaReduzida,
  ProjecaoAnual,
} from '@/lib/engine/reforma-tributaria'

function fmt(v: number) {
  return (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtPct(v: number) {
  return (v || 0).toFixed(2).replace('.', ',') + '%'
}

function parseMoney(val: string | number): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  if (!val) return 0
  const cleaned = val.toString().trim().replace(/[R$\s]/g, '')
  if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0
  }
  return parseFloat(cleaned) || 0
}

type SetorAtividade = 'comercio' | 'servicos' | 'industria' | 'personalizado'
type RegimeTributario = 'real' | 'presumido' | 'simples'

export default function ReformaTributariaPage() {
  // Estados do formulário
  const [receita, setReceita] = useState<string>('1000000')
  const [atividade, setAtividade] = useState<SetorAtividade>('comercio')
  const [regime, setRegime] = useState<RegimeTributario>('real')
  const [categoria, setCategoria] = useState<CategoriaReduzida>('padrao')
  const [pisCofins, setPisCofins] = useState<string>('9,25')
  const [icms, setIcms] = useState<string>('18,00')
  const [iss, setIss] = useState<string>('0,00')
  const [comprasDespesas, setComprasDespesas] = useState<string>('0')

  // Simulador de Split Payment
  const [splitValor, setSplitValor] = useState<string>('10000')
  const [splitAliquota, setSplitAliquota] = useState<number>(26.5)

  // Aba ativa de visualização
  const [abaAtiva, setAbaAtiva] = useState<'projecao' | 'split' | 'seletivo' | 'faq'>('projecao')

  // Aplicar presets de atividade
  const handleAtividadeChange = (novaAtividade: SetorAtividade, novoRegime: RegimeTributario = regime) => {
    setAtividade(novaAtividade)
    const pisPadrao = novoRegime === 'presumido' ? '3,65' : '9,25'

    if (novaAtividade === 'comercio') {
      setPisCofins(pisPadrao)
      setIcms('18,00')
      setIss('0,00')
    } else if (novaAtividade === 'servicos') {
      setPisCofins(pisPadrao)
      setIcms('0,00')
      setIss(novoRegime === 'presumido' ? '5,00' : '3,00')
    } else if (novaAtividade === 'industria') {
      setPisCofins(pisPadrao)
      setIcms('18,00')
      setIss('0,00')
    }
  }

  // Aplicar preset de regime
  const handleRegimeChange = (novoRegime: RegimeTributario) => {
    setRegime(novoRegime)
    if (novoRegime === 'presumido') {
      setPisCofins('3,65')
    } else if (novoRegime === 'real') {
      setPisCofins('9,25')
    }
  }

  // Projeção calculada reativamente
  const projecao: ProjecaoAnual[] = useMemo(() => {
    const receitaNum = parseMoney(receita)
    const pisNum = parseMoney(pisCofins)
    const icmsNum = parseMoney(icms)
    const issNum = parseMoney(iss)
    const despesasNum = parseMoney(comprasDespesas)

    return projetarTransicao({
      receitaBrutaAnual: receitaNum,
      aliquotaPISCOFINSAtual: pisNum,
      aliquotaICMSAtual: icmsNum,
      aliquotaISSAtual: issNum,
      aliquotaReduzida: categoria,
      comprasDespesasAnual: despesasNum,
    })
  }, [receita, pisCofins, icms, iss, categoria, comprasDespesas])

  // Cálculo do Split Payment
  const splitResult = useMemo(() => {
    const v = parseMoney(splitValor)
    return calcularSplitPayment({ valorOperacao: v, aliquotaCombinada: splitAliquota })
  }, [splitValor, splitAliquota])

  // Dados consolidados para os cards de destaque
  const baseAtual = projecao[0]?.totalBaselineAtual ?? 0
  const aliqAtual = projecao[0]?.aliquotaBaselineAtual ?? 0
  const ano2026 = projecao[0]
  const ano2033 = projecao[7]
  const diferencaConsolidada = ano2033?.diferencaVsAtual ?? 0
  const variacaoConsolidadaPct = ano2033?.percentualVariacao ?? 0
  const isEconomia = diferencaConsolidada <= 0

  return (
    <CalculatorLayout>
      <div className="wrap">
        {/* CABEÇALHO */}
        <div className="section-head" style={{ maxWidth: 'none', marginBottom: 28 }}>
          <p className="eyebrow"><span className="glyph">ᚉ</span> Simulador Tributário</p>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', lineHeight: 1.15, margin: '12px 0 16px', color: 'var(--ink)' }}>
            Calculadora de Imposto Futuro & Reforma Tributária
          </h1>
          <p style={{ maxWidth: '48rem', fontSize: '1.05rem', color: 'var(--ink-72)', lineHeight: 1.6 }}>
            Projeção oficial da transição tributária de <strong>2026 a 2033</strong> (CBS, IBS e Imposto Seletivo conforme <strong>LC 214/2025</strong> e <strong>LC 227/2026</strong>). Compare o sistema atual com o novo IVA Dual e simule o impacto real no seu negócio.
          </p>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32, borderBottom: '1px solid var(--line-soft)', paddingBottom: 16 }}>
          <button
            type="button"
            onClick={() => setAbaAtiva('projecao')}
            className={`calc-btn ${abaAtiva === 'projecao' ? 'calc-btn-primary' : 'calc-btn-secondary'}`}
          >
            📊 Projeção da Transição (2026–2033)
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('split')}
            className={`calc-btn ${abaAtiva === 'split' ? 'calc-btn-primary' : 'calc-btn-secondary'}`}
          >
            ⚡ Split Payment (Retenção na Fonte)
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('seletivo')}
            className={`calc-btn ${abaAtiva === 'seletivo' ? 'calc-btn-primary' : 'calc-btn-secondary'}`}
          >
            🏷️ Imposto Seletivo (IS)
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('faq')}
            className={`calc-btn ${abaAtiva === 'faq' ? 'calc-btn-primary' : 'calc-btn-secondary'}`}
          >
            📖 Regras da LC 214/2025
          </button>
        </div>

        {/* ================= ABA 1: PROJEÇÃO 2026-2033 ================= */}
        {abaAtiva === 'projecao' && (
          <>
            {/* TIMELINE VISUAL DE TRANSIÇÃO */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--ink-56)' }}>
                  Cronograma Legal de Transição (LC 214/2025)
                </span>
                <span style={{ fontSize: '.82rem', color: 'var(--gold)', fontWeight: 500 }}>
                  Alíquota de Referência: CBS 8,8% + IBS 17,7% = 26,5%
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 10 }}>
                {TABELA_TRANSICAO.map(a => (
                  <div
                    key={a.ano}
                    className="result-box"
                    style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      background: a.ano === 2026 ? 'rgba(75, 232, 160, 0.08)' : (a.ano === 2033 ? 'rgba(227, 184, 96, 0.12)' : 'var(--surface)'),
                      border: a.ano === 2033 ? '1px solid var(--gold)' : (a.ano === 2026 ? '1px solid var(--emerald)' : '1px solid var(--line-soft)'),
                    }}
                  >
                    <span style={{ fontFamily: 'var(--display)', fontSize: '1.25rem', fontWeight: 600, color: a.ano === 2033 ? 'var(--gold)' : 'var(--ink)' }}>
                      {a.ano}
                    </span>
                    <div style={{ marginTop: 6, fontSize: '.78rem', color: 'var(--ink-72)', lineHeight: 1.4 }}>
                      <div>CBS: <strong style={{ color: 'var(--emerald-text)' }}>{fmtPct(a.cbs)}</strong></div>
                      <div>IBS: <strong style={{ color: 'var(--emerald-text)' }}>{fmtPct(a.ibs)}</strong></div>
                      <div style={{ fontSize: '.68rem', color: 'var(--ink-56)', marginTop: 4 }}>
                        {a.ano === 2026 ? 'Teste (100% compensado)' : (a.ano === 2033 ? 'Consolidado' : `IBS ${fmtPct(a.ibs)}`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMULÁRIO DE SIMULAÇÃO */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-card, 16px)', padding: '32px 28px', border: '1px solid var(--line-soft)', marginBottom: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--ink)' }}>
                  Parâmetros da Sua Empresa
                </h3>
                <span style={{ fontSize: '.82rem', color: 'var(--ink-56)' }}>
                  Altere qualquer campo para recalcular automaticamente em tempo real
                </span>
              </div>

              {/* SELEÇÃO RÁPIDA DE SETOR */}
              <div style={{ marginBottom: 22 }}>
                <label className="calc-label" style={{ marginBottom: 8 }}>Selecione o Setor de Atuação (preenchimento automático de alíquotas típicas):</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleAtividadeChange('comercio')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: atividade === 'comercio' ? 'var(--gold)' : 'var(--surface-2, transparent)',
                      color: atividade === 'comercio' ? '#000' : 'var(--ink)',
                      borderColor: atividade === 'comercio' ? 'var(--gold)' : 'var(--line)',
                    }}
                  >
                    🏪 Comércio (ICMS 18%, ISS 0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAtividadeChange('servicos')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: atividade === 'servicos' ? 'var(--gold)' : 'var(--surface-2, transparent)',
                      color: atividade === 'servicos' ? '#000' : 'var(--ink)',
                      borderColor: atividade === 'servicos' ? 'var(--gold)' : 'var(--line)',
                    }}
                  >
                    💼 Prestação de Serviços (ISS 3%–5%, ICMS 0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAtividadeChange('industria')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: atividade === 'industria' ? 'var(--gold)' : 'var(--surface-2, transparent)',
                      color: atividade === 'industria' ? '#000' : 'var(--ink)',
                      borderColor: atividade === 'industria' ? 'var(--gold)' : 'var(--line)',
                    }}
                  >
                    🏭 Indústria (ICMS 18%, ISS 0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtividade('personalizado')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: atividade === 'personalizado' ? 'var(--gold)' : 'var(--surface-2, transparent)',
                      color: atividade === 'personalizado' ? '#000' : 'var(--ink)',
                      borderColor: atividade === 'personalizado' ? 'var(--gold)' : 'var(--line)',
                    }}
                  >
                    ⚙️ Personalizado
                  </button>
                </div>
              </div>

              {/* SELEÇÃO DO REGIME ATUAL */}
              <div style={{ marginBottom: 22 }}>
                <label className="calc-label" style={{ marginBottom: 8 }}>Regime Tributário Atual:</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleRegimeChange('real')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: regime === 'real' ? 'var(--line)' : 'transparent',
                      color: 'var(--ink)',
                      borderColor: regime === 'real' ? 'var(--emerald)' : 'var(--line-soft)',
                    }}
                  >
                    Lucro Real (PIS/Cofins 9,25% não cumulativo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegimeChange('presumido')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: regime === 'presumido' ? 'var(--line)' : 'transparent',
                      color: 'var(--ink)',
                      borderColor: regime === 'presumido' ? 'var(--emerald)' : 'var(--line-soft)',
                    }}
                  >
                    Lucro Presumido (PIS/Cofins 3,65% cumulativo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegimeChange('simples')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      background: regime === 'simples' ? 'var(--line)' : 'transparent',
                      color: 'var(--ink)',
                      borderColor: regime === 'simples' ? 'var(--emerald)' : 'var(--line-soft)',
                    }}
                  >
                    Simples Nacional (Optante)
                  </button>
                </div>
                {regime === 'simples' && (
                  <div style={{ marginTop: 8, fontSize: '.8rem', color: 'var(--gold)', background: 'rgba(227, 184, 96, 0.08)', padding: '8px 12px', borderRadius: 8 }}>
                    ℹ️ <strong>Atenção para Simples Nacional:</strong> Pela LC 214/2025, empresas do Simples podem escolher permanecer no regime unificado ou apurar CBS/IBS pelo regime regular para transferir créditos integrais a clientes B2B. A simulação abaixo reflete o regime de comparação plena.
                  </div>
                )}
              </div>

              {/* GRID DE INPUTS */}
              <div className="calc-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {/* Receita Bruta Anual */}
                <div className="calc-field">
                  <label className="calc-label">Receita Bruta Anual (R$)</label>
                  <div className="calc-input-wrap">
                    <span className="calc-prefix">R$</span>
                    <input
                      type="text"
                      className="calc-input calc-input--prefix"
                      value={receita}
                      onChange={e => setReceita(e.target.value)}
                      placeholder="1.000.000,00"
                    />
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-56)', marginTop: 4, display: 'block' }}>
                    Faturamento estimado em 12 meses
                  </span>
                </div>

                {/* Categoria / Alíquota Reduzida */}
                <div className="calc-field">
                  <label className="calc-label">Categoria de Alíquota no Novo IVA</label>
                  <div className="calc-input-wrap">
                    <select
                      className="calc-input calc-select"
                      value={categoria}
                      onChange={e => setCategoria(e.target.value as CategoriaReduzida)}
                    >
                      {ALIQUOTAS_REDUZIDAS.map(c => (
                        <option key={c.categoria} value={c.categoria}>
                          {c.nome} ({fmtPct(c.aliquotaEfetiva)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-56)', marginTop: 4, display: 'block' }}>
                    Benefício da LC 214/2025 (saúde, educação, etc.)
                  </span>
                </div>

                {/* PIS/Cofins atual */}
                <div className="calc-field">
                  <label className="calc-label">PIS + Cofins Atual (%)</label>
                  <div className="calc-input-wrap">
                    <input
                      type="text"
                      className="calc-input"
                      value={pisCofins}
                      onChange={e => setPisCofins(e.target.value)}
                      placeholder="9,25"
                    />
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-56)', marginTop: 4, display: 'block' }}>
                    Real: 9,25% | Presumido: 3,65%
                  </span>
                </div>

                {/* ICMS atual */}
                <div className="calc-field">
                  <label className="calc-label">ICMS Atual (%)</label>
                  <div className="calc-input-wrap">
                    <input
                      type="text"
                      className="calc-input"
                      value={icms}
                      onChange={e => setIcms(e.target.value)}
                      placeholder="18,00"
                    />
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-56)', marginTop: 4, display: 'block' }}>
                    Média estadual (0% para serviços puros)
                  </span>
                </div>

                {/* ISS atual */}
                <div className="calc-field">
                  <label className="calc-label">ISS Atual (%)</label>
                  <div className="calc-input-wrap">
                    <input
                      type="text"
                      className="calc-input"
                      value={iss}
                      onChange={e => setIss(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-56)', marginTop: 4, display: 'block' }}>
                    De 2% a 5% (0% para comércio puro)
                  </span>
                </div>

                {/* Compras/Despesas Operacionais com Crédito */}
                <div className="calc-field">
                  <label className="calc-label">Compras & Despesas c/ Crédito (R$/ano)</label>
                  <div className="calc-input-wrap">
                    <span className="calc-prefix">R$</span>
                    <input
                      type="text"
                      className="calc-input calc-input--prefix"
                      value={comprasDespesas}
                      onChange={e => setComprasDespesas(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-56)', marginTop: 4, display: 'block' }}>
                    Insumos, aluguel, energia, serviços tomados
                  </span>
                </div>
              </div>
            </div>

            {/* CARDS COM RESUMO EXECUTIVO */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="calc-section-title" style={{ margin: 0 }}>
                  Resumo Comparativo de Carga Tributária
                </h3>
                <span style={{ fontSize: '.85rem', color: isEconomia ? 'var(--emerald-text)' : 'var(--gold)', fontWeight: 600 }}>
                  {isEconomia ? '✅ Projeção Favorável (Economia)' : '⚠️ Projeção com Acréscimo'}
                </span>
              </div>

              <div className="result-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <ResultBox
                  label="1. Sistema Atual (Referência Anual)"
                  value={`R$ ${fmt(baseAtual)}`}
                  highlight
                />
                <ResultBox
                  label="2. Ano Teste 2026 (Com Compensação)"
                  value={`R$ ${fmt(ano2026?.totalEfetivoAno ?? 0)}`}
                />
                <ResultBox
                  label="3. Sistema Novo Consolidado 2033"
                  value={`R$ ${fmt(ano2033?.totalEfetivoAno ?? 0)}`}
                  highlight
                />
                <div
                  className="result-box result-box--highlight"
                  style={{
                    background: isEconomia ? 'rgba(75, 232, 160, 0.08)' : 'rgba(227, 184, 96, 0.08)',
                    borderColor: isEconomia ? 'var(--emerald)' : 'var(--gold)',
                  }}
                >
                  <span className="result-box-label" style={{ color: isEconomia ? 'var(--emerald-text)' : 'var(--gold)' }}>
                    {isEconomia ? '4. Economia Anual em 2033' : '4. Variação em 2033 vs Atual'}
                  </span>
                  <div className="result-box-value" style={{ color: isEconomia ? 'var(--emerald-text)' : 'var(--gold)' }}>
                    {diferencaConsolidada > 0 ? '+' : ''}R$ {fmt(diferencaConsolidada)}
                  </div>
                  <span style={{ fontSize: '.8rem', color: 'var(--ink-72)', marginTop: 4 }}>
                    {diferencaConsolidada <= 0
                      ? `Redução de ${Math.abs(variacaoConsolidadaPct).toFixed(2).replace('.', ',')}% no tributo anual`
                      : `Acréscimo de ${variacaoConsolidadaPct.toFixed(2).replace('.', ',')}% no tributo anual`}
                  </span>
                </div>
              </div>

              {parseMoney(comprasDespesas) > 0 && (
                <div style={{ background: 'rgba(75, 232, 160, 0.06)', border: '1px solid var(--emerald)', borderRadius: 12, padding: '16px 20px', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--emerald-text)' }}>Não-Cumulatividade Plena (Crédito Amplo):</strong>
                      <span style={{ fontSize: '.9rem', color: 'var(--ink-72)', marginLeft: 8 }}>
                        Suas despesas de R$ {fmt(parseMoney(comprasDespesas))} geram <strong>R$ {fmt(ano2033?.creditoNovo ?? 0)}/ano</strong> em créditos diretos de CBS+IBS em 2033, reduzindo expressivamente o imposto a recolher!
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TABELA DE TRANSIÇÃO ANO A ANO */}
            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <h3 className="calc-section-title" style={{ margin: 0 }}>
                    Projeção Completa da Transição (2026 a 2033)
                  </h3>
                  <p style={{ color: 'var(--ink-72)', fontSize: '.88rem', margin: '4px 0 0' }}>
                    Demonstrativo detalhado do desembolso anual: substituição gradual do sistema antigo pelo novo IVA Dual.
                  </p>
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--ink-56)' }}>
                  Valores em Reais (R$) calculados sobre a receita de R$ {fmt(parseMoney(receita))}
                </div>
              </div>

              <div className="results-table-wrap">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th style={{ width: '8%' }}>Ano</th>
                      <th className="th-valor" style={{ width: '13%' }}>CBS ({categoria === 'padrao' ? '8,8%' : 'Red.'})</th>
                      <th className="th-valor" style={{ width: '13%' }}>IBS (Gradual)</th>
                      <th className="th-valor" style={{ width: '14%' }}>Novo IVA Líquido</th>
                      <th className="th-valor" style={{ width: '16%' }}>Sistema Antigo Remanescente</th>
                      <th className="th-valor" style={{ width: '16%', background: 'rgba(227, 184, 96, 0.06)' }}>Total a Recolher</th>
                      <th className="th-valor" style={{ width: '20%' }}>Variação vs Hoje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projecao.map(p => {
                      const economiaAno = p.diferencaVsAtual <= 0
                      return (
                        <tr key={p.ano} style={{ background: p.ano === 2033 ? 'rgba(227, 184, 96, 0.05)' : undefined }}>
                          <td>
                            <strong>{p.ano}</strong>
                            {p.ano === 2026 && <span style={{ display: 'block', fontSize: '.68rem', color: 'var(--emerald-text)' }}>Teste</span>}
                            {p.ano === 2033 && <span style={{ display: 'block', fontSize: '.68rem', color: 'var(--gold)' }}>Pleno</span>}
                          </td>
                          <td className="td-valor">
                            R$ {fmt(p.cbsDevido)}
                            <span style={{ display: 'block', fontSize: '.72rem', color: 'var(--ink-56)' }}>{fmtPct(p.aliquotaCBS)}</span>
                          </td>
                          <td className="td-valor">
                            R$ {fmt(p.ibsDevido)}
                            <span style={{ display: 'block', fontSize: '.72rem', color: 'var(--ink-56)' }}>{fmtPct(p.aliquotaIBS)}</span>
                          </td>
                          <td className="td-valor">
                            <strong>R$ {fmt(p.totalNovoLiquido)}</strong>
                            {p.creditoNovo > 0 && (
                              <span style={{ display: 'block', fontSize: '.7rem', color: 'var(--emerald-text)' }}>
                                (-R$ {fmt(p.creditoNovo)} cred.)
                              </span>
                            )}
                          </td>
                          <td className="td-valor">
                            R$ {fmt(p.totalAntigoRemanescente)}
                            <span style={{ display: 'block', fontSize: '.72rem', color: 'var(--ink-56)' }}>
                              {p.ano >= 2033 ? '0% (extinto)' : (p.ano === 2026 ? '100% compensado' : `${fmtPct(p.aliquotaICMSISS + p.aliquotaPISCOFINS)}`)}
                            </span>
                          </td>
                          <td className="td-valor" style={{ fontWeight: 600, color: 'var(--ink)', background: 'rgba(227, 184, 96, 0.06)' }}>
                            R$ {fmt(p.totalEfetivoAno)}
                            <span style={{ display: 'block', fontSize: '.72rem', color: 'var(--ink-56)' }}>
                              {fmtPct(p.aliquotaEfetivaAno)} da receita
                            </span>
                          </td>
                          <td className="td-valor" style={{ color: economiaAno ? 'var(--emerald-text)' : 'var(--gold)', fontWeight: 600 }}>
                            {p.diferencaVsAtual > 0 ? '+' : ''}R$ {fmt(p.diferencaVsAtual)}
                            <span style={{ display: 'block', fontSize: '.72rem', opacity: 0.85 }}>
                              ({p.diferencaVsAtual > 0 ? '+' : ''}{p.percentualVariacao.toFixed(2).replace('.', ',')}%)
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 14, fontSize: '.82rem', color: 'var(--ink-56)', lineHeight: 1.5 }}>
                * <strong>Ano de Teste 2026:</strong> O valor de CBS (0,9%) e IBS (0,1%) é integralmente compensado com o PIS/Cofins devido, sem gerar aumento financeiro de carga.
                <br />
                * <strong>Transição 2027 a 2032:</strong> PIS/Cofins extintos. CBS cheia entra em vigor. IBS cresce gradualmente de 10% a 40% da alíquota cheia, enquanto ICMS e ISS são reduzidos na mesma proporção.
                <br />
                * <strong>2033 Consolidado:</strong> Fim definitivo do ICMS, ISS e IPI. Vigoram unicamente CBS (federal) e IBS (estadual/municipal).
              </div>
            </div>
          </>
        )}

        {/* ================= ABA 2: SPLIT PAYMENT ================= */}
        {abaAtiva === 'split' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-card, 16px)', padding: '36px 30px', border: '1px solid var(--line-soft)', marginBottom: 32 }}>
              <div className="section-head" style={{ maxWidth: 'none', marginBottom: 24 }}>
                <p className="eyebrow"><span className="glyph">ᚉ</span> Art. 47 da LC 214/2025</p>
                <h2 style={{ fontSize: '1.8rem', margin: '8px 0 12px' }}>Simulador de Split Payment</h2>
                <p style={{ color: 'var(--ink-72)', maxWidth: '44rem', lineHeight: 1.6 }}>
                  O <strong>Split Payment</strong> é uma das maiores inovações da Reforma Tributária: no momento em que seu cliente paga (via Pix, cartão ou boleto), a parcela do tributo é <strong>retida automaticamente pela instituição financeira</strong> e repassada ao governo. Sua empresa recebe apenas o valor líquido na conta corrente.
                </p>
              </div>

              <div className="calc-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                <div className="calc-field">
                  <label className="calc-label">Valor da Venda / Fatura (R$)</label>
                  <div className="calc-input-wrap">
                    <span className="calc-prefix">R$</span>
                    <input
                      type="text"
                      className="calc-input calc-input--prefix"
                      value={splitValor}
                      onChange={e => setSplitValor(e.target.value)}
                      placeholder="10.000,00"
                    />
                  </div>
                </div>

                <div className="calc-field">
                  <label className="calc-label">Alíquota CBS + IBS da Operação (%)</label>
                  <div className="calc-input-wrap">
                    <select
                      className="calc-input calc-select"
                      value={splitAliquota}
                      onChange={e => setSplitAliquota(parseFloat(e.target.value))}
                    >
                      <option value={26.5}>Alíquota Padrão — 26,50%</option>
                      <option value={18.55}>Profissões Regulamentadas — 18,55% (30% red.)</option>
                      <option value={10.6}>Saúde / Educação / Insumos — 10,60% (60% red.)</option>
                      <option value={0}>Cesta Básica / Desoneração — 0,00%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESULTADO DO SPLIT */}
              <div className="result-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 24 }}>
                <ResultBox
                  label="Valor Bruto da Operação"
                  value={`R$ ${fmt(splitResult.valorOperacao)}`}
                />
                <div className="result-box" style={{ background: 'rgba(227, 184, 96, 0.08)', borderColor: 'var(--gold)' }}>
                  <span className="result-box-label" style={{ color: 'var(--gold)' }}>
                    Retenção Automática (Split Fisco)
                  </span>
                  <div className="result-box-value" style={{ color: 'var(--gold)' }}>
                    R$ {fmt(splitResult.valorTributo)}
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--ink-56)' }}>
                    Retido na liquidação bancária ({fmtPct(splitResult.aliquota)})
                  </span>
                </div>
                <div className="result-box result-box--highlight" style={{ background: 'rgba(75, 232, 160, 0.08)', borderColor: 'var(--emerald)' }}>
                  <span className="result-box-label" style={{ color: 'var(--emerald-text)' }}>
                    Valor Líquido na Conta da Empresa
                  </span>
                  <div className="result-box-value" style={{ color: 'var(--emerald-text)' }}>
                    R$ {fmt(splitResult.valorLiquidoRecebido)}
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--ink-56)' }}>
                    Disponível no caixa imediato
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--surface-2, rgba(0,0,0,0.02))', padding: '18px 22px', borderRadius: 12, border: '1px solid var(--line-soft)', marginTop: 20 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '1rem', color: 'var(--ink)' }}>Impacto Prático no Fluxo de Caixa:</h4>
                <p style={{ margin: 0, fontSize: '.9rem', color: 'var(--ink-72)', lineHeight: 1.6 }}>
                  No modelo anterior, a empresa recebia 100% da venda e recolhia os impostos apenas no mês seguinte (dia 20 ou 25). Com o Split Payment, o imposto <strong>não entra mais no caixa da empresa</strong>. O capital de giro precisará ser recalculado desde o início da fase obrigatória (2027 a 2033).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 3: IMPOSTO SELETIVO ================= */}
        {abaAtiva === 'seletivo' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-card, 16px)', padding: '36px 30px', border: '1px solid var(--line-soft)', marginBottom: 32 }}>
              <div className="section-head" style={{ maxWidth: 'none', marginBottom: 24 }}>
                <p className="eyebrow"><span className="glyph">ᚉ</span> Art. 39 da LC 214/2025</p>
                <h2 style={{ fontSize: '1.8rem', margin: '8px 0 12px' }}>Imposto Seletivo (IS — Imposto do Pecado)</h2>
                <p style={{ color: 'var(--ink-72)', maxWidth: '46rem', lineHeight: 1.6 }}>
                  O Imposto Seletivo é um tributo federal extra que incide sobre a produção, comercialização ou importação de produtos prejudiciais à saúde humana ou ao meio ambiente. Entra em vigor em <strong>2027</strong> e <strong>não gera direito a crédito tributário</strong> para o comprador.
                </p>
              </div>

              <div className="results-table-wrap">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Categoria</th>
                      <th style={{ width: '12%' }}>Início</th>
                      <th style={{ width: '23%' }}>Alíquota / Modelo</th>
                      <th style={{ width: '40%' }}>Regra Legal (LC 214/2025)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IMPOSTO_SELETIVO.map(item => (
                      <tr key={item.categoria}>
                        <td>
                          <strong>{item.nome}</strong>
                        </td>
                        <td>
                          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(227, 184, 96, 0.1)', color: 'var(--gold)', fontSize: '.82rem' }}>
                            {item.inicio}
                          </span>
                        </td>
                        <td style={{ color: 'var(--gold)', fontWeight: 500 }}>
                          {item.aliquotaEstimada}
                        </td>
                        <td style={{ color: 'var(--ink-72)', fontSize: '.88rem' }}>
                          {item.descricao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: 'rgba(227, 184, 96, 0.08)', padding: '16px 20px', borderRadius: 12, border: '1px solid var(--gold)', marginTop: 20 }}>
                <strong style={{ color: 'var(--gold)' }}>Atenção Importante:</strong>
                <p style={{ margin: '6px 0 0', fontSize: '.88rem', color: 'var(--ink-72)', lineHeight: 1.5 }}>
                  O Imposto Seletivo incide uma única vez na cadeia (monofásico) e as alíquotas definitivas de cada categoria serão fixadas por lei ordinária posterior. Medicamentos, alimentos convencionais e serviços essenciais estão <strong>expressamente proibidos</strong> de sofrer incidência de IS pela Constituição.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: FAQ & REGRAS ================= */}
        {abaAtiva === 'faq' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-card, 16px)', padding: '36px 30px', border: '1px solid var(--line-soft)', marginBottom: 32 }}>
              <div className="section-head" style={{ maxWidth: 'none', marginBottom: 28 }}>
                <p className="eyebrow"><span className="glyph">ᚉ</span> Base Regulatória</p>
                <h2 style={{ fontSize: '1.8rem', margin: '8px 0 12px' }}>Perguntas Frequentes & Entendimento Jurídico</h2>
                <p style={{ color: 'var(--ink-72)', maxWidth: '46rem' }}>
                  Principais pontos práticos da Lei Complementar nº 214/2025 e Lei Complementar nº 227/2026 para gestores e escritórios contábeis.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ padding: '20px 24px', background: 'var(--surface-2, transparent)', borderRadius: 12, border: '1px solid var(--line-soft)' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: 'var(--ink)' }}>
                    1. O que realmente acontece em 2026? A empresa vai pagar mais impostos?
                  </h4>
                  <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--ink-72)', lineHeight: 1.6 }}>
                    <strong>Não.</strong> O ano de 2026 é estritamente um ano de teste operacional e tecnológico da Receita Federal e do Comitê Gestor. A CBS de 0,9% e o IBS de 0,1% recolhidos serão <strong>100% compensados</strong> contra o valor devido de PIS/Cofins. Caso não haja PIS/Cofins suficiente para abater, o valor é dispensado ou restituído. A carga fiscal real não aumenta em 2026.
                  </p>
                </div>

                <div style={{ padding: '20px 24px', background: 'var(--surface-2, transparent)', borderRadius: 12, border: '1px solid var(--line-soft)' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: 'var(--ink)' }}>
                    2. Como funciona a não-cumulatividade plena (crédito amplo)?
                  </h4>
                  <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--ink-72)', lineHeight: 1.6 }}>
                    No sistema atual de PIS/Cofins e ICMS, apenas insumos de fabricação ou mercadorias para revenda geram crédito, com infindáveis disputas no CARF e tribunais. No novo IVA Dual (CBS/IBS), <strong>qualquer aquisição onerosa de bens ou serviços vinculada à atividade econômica gera crédito integral</strong> — incluindo aluguel predial, conta de luz, internet, consultorias, serviços contábeis, softwares e terceirização.
                  </p>
                </div>

                <div style={{ padding: '20px 24px', background: 'var(--surface-2, transparent)', borderRadius: 12, border: '1px solid var(--line-soft)' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: 'var(--ink)' }}>
                    3. Minha empresa é do Simples Nacional. O que muda?
                  </h4>
                  <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--ink-72)', lineHeight: 1.6 }}>
                    A Constituição garante a manutenção do Simples Nacional. Porém, o art. 41 da LC 214/2025 oferece uma opção estratégica: se sua empresa vende para clientes corporativos (B2B), eles vão preferir fornecedores que transfiram créditos cheios de CBS e IBS. Empresas do Simples poderão optar por recolher a CBS e o IBS pelo regime regular e os demais tributos (IRPJ, CSLL, CPP) pelo Simples.
                  </p>
                </div>

                <div style={{ padding: '20px 24px', background: 'var(--surface-2, transparent)', borderRadius: 12, border: '1px solid var(--line-soft)' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: 'var(--ink)' }}>
                    4. O que é a Lei Complementar nº 227/2026 (Comitê Gestor do IBS)?
                  </h4>
                  <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--ink-72)', lineHeight: 1.6 }}>
                    A LC 227/2026 cria a estrutura do Comitê Gestor do IBS (CG-IBS), entidade pública com representação paritária de todos os 26 estados, Distrito Federal e municípios. O comitê unifica a arrecadação, fiscalização e distribuição do IBS, eliminando de vez as 27 legislações estaduais conflitantes de ICMS e milhares de códigos municipais de ISS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DISCLAIMER E FONTES LEGAIS */}
        <div className="calc-disclaimer" style={{ marginTop: 40 }}>
          <strong>Fontes Oficiais & Base Jurídica:</strong> Emenda Constitucional nº 132/2023; Lei Complementar nº 214, de 16 de janeiro de 2025 (Regulamentação Geral da CBS, IBS e IS); Lei Complementar nº 227, de 2026 (Comitê Gestor do IBS); Pareceres Técnicos do Ministério da Fazenda e Receita Federal do Brasil. Os valores apresentados são projeções e estimativas analíticas para fins de planejamento tributário. Alíquotas definitivas serão consolidadas por Resolução do Senado Federal ao término da transição.
        </div>
      </div>
    </CalculatorLayout>
  )
}
