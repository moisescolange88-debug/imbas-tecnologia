import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
// zod/v4 é exigido pelo helper zodOutputFormat do SDK. O resto do projeto usa a
// raiz `zod` (API v3) — não misture os dois no mesmo schema.
import * as z from 'zod/v4'
import { extrairTexto, montarTextoComPaginas } from '@/lib/contrato/extrair-texto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MODELO = 'claude-sonnet-5'

/** Limites da API: 32 MB por requisição e 600 páginas por documento. */
const MAX_BYTES = 30 * 1024 * 1024
const MAX_PAGINAS = 600

const ContratoSchema = z.object({
  tipo: z
    .string()
    .describe('Tipo do contrato: financiamento de veículo, imobiliário/SFH, consignado, empréstimo pessoal, leasing, cheque especial, cartão, outro'),
  partes: z.object({
    credor: z.string().describe('Instituição financeira ou credor. String vazia se não constar.'),
    devedor: z.string().describe('Contratante/mutuário. String vazia se não constar.'),
  }),
  valores: z.object({
    valorFinanciado: z.string().describe('Valor financiado/principal como aparece no contrato. Vazio se ausente.'),
    valorParcela: z.string().describe('Valor da parcela. Vazio se ausente.'),
    numeroParcelas: z.string().describe('Quantidade de parcelas. Vazio se ausente.'),
    valorTotal: z.string().describe('Valor total a pagar. Vazio se ausente.'),
  }),
  encargos: z.object({
    jurosMensal: z.string().describe('Taxa de juros remuneratórios ao mês. Vazio se ausente.'),
    jurosAnual: z.string().describe('Taxa de juros ao ano. Vazio se ausente.'),
    cet: z.string().describe('Custo Efetivo Total. Vazio se ausente.'),
    sistemaAmortizacao: z.string().describe('Price, SAC, SACRE, misto ou vazio se não declarado.'),
    indiceCorrecao: z.string().describe('Índice de correção (TR, IPCA, INPC...). Vazio se ausente.'),
  }),
  tarifas: z
    .array(z.object({ nome: z.string(), valor: z.string() }))
    .describe('Tarifas e despesas cobradas: TAC, cadastro, avaliação, registro, seguro, IOF. Lista vazia se nenhuma.'),
  datas: z.object({
    assinatura: z.string().describe('Data de assinatura. Vazio se ausente.'),
    primeiroVencimento: z.string().describe('Primeiro vencimento. Vazio se ausente.'),
  }),
  garantias: z.array(z.string()).describe('Alienação fiduciária, hipoteca, aval, fiança, penhor.'),
  clausulasAtencao: z
    .array(
      z.object({
        tema: z.string().describe('Ex.: capitalização mensal de juros, venda casada de seguro, comissão de permanência'),
        transcricao: z.string().describe('Trecho literal da cláusula, sem parafrasear'),
        pagina: z.number().describe('Página onde consta. 0 se não identificada.'),
      }),
    )
    .describe('Cláusulas relevantes para revisional ou repetição de indébito.'),
  camposNaoLocalizados: z
    .array(z.string())
    .describe('Nomes dos campos acima que não constam no documento. Nunca preencha um campo por dedução — liste aqui.'),
})

const SISTEMA = `Você lê contratos bancários e extrai os dados que alimentam cálculo revisional.

Regras invioláveis:
- Transcreva o que está escrito. Nunca deduza, arredonde, converta ou complete um valor que não esteja no documento.
- Campo ausente entra como string vazia e o nome do campo vai em camposNaoLocalizados.
- Não converta taxa mensal em anual (nem o inverso). Registre só o que o contrato declara.
- Em clausulasAtencao, transcreva o trecho literal — não parafraseie.
- O documento é entregue com marcações <pagina numero="N">. Use esse número em pagina.`

interface Corpo {
  /** PDF em base64, sem prefixo data:. */
  pdfBase64?: string
  /** Texto já extraído, quando a extração acontece fora daqui. */
  texto?: string
  /** Pergunta livre sobre o contrato. Quando ausente, faz só a extração estruturada. */
  pergunta?: string
}

