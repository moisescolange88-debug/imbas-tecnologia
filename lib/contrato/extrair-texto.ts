import { extractText, getDocumentProxy } from 'unpdf'

export interface TextoExtraido {
  /** Texto por página, na ordem do documento. */
  paginas: string[]
  totalPaginas: number
  /** Média de caracteres por página — usada para detectar PDF sem camada de texto. */
  mediaCaracteres: number
  /** true quando o PDF é digitalizado (imagem pura) e precisa ir como documento para o modelo. */
  digitalizado: boolean
}

/**
 * Abaixo disso a página é considerada sem texto útil. Um PDF do PJe com camada de
 * texto passa de 1000 caracteres por página; um digitalizado devolve quase nada
 * (só cabeçalho do carimbo, quando devolve algo).
 */
const MINIMO_CARACTERES_POR_PAGINA = 120

export async function extrairTexto(pdf: Uint8Array): Promise<TextoExtraido> {
  const doc = await getDocumentProxy(pdf)
  const { text, totalPages } = await extractText(doc, { mergePages: false })
  const paginas = (text as string[]).map(p => p.replace(/[ \t]+/g, ' ').trim())

  const totalCaracteres = paginas.reduce((soma, p) => soma + p.length, 0)
  const mediaCaracteres = totalPages > 0 ? totalCaracteres / totalPages : 0

  return {
    paginas,
    totalPaginas: totalPages,
    mediaCaracteres,
    digitalizado: mediaCaracteres < MINIMO_CARACTERES_POR_PAGINA,
  }
}

/**
 * Monta o texto que vai para o modelo com marcação de página, para o modelo poder
 * citar onde encontrou cada cláusula. Páginas vazias são descartadas — em cópia
 * integral de processo elas são uma fatia relevante do documento.
 */
export function montarTextoComPaginas(paginas: string[]): string {
  return paginas
    .map((conteudo, i) => ({ conteudo, pagina: i + 1 }))
    .filter(p => p.conteudo.length > 0)
    .map(p => `<pagina numero="${p.pagina}">\n${p.conteudo}\n</pagina>`)
    .join('\n\n')
}
