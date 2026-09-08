'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { LICENCAS, METADADOS } from '@/lib/licensing/conhecimento'
import { LICENCAS_MUNICIPAIS, CIDADES_CONHEBIDAS, buscarCidade } from '@/lib/licensing/municipais'
import type { Licenca, Orgao } from '@/lib/licensing/types'

function fmtBR(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const LICENCAS_TOTAL: Licenca[] = [...LICENCAS, ...LICENCAS_MUNICIPAIS]

export default function LicenciamentoPage() {
  const [orgao, setOrgao] = useState<Orgao | 'TODOS'>('TODOS')
  const [busca, setBusca] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [selecionada, setSelecionada] = useState<Licenca | null>(LICENCAS_TOTAL[0] ?? null)

  const licencas = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return LICENCAS_TOTAL.filter(l => {
      if (orgao !== 'TODOS' && l.orgao !== orgao) return false
      if (!t) return true
      return (
        l.sigla.toLowerCase().includes(t) ||
        l.nome.toLowerCase().includes(t) ||
        l.tags.some(tag => tag.toLowerCase().includes(t))
      )
    })
  }, [orgao, busca])

  const cidadeDetectada = useMemo(() => {
    const m = municipio.trim()
    if (!m) return null
    return buscarCidade(m)
  }, [municipio])

  const meta = METADADOS

  return (
    <>
      <section style={{ padding: '80px 0 40px' }}>
        <div className="wrap">
          <p className="eyebrow"><span className="glyph">ᚓ</span> Base de conhecimento</p>
          <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.4rem)', lineHeight: 1.12, margin: '20px 0 24px' }}>
            Licenças <span className="lit">ANVISA</span> e <span className="lit">CETESB</span>: o mapa completo.
          </h1>
          <p className="lede" style={{ maxWidth: '46rem', fontSize: '1.1rem' }}>
            Base de conhecimento viva sobre licenciamento sanitário e ambiental. Requisitos, documentos, prazos, custos estimados e fundamentação legal — cruzados com a IA para gerar a cotação da sua empresa.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link className="btn btn-gold" href="/conhecimento/cotacao">Gerar cotação com IA</Link>
            <a className="btn btn-ghost" href="#licencas">Ver licenças</a>
          </div>
        </div>
      </section>

      <section className="section-pad" id="orgaos">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚂ</span> Orgãos</p>
            <h2>Quatro orgãos, uma jornada integrada.</h2>
            <p>Federal, estadual, municipal e bombeiros — sincronize as licenças para evitar interdições.</p>
          </div>
          <div className="cards reveal">
            {meta.map(m => (
              <article key={m.orgao} className="card">
                <h3>{m.orgao}</h3>
                <p>{m.resumo}</p>
                <ul style={{ marginTop: 14 }}>
                  {m.itens.slice(0, 5).map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className="card-tag">{m.totalLicencas} licenças / autorizações</span>
                </div>
                {m.urlOficial && (
                  <div style={{ marginTop: 22 }}>
                    <a className="btn btn-ghost" href={m.urlOficial} target="_blank" rel="noopener noreferrer">
                      Portal oficial
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" id="municipio" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚏ</span> Município</p>
            <h2>Filtre pelo seu município para ver as particularidades.</h2>
            <p>Mapeamos 20 cidades com regras específicas de Alvará de Funcionamento, Vigilância Sanitária municipal, Corpo de Bombeiros e Tributos.</p>
          </div>
          <div className="lic-controlbar reveal">
            <div className="lic-search" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Sua cidade (São Paulo, Curitiba, Rio de Janeiro, Belo Horizonte, Campinas, Manaus, Salvador, Brasília...)"
                value={municipio}
                onChange={e => setMunicipio(e.target.value)}
              />
            </div>
          </div>
          {cidadeDetectada && (
            <div className="cot-ia reveal" style={{ marginTop: 10 }}>
              <h4>{cidadeDetectada.info.nome}/{cidadeDetectada.info.uf}</h4>
              <p style={{ color: 'var(--mist)', marginBottom: 12, fontSize: '.95rem' }}>{cidadeDetectada.info.obsAlvara}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><strong>Alvará típico:</strong> {cidadeDetectada.info.alvaraNomes.join(', ')}</li>
                <li><strong>Prazo:</strong> {cidadeDetectada.info.prazoAlvara}</li>
                {cidadeDetectada.info.alvaraSanitario && (
                  <li><strong>Vigilância Sanitária local:</strong> {cidadeDetectada.info.alvaraSanitario}</li>
                )}
                <li><strong>Bombeiros:</strong> {cidadeDetectada.info.bombeiros}</li>
              </ul>
              <div style={{ marginTop: 14 }}>
                <strong>Particularidades:</strong>
                <ul style={{ marginTop: 6 }}>
                  {cidadeDetectada.info.particularidades.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div style={{ marginTop: 18 }}>
                <Link className="btn btn-gold" href={`/conhecimento/cotacao?municipio=${encodeURIComponent(cidadeDetectada.info.nome)}`}>
                  Gerar cotação para {cidadeDetectada.info.nome}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-pad" id="licencas" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚉ</span> Catálogo</p>
            <h2>Catálogo de licenças</h2>
            <p>Filtre por orgão ou pesquise por sigla, nome ou tag. Selecione uma licença para abrir os detalhes.</p>
          </div>

          <div className="lic-controlbar reveal">
            <div className="lic-filters">
              {(['TODOS', 'ANVISA', 'CETESB', 'MUNICIPAL', 'BOMBEIROS'] as const).map(o => (
                <button
                  key={o}
                  className={`lic-filter ${orgao === o ? 'is-active' : ''}`}
                  onClick={() => setOrgao(o)}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="lic-search">
              <input
                type="text"
                placeholder="Pesquisar por sigla, nome ou tag..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="lic-grid reveal">
            <div className="lic-list">
              {licencas.length === 0 && (
                <div className="lic-empty">Nenhuma licença encontrada para esse filtro.</div>
              )}
              {licencas.map(l => {
                const active = selecionada?.id === l.id
                return (
                  <button
                    key={l.id}
                    className={`lic-item ${active ? 'is-active' : ''}`}
                    onClick={() => setSelecionada(l)}
                  >
                    <span className="lic-item-orgao">{l.orgao}</span>
                    <span className="lic-item-body">
                      <strong>{l.sigla}</strong>
                      <span>{l.nome}</span>
                    </span>
                    <span className="lic-item-arrow" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>

            <div className="lic-detail">
              {!selecionada && (
                <div className="lic-empty">Selecione uma licença para ver os detalhes.</div>
              )}
              {selecionada && (
                <article className="lic-card">
                  <header>
                    <span className="lic-badge">{selecionada.orgao}</span>
                    <h3>{selecionada.sigla} — {selecionada.nome}</h3>
                    <p>{selecionada.resumo}</p>
                  </header>

                  <section>
                    <h4>Descrição</h4>
                    <p>{selecionada.descricao}</p>
                  </section>

                  <section>
                    <h4>Público-alvo</h4>
                    <ul>
                      {selecionada.publicoAlvo.map(p => <li key={p}>{p}</li>)}
                    </ul>
                  </section>

                  <section>
                    <h4>Requisitos</h4>
                    <ul>
                      {selecionada.requisitos.map(r => <li key={r}>{r}</li>)}
                    </ul>
                  </section>

                  <section>
                    <h4>Documentos</h4>
                    <ul className="lic-doc-list">
                      {selecionada.documentos.map((d, i) => (
                        <li key={i} className={d.obrigatorio ? 'obrigatorio' : 'opcional'}>
                          <strong>{d.obrigatorio ? 'Obrigatório' : 'Recomendado'}</strong>
                          <span>{d.nome}</span>
                          <em>{d.descricao}</em>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4>Prazos</h4>
                    <div className="lic-prazos">
                      <div>
                        <span>Análise</span>
                        <strong>{selecionada.prazos.analise}</strong>
                      </div>
                      <div>
                        <span>Validade</span>
                        <strong>{selecionada.prazos.validade}</strong>
                      </div>
                      {selecionada.prazos.observacao && (
                        <div className="lic-przobs">
                          <span></span>
                          <em>{selecionada.prazos.observacao}</em>
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4>Custos estimados</h4>
                    <table className="lic-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Min.</th>
                          <th>Máx.</th>
                          <th>Unidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selecionada.custos.map((c, i) => (
                          <tr key={i}>
                            <td>
                              {c.descricao}
                              {c.observacao && <em>{c.observacao}</em>}
                            </td>
                            <td>R$ {fmtBR(c.valorMin)}</td>
                            <td>R$ {fmtBR(c.valorMax)}</td>
                            <td>{c.unidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  <section>
                    <h4>Fundamentação legal</h4>
                    <ul>
                      {selecionada.fundamentacaoLegal.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </section>

                  <section>
                    <h4>Exemplos de aplicação</h4>
                    <ul>
                      {selecionada.exemplosAplicacao.map(e => <li key={e}>{e}</li>)}
                    </ul>
                  </section>

                  <footer>
                    <a className="btn btn-ghost" href={selecionada.urlOficial} target="_blank" rel="noopener noreferrer">
                      Fonte oficial
                    </a>
                    <Link className="btn btn-gold" href={`/conhecimento/cotacao?lic=${selecionada.id}`}>
                      Incluir na cotação
                    </Link>
                  </footer>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="wrap reveal">
          <p className="eyebrow"><span className="glyph">ᚐ</span> Próximo passo</p>
          <h2>Pronto para um orçamento inteligente para sua empresa?</h2>
          <p>Nossa IA combina a base de conhecimento acima com o seu perfil para gerar uma cotação de licenças com prazos, custos e justificativas.</p>
          <Link className="btn btn-gold" href="/conhecimento/cotacao">Gerar cotação com IA</Link>
        </div>
      </section>
    </>
  )
}
