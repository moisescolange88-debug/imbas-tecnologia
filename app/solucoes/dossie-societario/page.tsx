'use client'

import Link from 'next'
import ContactForm from '@/components/contato/ContactForm'

export default function DossieSocietarioPage() {
  const indicacoes = [
    'Identificar quem eram os sócios e administradores em determinado período',
    'Localizar contratos sociais, alterações contratuais, atas e outros atos arquivados',
    'Reconstruir mudanças no capital social e na participação societária',
    'Verificar alterações de endereço, objeto social ou nome empresarial ao longo do tempo',
    'Conferir informações apresentadas pela empresa com os registros oficiais disponíveis',
    'Organizar documentos para processos judiciais, administrativos ou arbitrais',
    'Preparar análise preliminar antes da compra, venda ou entrada em uma sociedade',
    'Levantar informações para inventário, dissolução societária ou apuração de haveres',
    'Conhecer a fundo histórico de cliente, fornecedor, parceiro comercial ou devedor',
    'Identificar lacunas documentais que ainda precisam ser regularizadas ou solicitadas',
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
      tag: 'Especializado',
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
    'Empresários e sócios que necessitam auditar ou recompor seus próprios registros',
    'Herdeiros, inventariantes e gestores de espólio em partilhas',
    'Advogados e escritórios jurídicos preparando ações societárias ou defesas',
    'Peritos contábeis e assistentes técnicos formulando quesitos e laudos',
    'Investidores, fundos e compradores de empresas em fase de negociação',
    'Credores e empresas em processos de recuperação de crédito ou execução',
    'Departamentos jurídicos e financeiros de grandes corporações',
    'Empresas que desejam homologar ou conhecer a fundo parceiros e fornecedores',
  ]

  return (
    <>
      {/* HERO */}
      <section style={{ padding: '100px 0 60px', position: 'relative' }}>
        <div className="wrap">
          <p className="eyebrow"><span className="glyph">ᚑ</span> Inteligência Societária</p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.08, margin: '20px 0 24px' }}>
            Dossiê Societário e Histórico Empresarial
          </h1>
          <p className="lede" style={{ maxWidth: '44rem', fontSize: '1.2rem', color: 'var(--ink-72)' }}>
            Conheça a trajetória registral da empresa e encontre as informações necessárias para tomar decisões com mais segurança.
          </p>
          <div className="hero-actions" style={{ marginTop: 36 }}>
            <a className="btn btn-gold" href="#solicitar">Solicitar análise do dossiê</a>
            <a className="btn btn-ghost" href="#modalidades">Conhecer modalidades</a>
          </div>
        </div>
      </section>

      {/* TEXTO DE ABERTURA */}
      <section className="section-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="wrap">
          <div style={{ maxWidth: '46rem', margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}><span className="glyph">ᚔ</span> Contexto & Finalidade</p>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', lineHeight: 1.1, marginBottom: 28 }}>
              O histórico formal de uma sociedade, revelado com precisão documental.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: '1.08rem', lineHeight: 1.8, color: 'var(--ink-72)' }}>
              <p>
                O <strong>Dossiê Societário</strong> é um levantamento organizado dos documentos e acontecimentos registrados ao longo da existência de uma empresa.
              </p>
              <p>
                O serviço reúne informações cadastrais, atos constitutivos, alterações contratuais e mudanças relevantes no quadro societário e na administração. Os documentos encontrados são apresentados de forma estruturada, acompanhados de uma linha do tempo e de um relatório com divergências, lacunas documentais e pontos que mereçam verificação.
              </p>
              <p>
                Esse levantamento pode ser utilizado em negociações empresariais, conflitos entre sócios, inventários, cobranças, análises de fornecedores, preparação de processos e outras situações que exijam compreender o histórico formal de uma sociedade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUANDO É INDICADO */}
      <section className="section-pad">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚁ</span> Aplicações Práticas</p>
            <h2>Quando este serviço é indicado?</h2>
            <p>Situações em que o acesso a dados societários pretéritos e conferidos é indispensável.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {indicacoes.map((item, idx) => (
              <div
                key={idx}
                className="card reveal"
                style={{ padding: '28px 30px', borderRadius: '32px' }}
              >
                <span style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', display: 'block', marginBottom: 10 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '0.98rem', color: 'var(--ink)', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE PODE SER PESQUISADO & ENTREGÁVEIS */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'start' }}>
            
            {/* O QUE PODE SER PESQUISADO */}
            <div className="reveal">
              <p className="eyebrow"><span className="glyph">ᚄ</span> Fontes e Registros</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', margin: '18px 0 24px' }}>
                O que pode ser pesquisado?
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {oQuePodeSerPesquisado.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      paddingLeft: 24,
                      position: 'relative',
                      fontSize: '0.98rem',
                      color: 'var(--ink-72)',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ position: 'absolute', left: 0, top: '0.6em', width: 8, height: 2, background: 'var(--emerald)' }}></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--void)', borderRadius: '16px', borderLeft: '3px solid var(--gold)' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-56)', lineHeight: 1.6, margin: 0 }}>
                  <em>Observação:</em> A relação definitiva dos documentos é estabelecida de acordo com a finalidade do levantamento, a disponibilidade das informações e o estado de registro da empresa.
                </p>
              </div>
            </div>

            {/* O QUE VOCÊ RECEBE */}
            <div className="reveal">
              <p className="eyebrow"><span className="glyph">ᚂ</span> Entregáveis</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', margin: '18px 0 24px' }}>
                O que você recebe?
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {entregaveis.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      paddingLeft: 24,
                      position: 'relative',
                      fontSize: '0.98rem',
                      color: 'var(--ink-72)',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ position: 'absolute', left: 0, top: '0.6em', width: 8, height: 2, background: 'var(--gold)' }}></span>
                    {item}
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
            <p>Processo em cinco etapas para garantir rastreabilidade, rigor técnico e sigilo documental.</p>
          </div>
          <div className="steps reveal" style={{ borderLeft: '1px solid var(--line-soft)' }}>
            {etapas.map(etapa => (
              <div key={etapa.num} className="step">
                <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>
                  Etapa {etapa.num}
                </div>
                <span className="step-name">Fase {etapa.num} de 5</span>
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
            <p className="eyebrow"><span className="glyph">ᚉ</span> Escopos</p>
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
                  <a className="btn btn-ghost" href="#solicitar">Solicitar esta modalidade</a>
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
            <h2>Quem pode contratar?</h2>
            <p>Atendemos pessoas físicas, empresas e profissionais técnicos em todo o território nacional.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {quemContrata.map((item, idx) => (
              <div
                key={idx}
                className="card reveal"
                style={{ padding: '24px 26px', borderRadius: '28px' }}
              >
                <p style={{ fontSize: '0.95rem', color: 'var(--ink-72)', lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                    {item.split(' ')[0]}
                  </strong>
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* OBSERVAÇÕES IMPORTANTES */}
          <div
            className="reveal"
            style={{
              marginTop: 64,
              padding: '32px 36px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--line-soft)',
            }}
          >
            <p className="eyebrow" style={{ color: 'var(--ink-56)', marginBottom: 12 }}>
              Observações Técnicas e Legais
            </p>
            <p style={{ fontSize: '0.96rem', color: 'var(--ink-72)', lineHeight: 1.8, margin: 0 }}>
              A disponibilidade dos documentos depende do órgão responsável, do período pesquisado e da existência de registros digitalizados. Taxas de cartórios, juntas comerciais e demais órgãos são apresentadas separadamente dos honorários do serviço. Quando o caso exigir interpretação jurídica, registral ou processual, o trabalho poderá ser desenvolvido em conjunto com o advogado responsável.
            </p>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL & FORMULÁRIO */}
      <section className="cta-final" id="solicitar" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: '42rem', margin: '0 auto 56px' }}>
            <p className="eyebrow"><span className="glyph">ᚑ</span> Solicitação</p>
            <h2>Precisa conhecer o histórico de uma empresa?</h2>
            <p>
              Envie o CNPJ e informe o objetivo da pesquisa. Avaliaremos o caso e apresentaremos o escopo, o prazo e os documentos recomendados.
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
