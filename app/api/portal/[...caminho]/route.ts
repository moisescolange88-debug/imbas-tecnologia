// Ponte entre a Área do Cliente (este site) e o servidor das ferramentas.
//
// O navegador do cliente só fala com este site. Esta função repassa cada pedido ao servidor, junto com uma chave
// secreta que só existe aqui (variável PORTAL_CHAVE) e no servidor. O endereço do servidor (PORTAL_BACKEND_URL)
// nunca é enviado ao navegador, e só os caminhos listados abaixo são repassados.
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const PERMITIDOS = [
  /^\/entrar$/,
  /^\/sair$/,
  /^\/api\/(estado|extrato|conversas|pergunta|trocar-senha|termo)$/,
  /^\/api\/conversa\/[a-f0-9]{32}$/,
  /^\/api\/arquivo\/[A-Za-z0-9_-]{10,40}$/,
  // anexo grande: a tela abre o envio, manda o arquivo em partes e o servidor monta
  /^\/api\/envio$/,
  /^\/api\/envio\/[A-Za-z0-9_-]{16,40}$/,
  /^\/api\/envio\/[A-Za-z0-9_-]{16,40}\/\d{1,4}$/,
]
const LIMITE = 4 * 1024 * 1024 // tamanho máximo de um pedido que passa por esta função (a Vercel corta em 4,5 MB)
const GRANDE = 'Pedido grande demais para passar pelo site. Recarregue a página e anexe o arquivo de novo.'

const recusa = (status: number, detail: string) =>
  new Response(JSON.stringify({ detail }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

async function ponte(req: Request, { params }: { params: { caminho: string[] } }) {
  const base = (process.env.PORTAL_BACKEND_URL || '').replace(/\/+$/, '')
  const chave = process.env.PORTAL_CHAVE || ''
  if (!base || chave.length < 32) return recusa(503, 'A Área do Cliente ainda não está ligada ao servidor.')

  const url = new URL(req.url)
  const caminho = '/' + (params.caminho || []).join('/')
  if (!PERMITIDOS.some((r) => r.test(caminho))) return recusa(404, 'Não encontrado.')

  // pedidos que alteram algo só valem quando partem das páginas deste mesmo site
  if (req.method !== 'GET') {
    const origem = req.headers.get('origin')
    if (!origem || origem !== url.origin) return recusa(403, 'Pedido recusado.')
  }

  const cab = new Headers()
  for (const nome of ['content-type', 'cookie', 'accept', 'x-portal']) {
    const v = req.headers.get(nome)
    if (v) cab.set(nome, v)
  }
  cab.set('x-portal-chave', chave)
  cab.set('x-portal-cliente', (req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0] || '').trim())

  let corpo: ArrayBuffer | undefined
  if (req.method !== 'GET') {
    if (Number(req.headers.get('content-length') || 0) > LIMITE) return recusa(413, GRANDE)
    corpo = await req.arrayBuffer()
    if (corpo.byteLength > LIMITE) return recusa(413, GRANDE)
  }

  let r: Response
  try {
    // pedido sem corpo (apagar um caso, remover um anexo) segue sem corpo: um corpo vazio faz o repasse falhar
    const semCorpo = !corpo || corpo.byteLength === 0
    if (semCorpo) cab.delete('content-type')
    r = await fetch(base + caminho, { method: req.method, headers: cab, body: semCorpo ? undefined : corpo, redirect: 'manual', cache: 'no-store' })
  } catch {
    return recusa(502, 'O servidor das ferramentas não respondeu. Tente de novo em instantes.')
  }
  // 403 sem sessão é a chave recusada pelo servidor: não repassa o detalhe
  if (r.status === 403 && !req.headers.get('cookie')) return recusa(503, 'A Área do Cliente ainda não está ligada ao servidor.')

  const saida = new Headers({ 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  for (const nome of ['content-type', 'content-disposition', 'content-length']) {
    const v = r.headers.get(nome)
    if (v) saida.set(nome, v)
  }
  const cookies = typeof r.headers.getSetCookie === 'function' ? r.headers.getSetCookie() : []
  for (const c of cookies) saida.append('set-cookie', c)
  return new Response(r.body, { status: r.status, headers: saida })
}

export { ponte as GET, ponte as POST, ponte as DELETE }
