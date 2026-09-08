// Barreiras contra propagação silenciosa de erro.
//
// O risco específico deste motor não é errar uma conta — é errar a mesma conta
// em todos os laudos já emitidos, sem que nada apite. As defesas aqui atacam
// as três formas dessa falha:
//
//   1. invariantes verificadas em toda execução, e não só nos testes;
//   2. versão do motor carimbada em cada memória, para responder "quais laudos
//      foram atingidos?" depois que um defeito aparece;
//   3. impressão digital das premissas, para reconferir anos depois se o
//      resultado veio daqueles dados e daquele motor.

import type {
  Confronto,
  ConfrontoAtualizado,
  ProvaDeIntegridade,
  QuadroAmortizacao,
  Violacao,
} from './tipos'

/**
 * Versão do motor de cálculo.
 *
 * INCREMENTE SEMPRE que alterar qualquer resultado numérico — fórmula,
 * arredondamento, convenção de intervalo, ordem de composição. É esse número
 * que permite, ao descobrir um defeito, identificar exatamente quais laudos
 * já protocolados foram gerados pela versão defeituosa.
 */
export const MOTOR_VERSAO = '1.0.0'

/** Tolerância de fechamento. Acima disso não é arredondamento, é defeito. */
const TOL = 0.005

function violado(
  regra: string,
  esperado: number,
  obtido: number,
  local?: string
): Violacao | null {
  const diferenca = obtido - esperado
  if (Math.abs(diferenca) <= TOL) return null
  return {
    regra,
    esperado: Number(esperado.toFixed(4)),
    obtido: Number(obtido.toFixed(4)),
    diferenca: Number(diferenca.toFixed(4)),
    local,
  }
}

/** Serialização estável — chaves ordenadas, para hash reprodutível. */
function estavel(valor: unknown): string {
  if (valor === null || typeof valor !== 'object') return JSON.stringify(valor)
  if (Array.isArray(valor)) return `[${valor.map(estavel).join(',')}]`
  const obj = valor as Record<string, unknown>
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${estavel(obj[k])}`)
    .join(',')}}`
}

