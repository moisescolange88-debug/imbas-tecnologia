'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import Markdown from './Markdown'

type Ferramenta = {
  id: string; nome: string; resumo: string; exemplos: string[]; anexos: boolean; extensoes: string[]; quantidade: number; no_ar: boolean
  limite_arquivo: number // maior arquivo que a ferramenta lê
  arquivo_maximo: number // maior .txt aceito (acima do limite da ferramenta, o servidor compacta antes de entregar)
  compacta: boolean
}
type Estado = {
  usuario: { nome: string; email: string; provisoria: boolean; termo: boolean }
  acesso: { ativo: boolean; creditos: number; validade: string | null; motivo: string }
  ferramentas: Ferramenta[]
  limites: { mensagens_por_caso: number; senha_minima: number; mensagem_maxima: number }
  termo: { versao: string; texto: string }
}
type Arquivo = { id: string; nome: string; tamanho: number }
type Mensagem = { id: number; papel: 'cliente' | 'ferramenta'; texto: string; estado: 'pronto' | 'fila' | 'andamento' | 'erro'; anexos: { nome: string; tamanho: number }[]; arquivos: Arquivo[] }
type Caso = { id: string; ferramenta: string; titulo: string; mensagens: Mensagem[]; restantes: number }
type Resumo = { id: string; ferramenta: string; ferramenta_nome: string; titulo: string; atualizada_em: string }

type Andamento = { fase: 'compactando' | 'enviando' | 'enviado'; fracao: number }
const PARTE_PADRAO = 2 * 1024 * 1024 // cada pedido ao site leva no máximo 4 MB; arquivo maior segue em partes
const WHATSAPP = 'https://wa.me/5519974128714?text=' + encodeURIComponent('Olá! Quero acesso às ferramentas da Área do Cliente da Imbas Tecnologia.')

class Falha extends Error {
  constructor(public status: number, mensagem: string) { super(mensagem) }
}

async function api<T = any>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  let r: Response
  try {
    r = await fetch('/api/portal' + caminho, { ...opcoes, credentials: 'same-origin', cache: 'no-store', headers: { 'x-portal': '1', ...(opcoes.headers || {}) } })
  } catch {
    throw new Falha(0, 'Sem conexão com o site. Confira a internet e tente de novo.')
  }
  let d: any = null
  try { d = await r.json() } catch { /* resposta sem corpo */ }
  if (!r.ok) throw new Falha(r.status, (d && typeof d.detail === 'string' && d.detail) || 'Não foi possível concluir. Tente de novo.')
  return d as T
}

const enviarJson = (caminho: string, corpo: unknown) =>
  api(caminho, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo) })

const dataBr = (iso: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '')
const tamanho = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(1).replace(/\.0$/, '').replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB')
const extensao = (nome: string) => '.' + (nome.split('.').pop() || '').toLowerCase()
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Texto (SPED, CSV) encolhe umas dez vezes: é compactado aqui mesmo, antes de subir, quando o navegador sabe fazer isso.
async function compactar(arq: File): Promise<Blob | null> {
  if (typeof CompressionStream === 'undefined' || arq.size < 512 * 1024 || !['.txt', '.csv'].includes(extensao(arq.name))) return null
  try {
    const fluxo = (arq.stream() as ReadableStream<any>).pipeThrough(new CompressionStream('gzip') as any)
    const menor = await new Response(fluxo as ReadableStream).blob()
    return menor.size < arq.size ? menor : null
  } catch {
    return null
  }
}

