// Reconstituição do saldo devedor conforme premissas contratuais.
// Corresponde ao Apêndice I do laudo pericial financeiro.

import { arredondar } from '../common'
import { alertasDeViolacao, gerarProva, verificarQuadro } from './integridade'
import {
  CAPITALIZACAO_LABEL,
  SISTEMA_LABEL,
  type LinhaAmortizacao,
  type PassoMemoria,
  type PremissasContrato,
  type QuadroAmortizacao,
  type TotaisQuadro,
} from './tipos'

/**
 * Prestação constante do Sistema Francês (Price).
 *
 *        i · (1 + i)^n
 * PMT = ─────────────── · PV
 *        (1 + i)^n − 1
 *
 * Com taxa zero a prestação degenera em PV / n.
 */
export function parcelaPrice(pv: number, i: number, n: number): number {
  if (n <= 0) return 0
  if (i === 0) return arredondar(pv / n)
  const fator = Math.pow(1 + i, n)
  return arredondar((pv * (i * fator)) / (fator - 1))
}

/** Amortização constante do SAC: PV / n. */
export function amortizacaoConstante(pv: number, n: number): number {
  if (n <= 0) return 0
  return arredondar(pv / n)
}

/** Taxa efetiva anual equivalente a uma taxa mensal, em capitalização composta. */
export function taxaEfetivaAnual(taxaMensal: number): number {
  return Math.pow(1 + taxaMensal, 12) - 1
}

interface EncargosPorParcela {
  primeira: number
  demais: number
}

function encargos(p: PremissasContrato): EncargosPorParcela {
  const recorrente = (p.seguroMensal ?? 0) + (p.outrasTarifasMensais ?? 0)
  return {
    primeira: arredondar(recorrente + (p.tac ?? 0)),
    demais: arredondar(recorrente),
  }
}

/**
 * Juros do período.
 *
 * Em capitalização composta os juros incidem sobre o saldo devedor do período.
 * Em capitalização simples incidem sempre sobre o capital inicial, sem
 * incorporação ao saldo.
 */
function jurosDoPeriodo(
  saldoInicial: number,
  premissas: PremissasContrato
): number {
  const base =
    premissas.capitalizacao === 'simples' ? premissas.principal : saldoInicial
  return arredondar(base * premissas.taxaPeriodo)
}

/**
 * Série de amortizações do período 1 ao período n, conforme o sistema.
 * O saldo devedor é derivado dessas amortizações, nunca o contrário.
 */
function serieAmortizacoes(p: PremissasContrato): number[] {
  const { principal, prazo, taxaPeriodo, sistema } = p

  // Sob capitalização simples os juros não se incorporam ao saldo, e os três
  // sistemas convergem para amortização linear do principal.
  if (p.capitalizacao === 'simples') {
    return Array.from({ length: prazo }, () =>
      amortizacaoConstante(principal, prazo)
    )
  }

  if (sistema === 'sac') {
    return Array.from({ length: prazo }, () =>
      amortizacaoConstante(principal, prazo)
    )
  }

  const pricePmt = parcelaPrice(principal, taxaPeriodo, prazo)
  const amortPrice: number[] = []
  let saldo = principal
  for (let k = 0; k < prazo; k++) {
    const juros = arredondar(saldo * taxaPeriodo)
    const amort = arredondar(pricePmt - juros)
    amortPrice.push(amort)
    saldo = arredondar(saldo - amort)
  }

  if (sistema === 'price') return amortPrice

  // SAM: média aritmética, período a período, das amortizações Price e SAC.
  const amortSac = amortizacaoConstante(principal, prazo)
  return amortPrice.map((a) => arredondar((a + amortSac) / 2))
}

/**
 * Monta o quadro de amortização completo com a memória de cálculo.
 *
 * Diferente do template Excel do kit pericial, o sistema de amortização e o
 * critério de capitalização são efetivamente aplicados ao cálculo — não são
 * campos meramente descritivos.
 */
