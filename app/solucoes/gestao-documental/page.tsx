'use client'

import Link from 'next'
import ContactForm from '@/components/contato/ContactForm'

export default function GestaoDocumentalPage() {
  const indicacoes = [
    'Empresas que pretendem fornecer para indústrias, hospitais, condomínios, redes varejistas ou grandes grupos empresariais',
    'Empresas que precisam preencher portais de homologação e qualificação de fornecedores',
    'Participantes ativos de processos de cotação, contratação, concorrência e RFPs',
    'Fornecedores com múltiplos clientes e exigências documentais simultâneas e divergentes',
    'Empresas que enfrentam vencimentos frequentes de certidões e retrabalho na renovação',
    'Empresas com bloqueios cadastrais periódicos ou atrasos no faturamento e recebimento',
    'Interessados em organizar e manter regularizada a documentação para contratações públicas',
    'Empresas que desejam centralizar o controle documental e eliminar pastas dispersas',
  ]

  const oQueFazemos = [
    'Levantamento criterioso das exigências de cada cliente, contrato ou portal homologador',
    'Elaboração de checklist personalizado por cliente ou edital',
    'Organização de documentos societários, fiscais e cadastrais vigentes',
    'Conferência analítica dos dados apresentados nos documentos e contratos',
    'Emissão sistemática de certidões disponíveis em portais oficiais federais, estaduais e municipais',
    'Controle rigoroso de prazos de validade e calendário de vencimentos',
    'Registro e acompanhamento proativo das pendências fiscais ou cadastrais identificadas',
    'Organização de balanços, demonstrações contábeis e índices econômico-financeiros solicitados',
    'Preparação do conjunto documental completo e padronizado para submissão',
    'Atualização periódica dos documentos em portais autorizados de clientes',
    'Acompanhamento contínuo do status de aprovação de cada cadastro',
    'Organização documental completa para o SICAF (níveis I a VI), quando aplicável',
    'Relatório executivo de documentos válidos, próximos do vencimento e pendentes',
  ]

  const documentosAcompanhados = [
    'Cartão do CNPJ atualizado',
    'Contrato social consolidado e alterações arquivadas',
    'Certidões simplificadas da Junta Comercial',
    'Inscrições estadual e municipal',
    'Alvarás de funcionamento e licenças sanitárias e ambientais',
    'Certidões de regularidade fiscal federais (Receita e PGFN), estaduais e municipais',
    'Certificado de regularidade do FGTS (CRF)',
    'Certidão Negativa de Débitos Trabalhistas (CNDT)',
    'Balanço patrimonial e demonstrações contábeis do último exercício',
    'Índices de qualificação econômico-financeira (Liquidez Geral, Corrente e Solvência)',
    'Comprovantes bancários e dados de faturamento homologados',
    'Declarações específicas exigidas pelo contratante ou compliance',
    'Certificados técnicos e registros em conselhos profissionais dos responsáveis',
    'Apólices de seguro vigentes (RC, garantia, vida)',
    'Documentação trabalhista e previdenciária de equipes alocadas',
    'Comprovantes de experiência prévia e atestados de capacidade técnica',
  ]

  const entregaveis = [
    'Checklist estruturado por cliente, contrato ou portal de compras',
    'Pasta digital padronizada e indexada em nuvem',
    'Relação consolidada dos documentos apresentados e vigentes',
    'Controle das datas de emissão e prazos exatos de vencimento',
    'Painel de pendências e ações corretivas recomendadas',
    'Alertas prévios automáticos antes do vencimento de certidões',
    'Histórico auditável dos documentos e versões enviadas aos clientes',
    'Registro centralizado das exigências e comunicações recebidas',
    'Relatório periódico de acompanhamento do status cadastral',
    'Comprovantes de protocolo ou envio nos portais de homologação',
    'Indicação das providências necessárias para regularização de certidões positivas',
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

  const beneficios = [
    'Menor risco de perder prazos documentais e oportunidades de venda',
    'Muito mais agilidade no atendimento e respostas aos clientes',
    'Redução drástica de retrabalho administrativo e estresse na renovação',
    'Centralização de todas as informações em repositório confiável',
    'Maior rastreabilidade e histórico dos documentos transmitidos',
    'Identificação antecipada de certidões travadas antes que travem pagamentos',
    'Melhor preparação competitiva para contratações de grande porte',
    'Apoio direto às equipes comercial, financeira e de suprimentos',
  ]

  return (
    <>
      {/* HERO */}
      <section style={{ padding: '100px 0 60px', position: 'relative' }}>
        <div className="wrap">
          <p className="eyebrow"><span className="glyph">ᚓ</span> Gestão de Fornecedores</p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.08, margin: '20px 0 24px' }}>
            Gestão Documental e Cadastro de Fornecedores
          </h1>
          <p className="lede" style={{ maxWidth: '44rem', fontSize: '1.2rem', color: 'var(--ink-72)' }}>
            Mantenha sua empresa preparada para vender, faturar e renovar contratos.
          </p>
          <div className="hero-actions" style={{ marginTop: 36 }}>
            <a className="btn btn-gold" href="#solicitar">Solicitar diagnóstico documental</a>
            <a className="btn btn-ghost" href="#como-funciona">Ver como funciona</a>
          </div>
        </div>
      </section>

      {/* TEXTO DE ABERTURA */}
      <section className="section-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="wrap">
          <div style={{ maxWidth: '46rem', margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}><span className="glyph">ᚔ</span> Segurança Operacional</p>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', lineHeight: 1.1, marginBottom: 28 }}>
              Nunca mais perca um faturamento por certidão vencida ou cadastro desatualizado.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: '1.08rem', lineHeight: 1.8, color: 'var(--ink-72)' }}>
              <p>
                Empresas que fornecem produtos ou serviços para grandes clientes precisam apresentar diferentes documentos durante o cadastro, a contratação, o faturamento e a renovação dos contratos.
              </p>
              <p>
                Certidões vencidas, formulários incompletos e informações divergentes podem atrasar a homologação, impedir a participação em uma oportunidade comercial ou suspender pagamentos legítimos.
              </p>
              <p>
                A <strong>Gestão Documental de Fornecedores</strong> centraliza essas exigências, acompanha os vencimentos e ajuda a empresa a manter seus cadastros organizados nos portais dos clientes e nos sistemas aplicáveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM É INDICADO */}
      <section className="section-pad">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚁ</span> Perfil de Clientes</p>
            <h2>Para quem este serviço é indicado?</h2>
            <p>Empresas que buscam previsibilidade, conformidade e velocidade em suas relações com grandes compradores.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {indicacoes.map((item, idx) => (
              <div
                key={idx}
                className="card reveal"
                style={{ padding: '28px 30px', borderRadius: '32px' }}
              >
                <span style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--emerald-text)', display: 'block', marginBottom: 10 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '0.98rem', color: 'var(--ink)', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE FAZEMOS & BENEFÍCIOS */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'start' }}>
            
            {/* O QUE FAZEMOS */}
            <div className="reveal">
              <p className="eyebrow"><span className="glyph">ᚄ</span> Atuação Operacional</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', margin: '18px 0 24px' }}>
                O que fazemos?
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {oQueFazemos.map((item, idx) => (
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
            </div>

            {/* BENEFÍCIOS */}
            <div className="reveal">
              <p className="eyebrow"><span className="glyph">ᚂ</span> Resultados Tangíveis</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', margin: '18px 0 24px' }}>
                Benefícios para sua empresa
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {beneficios.map((item, idx) => (
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

      {/* DOCUMENTOS ACOMPANHADOS */}
      <section className="section-pad">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚋ</span> Escopo de Monitoramento</p>
            <h2>Documentos que podem ser acompanhados</h2>
            <p>Gerenciamos o ciclo de vida de todo o acervo cadastral, fiscal, econômico e societário exigido pelo mercado.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {documentosAcompanhados.map((doc, idx) => (
              <div
                key={idx}
                className="card reveal"
                style={{ padding: '22px 24px', borderRadius: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', flex: 'none' }}></span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: 400 }}>{doc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: '18px 24px', background: 'var(--surface)', borderRadius: '20px', borderLeft: '3px solid var(--gold)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-56)', lineHeight: 1.6, margin: 0 }}>
              <em>Observação:</em> Alguns documentos dependem da atuação de engenheiros, advogados, responsáveis técnicos, seguradoras ou órgãos licenciadores. Nesses casos, a pendência será acompanhada e direcionada ao profissional responsável.
            </p>
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚑ</span> Entregáveis & Governança</p>
            <h2>O que você recebe?</h2>
            <p>Transparência total e ferramentas para sua equipe acompanhar cada homologação em tempo real.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {entregaveis.map((item, idx) => (
              <div
                key={idx}
                className="card reveal"
                style={{ background: 'var(--void)', padding: '26px 28px', borderRadius: '28px' }}
              >
                <span style={{ fontSize: '12px', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-text)', display: 'block', marginBottom: 8 }}>
                  Entregável {idx + 1}
                </span>
                <p style={{ fontSize: '0.96rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (5 ETAPAS) */}
      <section className="section-pad" id="como-funciona">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow"><span className="glyph">ᚂ</span> Método Contínuo</p>
            <h2>Como funciona a gestão documental?</h2>
            <p>Do levantamento inicial ao acompanhamento mensal proativo.</p>
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
            <p className="eyebrow"><span className="glyph">ᚉ</span> Modalidades</p>
            <h2>Modalidades de contratação</h2>
            <p>Escolha o formato que melhor atende à dinâmica comercial e operacional da sua empresa.</p>
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

      {/* SEGURANÇA E AUTORIZAÇÕES & OBSERVAÇÕES */}
      <section className="section-pad">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            <div
              className="card reveal"
              style={{
                padding: '36px 40px',
                borderLeft: '4px solid var(--emerald)',
              }}
            >
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                <span className="glyph">ᚔ</span> Segurança e Autorizações
              </p>
              <h3 style={{ fontSize: '1.6rem', marginBottom: 16 }}>
                Privacidade rigorosa e acesso auditável
              </h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--ink-72)', lineHeight: 1.8 }}>
                O acesso a informações fiscais ou ambientes restritos será realizado por meio de autorização apropriada, procuração eletrônica ou acesso conduzido pelo próprio cliente. As autorizações devem ser limitadas aos serviços necessários e podem ser canceladas pelo titular a qualquer momento. <strong>Senhas pessoais não devem ser solicitadas ou compartilhadas.</strong>
              </p>
            </div>

            <div
              className="card reveal"
              style={{
                padding: '36px 40px',
                borderLeft: '4px solid var(--gold)',
              }}
            >
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                <span className="glyph">ᚐ</span> Observações Importantes
              </p>
              <h3 style={{ fontSize: '1.6rem', marginBottom: 16 }}>
                Escopo e responsabilidades
              </h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--ink-72)', lineHeight: 1.8 }}>
                A contratação do serviço não elimina as exigências estabelecidas pelo cliente, pelo edital ou pelo órgão responsável. A emissão de certidões depende da situação cadastral e fiscal da empresa. Quando houver impedimentos, serão apresentadas as pendências identificadas e as providências recomendadas. Taxas públicas, certificados, traduções, cartórios, responsáveis técnicos e serviços de terceiros são cobrados separadamente.
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
              Envie a relação de documentos, o edital ou a página com as exigências. Faremos uma avaliação inicial e apresentaremos o escopo do serviço.
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