// Manda um anexo ao servidor em partes, uma de cada vez, e devolve o código do envio (citado depois na pergunta).
async function enviarArquivo(ferramenta: string, arq: File, avisar: (a: Andamento) => void): Promise<string> {
  avisar({ fase: 'compactando', fracao: 0 })
  const menor = await compactar(arq)
  const corpo: Blob = menor || arq
  const aberto = await enviarJson('/api/envio', { ferramenta, nome: arq.name, tamanho: arq.size, bytes: corpo.size, compactado: !!menor }) as { id: string; parte: number }
  const parte = Math.min(Math.max(Number(aberto.parte) || PARTE_PADRAO, 256 * 1024), 3 * 1024 * 1024)
  avisar({ fase: 'enviando', fracao: 0 })
  for (let n = 0, inicio = 0; inicio < corpo.size; n++, inicio += parte) {
    const fatia = corpo.slice(inicio, inicio + parte)
    for (let tentativa = 1; ; tentativa++) {
      try {
        await api(`/api/envio/${aberto.id}/${n}`, { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: fatia })
        break
      } catch (f) {
        const status = (f as Falha).status
        // queda de conexão ou servidor sem responder: tenta a mesma parte de novo (o servidor não grava duas vezes)
        if (![0, 502, 504].includes(status) || tentativa >= 4) throw f
        await espera(1500 * tentativa)
      }
    }
    avisar({ fase: 'enviando', fracao: Math.min(1, (inicio + fatia.size) / corpo.size) })
  }
  avisar({ fase: 'enviado', fracao: 1 })
  return aberto.id
}
const maiusculaInicial = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t)