export function gerarQuadroAmortizacao(
  premissas: PremissasContrato
): QuadroAmortizacao {
  const { principal, prazo, taxaPeriodo, sistema, capitalizacao } = premissas
  const memoria: PassoMemoria[] = []
  const alertas: string[] = []

  if (prazo <= 0 || principal <= 0) {
    return {
      premissas,
      linhas: [],
      totais: {
        amortizacao: 0,
        juros: 0,
        encargosAcessorios: 0,
        parcelasTeoricas: 0,
        parcelasTotais: 0,
      },
      memoria,
      alertas: [
        'DADOS INSUFICIENTES — valor principal e prazo devem ser maiores que zero para reconstituir o saldo devedor.',
      ],
      prova: gerarProva(premissas, []),
    }
  }

  if (capitalizacao === 'simples') {
    alertas.push(
      '[VERIFICAR] Capitalização simples adotada. O motor aplicou juros lineares sobre o capital inicial (J = PV × i em todos os períodos), com amortização linear do principal. Métodos alternativos usados na prática pericial — linear ponderado, Gauss e congêneres — produzem resultado distinto e exigem definição expressa do perito.'
    )
  }

  if (sistema === 'sam') {
    alertas.push(
      '[VERIFICAR] SAM calculado pela média aritmética, período a período, das amortizações do Price e do SAC. Há definição concorrente que faz a média das prestações. Confirme qual é aderente ao contrato antes do protocolo.'
    )
  }

  if (!premissas.origem) {
    alertas.push(
      'DADOS INSUFICIENTES — não foi informada a origem das premissas (cláusula contratual e folha dos autos). A rastreabilidade de cada premissa é exigida pelo item 52(b) da NBC TP 01 (R2).'
    )
  }

  memoria.push({
    referencia: 'Premissas adotadas',
    formula: 'PV, n, i, sistema, critério de capitalização',
    substituicao: `PV = ${principal}; n = ${prazo}; i = ${taxaPeriodo} ao período; ${SISTEMA_LABEL[sistema]}; ${CAPITALIZACAO_LABEL[capitalizacao]}`,
    resultado: principal,
    fundamento: premissas.origem ?? 'origem não informada',
  })

  if (sistema === 'price' && capitalizacao === 'composta') {
    const fator = Math.pow(1 + taxaPeriodo, prazo)
    memoria.push({
      referencia: 'Prestação constante (Price)',
      formula: 'PMT = PV × [ i × (1+i)^n ] ÷ [ (1+i)^n − 1 ]',
      substituicao: `PMT = ${principal} × [ ${taxaPeriodo} × ${fator.toFixed(8)} ] ÷ [ ${fator.toFixed(8)} − 1 ]`,
      resultado: parcelaPrice(principal, taxaPeriodo, prazo),
    })
  }

  const amortizacoes = serieAmortizacoes(premissas)
  const enc = encargos(premissas)
  const linhas: LinhaAmortizacao[] = []
  let saldo = principal

  for (let k = 1; k <= prazo; k++) {
    const saldoInicial = saldo
    const juros = jurosDoPeriodo(saldoInicial, premissas)

    // Na última parcela a amortização absorve o saldo remanescente, de modo
    // que o saldo final feche exatamente em zero. O resíduo decorre dos
    // arredondamentos a duas casas praticados período a período.
    const amortizacao =
      k === prazo ? arredondar(saldoInicial) : amortizacoes[k - 1]

    const encargosAcessorios = k === 1 ? enc.primeira : enc.demais
    const parcelaTeorica = arredondar(amortizacao + juros)
    const parcelaTotal = arredondar(parcelaTeorica + encargosAcessorios)
    const saldoFinal = arredondar(saldoInicial - amortizacao)

    linhas.push({
      parcela: k,
      saldoInicial,
      amortizacao,
      juros,
      encargosAcessorios,
      parcelaTeorica,
      parcelaTotal,
      saldoFinal,
    })

    memoria.push({
      referencia: `Parcela ${k} — juros`,
      formula:
        capitalizacao === 'simples' ? 'J = PV × i' : 'J = SD(início) × i',
      substituicao:
        capitalizacao === 'simples'
          ? `J = ${principal} × ${taxaPeriodo} = ${juros}`
          : `J = ${saldoInicial} × ${taxaPeriodo} = ${juros}`,
      resultado: juros,
    })

    saldo = saldoFinal
  }

  const totais: TotaisQuadro = linhas.reduce<TotaisQuadro>(
    (acc, l) => ({
      amortizacao: arredondar(acc.amortizacao + l.amortizacao),
      juros: arredondar(acc.juros + l.juros),
      encargosAcessorios: arredondar(
        acc.encargosAcessorios + l.encargosAcessorios
      ),
      parcelasTeoricas: arredondar(acc.parcelasTeoricas + l.parcelaTeorica),
      parcelasTotais: arredondar(acc.parcelasTotais + l.parcelaTotal),
    }),
    {
      amortizacao: 0,
      juros: 0,
      encargosAcessorios: 0,
      parcelasTeoricas: 0,
      parcelasTotais: 0,
    }
  )

  // Verificação obrigatória: as invariantes rodam em toda execução, não só nos
  // testes. Um defeito passa a se anunciar no próprio laudo, no topo dos
  // alertas, em vez de sair como um número plausível.
  const parcial: QuadroAmortizacao = {
    premissas,
    linhas,
    totais,
    memoria,
    alertas,
    prova: gerarProva(premissas, []),
  }
  const violacoes = verificarQuadro(parcial)

  return {
    ...parcial,
    alertas: [...alertasDeViolacao(violacoes), ...alertas],
    prova: gerarProva(premissas, violacoes),
  }
}
