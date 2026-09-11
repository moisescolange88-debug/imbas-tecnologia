'use client'

import Link from 'next/link'
import ContactForm from '@/components/contato/ContactForm'
import { useOghamNumerals, useOghamStrips } from '@/lib/ogham'

export default function GestaoDocumentalPage() {
  useOghamNumerals()
  useOghamStrips()

  const indicacoes = [
    'Empresas que pretendem fornecer para indústrias, hospitais, condomínios, redes varejistas ou grandes grupos empresariais',
    'Empresas que precisam preencher portais de homologação e qualificação de fornecedores',
    'Participantes ativos de processos de cotação, contratação, concorrência comercial e RFPs',
    'Fornecedores com múltiplos clientes e exigências documentais simultâneas e divergentes',
    'Empresas que enfrentam vencimentos frequentes de certidões e retrabalho na renovação periódica',
    'Empresas com bloqueios cadastrais periódicos ou atrasos no faturamento e recebimento de notas fiscais',
    'Interessados em organizar e manter permanentemente regularizada a documentação para contratações públicas',
    'Empresas que desejam centralizar o controle documental e eliminar pastas dispersas e desatualizadas',
  ]

  const oQueFazemos = [
    'Levantamento criterioso das exigências de cada cliente, contrato ou portal homologador',
    'Elaboração de checklist personalizado por cliente ou edital de compras',
    'Organização de documentos societários, fiscais e cadastrais vigentes',
    'Conferência analítica dos dados apresentados nos documentos e contratos',
    'Emissão sistemática de certidões disponíveis em portais oficiais federais, estaduais e municipais',
    'Controle rigoroso de prazos de validade e calendário de vencimentos com alerta prévio',
    'Registro e acompanhamento proativo das pendências fiscais ou cadastrais identificadas',
    'Organização de balanços, demonstrações contábeis e índices econômico-financeiros solicitados',
    'Preparação do conjunto documental completo e padronizado para submissão ágil',
    'Atualização periódica dos documentos em portais autorizados de clientes',
    'Acompanhamento contínuo do status de aprovação de cada cadastro corporativo',
    'Organização documental completa para o SICAF (níveis I a VI), quando aplicável',
    'Relatório executivo periódico de documentos válidos, próximos do vencimento e pendentes',
  ]

  const documentosAcompanhados = [
    'Cartão do CNPJ atualizado',
    'Contrato social consolidado e alterações arquivadas',
    'Certidões simplificadas e específicas da Junta Comercial',
    'Inscrições estadual e municipal ativas',
    'Alvarás de funcionamento e licenças sanitárias e ambientais',
    'Certidões de regularidade fiscal federais (Receita e PGFN)',
    'Certidões de regularidade fiscal estaduais',
    'Certidões de tributos municipais',
    'Certificado de Regularidade do FGTS (CRF)',
    'Certidão Negativa de Débitos Trabalhistas (CNDT)',
    'Balanço patrimonial e demonstrações contábeis (DRE)',
    'Índices de qualificação econômico-financeira (Liquidez e Solvência)',
    'Comprovantes bancários e dados de faturamento homologados',
    'Declarações específicas de conformidade e compliance',
    'Registros e certidões em conselhos de classe profissionais',
    'Apólices de seguro vigentes e atestados de capacidade técnica',
  ]

  const beneficios = [
    'Menor risco de perder prazos documentais e oportunidades comerciais de venda',
    'Muito mais agilidade no atendimento às demandas cadastrais de novos clientes',
    'Redução sensível do tempo gasto pela equipe interna na busca e emissão de certidões',
    'Histórico auditável e documentação centralizada em repositório único e padronizado',
    'Visão clara e antecipada de certidões que exigem providências antes de vencerem',
    'Segurança jurídica na submissão de informações e cumprimento dos editais',
    'Eliminação de pagamentos travados ou notas fiscais retidas por certidões vencidas',
    'Postura profissional que transmite credibilidade e governança aos grandes compradores',
  ]

  const etapas = [
    {
      num: 1,
      titulo: 'Diagnóstico inicial',
      desc: 'Levantamos os clientes, portais e contratos que possuem exigências documentais e identificamos o material e certidões já disponíveis.',
    },
    {
      num: 2,
      titulo: 'Matriz documental',
      desc: 'Associamos cada documento à sua finalidade, ao órgão emissor competente, à data de vencimento e ao cliente ou portal que o exige.',
    },
    {
      num: 3,
      titulo: 'Organização e atualização',
      desc: 'Reunimos e conferimos os documentos. Quando uma certidão não puder ser emitida de imediato, registramos a pendência para encaminhamento.',
    },
    {
      num: 4,
      titulo: 'Cadastro e acompanhamento',
      desc: 'Mediante autorização prévia, acompanhamos o preenchimento e a atualização dos portais indicados pelo cliente contratante.',
    },
    {
      num: 5,
      titulo: 'Manutenção periódica',
      desc: 'Monitoramos vencimentos de forma contínua e solicitamos antecipadamente os documentos que dependem da empresa ou de terceiros.',
    },
  ]

  const modalidades = [
    {
      tag: 'Ponto de Partida',
      nome: 'Organização inicial',
      desc: 'Montagem completa da pasta documental digital, levantamento de todas as exigências dos clientes, checklist analítico, conferência dos documentos e relatório executivo de pendências.',
    },
    {
      tag: 'Demanda Específica',
      nome: 'Cadastro por projeto',
      desc: 'Preparação sob medida para uma homologação urgente, participação em processo de cotação/RFP, concorrência comercial ou credenciamento em um portal específico.',
    },
    {
      tag: 'Gestão Contínua',
      nome: 'Gestão documental mensal',
      desc: 'Controle contínuo de vencimentos, reemissão periódica de certidões antes de expirarem, atualização rotineira dos portais de clientes e envio de relatório mensal à diretoria.',
    },
    {
      tag: 'Setor Público',
      nome: 'Preparação para fornecedores públicos',
      desc: 'Organização e conferência da documentação necessária para habilitação jurídica, fiscal, trabalhista e econômico-financeira no SICAF e portais públicos de compras.',
    },
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
                <span className="glyph">᚛</span> Homologação & Regularidade de Fornecedores <span className="glyph">᚜</span>
              </p>
              <h1>
                Gestão Documental e <span className="lit">Cadastro de Fornecedores</span>
              </h1>
              <p className="lede">
                Organizamos documentos, controlamos vencimentos e acompanhamos cadastros de fornecedores. Sua empresa fica permanentemente preparada para homologações, renovações contratuais e novas oportunidades comerciais sem atrasos operacionais.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 32, alignItems: 'center' }}>
                <a className="btn btn-gold" href="#solicitar">
                  Solicitar Diagnóstico Documental
                </a>
                <a className="btn btn-ghost" href="#como-funciona">
                  Conhecer o Método Contínuo
                </a>
              </div>
            </div>

            {/* CARD DE SÍNTESE DO ESCOPO */}
            <div
              className="card"
              style={{
                padding: '38px 34px',
                background: 'var(--surface)',
                borderLeft: '3px solid var(--emerald)',
              }}
            >
              <span className="card-tag">Governança Comercial</span>
              <h3 style={{ fontSize: '1.45rem', margin: '14px 0 10px', color: 'var(--ink)' }}>
                Risco Zero de Bloqueio em Portais
              </h3>
              <p style={{ fontSize: '0.94rem', color: 'var(--ink-72)', lineHeight: 1.68 }}>
                Centralizamos certidões federais, estaduais e municipais, balanços e atestados técnicos em repositório digital seguro com monitoramento de validade contínuo, proativo e preventivo.
              </p>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line-soft)' }}>
                <span style={{ fontSize: '12.5px', letterSpacing: '.04em', color: 'var(--emerald-text)', fontWeight: 600, display: 'block', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  ✦ Portais privados (Ariba, Coupa, Nimbi) e públicos (SICAF)
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE MÉTRICAS / DESTAQUES */}
          <div className="serv-stats-bar">
            <div className="serv-stat-item">
              <span className="serv-stat-num">Zero</span>
              <span className="serv-stat-label">Bloqueios de Pagamento</span>
              <span className="serv-stat-desc">Certidões vigentes evitam retenção de faturamento e travamento de pedidos.</span>
            </div>
            <div className="serv-stat-item">
              <span className="serv-stat-num">Amplo</span>
              <span className="serv-stat-label">SICAF & Redes Privadas</span>
              <span className="serv-stat-desc">Homologação em portais de grandes compradores e setor público.</span>
            </div>
            <div className="serv-stat-item">
              <span className="serv-stat-num">30d</span>
              <span className="serv-stat-label">Alerta Antecipado</span>
              <span className="serv-stat-desc">Reemissão programada e controle antes do vencimento das certidões.</span>
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
            <h2>Quando a gestão documental é indicada?</h2>
            <p>Cenários operacionais onde o vencimento de uma certidão custa contratos, homologações ou retenção de faturamento.</p>
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

      {/* ESCOPO: O QUE FAZEMOS vs BENEFÍCIOS */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚔ</span> Matriz de Entrega</p>
            <h2>Operação proativa e resultados estratégicos</h2>
            <p>A união entre disciplina operacional contínua e tranquilidade comercial para sua empresa.</p>
          </div>

          <div className="serv-dual-grid">
            
            {/* O QUE FAZEMOS */}
            <div className="serv-scope-card reveal">
              <div className="serv-scope-head">
                <div className="serv-scope-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 4 }}><span className="glyph">ᚄ</span> Operação Contínua</p>
                  <h3 style={{ fontSize: '1.75rem', margin: 0 }}>O que fazemos por sua empresa</h3>
                </div>
              </div>

              <ul className="serv-check-list">
                {oQueFazemos.map((item, idx) => (
                  <li key={idx} className="serv-check-item">
                    <span className="serv-check-dot"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BENEFÍCIOS */}
            <div className="serv-scope-card is-gold reveal">
              <div className="serv-scope-head">
                <div className="serv-scope-icon is-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ color: 'var(--gold-text)', marginBottom: 4 }}><span className="glyph">ᚂ</span> Retorno Estratégico</p>
                  <h3 style={{ fontSize: '1.75rem', margin: 0 }}>Benefícios Diretos</h3>
                </div>
              </div>

              <ul className="serv-check-list">
                {beneficios.map((item, idx) => (
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

      {/* DOCUMENTOS ACOMPANHADOS */}
      <section className="section-pad" id="documentos">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚓ</span> Matriz Documental</p>
            <h2>Documentos frequentemente acompanhados</h2>
            <p>Monitoramos o ciclo de vida completo de 16 categorias essenciais de certidões, habilitações e balanços empresariais.</p>
          </div>

          <div className="serv-docs-grid reveal">
            {documentosAcompanhados.map((doc, idx) => (
              <div key={idx} className="serv-doc-pill">
                <span className="serv-doc-icon"></span>
                <span className="serv-doc-text">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (5 ETAPAS) */}
      <section className="section-pad" id="como-funciona" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚋ</span> Método Contínuo</p>
            <h2>Como funciona a gestão documental?</h2>
            <p>Do diagnóstico cadastral inicial ao acompanhamento mensal proativo e preventivo.</p>
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
      <section className="section-pad" id="modalidades">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚉ</span> Modalidades de Contratação</p>
            <h2>Formatos de atendimento</h2>
            <p>Escolha o modelo que melhor atende ao porte da sua carteira de clientes e à complexidade dos seus cadastros.</p>
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

      {/* SEGURANÇA E AUTORIZAÇÕES & OBSERVAÇÕES */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            <div
              className="card reveal"
              style={{
                padding: '40px 38px',
                borderLeft: '4px solid var(--emerald)',
                background: 'var(--void)',
              }}
            >
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                <span className="glyph">ᚔ</span> Segurança e Governança
              </p>
              <h3 style={{ fontSize: '1.65rem', marginBottom: 16 }}>
                Privacidade rigorosa e acesso auditável
              </h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--ink-72)', lineHeight: 1.8 }}>
                O acesso a informações fiscais ou ambientes restritos será realizado estritamente por meio de autorização formal, procuração eletrônica da Receita Federal (e-CAC) ou sessões orientadas conduzidas pelo próprio cliente. As autorizações são limitadas aos serviços contratados e podem ser revogadas pelo titular a qualquer instante. <strong>Senhas pessoais de acesso nunca são solicitadas nem compartilhadas.</strong>
              </p>
            </div>

            <div
              className="card reveal"
              style={{
                padding: '40px 38px',
                borderLeft: '4px solid var(--gold)',
                background: 'var(--void)',
              }}
            >
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                <span className="glyph">ᚐ</span> Diretrizes Técnicas
              </p>
              <h3 style={{ fontSize: '1.65rem', marginBottom: 16 }}>
                Escopo e responsabilidades transparentes
              </h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--ink-72)', lineHeight: 1.8 }}>
                A contratação do serviço não substitui as exigências técnicas estabelecidas pelo comprador, pelo edital ou pelo órgão regulador. A emissão de certidões negativas depende da regularidade cadastral e tributária da empresa. Havendo impedimentos ou débitos, serão apresentadas as pendências apontadas e as providências recomendadas. Taxas públicas, registros em conselhos, certificados e serviços de terceiros são apresentados separadamente dos honorários profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL & FORMULÁRIO */}
      <section className="cta-final" id="solicitar" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: '44rem', margin: '0 auto 56px' }}>
            <p className="eyebrow"><span className="glyph">ᚓ</span> Diagnóstico Documental</p>
            <h2>Sua empresa precisa organizar ou atualizar um cadastro de fornecedor?</h2>
            <p>
              Envie a relação de documentos, o edital de licitação ou o link do portal com as exigências. Faremos uma avaliação preliminar e apresentaremos o escopo do serviço e o cronograma.
            </p>
          </div>

          <ContactForm
            servicoInicial="Gestão Documental e Cadastro de Fornecedores"
            titulo="Solicitar Diagnóstico Documental"
            subtitulo="Envie os dados básicos da sua empresa e a demanda de homologação para receber o plano de ação."
          />
        </div>
      </section>
    </>
  )
}