export async function POST(req: Request) {
  try {
    const { pdf, texto, pergunta } = await lerEntrada(req)

    const client = new Anthropic()
    let conteudoDocumento: Anthropic.ContentBlockParam
    let aviso: string | null = null

    if (texto) {
      conteudoDocumento = { type: 'text', text: texto, cache_control: { type: 'ephemeral' } }
    } else if (pdf) {
      if (pdf.byteLength > MAX_BYTES) {
        return NextResponse.json(
          { erro: `PDF de ${(pdf.byteLength / 1024 / 1024).toFixed(1)} MB excede o limite de 30 MB.` },
          { status: 413 },
        )
      }

      const extraido = await extrairTexto(pdf)
      if (extraido.totalPaginas > MAX_PAGINAS) {
        return NextResponse.json(
          { erro: `Documento com ${extraido.totalPaginas} páginas excede o limite de ${MAX_PAGINAS}.` },
          { status: 413 },
        )
      }

      if (extraido.digitalizado) {
        // Sem camada de texto: o PDF vai como documento e o modelo lê as páginas
        // por visão. Custa na ordem de 1500 a 4800 tokens por página, contra ~700
        // de uma página de texto — daí o aviso.
        conteudoDocumento = {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: Buffer.from(pdf).toString('base64') },
          cache_control: { type: 'ephemeral' },
        }
        aviso = `PDF sem camada de texto (${extraido.totalPaginas} páginas lidas por visão). Passar por OCR antes reduz o custo em cerca de 5x.`
      } else {
        conteudoDocumento = {
          type: 'text',
          text: montarTextoComPaginas(extraido.paginas),
          cache_control: { type: 'ephemeral' },
        }
      }
    } else {
      return NextResponse.json({ erro: 'Envie o contrato em pdfBase64, arquivo ou texto.' }, { status: 400 })
    }

    // Sem pergunta: extração estruturada. O schema devolve objeto validado, sem
    // parsing de texto livre no cliente.
    if (!pergunta) {
      const resposta = await client.messages.parse({
        model: MODELO,
        max_tokens: 16000,
        system: SISTEMA,
        // O default do Sonnet 5 é effort high. Extração dirigida por schema não
        // precisa disso — medium é o corte de custo que não muda o resultado.
        output_config: { effort: 'medium', format: zodOutputFormat(ContratoSchema) },
        messages: [
          {
            role: 'user',
            content: [conteudoDocumento, { type: 'text', text: 'Extraia os dados deste contrato.' }],
          },
        ],
      })

      if (resposta.stop_reason === 'refusal') {
        return NextResponse.json({ erro: 'A leitura foi recusada pelos filtros do modelo.' }, { status: 422 })
      }

      return NextResponse.json({
        contrato: resposta.parsed_output,
        aviso,
        uso: resumirUso(resposta.usage),
      })
    }

    // Com pergunta: resposta em texto. O documento fica antes do cache_control,
    // então perguntas seguintes sobre o mesmo contrato leem do cache (~0,1x).
    const resposta = await client.messages.create({
      model: MODELO,
      max_tokens: 16000,
      system: SISTEMA,
      output_config: { effort: 'medium' },
      messages: [
        { role: 'user', content: [conteudoDocumento, { type: 'text', text: pergunta }] },
      ],
    })

    if (resposta.stop_reason === 'refusal') {
      return NextResponse.json({ erro: 'A leitura foi recusada pelos filtros do modelo.' }, { status: 422 })
    }

    const textoResposta = resposta.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('\n')

    return NextResponse.json({ resposta: textoResposta, aviso, uso: resumirUso(resposta.usage) })
  } catch (err: any) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ erro: 'Limite de requisições atingido. Tente em instantes.' }, { status: 429 })
    }
    // APIConnectionError é subclasse de APIError no SDK TypeScript — checar antes.
    if (err instanceof Anthropic.APIConnectionError) {
      return NextResponse.json({ erro: 'Não foi possível alcançar a API.' }, { status: 502 })
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json({ erro: `Falha na leitura: ${err.message}` }, { status: err.status ?? 502 })
    }
    return NextResponse.json({ erro: err?.message || 'Falha ao ler o contrato.' }, { status: 400 })
  }
}

async function lerEntrada(req: Request): Promise<{ pdf?: Uint8Array; texto?: string; pergunta?: string }> {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const arquivo = form.get('arquivo')
    const pergunta = (form.get('pergunta') as string) || undefined
    if (arquivo instanceof File) {
      return { pdf: new Uint8Array(await arquivo.arrayBuffer()), pergunta }
    }
    return { texto: (form.get('texto') as string) || undefined, pergunta }
  }

  const body = (await req.json()) as Corpo
  return {
    pdf: body.pdfBase64 ? new Uint8Array(Buffer.from(body.pdfBase64, 'base64')) : undefined,
    texto: body.texto,
    pergunta: body.pergunta,
  }
}

function resumirUso(uso: Anthropic.Usage) {
  return {
    entrada: uso.input_tokens,
    saida: uso.output_tokens,
    cacheEscrito: uso.cache_creation_input_tokens ?? 0,
    cacheLido: uso.cache_read_input_tokens ?? 0,
  }
}
