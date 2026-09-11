'use client'

import Link from 'next/link'
import ContactForm from '@/components/contato/ContactForm'
import { useOghamNumerals, useOghamStrips } from '@/lib/ogham'

export default function DossieSocietarioPage() {
  useOghamNumerals()
  useOghamStrips()

  const indicacoes = [
    'Identificar quem eram os sócios e administradores em determinado período histórico',
    'Localizar contratos sociais, alterações contratuais, atas e outros atos arquivados',
    'Reconstruir mudanças no capital social e na participação societária',
    'Verificar alterações de endereço, objeto social (CNAE) ou denominação empresarial ao longo do tempo',
    'Conferir informações apresentadas pela empresa com os registros oficiais disponíveis',
    'Organizar documentos para processos judiciais, administrativos ou arbitrais',
    'Preparar análise preliminar antes da compra, venda ou entrada em uma sociedade (due diligence)',
    'Levantar informações para inventário, partilha, dissolução societária ou apuração de haveres',
    'Conhecer a fundo o histórico de cliente, fornecedor, parceiro comercial ou devedor',
    'Identificar lacunas documentais que ainda precisam ser regularizadas ou solicitadas aos órgãos',
  ]

  const oQuePodeSerPesquisado = [
    'Comprovante de inscrição e situação cadastral no CNPJ',
    'Fichas cadastrais completas disponíveis na Junta Comercial',
    'Contrato social original ou requerimento de empresário',
    'Todas as alterações contratuais registradas',
    'Atas de assembleias e reuniões de sócios/acionistas arquivadas',
    'Certidões simplificadas, específicas e de inteiro teor',
    'Histórico cronológico de sócios e administradores',
    'Evolução e alterações do capital social',
    'Mudanças de endereço físico, atividade econômica (CNAE) e denominação',
    'Documentos societários complementares fornecidos pelo cliente',
    'Informações adicionais disponíveis em fontes públicas oficiais',
  ]

  const entregaveis = [
    'Relatório executivo de identificação da empresa pesquisada',
    'Linha do tempo estruturada dos principais acontecimentos societários',
    'Relação detalhada dos sócios e administradores em cada período histórico',
    'Quadro comparativo das alterações de capital social e cláusulas',
    'Índice cronológico dos documentos localizados',
    'Cópias digitais em alta resolução dos documentos obtidos',
    'Relação das fontes e órgãos oficiais consultados',
    'Apontamento analítico de divergências cadastrais ou documentais',
    'Lista de documentos não localizados ou que dependem de autorização',
    'Observações técnicas direcionadas à finalidade informada pelo cliente',
  ]

  const etapas = [
    {
      num: 1,
      titulo: 'Definição do objetivo',
      desc: 'Identificamos o que o cliente precisa esclarecer e quais informações e períodos serão relevantes para o trabalho.',
    },
    {
      num: 2,
      titulo: 'Identificação da empresa',
      desc: 'Confirmamos os dados cadastrais (CNPJ, NIRE, filiais) e os órgãos estaduais onde os atos deverão ser pesquisados.',
    },
    {
      num: 3,
      titulo: 'Pesquisa documental',
      desc: 'Consultamos as fontes aplicáveis e solicitamos as certidões ou cópias necessárias. Atos restritos dependem de autorização do titular.',
    },
    {
      num: 4,
      titulo: 'Organização e conferência',
      desc: 'Classificamos os documentos, construímos a cronologia visual e destacamos eventuais divergências ou lacunas registrais.',
    },
    {
      num: 5,
      titulo: 'Entrega do dossiê',
      desc: 'O cliente recebe o relatório analítico e todos os documentos organizados em formato digital padronizado.',
    },
  ]

  const modalidades = [
    {
      tag: 'Visão Essencial',
      nome: 'Dossiê cadastral básico',
      desc: 'Visão atual e consolidada da empresa: situação cadastral, atividades econômicas vigentes, endereço, quadro societário presente e certidões públicas essenciais.',
    },
    {
      tag: 'Linha do Tempo Completa',
      nome: 'Histórico societário completo',
      desc: 'Reconstrução cronológica de todos os atos registrados desde a constituição: alterações de sócios, administradores, capital social, endereços e objetos sociais.',
    },
    {
      tag: 'Instrução Probatória',
      nome: 'Dossiê para advogado ou perito',
      desc: 'Organização dos documentos societários estritamente correlacionados ao objeto do processo ou laudo técnico, com cronologia e índice de evidências.',
    },
    {
      tag: 'M&A e Investimento',
      nome: 'Dossiê para negociação empresarial',
      desc: 'Levantamento focado em auditoria preliminar (pre-due diligence) para entrada de novos sócios, aquisição de quotas/ações ou avaliação de solidez de parceiros comerciais.',
    },
  ]

  const quemContrata = [
    { papel: 'Empresários e Sócios', desc: 'Que necessitam auditar ou recompor seus próprios registros societários e certidões históricas.' },
    { papel: 'Herdeiros e Inventariantes', desc: 'Em processos de partilha, espólio e apuração de haveres que exigem reconstrução formal.' },
    { papel: 'Advogados e Jurídico', desc: 'Departamentos jurídicos e escritórios que precisam instruir ações judiciais ou defesas administrativas.' },
    { papel: 'Peritos Judiciais', desc: 'Que demandam organização documental e cronológica rigorosa para fundamentação de laudos técnicos.' },
    { papel: 'Investidores e Compradores', desc: 'Em processos de auditoria preliminar, M&A e avaliação de riscos pré-contratuais.' },
    { papel: 'Empresas em Compliance', desc: 'Que realizam conferência minuciosa de parceiros, fornecedores estratégicos ou devedores.' },
  ]

  return (
    <>
      {/* HERO SECTION */}
      <section className="serv-hero">
        <div className="wrap">
          <div style={{ marginBottom: 28 }}>
            <Link
              href="/#solucoes"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '12px',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-56)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color .2s',
              }}
            >
              ← Voltar às Soluções
            </Link>
          </div>

          <div className="serv-hero-grid">
            <div>
              <p className="eyebrow">
                <span className="glyph">᚛</span> Inteligência Societária & Investigação Registral <span className="glyph">᚜</span>
              </p>
              <h1>
                Dossiê Societário e <span className="lit">Histórico Empresarial</span>
              </h1>
              <p className="lede">
                Reconstruímos o histórico formal da empresa por meio de atos societários, registros cadastrais e certidões oficiais. A entrega inclui linha do tempo cronológica, acervo digital estruturado e apontamento analítico de divergências ou lacunas documentais.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 32, alignItems: 'center' }}>
                <a className="btn btn-gold" href="#solicitar">
                  Solicitar Análise de Dossiê
                </a>
                <a className="btn btn-ghost" href="#como-funciona">
                  Conhecer o Método Operacional
                </a>
              </div>
            </div>

            {/* CARD DE SÍNTESE DO ESCOPO */}
            <div
              className="card"
              style={{
                padding: '38px 34px',
                background: 'var(--surface)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              <span className="card-tag">Síntese do Escopo</span>
              <h3 style={{ fontSize: '1.45rem', margin: '14px 0 10px', color: 'var(--ink)' }}>
                Rastreabilidade e Segurança Jurídica
              </h3>
              <p style={{ fontSize: '0.94rem', color: 'var(--ink-72)', lineHeight: 1.68 }}>
                O dossiê consolida certidões de inteiro teor, alterações contratuais arquivadas nas Juntas Comerciais e dados cadastrais da Receita Federal em uma visão única, cronológica e auditável.
              </p>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line-soft)' }}>
                <span style={{ fontSize: '12.5px', letterSpacing: '.04em', color: 'var(--gold-text)', fontWeight: 600, display: 'block', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  ✦ Atendimento em todo o território nacional
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE MÉTRICAS / DESTAQUES */}
          <div className="serv-stats-bar">
            <div className="serv-stat-item">
              <span className="serv-stat-num">100%</span>
              <span className="serv-stat-label">Fontes Oficiais</span>
              <span className="serv-stat-desc">Juntas Comerciais, Receita Federal, Cartórios de RTD e Diários Oficiais.</span>
            </div>
            <div className="serv-stat-item">
              <span className="serv-stat-num">Integral</span>
              <span className="serv-stat-label">Linha do Tempo</span>
              <span className="serv-stat-desc">Reconstituição rigorosa de alterações societárias, sócios e capital social.</span>
            </div>
            <div className="serv-stat-item">
              <span className="serv-stat-num">Sigilo</span>
              <span className="serv-stat-label">Conformidade LGPD</span>
              <span className="serv-stat-desc">Procedimentos estritamente confidenciais sob sigilo e fé pública.</span>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP DECORATIVA OGHAM */}
      <div className="ogham-strip" aria-hidden="true" style={{ margin: '10px 0 40px' }}>
        <svg></svg>
      </div>

      {/* QUANDO É INDICADO */}
      <section className="section-pad" id="indicacoes">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚑ</span> Casos de Aplicação</p>
            <h2>Quando a elaboração do dossiê é indicada?</h2>
            <p>Cenários operacionais, jurídicos e corporativos onde a clareza registral define o desfecho da demanda.</p>
          </div>

          <div className="serv-indicator-grid">
            {indicacoes.map((item, idx) => (
              <div key={idx} className="serv-indicator-card reveal">
                <span className="serv-indicator-num">{String(idx + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESCOPO: O QUE PODE SER PESQUISADO vs O QUE VOCÊ RECEBE */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚔ</span> Matriz de Cobertura</p>
            <h2>Fontes consultadas e entregáveis analíticos</h2>
            <p>Estrutura comparativa entre o universo de registros pesquisados e o dossiê executivo final.</p>
          </div>

          <div className="serv-dual-grid">
            
            {/* O QUE PODE SER PESQUISADO */}
            <div className="serv-scope-card reveal">
              <div className="serv-scope-head">
                <div className="serv-scope-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 4 }}><span className="glyph">ᚄ</span> Fontes e Registros</p>
                  <h3 style={{ fontSize: '1.75rem', margin: 0 }}>O que pode ser pesquisado?</h3>
                </div>
              </div>

              <ul className="serv-check-list">
                {oQuePodeSerPesquisado.map((item, idx) => (
                  <li key={idx} className="serv-check-item">
                    <span className="serv-check-dot"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--void)', borderRadius: '18px', borderLeft: '3px solid var(--emerald)' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-56)', lineHeight: 1.62, margin: 0 }}>
                  <em>Observação:</em> A relação definitiva dos documentos é estabelecida de acordo com a finalidade do levantamento, a disponibilidade das informações e o estado de registro da empresa.
                </p>
              </div>
            </div>

            {/* O QUE VOCÊ RECEBE */}
            <div className="serv-scope-card is-gold reveal">
              <div className="serv-scope-head">
                <div className="serv-scope-icon is-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ color: 'var(--gold-text)', marginBottom: 4 }}><span className="glyph">ᚂ</span> Entregáveis Oficiais</p>
                  <h3 style={{ fontSize: '1.75rem', margin: 0 }}>O que você recebe?</h3>
                </div>
              </div>

              <ul className="serv-check-list">
                {entregaveis.map((item, idx) => (
                  <li key={idx} className="serv-check-item">
                    <span className="serv-check-dot is-gold"></span>
                    <span style={{ color: 'var(--ink)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (ETAPAS) */}
      <section className="section-pad" id="como-funciona">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚋ</span> Método Operacional</p>
            <h2>Como funciona a elaboração do dossiê?</h2>
            <p>Processo em cinco etapas para garantir rastreabilidade analítica, rigor técnico e sigilo documental.</p>
          </div>

          <div className="steps reveal">
            {etapas.map(etapa => (
              <div key={etapa.num} className="step">
                <div className="ogham-num" data-strokes={etapa.num} aria-hidden="true"></div>
                <span className="step-name">Fase 0{etapa.num} de 05</span>
                <h3>{etapa.titulo}</h3>
                <p>{etapa.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="section-pad" id="modalidades" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚉ</span> Escopos de Atendimento</p>
            <h2>Modalidades do serviço</h2>
            <p>Formatos desenhados para atender desde checagens cadastrais rápidas até instrução probatória complexa.</p>
          </div>

          <div className="cards">
            {modalidades.map((m, idx) => (
              <article key={idx} className="card reveal" style={{ background: 'var(--void)' }}>
                <span className="card-tag">{m.tag}</span>
                <h3>{m.nome}</h3>
                <p style={{ marginTop: 16 }}>{m.desc}</p>
                <div style={{ marginTop: 28 }}>
                  <a className="btn btn-ghost" href="#solicitar">
                    Solicitar esta modalidade
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* QUEM PODE CONTRATAR */}
      <section className="section-pad">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚐ</span> Público Atendido</p>
            <h2>Quem pode contratar o dossiê?</h2>
            <p>Atendemos pessoas físicas, empresas, escritórios de advocacia e peritos em todo o Brasil.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {quemContrata.map((item, idx) => (
              <div
                key={idx}
                className="card reveal"
                style={{ padding: '28px 30px', borderRadius: '28px' }}
              >
                <span className="card-tag" style={{ marginBottom: 12 }}>{item.papel}</span>
                <p style={{ fontSize: '0.95rem', color: 'var(--ink-72)', lineHeight: 1.64, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* OBSERVAÇÕES TÉCNICAS E LEGAIS */}
          <div
            className="reveal"
            style={{
              marginTop: 56,
              padding: '36px 40px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'inset 0 0 0 1px var(--line-soft)',
              borderLeft: '4px solid var(--gold)',
            }}
          >
            <p className="eyebrow" style={{ color: 'var(--gold-text)', marginBottom: 12 }}>
              <span className="glyph">ᚔ</span> Observações Técnicas e Legais
            </p>
            <p style={{ fontSize: '0.96rem', color: 'var(--ink-72)', lineHeight: 1.8, margin: 0 }}>
              A disponibilidade dos documentos depende do órgão responsável, do período pesquisado e da existência de registros digitalizados nos arquivos públicos. Taxas de cartórios, juntas comerciais e demais órgãos emissores são apresentadas de forma transparente e separadamente dos honorários profissionais. Quando o caso exigir interpretação jurídica, registral ou processual, o trabalho poderá ser desenvolvido em estreita cooperação com o advogado responsável pelo caso.
            </p>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL & FORMULÁRIO */}
      <section className="cta-final" id="solicitar" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: '44rem', margin: '0 auto 56px' }}>
            <p className="eyebrow"><span className="glyph">ᚑ</span> Solicitação de Análise</p>
            <h2>Precisa conhecer o histórico de uma empresa?</h2>
            <p>
              Envie o CNPJ e informe o objetivo da pesquisa. Avaliaremos o caso com discrição e apresentaremos o escopo preliminar, o prazo estimado e os documentos recomendados.
            </p>
          </div>

          <ContactForm
            servicoInicial="Dossiê Societário e Histórico Empresarial"
            titulo="Solicitar Análise do Dossiê"
            subtitulo="Informe os dados da empresa e a finalidade da pesquisa para receber o escopo preliminar."
          />
        </div>
      </section>
    </>
  )
}