/** FNV-1a de 32 bits. Serve para detectar mudança, não para segurança. */
export function impressaoDigital(valor: unknown): string {
  const texto = estavel(valor)
  let h = 0x811c9dc5
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

/**
 * Invariantes do quadro de amortização. Valem para qualquer entrada — não são
 * casos de teste, são propriedades que o resultado tem de satisfazer sempre.
 */
export function verificarQuadro(quadro: QuadroAmortizacao): Violacao[] {
  const v: (Violacao | null)[] = []
  const { linhas, totais, premissas } = quadro
  if (linhas.length === 0) return []

  v.push(
    violado(
      'soma das amortizações deve igualar o principal',
      premissas.principal,
      totais.amortizacao
    )
  )

  v.push(
    violado(
      'saldo devedor deve encerrar em zero',
      0,
      linhas[linhas.length - 1].saldoFinal
    )
  )

  v.push(
    violado(
      'quantidade de linhas deve igualar o prazo contratado',
      premissas.prazo,
      linhas.length
    )
  )

  let somaJuros = 0
  let somaEncargos = 0
  let somaTeoricas = 0
  let somaTotais = 0

  linhas.forEach((l, i) => {
    const onde = `parcela ${l.parcela}`

    v.push(
      violado(
        'parcela teórica deve ser a soma de amortização e juros',
        l.amortizacao + l.juros,
        l.parcelaTeorica,
        onde
      )
    )

    v.push(
      violado(
        'parcela total deve ser a parcela teórica acrescida dos encargos',
        l.parcelaTeorica + l.encargosAcessorios,
        l.parcelaTotal,
        onde
      )
    )

    v.push(
      violado(
        'saldo final deve ser o saldo inicial menos a amortização',
        l.saldoInicial - l.amortizacao,
        l.saldoFinal,
        onde
      )
    )

    if (i > 0) {
      v.push(
        violado(
          'saldo inicial deve encadear com o saldo final anterior',
          linhas[i - 1].saldoFinal,
          l.saldoInicial,
          onde
        )
      )
    }

    if (l.saldoFinal < -TOL) {
      v.push({
        regra: 'saldo devedor não pode ficar negativo',
        esperado: 0,
        obtido: l.saldoFinal,
        diferenca: l.saldoFinal,
        local: onde,
      })
    }

    somaJuros += l.juros
    somaEncargos += l.encargosAcessorios
    somaTeoricas += l.parcelaTeorica
    somaTotais += l.parcelaTotal
  })

  v.push(violado('total de juros deve fechar com as linhas', somaJuros, totais.juros))
  v.push(
    violado(
      'total de encargos deve fechar com as linhas',
      somaEncargos,
      totais.encargosAcessorios
    )
  )
  v.push(
    violado(
      'total das parcelas teóricas deve fechar com as linhas',
      somaTeoricas,
      totais.parcelasTeoricas
    )
  )
  v.push(
    violado(
      'total das parcelas deve fechar com as linhas',
      somaTotais,
      totais.parcelasTotais
    )
  )

  return v.filter((x): x is Violacao => x !== null)
}

/** Invariantes do confronto entre reconstituído e cobrado. */
export function verificarConfronto(confronto: Confronto): Violacao[] {
  const v: (Violacao | null)[] = []

  let somaDevido = 0
  let somaCobrado = 0
  let somaDiferencas = 0

  for (const l of confronto.linhas) {
    v.push(
      violado(
        'diferença da linha deve ser cobrado menos devido',
        l.cobrado - l.devido,
        l.diferenca,
        `parcela ${l.parcela}`
      )
    )
    somaDevido += l.devido
    somaCobrado += l.cobrado
    somaDiferencas += l.diferenca
  }

  v.push(violado('total devido deve fechar com as linhas', somaDevido, confronto.totalDevido))
  v.push(
    violado('total cobrado deve fechar com as linhas', somaCobrado, confronto.totalCobrado)
  )
  v.push(
    violado(
      'diferença total deve fechar com a soma das diferenças',
      somaDiferencas,
      confronto.diferencaTotal
    )
  )
  v.push(
    violado(
      'diferença total deve ser o total cobrado menos o total devido',
      confronto.totalCobrado - confronto.totalDevido,
      confronto.diferencaTotal
    )
  )

  return v.filter((x): x is Violacao => x !== null)
}

/** Invariantes da atualização das diferenças. */
export function verificarAtualizacao(c: ConfrontoAtualizado): Violacao[] {
  const v: (Violacao | null)[] = []
  let soma = 0
  let algumNaoApurado = false

  for (const l of c.linhas) {
    const a = l.atualizacao
    if (a.total === null) {
      algumNaoApurado = true
      continue
    }
    v.push(
      violado(
        'valor atualizado deve compor nominal, correção, juros e multa',
        a.valorOriginal + a.correcaoMonetaria + a.juros + a.multa,
        a.total,
        `parcela ${l.parcela}`
      )
    )
    soma += a.total
  }

  if (!algumNaoApurado && c.diferencaAtualizada !== null) {
    v.push(
      violado(
        'diferença atualizada deve fechar com a soma das linhas',
        soma,
        c.diferencaAtualizada
      )
    )
  }

  if (algumNaoApurado && c.diferencaAtualizada !== null) {
    v.push({
      regra:
        'diferença atualizada não pode ser apresentada quando alguma linha não foi apurada',
      esperado: 0,
      obtido: c.diferencaAtualizada,
      diferenca: c.diferencaAtualizada,
    })
  }

  return v.filter((x): x is Violacao => x !== null)
}

/** Prefixo deliberadamente estridente — este alerta não pode passar batido. */
export const PREFIXO_INTEGRIDADE = '⛔ ERRO DE INTEGRIDADE DO MOTOR'

export function alertasDeViolacao(violacoes: Violacao[]): string[] {
  if (violacoes.length === 0) return []
  return [
    `${PREFIXO_INTEGRIDADE} — ${violacoes.length} invariante(s) violada(s). ` +
      'O resultado NÃO deve ser utilizado em laudo. Comunique o defeito antes de qualquer protocolo. ' +
      violacoes
        .map(
          (x) =>
            `[${x.local ?? 'geral'}] ${x.regra}: esperado ${x.esperado}, obtido ${x.obtido}`
        )
        .join(' · '),
  ]
}

/** Monta a prova de integridade que acompanha a memória de cálculo. */
export function gerarProva(
  premissas: unknown,
  violacoes: Violacao[]
): ProvaDeIntegridade {
  return {
    motorVersao: MOTOR_VERSAO,
    impressaoPremissas: impressaoDigital(premissas),
    violacoes,
    integro: violacoes.length === 0,
  }
}
