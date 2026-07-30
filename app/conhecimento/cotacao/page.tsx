'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Cotacao, PerfilEmpresa } from '@/lib/licensing/types'
import { LICENCAS } from '@/lib/licensing/conhecimento'
import { LICENCAS_MUNICIPAIS } from '@/lib/licensing/municipais'

function fmtBR(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const PORTE_OPCOES = [
  { value: 'MEI', label: 'MEI — Microempreendedor Individual' },
  { value: 'ME', label: 'ME — Microempresa' },
  { value: 'EPP', label: 'EPP — Empresa de Pequeno Porte' },
  { value: 'MEDIO', label: 'Médio porte' },
  { value: 'GRANDE', label: 'Grande porte' },
] as const

const SUGESTOES_DEMO = [
  'Indústria de suplementos alimentares nutracêuticos, médio porte, em São Paulo capital.',
  'Pequena indústria de cosméticos veganos, ME, em Curitiba (PR).',
  'Indústria química iniciante, médio porte, em Mauá (SP).',
  'Distribuidora de dispositivos médicos, ME, em Porto Alegre (RS).',
  'Posto de gasolina novo, EPP, interior de São Paulo.',
  'Pequeno restaurante no centro de Belo Horizonte.',
  'Mercadinho de bairro em Manaus (AM).',
]

export default function CotacaoPage() {
  return (
    <Suspense fallback={null}>
      <CotacaoPageInner />
    </Suspense>
  )
}

function CotacaoPageInner() {
  const searchParams = useSearchParams()
  const [perfil, setPerfil] = useState<PerfilEmpresa>({
    segmento: 'Indústria de alimentos',
    faturamentoAnual: 1_500_000,
    numeroFuncionarios: 25,
    estado: 'SP',
    municipio: 'São Paulo',
    porte: 'ME',
    observacoes: '',
  })
  const [mensagem, setMensagem] = useState('')
  const [cotacao, setCotacao] = useState<Cotacao | null>(null)
  const [respostaIA, setRespostaIA] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarPrompt, setMostrarPrompt] = useState(false)

  const licencasCatalogo = useMemo(() => [...LICENCAS, ...LICENCAS_MUNICIPAIS], [])

  useEffect(() => {
    const m = searchParams.get('municipio')
    if (m) setPerfil(p => ({ ...p, municipio: m }))
  }, [searchParams])

  const setField = <K extends keyof PerfilEmpresa>(key: K, value: PerfilEmpresa[K]) => {
    setPerfil(p => ({ ...p, [key]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    setRespostaIA(null)
    try {
      const res = await fetch('/api/cotacao', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ perfil, mensagem: mensagem || undefined }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.erro || 'Falha na cotação.')
      }
      const data = await res.json()
      setCotacao(data.cotacao)
      setRespostaIA(data.mensagemIA ?? null)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const usarSugestao = (s: string) => {
    setMensagem(s)
  }

  return (
    <>
      <section style={{ padding: '80px 0 40px' }}>
        <div className="wrap">
          <p className="eyebrow"><span className="glyph">ᚓ</span> Cotação com IA</p>
          <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.4rem)', lineHeight: 1.12, margin: '20px 0 24px' }}>
            Cotação de licenças com <span className="lit">IA</span>.
          </h1>
          <p className="lede" style={{ maxWidth: '46rem', fontSize: '1.1rem' }}>
            Conte sobre sua empresa. A IA cruza sua descrição com a base de conhecimento de ANVISA e CETESB e devolve uma lista personalizada de licenças, prazos, custos e risco regulatório.
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cot-grid">
            <form className="cot-form" onSubmit={submit}>
              <h3>Perfil da empresa</h3>
              <label>
                <span>Segmento</span>
                <input
                  required
                  value={perfil.segmento}
                  onChange={e => setField('segmento', e.target.value)}
                  placeholder="Indústria de cosméticos, posto de combustível..."
                />
              </label>
              <label>
                <span>Porte</span>
                <select value={perfil.porte} onChange={e => setField('porte', e.target.value as any)}>
                  {PORTE_OPCOES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </label>
              <div className="cot-row">
                <label>
                  <span>Estado</span>
                  <input
                    value={perfil.estado}
                    onChange={e => setField('estado', e.target.value)}
                    placeholder="SP"
                    maxLength={2}
                  />
                </label>
                <label>
                  <span>Município</span>
                  <input
                    value={perfil.municipio}
                    onChange={e => setField('municipio', e.target.value)}
                    placeholder="Município"
                  />
                </label>
              </div>
              <div className="cot-row">
                <label>
                  <span>Faturamento anual (R$)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={perfil.faturamentoAnual}
                    onChange={e => setField('faturamentoAnual', parseFloat(e.target.value) || 0)}
                  />
                </label>
                <label>
                  <span>Funcionários</span>
                  <input
                    type="number"
                    value={perfil.numeroFuncionarios}
                    onChange={e => setField('numeroFuncionarios', parseInt(e.target.value) || 0)}
                  />
                </label>
              </div>
              <label>
                <span>Observações</span>
                <textarea
                  rows={3}
                  value={perfil.observacoes}
                  onChange={e => setField('observacoes', e.target.value)}
                  placeholder="Linhas de produto, certificações atuais, próximos passos..."
                />
              </label>

              <h3 style={{ marginTop: 24 }}>Mensagem para a IA</h3>
              <label>
                <span>Conte com suas palavras o que a empresa faz:</span>
                <textarea
                  rows={4}
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  placeholder="Ex.: Fabricamos suplementos alimentares à base de proteínas vegetais e queremos lançar uma whey blend vegana. Hoje somos ME, temos 8 funcionários, em São Paulo capital."
                />
              </label>
              <div className="cot-suggest">
                <span>Ou use uma sugestão:</span>
                <div className="cot-suggest-buttons">
                  {SUGESTOES_DEMO.map((s, i) => (
                    <button key={i} type="button" onClick={() => usarSugestao(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="cot-actions">
                <button type="submit" className="btn btn-gold" disabled={carregando}>
                  {carregando ? 'Calculando…' : 'Gerar cotação com IA'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setMostrarPrompt(true)}>
                  Ver prompt usado
                </button>
              </div>

              {erro && <p className="cot-error">{erro}</p>}
              <p className="cot-disclaimer">
                Estimativa automatizada. Antes de investir, consulte um(a) consultor(a) regulatório(a) ou advogado(a) especializado.
              </p>
            </form>

            <div className="cot-result">
              {!cotacao && (
                <div className="cot-empty">
                  <h3>Aguardando sua cotação</h3>
                  <p>Preencha o perfil e clique em <strong>Gerar cotação com IA</strong>. O sistema vai cruzar a base de conhecimento e devolver as licenças relevantes, prazos e custos.</p>
                  <ul>
                    <li>Lista de licenças ANVISA e CETESB aplicáveis</li>
                    <li>Custo estimado mínimo, médio e máximo</li>
                    <li>Prazos realistas de análise</li>
                    <li>Justificativa e alertas regulatórios</li>
                    <li>Prompt pronto para você colar em outra IA</li>
                  </ul>
                </div>
              )}

              {cotacao && (
                <div className="cot-print">
                  <header>
                    <span className="lic-badge">Cotação #{cotacao.data.slice(0, 10)}</span>
                    <h3>Resumo da cotação</h3>
                  </header>

                  <div className="cot-metrics">
                    <div className="metric">
                      <span>Investimento estimado</span>
                      <strong>R$ {fmtBR(cotacao.custoTotal.medio)}</strong>
                      <em>R$ {fmtBR(cotacao.custoTotal.min)} — R$ {fmtBR(cotacao.custoTotal.max)}</em>
                    </div>
                    <div className="metric">
                      <span>Prazo total estimado</span>
                      <strong>{cotacao.prazoTotalDias} dias</strong>
                      <em>Sequencial (paralelização é possível)</em>
                    </div>
                    <div className="metric">
                      <span>Licenças</span>
                      <strong>{cotacao.itens.length}</strong>
                      <em>Essenciais + recomendadas</em>
                    </div>
                  </div>

                  {cotacao.cidadeDetected && (
                    <div className="cot-ia">
                      <h4>Município mapeado: {cotacao.cidadeDetected.nome}/{cotacao.cidadeDetected.uf}</h4>
                      <p style={{ marginBottom: 12, color: 'var(--mist)', fontSize: '.92rem' }}>{cotacao.cidadeDetected.obsAlvara}</p>
                      <ul className="cot-itens" style={{ margin: 0 }}>
                        <li className="prio-recomendada">
                          <strong>Alvará típico:</strong>
                          <span>{cotacao.cidadeDetected.alvaraNomes.join(', ')}</span>
                        </li>
                        {cotacao.cidadeDetected.alvaraSanitario && (
                          <li className="prio-recomendada">
                            <strong>Vigilância Sanitária local:</strong>
                            <span>{cotacao.cidadeDetected.alvaraSanitario}</span>
                          </li>
                        )}
                        <li className="prio-recomendada">
                          <strong>Bombeiros:</strong>
                          <span>{cotacao.cidadeDetected.bombeiros}</span>
                        </li>
                        <li className="prio-recomendada">
                          <strong>Prazo:</strong>
                          <span>{cotacao.cidadeDetected.prazoAlvara}</span>
                        </li>
                      </ul>
                      {cotacao.cidadeDetected.particularidades.length > 0 && (
                        <div className="cot-obs" style={{ marginTop: 14 }}>
                          <h4>Particularidades do município</h4>
                          <ul>
                            {cotacao.cidadeDetected.particularidades.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <ul className="cot-itens">
                    {cotacao.itens.map(i => (
                      <li key={i.licencaId} className={`prio-${i.prioridade}`}>
                        <div className="cot-item-head">
                          <strong>{i.sigla} — {i.nome}</strong>
                          <span className="prio-tag">{i.prioridade}</span>
                        </div>
                        <p>{i.justificativa}</p>
                        <div className="cot-item-meta">
                          <span>R$ {fmtBR(i.custoEstimado.min)} — R$ {fmtBR(i.custoEstimado.max)}</span>
                          <span>· {i.prazoEstimadoDias} dias</span>
                          <span>· {i.orgao}</span>
                        </div>
                        {i.alertas.length > 0 && (
                          <ul className="cot-item-alerts">
                            {i.alertas.map((a, idx) => <li key={idx}>{a}</li>)}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>

                  {cotacao.observacoes.length > 0 && (
                    <div className="cot-obs">
                      <h4>Observações</h4>
                      <ul>
                        {cotacao.observacoes.map((o, i) => <li key={i}>{o}</li>)}
                      </ul>
                    </div>
                  )}

                  {respostaIA && (
                    <div className="cot-ia">
                      <h4>Refinamento da IA</h4>
                      <pre>{respostaIA}</pre>
                    </div>
                  )}

                  <details className="cot-prompt">
                    <summary>Ver prompt estruturado (copie para outra IA)</summary>
                    <pre>{cotacao.promptIA}</pre>
                  </details>

                  <details className="cot-prompt">
                    <summary>Catálogo completo (JSON)</summary>
                    <pre>{JSON.stringify(licencasCatalogo, null, 2)}</pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {mostrarPrompt && (
        <div className="cot-modal" role="dialog" aria-modal="true" onClick={() => setMostrarPrompt(false)}>
          <div className="cot-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="cot-modal-close" onClick={() => setMostrarPrompt(false)} aria-label="Fechar">×</button>
            <h3>Prompt usado pela IA</h3>
            <p>O modelo local monta este prompt combinando seu perfil e a base de conhecimento. Cole-o no ChatGPT, Claude, Gemini ou qualquer outra IA para obter uma análise adicional.</p>
            <pre>{cotacao?.promptIA || 'A cotação ainda não foi gerada. Clique em "Gerar cotação com IA" e o prompt será mostrado.'}</pre>
          </div>
        </div>
      )}

      <section className="cta-final">
        <div className="wrap reveal">
          <p className="eyebrow"><span className="glyph">ᚂ</span> Saber mais</p>
          <h2>Voltar para a base de conhecimento</h2>
          <p>Consulte as licenças individualmente, com detalhes, fundamentação legal e links oficiais.</p>
          <Link className="btn btn-gold" href="/conhecimento/licenciamento">Ir para a base</Link>
        </div>
      </section>
    </>
  )
}
