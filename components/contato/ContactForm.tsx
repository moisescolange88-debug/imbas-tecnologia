'use client'

import { useState, useId, useEffect } from 'react'

export interface ContactFormProps {
  servicoInicial?: string
  titulo?: string
  subtitulo?: string
  className?: string
}

const OPCOES_SERVICO = [
  { id: 'dossie', nome: 'Dossiê Societário', rotuloCompleto: 'Dossiê Societário e Histórico Empresarial' },
  { id: 'gestao', nome: 'Gestão Documental', rotuloCompleto: 'Gestão Documental e Cadastro de Fornecedores' },
  { id: 'ia-contabil', nome: 'IA Contábil', rotuloCompleto: 'Automação e IA para Escritórios Contábeis' },
  { id: 'juridico', nome: 'Advocacia Aumentada', rotuloCompleto: 'Pesquisa e IA para Escritórios Jurídicos' },
  { id: 'outro', nome: 'Outro', rotuloCompleto: 'Outra Demanda Especializada' },
]

export default function ContactForm({
  servicoInicial = 'Dossiê Societário e Histórico Empresarial',
  titulo,
  subtitulo,
  className = '',
}: ContactFormProps) {
  const formId = useId()

  // Identifica o serviço ativo inicial
  const servicoEncontrado = OPCOES_SERVICO.find(
    s => s.rotuloCompleto === servicoInicial || s.nome === servicoInicial
  )

  const [servicoAtivo, setServicoAtivo] = useState(
    servicoEncontrado ? servicoEncontrado.rotuloCompleto : OPCOES_SERVICO[0].rotuloCompleto
  )

  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [documentos, setDocumentos] = useState('')
  const [consentimento, setConsentimento] = useState(true)

  const [status, setStatus] = useState<'idle' | 'enviado'>('idle')
  const [erros, setErros] = useState<Record<string, string>>({})

  const WHATSAPP_NUMERO =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '[INSERIR NÚMERO DO WHATSAPP]';

  function formatarCNPJ(v: string) {
    const limpo = v.replace(/\\D/g, '').slice(0, 14)
    if (limpo.length <= 2) return limpo
    if (limpo.length <= 5) return `${limpo.slice(0, 2)}.${limpo.slice(2)}`
    if (limpo.length <= 8) return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5)}`
    if (limpo.length <= 12)
      return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8)}`
    return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8, 12)}-${limpo.slice(12)}`
  }

  function formatarTelefone(v: string) {
    const limpo = v.replace(/\\D/g, '').slice(0, 11)
    if (limpo.length <= 2) return limpo
    if (limpo.length <= 6) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`
    if (limpo.length <= 10)
      return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6)}`
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`
  }

  function gerarMensagem() {
    if (servicoAtivo.includes('Dossiê Societário')) {
      const cnpjTexto = cnpj.trim() || '[CNPJ]';
      const objTexto = objetivo.trim() || '[OBJETIVO]';
      return `Olá! Gostaria de solicitar uma análise para elaboração de Dossiê Societário. O CNPJ da empresa é ${cnpjTexto} e o objetivo do levantamento é ${objTexto}.`
    }
    if (servicoAtivo.includes('Gestão Documental')) {
      return 'Olá! Gostaria de solicitar um diagnóstico para organização ou atualização do cadastro de fornecedores da minha empresa.'
    }
    return `Olá! Gostaria de solicitar mais informações sobre ${servicoAtivo} na Imbas Tecnologia.`
  }

  function validar() {
    const novosErros: Record<string, string> = {}
    if (!nome.trim()) novosErros.nome = 'Informe seu nome completo'
    if (!telefone.trim() || telefone.length < 10)
      novosErros.telefone = 'Informe um telefone ou WhatsApp válido com DDD'
    if (!email.trim() || !email.includes('@') || !email.includes('.'))
      novosErros.email = 'Informe um e-mail corporativo válido'
    if (!objetivo.trim())
      novosErros.objetivo = 'Descreva resumidamente o objetivo da pesquisa ou homologação'
    if (!consentimento)
      novosErros.consentimento = 'É necessário concordar com os termos de privacidade LGPD'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    const msg = gerarMensagem()
    const corpoEmail = encodeURIComponent(
      `Solicitação formal recebida via portal Imbas Tecnologia:\n\n` +
      `Serviço: ${servicoAtivo}\n` +
      `Nome: ${nome}\n` +
      `Empresa: ${empresa || 'Não informada'}\n` +
      `CNPJ: ${cnpj || 'Não informado'}\n` +
      `Telefone/WhatsApp: ${telefone}\n` +
      `E-mail: ${email}\n\n` +
      `Objetivo / Demanda:\n${objetivo}\n\n` +
      `Relação de Documentos ou Edital:\n${documentos || 'Nenhum anexo indicado'}\n\n` +
      `Mensagem base pronta:\n${msg}`
    )

    const mailtoUrl = `mailto:contato@imbastecnologia.com.br?subject=${encodeURIComponent(`[Diagnóstico] ${servicoAtivo} — ${empresa || nome}`)}&body=${corpoEmail}`
    window.open(mailtoUrl, '_blank')
    setStatus('enviado')
  }

  function handleAbrirWhatsApp() {
    if (!validar()) return
    const msg = gerarMensagem()
    if (WHATSAPP_NUMERO === '[INSERIR NÚMERO DO WHATSAPP]') {
      alert(
        `Mensagem preparada com sucesso:\n\n"${msg}"\n\nO canal institucional de e-mail será aberto com a demanda preenchida para atendimento direto.`
      )
      const mailtoUrl = `mailto:contato@imbastecnologia.com.br?subject=${encodeURIComponent(`[WhatsApp Solicitação] ${servicoAtivo}`)}&body=${encodeURIComponent(msg)}`
      window.open(mailtoUrl, '_blank')
      setStatus('enviado')
      return
    }

    const numeroLimpo = WHATSAPP_NUMERO.replace(/\\D/g, '')
    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setStatus('enviado')
  }

  const mensagemAoVivo = gerarMensagem()

  return (
    <div
      className={`card ${className}`}
      style={{
        maxWidth: 780,
        margin: '0 auto',
        padding: 'clamp(32px, 5.5vw, 56px)',
        background: 'var(--surface)',
        boxShadow: 'inset 0 0 0 1px var(--line-soft), 0 20px 48px rgba(14,42,26,.06)',
      }}
    >
      {titulo && (
        <div style={{ marginBottom: 32 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>
            <span className="glyph">ᚑ</span> Diagnóstico & Escopo
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.7rem)', lineHeight: 1.02 }}>
            {titulo}
          </h2>
          {subtitulo && (
            <p style={{ marginTop: 12, color: 'var(--ink-72)', fontSize: '1.04rem', lineHeight: 1.6 }}>
              {subtitulo}
            </p>
          )}
        </div>
      )}

      {status === 'enviado' ? (
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--void)',
              boxShadow: 'inset 0 0 0 1.5px var(--emerald-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 22,
              color: 'var(--emerald-text)',
              fontSize: '26px',
            }}
          >
            ✓
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: 12, lineHeight: 1.1 }}>Solicitação preparada com rigor!</h3>
          <p style={{ color: 'var(--ink-72)', maxWidth: '34rem', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Os dados da sua demanda foram estruturados. Nossa equipe técnica retornará com o diagnóstico inicial, escopo e prazos.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStatus('idle')}
          >
            Enviar outra solicitação
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Segmented Toggle dos Serviços */}
          <div style={{ marginBottom: 28 }}>
            <label className="calc-label" style={{ marginBottom: 12, display: 'block' }}>
              Selecione o serviço de interesse:
            </label>
            <div className="contact-service-toggle">
              {OPCOES_SERVICO.map(opcao => (
                <button
                  key={opcao.id}
                  type="button"
                  onClick={() => setServicoAtivo(opcao.rotuloCompleto)}
                  className={`contact-service-btn ${
                    servicoAtivo === opcao.rotuloCompleto ? 'is-active' : ''
                  }`}
                  aria-pressed={servicoAtivo === opcao.rotuloCompleto}
                >
                  {opcao.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Nome e Empresa */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="calc-field">
              <label htmlFor={`${formId}-nome`} className="calc-label">
                Nome completo *
              </label>
              <input
                id={`${formId}-nome`}
                type="text"
                required
                className={`calc-input ${erros.nome ? 'calc-input--error' : ''}`}
                value={nome}
                onChange={e => {
                  setNome(e.target.value)
                  if (erros.nome) setErros(prev => ({ ...prev, nome: '' }))
                }}
                placeholder="Ex.: Carolina de Souza"
              />
              {erros.nome && <span className="calc-error">{erros.nome}</span>}
            </div>

            <div className="calc-field">
              <label htmlFor={`${formId}-empresa`} className="calc-label">
                Empresa ou Razão Social
              </label>
              <input
                id={`${formId}-empresa`}
                type="text"
                className="calc-input"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                placeholder="Nome da sociedade ou escritório"
              />
            </div>
          </div>

          {/* CNPJ e Telefone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="calc-field">
              <label htmlFor={`${formId}-cnpj`} className="calc-label">
                CNPJ da empresa pesquisada ou fornecedora
              </label>
              <input
                id={`${formId}-cnpj`}
                type="text"
                className="calc-input"
                value={cnpj}
                onChange={e => setCnpj(formatarCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="calc-field">
              <label htmlFor={`${formId}-telefone`} className="calc-label">
                Telefone ou WhatsApp com DDD *
              </label>
              <input
                id={`${formId}-telefone`}
                type="tel"
                required
                className={`calc-input ${erros.telefone ? 'calc-input--error' : ''}`}
                value={telefone}
                onChange={e => {
                  setTelefone(formatarTelefone(e.target.value))
                  if (erros.telefone) setErros(prev => ({ ...prev, telefone: '' }))
                }}
                placeholder="(19) 90000-0000"
              />
              {erros.telefone && <span className="calc-error">{erros.telefone}</span>}
            </div>
          </div>

          {/* E-mail */}
          <div className="calc-field">
            <label htmlFor={`${formId}-email`} className="calc-label">
              E-mail institucional de contato *
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              required
              className={`calc-input ${erros.email ? 'calc-input--error' : ''}`}
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (erros.email) setErros(prev => ({ ...prev, email: '' }))
              }}
              placeholder="seu.nome@empresa.com.br"
            />
            {erros.email && <span className="calc-error">{erros.email}</span>}
          </div>

          {/* Objetivo ou Necessidade */}
          <div className="calc-field">
            <label htmlFor={`${formId}-objetivo`} className="calc-label">
              Objetivo ou necessidade da demanda *
            </label>
            <textarea
              id={`${formId}-objetivo`}
              rows={4}
              required
              className={`calc-input ${erros.objetivo ? 'calc-input--error' : ''}`}
              style={{ borderRadius: '24px', resize: 'vertical' }}
              value={objetivo}
              onChange={e => {
                setObjetivo(e.target.value)
                if (erros.objetivo) setErros(prev => ({ ...prev, objetivo: '' }))
              }}
              placeholder={
                servicoAtivo.includes('Dossiê')
                  ? 'Ex.: Reconstituição de atos societários e alterações de sócios entre 2017 e 2023 para fins de instrução probatória em processo judicial...'
                  : 'Ex.: Organização documental para homologação e cadastramento urgente no portal de compras da indústria X / renovação SICAF...'
              }
            />
            {erros.objetivo && <span className="calc-error">{erros.objetivo}</span>}
          </div>

          {/* Relação de Documentos ou Link de Edital */}
          <div className="calc-field">
            <label htmlFor={`${formId}-documentos`} className="calc-label">
              Relação de documentos, edital ou link com exigências (opcional)
            </label>
            <textarea
              id={`${formId}-documentos`}
              rows={3}
              className="calc-input"
              style={{ borderRadius: '20px', resize: 'vertical' }}
              value={documentos}
              onChange={e => setDocumentos(e.target.value)}
              placeholder="Cole aqui a lista de certidões solicitadas, URL do edital de licitação ou portal homologador..."
            />
          </div>

          {/* Caixa de Pré-visualização da Mensagem */}
          <div className="contact-preview-box">
            <div className="contact-preview-badge">
              <span style={{ fontSize: 13 }}>💬</span> Mensagem pré-formatada para atendimento:
            </div>
            <div className="contact-preview-text">
              “{mensagemAoVivo}”
            </div>
          </div>

          {/* Consentimento de Privacidade */}
          <div style={{ margin: '24px 0 28px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <input
              id={`${formId}-consentimento`}
              type="checkbox"
              checked={consentimento}
              onChange={e => {
                setConsentimento(e.target.checked)
                if (erros.consentimento) setErros(prev => ({ ...prev, consentimento: '' }))
              }}
              style={{
                marginTop: 4,
                width: 18,
                height: 18,
                accentColor: 'var(--emerald)',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor={`${formId}-consentimento`}
              style={{ fontSize: '0.9rem', color: 'var(--ink-72)', lineHeight: 1.5, cursor: 'pointer' }}
            >
              Concordo com o tratamento dos dados informados para contato, diagnóstico preliminar e elaboração de proposta técnica, sob estrito sigilo profissional e nos termos da Lei Geral de Proteção de Dados (LGPD).
            </label>
          </div>
          {erros.consentimento && (
            <div style={{ marginBottom: 16 }}>
              <span className="calc-error">{erros.consentimento}</span>
            </div>
          )}

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="btn btn-gold" style={{ flex: '1 1 240px' }}>
              Enviar por E-mail institucional
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleAbrirWhatsApp}
              style={{ flex: '1 1 240px', display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3" />
              </svg>
              Conversar no WhatsApp
            </button>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--ink-56)',
              marginTop: 20,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Seus dados são protegidos por sigilo profissional e tecnologia com criptografia. Não solicitamos nem compartilhamos senhas pessoais de acesso.
          </p>
        </form>
      )}
    </div>
  )
}
