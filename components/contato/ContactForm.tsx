'use client'

import { useState, useId } from 'react'

export interface ContactFormProps {
  servicoInicial?: string
  titulo?: string
  subtitulo?: string
  className?: string
}

const OPCOES_SERVICO = [
  'Dossiê Societário e Histórico Empresarial',
  'Gestão Documental e Cadastro de Fornecedores',
  'Automação e IA para Escritórios Contábeis',
  'Pesquisa e IA para Escritórios Jurídicos',
  'Marketplace e Conciliação',
  'Outro',
]

export default function ContactForm({
  servicoInicial = 'Dossiê Societário e Histórico Empresarial',
  titulo,
  subtitulo,
  className = '',
}: ContactFormProps) {
  const formId = useId()
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [servico, setServico] = useState(servicoInicial)
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
    if (servico.includes('Dossiê Societário')) {
      const cnpjTexto = cnpj.trim() || '[CNPJ]';
      const objTexto = objetivo.trim() || '[OBJETIVO]';
      return `Olá! Gostaria de solicitar uma análise para elaboração de Dossiê Societário. O CNPJ da empresa é ${cnpjTexto} e o objetivo do levantamento é ${objTexto}.`
    }
    if (servico.includes('Gestão Documental')) {
      return 'Olá! Gostaria de solicitar um diagnóstico para organização ou atualização do cadastro de fornecedores da minha empresa.'
    }
    return `Olá! Gostaria de solicitar mais informações sobre o serviço de ${servico}.`
  }

  function validar() {
    const novosErros: Record<string, string> = {}
    if (!nome.trim()) novosErros.nome = 'Informe seu nome completo'
    if (!telefone.trim()) novosErros.telefone = 'Informe um telefone ou WhatsApp para contato'
    if (!email.trim() || !email.includes('@')) novosErros.email = 'Informe um e-mail corporativo válido'
    if (!objetivo.trim()) novosErros.objetivo = 'Descreva resumidamente seu objetivo ou necessidade'
    if (!consentimento) novosErros.consentimento = 'É necessário autorizar o contato para elaboração da proposta'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    const msg = gerarMensagem()
    const corpoEmail = encodeURIComponent(
      `Solicitação via formulário Imbas Tecnologia:\n\n` +
      `Nome: ${nome}\n` +
      `Empresa: ${empresa || 'Não informada'}\n` +
      `CNPJ: ${cnpj || 'Não informado'}\n` +
      `Telefone/WhatsApp: ${telefone}\n` +
      `E-mail: ${email}\n` +
      `Serviço de interesse: ${servico}\n` +
      `Objetivo / Necessidade:\n${objetivo}\n\n` +
      `Relação de Documentos / Edital:\n${documentos || 'Nenhum anexo indicado'}\n\n` +
      `Mensagem sugerida:\n${msg}`
    )

    const mailtoUrl = `mailto:contato@imbastecnologia.com.br?subject=${encodeURIComponent(`[Orçamento] ${servico} — ${empresa || nome}`)}&body=${corpoEmail}`
    window.open(mailtoUrl, '_blank')
    setStatus('enviado')
  }

  function handleAbrirWhatsApp() {
    if (!validar()) return
    const msg = gerarMensagem()
    if (WHATSAPP_NUMERO === '[INSERIR NÚMERO DO WHATSAPP]') {
      alert(
        `Mensagem montada com sucesso:\n\n"${msg}"\n\nO número de WhatsApp da central está em configuração. O canal de e-mail institucional será aberto para envio da demanda.`
      )
      const mailtoUrl = `mailto:contato@imbastecnologia.com.br?subject=${encodeURIComponent(`[WhatsApp Solicitação] ${servico}`)}&body=${encodeURIComponent(msg)}`
      window.open(mailtoUrl, '_blank')
      setStatus('enviado')
      return
    }

    const numeroLimpo = WHATSAPP_NUMERO.replace(/\\D/g, '')
    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setStatus('enviado')
  }

  return (
    <div
      className={`card ${className}`}
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: 'clamp(28px, 5vw, 48px)',
        background: 'var(--surface)',
      }}
    >
      {titulo && (
        <div style={{ marginBottom: 28 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>
            <span className="glyph">ᚑ</span> Diagnóstico & Proposta
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)', lineHeight: 1.05 }}>
            {titulo}
          </h2>
          {subtitulo && (
            <p style={{ marginTop: 12, color: 'var(--ink-72)', fontSize: '1.02rem' }}>
              {subtitulo}
            </p>
          )}
        </div>
      )}

      {status === 'enviado' ? (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--void)',
              boxShadow: 'inset 0 0 0 1px var(--emerald-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              color: 'var(--emerald-text)',
              fontSize: '24px',
            }}
          >
            ✓
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Solicitação preparada!</h3>
          <p style={{ color: 'var(--ink-72)', maxWidth: '32rem', margin: '0 auto 28px' }}>
            Sua solicitação foi processada e direcionada à equipe da Imbas Tecnologia para análise inicial e retorno ágil.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStatus('idle')}
          >
            Preencher novo formulário
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
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
                Empresa
              </label>
              <input
                id={`${formId}-empresa`}
                type="text"
                className="calc-input"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                placeholder="Razão social ou fantasia"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="calc-field">
              <label htmlFor={`${formId}-cnpj`} className="calc-label">
                CNPJ (se aplicável)
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
                Telefone ou WhatsApp *
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

          <div className="calc-field">
            <label htmlFor={`${formId}-email`} className="calc-label">
              E-mail corporativo *
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
              placeholder="contato@suaempresa.com.br"
            />
            {erros.email && <span className="calc-error">{erros.email}</span>}
          </div>

          <div className="calc-field">
            <label htmlFor={`${formId}-servico`} className="calc-label">
              Serviço de interesse *
            </label>
            <select
              id={`${formId}-servico`}
              className="calc-input calc-select"
              value={servico}
              onChange={e => setServico(e.target.value)}
            >
              {OPCOES_SERVICO.map(op => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label htmlFor={`${formId}-objetivo`} className="calc-label">
              Objetivo ou necessidade *
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
              placeholder="Descreva o que precisa esclarecer, o histórico da empresa ou os portais/editais de homologação..."
            />
            {erros.objetivo && <span className="calc-error">{erros.objetivo}</span>}
          </div>

          <div className="calc-field">
            <label htmlFor={`${formId}-documentos`} className="calc-label">
              Relação de documentos, edital ou link de exigências (opcional)
            </label>
            <textarea
              id={`${formId}-documentos`}
              rows={3}
              className="calc-input"
              style={{ borderRadius: '20px', resize: 'vertical' }}
              value={documentos}
              onChange={e => setDocumentos(e.target.value)}
              placeholder="Cole aqui o link do edital, portal de cadastro ou a lista de certidões e exigências..."
            />
          </div>

          <div style={{ margin: '22px 0 28px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
              style={{ fontSize: '0.88rem', color: 'var(--ink-72)', lineHeight: 1.5, cursor: 'pointer' }}
            >
              Concordo com o tratamento dos dados informados para contato, diagnóstico inicial e elaboração do escopo do serviço, em estrita conformidade com a LGPD e sigilo profissional.
            </label>
          </div>
          {erros.consentimento && (
            <div style={{ marginBottom: 16 }}>
              <span className="calc-error">{erros.consentimento}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="btn btn-gold" style={{ flex: '1 1 240px' }}>
              Enviar por E-mail institucional
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleAbrirWhatsApp}
              style={{ flex: '1 1 240px' }}
            >
              Conversar no WhatsApp
            </button>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--ink-56)',
              marginTop: 18,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Seus dados são protegidos por sigilo profissional. Não solicitamos nem compartilhamos senhas de acesso pessoal.
          </p>
        </form>
      )}
    </div>
  )
}