export default function Portal() {
  const [fase, setFase] = useState<'carregando' | 'entrada' | 'painel' | 'fora'>('carregando')
  const [estado, setEstado] = useState<Estado | null>(null)
  const [aviso, setAviso] = useState('')

  const carregar = useCallback(async () => {
    try {
      setEstado(await api<Estado>('/api/estado'))
      setFase('painel')
    } catch (e) {
      const f = e as Falha
      if (f.status === 401) { setEstado(null); setFase('entrada') }
      else { setAviso(f.message); setFase('fora') }
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const sair = async () => {
    try { await api('/sair', { method: 'POST' }) } catch { /* a sessão cai de qualquer jeito */ }
    setEstado(null)
    setFase('entrada')
  }

  return (
    <div className="pt-pagina">
      <div className="wrap">
        {fase === 'carregando' && <p className="pt-espera" role="status">Abrindo a Área do Cliente…</p>}
        {fase === 'fora' && (
          <div className="pt-cartao pt-estreito">
            <h1 className="pt-titulo">Área do Cliente</h1>
            <p className="pt-erro" role="alert">{aviso}</p>
            <button className="btn btn-ghost btn-sm" onClick={() => { setFase('carregando'); carregar() }}>Tentar de novo</button>
          </div>
        )}
        {fase === 'entrada' && <Entrada aoEntrar={carregar} />}
        {fase === 'painel' && estado && (
          estado.usuario.provisoria ? <TrocarSenha estado={estado} aoTrocar={carregar} aoSair={sair} />
            : !estado.usuario.termo ? <Termo estado={estado} aoAceitar={carregar} aoSair={sair} />
              : <Painel estado={estado} recarregar={carregar} aoSair={sair} />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ entrada */

function Entrada({ aoEntrar }: { aoEntrar: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const entrar = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await enviarJson('/entrar', { email, senha })
      aoEntrar()
    } catch (f) {
      setErro(maiusculaInicial((f as Falha).message))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pt-entrada">
      <div className="pt-entrada-texto">
        <p className="eyebrow"><span className="glyph">ᚑ</span> Área do Cliente</p>
        <h1 className="pt-titulo-grande">Suas ferramentas de cálculo tributário, em um só lugar.</h1>
        <p className="pt-lede">
          Envie os documentos da empresa e receba o cálculo conferido, os cenários comparados e os arquivos prontos para o contador revisar e assinar.
        </p>
        <ul className="pt-lista-ferramentas">
          <li><b>Dívida com a União e CAPAG</b><span>Capacidade de pagamento, cenários de negociação com a PGFN e o dossiê do pedido de revisão.</span></li>
          <li><b>Reforma Tributária e Planejamento</b><span>Transição de 2026 a 2033 com a calculadora oficial da Receita, comparação de regimes e leitura de ECF e EFD.</span></li>
        </ul>
        <p className="pt-nota">
          Ainda não tem acesso? <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">Fale com a Imbas Tecnologia pelo WhatsApp</a>.
        </p>
      </div>
      <form className="pt-cartao" onSubmit={entrar} noValidate>
        <h2 className="pt-titulo">Entrar</h2>
        <div className="calc-field">
          <label className="calc-label" htmlFor="pt-email">E-mail</label>
          <input id="pt-email" className="calc-input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="calc-field">
          <label className="calc-label" htmlFor="pt-senha">Senha</label>
          <input id="pt-senha" className="calc-input" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        {erro && <p className="pt-erro" role="alert">{erro}</p>}
        <button className="btn btn-gold pt-largo" type="submit" disabled={enviando || !email || !senha}>{enviando ? 'Entrando…' : 'Entrar'}</button>
        <p className="pt-nota">No primeiro acesso, use a senha provisória que você recebeu da Imbas. Esqueceu a senha? Peça uma nova pelo WhatsApp.</p>
      </form>
    </div>
  )
}

function TrocarSenha({ estado, aoTrocar, aoSair }: { estado: Estado; aoTrocar: () => void; aoSair: () => void }) {
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [repete, setRepete] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const minimo = estado.limites.senha_minima

  const trocar = async (e: FormEvent) => {
    e.preventDefault()
    if (nova.length < minimo) return setErro(`A nova senha precisa ter pelo menos ${minimo} caracteres.`)
    if (nova !== repete) return setErro('As duas senhas novas não são iguais.')
    setErro('')
    setEnviando(true)
    try {
      await enviarJson('/api/trocar-senha', { atual, nova })
      aoTrocar()
    } catch (f) {
      setErro(maiusculaInicial((f as Falha).message))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="pt-cartao pt-estreito" onSubmit={trocar} noValidate>
      <h1 className="pt-titulo">Crie a sua senha</h1>
      <p className="pt-nota">Olá, {estado.usuario.nome}. A senha que você recebeu é provisória. Escolha uma senha só sua, com pelo menos {minimo} caracteres.</p>
      <div className="calc-field">
        <label className="calc-label" htmlFor="pt-atual">Senha provisória</label>
        <input id="pt-atual" className="calc-input" type="password" autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} />
      </div>
      <div className="calc-field">
        <label className="calc-label" htmlFor="pt-nova">Nova senha</label>
        <input id="pt-nova" className="calc-input" type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} />
      </div>
      <div className="calc-field">
        <label className="calc-label" htmlFor="pt-repete">Repita a nova senha</label>
        <input id="pt-repete" className="calc-input" type="password" autoComplete="new-password" value={repete} onChange={(e) => setRepete(e.target.value)} />
      </div>
      {erro && <p className="pt-erro" role="alert">{erro}</p>}
      <div className="pt-acoes">
        <button className="btn btn-gold" type="submit" disabled={enviando || !atual || !nova || !repete}>{enviando ? 'Salvando…' : 'Salvar senha'}</button>
        <button className="btn btn-ghost-light" type="button" onClick={aoSair}>Sair</button>
      </div>
    </form>
  )
}

function Termo({ estado, aoAceitar, aoSair }: { estado: Estado; aoAceitar: () => void; aoSair: () => void }) {
  const [marcado, setMarcado] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const aceitar = async () => {
    setErro('')
    setEnviando(true)
    try {
      await enviarJson('/api/termo', { aceito: true, versao: estado.termo.versao })
      aoAceitar()
    } catch (f) {
      setErro(maiusculaInicial((f as Falha).message))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pt-cartao pt-medio">
      <h1 className="pt-titulo">Antes de começar</h1>
      <div className="pt-termo">
        {estado.termo.texto.split('\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <label className="pt-marcar">
        <input type="checkbox" checked={marcado} onChange={(e) => setMarcado(e.target.checked)} />
        <span>Li e estou de acordo.</span>
      </label>
      {erro && <p className="pt-erro" role="alert">{erro}</p>}
      <div className="pt-acoes">
        <button className="btn btn-gold" onClick={aceitar} disabled={!marcado || enviando}>{enviando ? 'Registrando…' : 'Continuar'}</button>
        <button className="btn btn-ghost-light" type="button" onClick={aoSair}>Sair</button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ painel */

function Painel({ estado, recarregar, aoSair }: { estado: Estado; recarregar: () => void; aoSair: () => void }) {
  const [casos, setCasos] = useState<Resumo[]>([])
  const [aberto, setAberto] = useState<string | null>(null)      // id do caso aberto; null = tela de caso novo
  const [caso, setCaso] = useState<Caso | null>(null)
  const [erro, setErro] = useState('')
  const [listaAberta, setListaAberta] = useState(false)          // só muda algo no celular
  const fimRef = useRef<HTMLDivElement>(null)
  const { acesso } = estado

  const listar = useCallback(async () => {
    try { setCasos((await api<{ conversas: Resumo[] }>('/api/conversas')).conversas) } catch (f) { if ((f as Falha).status === 401) recarregar() }
  }, [recarregar])

  const abrir = useCallback(async (id: string) => {
    try {
      setCaso(await api<Caso>(`/api/conversa/${id}`))
      setErro('')
    } catch (f) {
      if ((f as Falha).status === 401) return recarregar()
      setErro(maiusculaInicial((f as Falha).message))
    }
  }, [recarregar])

  useEffect(() => { listar() }, [listar])
  useEffect(() => { if (aberto) abrir(aberto); else setCaso(null) }, [aberto, abrir])

  const ultima = caso?.mensagens[caso.mensagens.length - 1]
  const preparando = !!ultima && (ultima.estado === 'fila' || ultima.estado === 'andamento')

  // enquanto a resposta está em preparo, consulta o servidor a cada 3 segundos
  useEffect(() => {
    if (!aberto || !preparando) return
    const t = setInterval(() => abrir(aberto), 3000)
    return () => clearInterval(t)
  }, [aberto, preparando, abrir])

  // quando a resposta chega (ou falha), atualiza os créditos e a lista
  const estadoUltima = ultima?.estado
  useEffect(() => {
    if (estadoUltima === 'pronto' || estadoUltima === 'erro') { recarregar(); listar() }
  }, [estadoUltima, ultima?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fimRef.current?.scrollIntoView({ block: 'end' }) }, [caso?.mensagens.length, estadoUltima])

  const enviar = async (ferramenta: string | null, mensagem: string, envios: string[]) => {
    const corpo = new FormData()
    corpo.set('mensagem', mensagem)
    if (aberto) corpo.set('conversa', aberto)
    else if (ferramenta) corpo.set('ferramenta', ferramenta)
    for (const id of envios) corpo.append('envios', id) // os anexos já subiram em partes; aqui vai só o código de cada um
    const r = await api<{ conversa: string }>('/api/pergunta', { method: 'POST', body: corpo })
    if (aberto === r.conversa) await abrir(r.conversa)
    else setAberto(r.conversa)
    listar()
    recarregar()
  }

  const apagar = async () => {
    if (!caso || !window.confirm('Apagar este caso e os arquivos gerados? Não dá para desfazer, e o crédito usado não volta.')) return
    try {
      await api(`/api/conversa/${caso.id}`, { method: 'DELETE' })
      setAberto(null)
      listar()
    } catch (f) {
      setErro(maiusculaInicial((f as Falha).message))
    }
  }

  const ferramentaDoCaso = useMemo(() => estado.ferramentas.find((f) => f.id === caso?.ferramenta) || null, [estado.ferramentas, caso?.ferramenta])

  return (
    <div className="pt-painel">
      <header className="pt-topo">
        <div>
          <p className="eyebrow"><span className="glyph">ᚑ</span> Área do Cliente</p>
          <h1 className="pt-titulo">Olá, {estado.usuario.nome}</h1>
        </div>
        <div className="pt-saldo">
          <span className="pt-saldo-item"><b>{acesso.creditos}</b> {acesso.creditos === 1 ? 'caso disponível' : 'casos disponíveis'}</span>
          <span className="pt-saldo-item">{acesso.validade ? <>Acesso até <b>{dataBr(acesso.validade)}</b></> : 'Acesso sem data de término'}</span>
          <button className="btn btn-ghost-light btn-sm" onClick={aoSair}>Sair</button>
        </div>
      </header>

      {!acesso.ativo && (
        <div className="pt-faixa" role="alert">
          <span>{acesso.motivo}</span>
          <a className="btn btn-gold btn-sm" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Falar com a Imbas</a>
        </div>
      )}

      <div className={`pt-corpo ${listaAberta ? 'pt-mostra-lista' : ''}`}>
        <aside className="pt-lateral" aria-label="Seus casos">
          <button className="btn btn-gold btn-sm pt-largo" onClick={() => { setAberto(null); setListaAberta(false) }}>Novo caso</button>
          <ul className="pt-casos">
            {casos.length === 0 && <li className="pt-vazio">Seus casos aparecem aqui.</li>}
            {casos.map((c) => (
              <li key={c.id}>
                <button className={`pt-caso ${c.id === aberto ? 'is-atual' : ''}`} onClick={() => { setAberto(c.id); setListaAberta(false) }}>
                  <span className="pt-caso-titulo">{c.titulo}</span>
                  <span className="pt-caso-meta">{c.ferramenta_nome} · {dataBr(c.atualizada_em)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="pt-principal">
          <button className="pt-voltar" onClick={() => setListaAberta(true)}>← Seus casos ({casos.length})</button>
          {erro && <p className="pt-erro" role="alert">{erro}</p>}

          {!aberto && <NovoCaso estado={estado} aoEnviar={enviar} />}

          {aberto && caso && (
            <>
              <div className="pt-caso-cabeca">
                <div>
                  <h2 className="pt-subtitulo">{caso.titulo}</h2>
                  <p className="pt-caso-meta">{ferramentaDoCaso?.nome}</p>
                </div>
                <button className="pt-link" onClick={apagar} disabled={preparando}>Apagar caso</button>
              </div>
              <div className="pt-mensagens" aria-live="polite">
                {caso.mensagens.map((m) => <Balao key={m.id} m={m} />)}
                <div ref={fimRef} />
              </div>
              {caso.restantes > 0 && acesso.ativo ? (
                <Compositor
                  ferramenta={ferramentaDoCaso}
                  ocupado={preparando}
                  rotulo="Enviar"
                  dica={`Este caso ainda aceita ${caso.restantes} ${caso.restantes === 1 ? 'mensagem' : 'mensagens'}. Continuar um caso não consome crédito.`}
                  maximo={estado.limites.mensagem_maxima}
                  aoEnviar={(texto, envios) => enviar(null, texto, envios)}
                />
              ) : (
                <p className="pt-nota">{acesso.ativo ? 'Este caso chegou ao limite de mensagens. Abra um caso novo para continuar.' : acesso.motivo}</p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

function Balao({ m }: { m: Mensagem }) {
  if (m.papel === 'cliente') {
    return (
      <div className="pt-balao pt-balao-cliente">
        <p>{m.texto}</p>
        {m.anexos.length > 0 && (
          <ul className="pt-anexos">{m.anexos.map((a, i) => <li key={i}>{a.nome} · {tamanho(a.tamanho)}</li>)}</ul>
        )}
      </div>
    )
  }
  const preparando = m.estado === 'fila' || m.estado === 'andamento'
  return (
    <div className={`pt-balao pt-balao-ferramenta ${m.estado === 'erro' ? 'pt-balao-erro' : ''}`}>
      {preparando && (
        <p className="pt-espera" role="status">
          <span className="pt-pulso" aria-hidden="true" />
          {m.estado === 'fila' ? 'Na fila: há outros cálculos na frente.' : 'Calculando e redigindo. Costuma levar de 1 a 3 minutos; pode deixar esta página aberta.'}
        </p>
      )}
      {m.estado === 'erro' ? <p>{maiusculaInicial(m.texto)}.</p> : m.texto && <Markdown texto={m.texto} />}
      {m.arquivos.length > 0 && (
        <ul className="pt-arquivos">
          {m.arquivos.map((a) => (
            <li key={a.id}>
              <a className="pt-arquivo" href={`/api/portal/api/arquivo/${a.id}`} download={a.nome}>
                <span className="pt-arquivo-nome">{a.nome}</span>
                <span className="pt-arquivo-meta">Baixar · {tamanho(a.tamanho)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NovoCaso({ estado, aoEnviar }: { estado: Estado; aoEnviar: (ferramenta: string, texto: string, envios: string[]) => Promise<void> }) {
  const [escolhida, setEscolhida] = useState(estado.ferramentas[0]?.id || '')
  const [exemplo, setExemplo] = useState('')
  const f = estado.ferramentas.find((x) => x.id === escolhida) || null
  const { acesso } = estado
  const pode = acesso.ativo && acesso.creditos > 0

  return (
    <div className="pt-novo">
      <h2 className="pt-subtitulo">Abrir um caso novo</h2>
      <div className="pt-opcoes" role="radiogroup" aria-label="Ferramenta">
        {estado.ferramentas.map((x) => (
          <button key={x.id} role="radio" aria-checked={x.id === escolhida} className={`pt-opcao ${x.id === escolhida ? 'is-atual' : ''}`} onClick={() => { setEscolhida(x.id); setExemplo('') }}>
            <b>{x.nome}</b>
            <span>{x.resumo}</span>
            {!x.no_ar && <em>Fora do ar no momento</em>}
          </button>
        ))}
      </div>
      {f && f.exemplos.length > 0 && (
        <div className="pt-exemplos">
          <span className="calc-label">Exemplos de pedido</span>
          {f.exemplos.map((e, i) => <button key={i} className="pt-exemplo" onClick={() => setExemplo(e)}>{e}</button>)}
        </div>
      )}
      {pode ? (
        <Compositor
          key={escolhida + exemplo}
          ferramenta={f}
          ocupado={false}
          inicial={exemplo}
          rotulo="Abrir caso (1 crédito)"
          dica="Abrir um caso consome 1 crédito e inclui as perguntas de continuação. Se a primeira resposta falhar, o crédito volta."
          maximo={estado.limites.mensagem_maxima}
          aoEnviar={(texto, envios) => aoEnviar(escolhida, texto, envios)}
        />
      ) : (
        <div className="pt-faixa">
          <span>{acesso.ativo ? 'Você não tem crédito para abrir um caso novo.' : acesso.motivo}</span>
          <a className="btn btn-gold btn-sm" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Contratar créditos</a>
        </div>
      )}
    </div>
  )
}

function Compositor({ ferramenta, ocupado, rotulo, dica, maximo, inicial = '', aoEnviar }: {
  ferramenta: Ferramenta | null; ocupado: boolean; rotulo: string; dica: string; maximo: number; inicial?: string
  aoEnviar: (texto: string, envios: string[]) => Promise<void>
}) {
  const [texto, setTexto] = useState(inicial)
  const [arquivos, setArquivos] = useState<File[]>([])
  const [andamento, setAndamento] = useState<Map<File, Andamento>>(new Map())
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const campo = useRef<HTMLInputElement>(null)
  const subidos = useRef(new Map<File, string>()) // anexos que já estão no servidor: não sobem de novo se o envio da mensagem falhar
  const aceita = ferramenta?.anexos ? ferramenta.extensoes : []

  const escolher = (lista: FileList | null) => {
    if (!lista || !ferramenta) return
    const novos = [...arquivos]
    let recusa = ''
    for (const a of Array.from(lista)) {
      const ext = extensao(a.name)
      if (!aceita.includes(ext)) recusa = `Tipo de arquivo não aceito: ${a.name}. Aceitos: ${aceita.join(', ')}.`
      else if (a.size === 0) recusa = `O arquivo ${a.name} está vazio.`
      else if (a.size > (ext === '.txt' ? ferramenta.arquivo_maximo : ferramenta.limite_arquivo)) {
        recusa = `${a.name} tem ${tamanho(a.size)}; arquivos ${ext} vão até ${tamanho(ext === '.txt' ? ferramenta.arquivo_maximo : ferramenta.limite_arquivo)} nesta ferramenta.`
      } else if (!novos.some((n) => n.name === a.name && n.size === a.size)) novos.push(a)
    }
    if (campo.current) campo.current.value = ''
    if (novos.length > ferramenta.quantidade) return setErro(`São aceitos até ${ferramenta.quantidade} anexos por mensagem.`)
    setErro(recusa)
    setArquivos(novos)
  }

  const remover = (a: File) => {
    const id = subidos.current.get(a)
    if (id) api(`/api/envio/${id}`, { method: 'DELETE' }).catch(() => { /* o servidor apaga sozinho depois de um tempo */ })
    subidos.current.delete(a)
    setAndamento((m) => { const n = new Map(m); n.delete(a); return n })
    setArquivos((lista) => lista.filter((x) => x !== a))
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!ferramenta || (!texto.trim() && arquivos.length === 0)) return
    setErro('')
    setEnviando(true)
    try {
      const envios: string[] = []
      for (const a of arquivos) {
        let id = subidos.current.get(a)
        if (!id) {
          id = await enviarArquivo(ferramenta.id, a, (x) => setAndamento((m) => new Map(m).set(a, x)))
          subidos.current.set(a, id)
        }
        envios.push(id)
      }
      await aoEnviar(texto.trim(), envios)
      subidos.current.clear()
      setAndamento(new Map())
      setTexto('')
      setArquivos([])
    } catch (f) {
      const falha = f as Falha
      if (falha.status === 410) { subidos.current.clear(); setAndamento(new Map()) } // o servidor não tem mais os anexos: sobem de novo
      else setAndamento((m) => new Map(Array.from(m).filter(([a]) => subidos.current.has(a))))
      setErro(maiusculaInicial(falha.message || 'Não foi possível enviar. Tente de novo.'))
    } finally {
      setEnviando(false)
    }
  }

  const situacao = (a: File) => {
    const x = andamento.get(a)
    if (!x) return ''
    if (x.fase === 'compactando') return ' · preparando…'
    if (x.fase === 'enviando') return ` · enviando ${Math.round(x.fracao * 100)}%`
    return ' · enviado'
  }
  const subindo = enviando && arquivos.some((a) => andamento.get(a)?.fase !== 'enviado')

  const parado = ocupado || enviando || !ferramenta || !ferramenta.no_ar
  return (
    <form className="pt-compositor" onSubmit={enviar}>
      <label className="calc-label" htmlFor="pt-texto">Seu pedido</label>
      <textarea
        id="pt-texto" className="calc-input pt-texto" rows={4} maxLength={maximo} value={texto} disabled={parado}
        placeholder="Descreva o caso: valores da dívida, regime, receita, o que você quer calcular…"
        onChange={(e) => setTexto(e.target.value)}
      />
      {arquivos.length > 0 && (
        <ul className="pt-anexos">
          {arquivos.map((a, i) => (
            <li key={i}>
              {a.name} · {tamanho(a.size)}<span aria-live="polite">{situacao(a)}</span>{' '}
              <button type="button" className="pt-link" disabled={enviando} onClick={() => remover(a)} aria-label={`Remover ${a.name}`}>remover</button>
              {andamento.get(a)?.fase === 'enviando' && <progress className="pt-barra" max={1} value={andamento.get(a)?.fracao || 0} />}
            </li>
          ))}
        </ul>
      )}
      {erro && <p className="pt-erro" role="alert">{erro}</p>}
      <div className="pt-acoes">
        <button className="btn btn-gold" type="submit" disabled={parado || (!texto.trim() && arquivos.length === 0)}>{subindo ? 'Enviando anexos…' : enviando ? 'Enviando…' : ocupado ? 'Aguarde a resposta' : rotulo}</button>
        {aceita.length > 0 && (
          <>
            <input ref={campo} id="pt-anexo" className="pt-oculto" type="file" multiple accept={aceita.join(',')} disabled={parado} onChange={(e) => escolher(e.target.files)} />
            <label htmlFor="pt-anexo" className={`btn btn-ghost-light ${parado ? 'is-parado' : ''}`}>Anexar documentos</label>
          </>
        )}
      </div>
      <p className="pt-nota">
        {dica}
        {ferramenta && aceita.length > 0 && (
          <> Anexos aceitos: {aceita.join(', ')}, até {tamanho(ferramenta.limite_arquivo)} por arquivo
            {ferramenta.compacta && <>; SPED em .txt pode ter até {tamanho(ferramenta.arquivo_maximo)}, porque é compactado no envio</>}.
          </>
        )}
      </p>
    </form>
  )
}
