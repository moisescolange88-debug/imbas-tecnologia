'use client'

import { useEffect, useState } from 'react'

interface Scenario {
  id: string
  tab: string
  ogham: string
  entradaLabel: string
  entradaItens: string[]
  iaAcao: string
  iaDetalhe: string
  confianca: string
  saidaTitulo: string
  saidaMetrica: string
  saidaSub: string
  tempo: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'contabil',
    tab: 'Contábil',
    ogham: 'ᚃ',
    entradaLabel: 'Caixa de entrada · Lote mensal',
    entradaItens: ['420 NF-e e NFS-e', '14 extratos bancários', 'Guias e DARFs'],
    iaAcao: 'Conciliação e classificação fiscal',
    iaDetalhe: 'Cruzamento por plano de contas, CFOP e histórico de fornecedores',
    confianca: '99,4%',
    saidaTitulo: 'Fechamento preparado para revisão',
    saidaMetrica: '412 automáticos · 8 exceções',
    saidaSub: 'Anomalias isoladas com justificativa pronta para o contador decidir',
    tempo: '18 s',
  },
  {
    id: 'juridico',
    tab: 'Jurídico',
    ogham: 'ᚄ',
    entradaLabel: 'Autos e contratos · Triagem',
    entradaItens: ['Petição de 148 pág.', '12 acórdãos STJ/TST', 'Aditivos contratuais'],
    iaAcao: 'Extração de teses, prazos e riscos',
    iaDetalhe: 'Mapeamento de cláusulas críticas e precedentes alinhados ao escritório',
    confianca: '98,8%',
    saidaTitulo: 'Minuta estruturada com evidências',
    saidaMetrica: '6 pontos de risco · 4 precedentes',
    saidaSub: 'Citação por folha e página — a estratégia permanece com o advogado',
    tempo: '24 s',
  },
  {
    id: 'societario',
    tab: 'Societário & Fiscal',
    ogham: 'ᚋ',
    entradaLabel: 'Registros oficiais · Junta & LC 214',
    entradaItens: ['Atos desde 2011', 'Certidões SICAF', 'Simulação CBS/IBS'],
    iaAcao: 'Dossiê cronológico e projeção 2026–2033',
    iaDetalhe: 'Reconstituição societária, vencimentos e créditos de não cumulatividade',
    confianca: '100%',
    saidaTitulo: 'Painel executivo auditável',
    saidaMetrica: 'Linha do tempo + impacto IVA Dual',
    saidaSub: 'Divergências contratuais e oportunidades tributárias em uma página',
    tempo: '12 s',
  },
]

export default function HeroShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const timer = window.setInterval(() => {
      setActiveIdx(prev => (prev + 1) % SCENARIOS.length)
    }, 5800)
    return () => window.clearInterval(timer)
  }, [paused])

  const sc = SCENARIOS[activeIdx]

  return (
    <div
      className="hero-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Demonstração interativa do motor de inteligência documental da Imbas"
    >
      {/* Topo do painel */}
      <div className="hs-top">
        <div className="hs-status">
          <span className="hs-dot" aria-hidden="true" />
          <span>Motor Imbas · Ao vivo</span>
        </div>
        <div className="hs-tabs" role="tablist" aria-label="Exemplos de operação">
          {SCENARIOS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              className={`hs-tab ${idx === activeIdx ? 'is-active' : ''}`}
              onClick={() => {
                setPaused(true)
                setActiveIdx(idx)
              }}
            >
              {item.tab}
            </button>
          ))}
        </div>
      </div>

      {/* Etapa 1: Entrada */}
      <div className="hs-stage">
        <div className="hs-stage-head">
          <span className="hs-step-tag">01 · Entrada</span>
          <span className="hs-stage-meta">{sc.entradaLabel}</span>
        </div>
        <div className="hs-chips">
          {sc.entradaItens.map(item => (
            <span key={item} className="hs-chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Conector */}
      <div className="hs-connector" aria-hidden="true">
        <span className="hs-connector-line" />
        <span className="hs-connector-badge">
          <span className="hs-glyph">{sc.ogham}</span> Leitura estruturada · {sc.tempo}
        </span>
        <span className="hs-connector-line" />
      </div>

      {/* Etapa 2: IA */}
      <div className="hs-stage hs-stage--ia">
        <div className="hs-stage-head">
          <span className="hs-step-tag hs-step-tag--emerald">02 · Clarividência IA</span>
          <span className="hs-conf">{sc.confianca} aderência</span>
        </div>
        <strong className="hs-ia-title">{sc.iaAcao}</strong>
        <p className="hs-ia-desc">{sc.iaDetalhe}</p>
      </div>

      {/* Etapa 3: Decisão */}
      <div className="hs-result">
        <div className="hs-result-head">
          <span className="hs-step-tag hs-step-tag--gold">03 · Decisão humana</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" stroke="#D6A844" strokeWidth="1.4" />
            <path d="M8.5 12.2l2.4 2.4 4.8-5.1" stroke="#D6A844" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="hs-result-metric">{sc.saidaMetrica}</div>
        <div className="hs-result-title">{sc.saidaTitulo}</div>
        <p className="hs-result-sub">{sc.saidaSub}</p>
      </div>

      {/* Rodapé */}
      <div className="hs-foot">
        <span>LGPD &amp; sigilo profissional</span>
        <span>95% automático · 5% julgamento</span>
      </div>
    </div>
  )
}
