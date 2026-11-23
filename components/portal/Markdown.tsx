import { Fragment, type ReactNode } from 'react'

/**
 * Mostra o texto das ferramentas (Markdown simples) sem nunca interpretar HTML:
 * tudo vira elemento React, e só links http(s) viram âncoras.
 */

const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\(https?:\/\/[^)\s]+\)|\*[^*\n]+\*)/g

function inline(texto: string, chave: string): ReactNode[] {
  return texto.split(INLINE).map((p, i) => {
    const k = `${chave}-${i}`
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={k}>{p.slice(2, -2)}</strong>
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2) return <code key={k}>{p.slice(1, -1)}</code>
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={k}>{p.slice(1, -1)}</em>
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(p)
    if (link) return <a key={k} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>
    return <Fragment key={k}>{p}</Fragment>
  })
}

const celulas = (linha: string) => linha.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
const ehSeparador = (linha: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(linha)

export default function Markdown({ texto }: { texto: string }) {
  const linhas = texto.replace(/\r/g, '').split('\n')
  const blocos: ReactNode[] = []
  let i = 0
  while (i < linhas.length) {
    const l = linhas[i]
    const k = `b${i}`
    if (!l.trim()) { i++; continue }

    if (l.trim().startsWith('```')) {
      const corpo: string[] = []
      i++
      while (i < linhas.length && !linhas[i].trim().startsWith('```')) corpo.push(linhas[i++])
      i++
      blocos.push(<pre key={k}><code>{corpo.join('\n')}</code></pre>)
      continue
    }
    const titulo = /^(#{1,4})\s+(.*)$/.exec(l)
    if (titulo) {
      const T = (['h3', 'h3', 'h4', 'h5'] as const)[titulo[1].length - 1]
      blocos.push(<T key={k}>{inline(titulo[2], k)}</T>)
      i++
      continue
    }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { blocos.push(<hr key={k} />); i++; continue }

    if (l.includes('|') && i + 1 < linhas.length && ehSeparador(linhas[i + 1])) {
      const cab = celulas(l)
      const corpo: string[][] = []
      i += 2
      while (i < linhas.length && linhas[i].includes('|') && linhas[i].trim()) corpo.push(celulas(linhas[i++]))
      blocos.push(
        <div className="pt-tabela" key={k}>
          <table>
            <thead><tr>{cab.map((c, n) => <th key={n}>{inline(c, `${k}h${n}`)}</th>)}</tr></thead>
            <tbody>
              {corpo.map((linha, r) => (
                <tr key={r}>{cab.map((_, n) => <td key={n}>{inline(linha[n] ?? '', `${k}r${r}c${n}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }
    const item = /^\s*([-*•]|\d+[.)])\s+(.*)$/.exec(l)
    if (item) {
      const numerada = /\d/.test(item[1])
      const itens: string[] = []
      while (i < linhas.length) {
        const m = /^\s*([-*•]|\d+[.)])\s+(.*)$/.exec(linhas[i])
        if (m) itens.push(m[2])
        else if (linhas[i].trim() && /^\s{2,}/.test(linhas[i]) && itens.length) itens[itens.length - 1] += ' ' + linhas[i].trim()
        else break
        i++
      }
      const L = numerada ? 'ol' : 'ul'
      blocos.push(<L key={k}>{itens.map((t, n) => <li key={n}>{inline(t, `${k}i${n}`)}</li>)}</L>)
      continue
    }
    if (l.trim().startsWith('>')) {
      const corpo: string[] = []
      while (i < linhas.length && linhas[i].trim().startsWith('>')) corpo.push(linhas[i++].trim().replace(/^>\s?/, ''))
      blocos.push(<blockquote key={k}>{inline(corpo.join(' '), k)}</blockquote>)
      continue
    }
    const par: string[] = []
    while (
      i < linhas.length && linhas[i].trim() && !/^(#{1,4})\s/.test(linhas[i]) && !linhas[i].trim().startsWith('```') &&
      !/^\s*([-*•]|\d+[.)])\s+/.test(linhas[i]) && !(linhas[i].includes('|') && i + 1 < linhas.length && ehSeparador(linhas[i + 1]))
    ) par.push(linhas[i++])
    if (!par.length) par.push(linhas[i++])
    blocos.push(
      <p key={k}>
        {par.map((t, n) => (
          <Fragment key={n}>{n > 0 && <br />}{inline(t, `${k}p${n}`)}</Fragment>
        ))}
      </p>,
    )
  }
  return <div className="pt-md">{blocos}</div>
}
