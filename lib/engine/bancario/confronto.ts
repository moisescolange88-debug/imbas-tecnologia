// Confronto entre o devido conforme contrato e o efetivamente cobrado.
// Corresponde ao Apêndice III do laudo pericial financeiro.

import { arredondar } from '../common'
import {
  alertasDeViolacao,
  gerarProva,
  verificarConfronto,
} from './integridade'
import type {
  Confronto,
  LancamentoCobrado,
  LinhaConfronto,
  QuadroAmortizacao,
  SentidoDiferenca,
} from './tipos'

/** Tolerância de centavos abaixo da qual a diferença é tratada como nula. */
const TOLERANCIA = 0.01

function sentido(diferenca: number): SentidoDiferenca {
  if (Math.abs(diferenca) < TOLERANCIA) return 'sem-diferenca'
  return diferenca > 0 ? 'excesso-cobrado' : 'cobranca-a-menor'
}

/**
 * Confronta, parcela a parcela, o quadro reconstituído com os lançamentos
 * extraídos do extrato ou carnê.
 *
 * A diferença é sempre `cobrado − devido`: valor positivo indica excesso
 * cobrado em desfavor do tomador.
 *
 * Parcelas presentes em apenas um dos lados não são descartadas — entram no
 * confronto com o lado ausente zerado e recebem observação própria, para que a
 * lacuna documental fique visível no laudo em vez de sumir no total.
 */
export function confrontar(
  quadro: QuadroAmortizacao,
  lancamentos: LancamentoCobrado[]
): Confronto {
  const alertas: string[] = []
  const cobradoPorParcela = new Map<number, LancamentoCobrado>()

  for (const l of lancamentos) {
    if (cobradoPorParcela.has(l.parcela)) {
      alertas.push(
        `[VERIFICAR] Há mais de um lançamento informado para a parcela ${l.parcela}. Foi considerado o último. Confirme o critério de desempate entre documentos.`
      )
    }
    cobradoPorParcela.set(l.parcela, l)
  }

  const numeros = new Set<number>([
    ...quadro.linhas.map((l) => l.parcela),
    ...lancamentos.map((l) => l.parcela),
  ])

  const linhas: LinhaConfronto[] = []

  for (const n of Array.from(numeros).sort((a, b) => a - b)) {
    const devidoLinha = quadro.linhas.find((l) => l.parcela === n)
    const cobradoLinha = cobradoPorParcela.get(n)

    const devido = devidoLinha ? devidoLinha.parcelaTotal : 0
    const cobrado = cobradoLinha ? arredondar(cobradoLinha.total) : 0

    let observacao: string | undefined
    if (!devidoLinha) {
      observacao =
        'Parcela cobrada sem correspondência no quadro reconstituído — verificar se excede o prazo contratado.'
      alertas.push(
        `[VERIFICAR] A parcela ${n} consta dos lançamentos mas não do quadro contratual (prazo de ${quadro.premissas.prazo} parcelas).`
      )
    } else if (!cobradoLinha) {
      observacao =
        'Parcela prevista no contrato sem lançamento correspondente nos documentos apresentados.'
      alertas.push(
        `DADOS INSUFICIENTES — não foi apresentado lançamento para a parcela ${n}. A ausência impede o confronto desse período e deve ser registrada no laudo com indicação do impacto.`
      )
    } else if (!cobradoLinha.fonte) {
      observacao = 'Lançamento sem indicação da folha dos autos.'
    }

    linhas.push({
      parcela: n,
      devido,
      cobrado,
      diferenca: arredondar(cobrado - devido),
      observacao,
    })
  }

  const totalDevido = arredondar(
    linhas.reduce((acc, l) => acc + l.devido, 0)
  )
  const totalCobrado = arredondar(
    linhas.reduce((acc, l) => acc + l.cobrado, 0)
  )
  const diferencaTotal = arredondar(totalCobrado - totalDevido)

  const parcial: Confronto = {
    linhas,
    totalDevido,
    totalCobrado,
    diferencaTotal,
    sentido: sentido(diferencaTotal),
    alertas: [...quadro.alertas, ...alertas],
    prova: gerarProva({ premissas: quadro.premissas, lancamentos }, []),
  }
  const violacoes = verificarConfronto(parcial)

  return {
    ...parcial,
    alertas: [...alertasDeViolacao(violacoes), ...parcial.alertas],
    prova: gerarProva(
      { premissas: quadro.premissas, lancamentos },
      [...quadro.prova.violacoes, ...violacoes]
    ),
  }
}

/**
 * Confronto entre duas metodologias — a adotada pelo perito e a decorrente da
 * tese de uma das partes ou de comando judicial alternativo.
 *
 * Corresponde às abas 4 e 6 do template e atende ao item 54(c) da NBC TP 01
 * (R2), que prevê a apresentação de alternativas quando a metodologia for
 * condicionada às teses das partes.
 */
export function confrontarMetodologias(
  principal: QuadroAmortizacao,
  alternativa: QuadroAmortizacao
): Confronto {
  const numeros = new Set<number>([
    ...principal.linhas.map((l) => l.parcela),
    ...alternativa.linhas.map((l) => l.parcela),
  ])

  const linhas: LinhaConfronto[] = Array.from(numeros)
    .sort((a, b) => a - b)
    .map((n) => {
      const p = principal.linhas.find((l) => l.parcela === n)
      const a = alternativa.linhas.find((l) => l.parcela === n)
      const devido = p ? p.parcelaTotal : 0
      const cobrado = a ? a.parcelaTotal : 0
      return {
        parcela: n,
        devido,
        cobrado,
        diferenca: arredondar(cobrado - devido),
      }
    })

  const totalDevido = arredondar(linhas.reduce((acc, l) => acc + l.devido, 0))
  const totalCobrado = arredondar(linhas.reduce((acc, l) => acc + l.cobrado, 0))
  const diferencaTotal = arredondar(totalCobrado - totalDevido)

  const chave = {
    adotada: principal.premissas,
    alternativa: alternativa.premissas,
  }

  const parcial: Confronto = {
    linhas,
    totalDevido,
    totalCobrado,
    diferencaTotal,
    sentido: sentido(diferencaTotal),
    alertas: [...principal.alertas, ...alternativa.alertas],
    prova: gerarProva(chave, []),
  }
  const violacoes = verificarConfronto(parcial)

  return {
    ...parcial,
    alertas: [...alertasDeViolacao(violacoes), ...parcial.alertas],
    prova: gerarProva(chave, [
      ...principal.prova.violacoes,
      ...alternativa.prova.violacoes,
      ...violacoes,
    ]),
  }
}
