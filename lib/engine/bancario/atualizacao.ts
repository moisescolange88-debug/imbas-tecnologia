// Atualização de valores: correção monetária, juros de mora e multa.
//
// Nenhuma premissa tem padrão implícito. O que não tem default defensável
// falha de forma explícita (valor `null` + DADOS INSUFICIENTES); o que tem
// default natural é assumido e marcado com [VERIFICAR]. Em nenhuma hipótese o
// motor produz um número plausível a partir de premissa que ninguém decidiu.

import { arredondar } from '../common'
import {
  alertasDeViolacao,
  gerarProva,
  verificarAtualizacao,
} from './integridade'
import {
  competenciasEntre,
  compararCompetencias,
  fatorAcumulado,
  mesesEntre,
  somaAcumulada,
} from './indices'
import type {
  Competencia,
  Confronto,
  ConfrontoAtualizado,
  LinhaConfrontoAtualizada,
  PassoMemoria,
  PremissasAtualizacao,
  ResultadoCorrecao,
  ResultadoJuros,
  SentidoDiferenca,
  SerieIndice,
  ValorAtualizado,
} from './tipos'

const TOLERANCIA = 0.01

function sentido(diferenca: number): SentidoDiferenca {
  if (Math.abs(diferenca) < TOLERANCIA) return 'sem-diferenca'
  return diferenca > 0 ? 'excesso-cobrado' : 'cobranca-a-menor'
}

/**
 * Correção monetária de um valor entre duas competências.
 *
 * Competência ausente na série faz o resultado retornar `null`, com a lista de
 * competências faltantes no alerta. Não há preenchimento por variação zero.
 */
export function corrigirMonetariamente(
  valor: number,
  serie: SerieIndice,
  de: Competencia,
  ate: Competencia
): ResultadoCorrecao {
  const memoria: PassoMemoria[] = []
  const alertas: string[] = []

  const acumulado = fatorAcumulado(serie, de, ate)

  if (acumulado.fator === null) {
    const faltantes = acumulado.competenciasFaltantes
    alertas.push(
      faltantes.length > 0
        ? `DADOS INSUFICIENTES — a série ${serie.nome} não contém as competências ${faltantes.join(', ')}. Sem elas o fator de correção do período ${de} a ${ate} não pode ser apurado.`
        : `DADOS INSUFICIENTES — não foi possível apurar o fator de correção de ${serie.nome} entre ${de} e ${ate}.`
    )
    return {
      valorOriginal: valor,
      fator: null,
      valorCorrigido: null,
      competenciaInicial: de,
      competenciaFinal: ate,
      memoria,
      alertas,
    }
  }

  const valorCorrigido = arredondar(valor * acumulado.fator)
  const nPeriodos = acumulado.competenciasAplicadas.length

  memoria.push({
    referencia: `Correção monetária — ${serie.nome}`,
    formula:
      serie.tipo === 'numero-indice'
        ? 'Fator = índice(final) ÷ índice(inicial)'
        : 'Fator = Π (1 + variação do mês), do mês seguinte ao termo inicial até a data-base',
    substituicao: `Fator = ${acumulado.fator.toFixed(8)} (período ${de} → ${ate}, ${nPeriodos} competência(s) aplicada(s))`,
    resultado: valorCorrigido,
    fundamento: serie.fonte,
  })

  return {
    valorOriginal: valor,
    fator: acumulado.fator,
    valorCorrigido,
    competenciaInicial: de,
    competenciaFinal: ate,
    memoria,
    alertas,
  }
}

/**
 * Juros de mora sobre a base indicada, entre o termo inicial e a data-base.
 *
 * Aceita taxa fixa ao mês ou série de taxas (caso da SELIC). No regime simples
 * as taxas são somadas; no composto, capitalizadas.
 */
export function calcularJurosMora(
  baseDeCalculo: number,
  premissas: PremissasAtualizacao,
  termoInicial: Competencia,
  ate: Competencia
): ResultadoJuros {
  const memoria: PassoMemoria[] = []
  const alertas: string[] = []
  const regime = premissas.regimeJuros ?? 'simples'

  if (!premissas.regimeJuros) {
    alertas.push(
      '[VERIFICAR] Regime de juros de mora não informado. Adotou-se juros simples, que é o tratamento usual da mora, mas o critério deve ser confirmado ante o contrato ou o comando judicial.'
    )
  }

  if (premissas.jurosTaxaMensal !== undefined && premissas.jurosSerie) {
    alertas.push(
      '[VERIFICAR] Foram informadas taxa fixa e série de juros ao mesmo tempo. Prevaleceu a série; defina apenas um critério.'
    )
  }

  const meses = mesesEntre(termoInicial, ate)

  if (meses <= 0) {
    memoria.push({
      referencia: 'Juros de mora',
      formula: 'Sem incidência',
      substituicao: `Termo inicial ${termoInicial} não antecede a data-base ${ate}`,
      resultado: 0,
    })
    return {
      valorOriginal: baseDeCalculo,
      baseDeCalculo,
      meses: 0,
      valorJuros: 0,
      competenciaInicial: termoInicial,
      competenciaFinal: ate,
      memoria,
      alertas,
    }
  }

  let valorJuros: number | null = null

  if (premissas.jurosSerie) {
    const serie = premissas.jurosSerie
    const acumulado =
      regime === 'simples'
        ? somaAcumulada(serie, termoInicial, ate)
        : fatorAcumulado(serie, termoInicial, ate)

    if (acumulado.fator === null) {
      alertas.push(
        `DADOS INSUFICIENTES — a série de juros ${serie.nome} não contém as competências ${acumulado.competenciasFaltantes.join(', ')}. Os juros de mora do período não podem ser apurados.`
      )
    } else {
      const taxaAcumulada =
        regime === 'simples' ? acumulado.fator : acumulado.fator - 1
      valorJuros = arredondar(baseDeCalculo * taxaAcumulada)
      memoria.push({
        referencia: `Juros de mora — ${serie.nome} (${regime})`,
        formula:
          regime === 'simples'
            ? 'J = base × Σ taxas do período'
            : 'J = base × [ Π (1 + taxa) − 1 ]',
        substituicao: `J = ${baseDeCalculo} × ${taxaAcumulada.toFixed(8)} (${meses} mês(es))`,
        resultado: valorJuros,
        fundamento: serie.fonte,
      })
    }
  } else if (premissas.jurosTaxaMensal !== undefined) {
    const i = premissas.jurosTaxaMensal
    valorJuros =
      regime === 'simples'
        ? arredondar(baseDeCalculo * i * meses)
        : arredondar(baseDeCalculo * (Math.pow(1 + i, meses) - 1))

    memoria.push({
      referencia: `Juros de mora — taxa fixa (${regime})`,
      formula: regime === 'simples' ? 'J = base × i × n' : 'J = base × [(1+i)^n − 1]',
      substituicao: `J = ${baseDeCalculo} × ${i} ${regime === 'simples' ? '×' : '^'} ${meses}`,
      resultado: valorJuros,
      fundamento: premissas.fundamento,
    })
  } else {
    valorJuros = 0
  }

  return {
    valorOriginal: baseDeCalculo,
    baseDeCalculo,
    meses,
    valorJuros,
    competenciaInicial: termoInicial,
    competenciaFinal: ate,
    memoria,
    alertas,
  }
}

/**
 * Atualiza um valor da competência de origem até a data-base do laudo,
 * aplicando correção monetária, juros de mora e multa conforme as premissas.
 *
 * A ordem é: corrige, depois incide juros sobre a base definida em
 * `baseDosJuros`, depois multa sobre a base definida em `baseDaMulta`.
 */
export function atualizarValor(
  valor: number,
  premissas: PremissasAtualizacao,
  de: Competencia,
  ate: Competencia
): ValorAtualizado {
  const memoria: PassoMemoria[] = []
  const alertas: string[] = []
  let falhou = false

  const temJuros =
    premissas.jurosTaxaMensal !== undefined || premissas.jurosSerie !== undefined

  if (premissas.correcao && premissas.jurosEmbutemCorrecao) {
    alertas.push(
      '[VERIFICAR] A série de juros foi declarada como já embutindo recomposição inflacionária (caso da SELIC) e há correção monetária aplicada no mesmo período. A cumulação configura atualização em duplicidade e precisa de decisão expressa.'
    )
  }

  if (!premissas.fundamento) {
    alertas.push(
      'DADOS INSUFICIENTES — não foi informado o fundamento das premissas de atualização (cláusula, decisão judicial ou dispositivo legal). Índice, taxa e termo inicial exigem origem declarada.'
    )
  }

  // --- Correção monetária -------------------------------------------------
  let correcaoMonetaria = 0
  let valorCorrigido = valor

  if (premissas.correcao) {
    const r = corrigirMonetariamente(valor, premissas.correcao, de, ate)
    memoria.push(...r.memoria)
    alertas.push(...r.alertas)
    if (r.valorCorrigido === null) {
      falhou = true
    } else {
      valorCorrigido = r.valorCorrigido
      correcaoMonetaria = arredondar(valorCorrigido - valor)
    }
  }

  // --- Juros de mora ------------------------------------------------------
  let juros = 0

  if (temJuros) {
    if (!premissas.baseDosJuros) {
      alertas.push(
        'DADOS INSUFICIENTES — não foi definido se os juros de mora incidem sobre o valor corrigido ou sobre o valor nominal. Ambos os critérios são praticados e produzem resultados distintos; o motor não arbitra a escolha.'
      )
      falhou = true
    } else {
      const termo = premissas.termoInicialJuros ?? de
      if (!premissas.termoInicialJuros) {
        // Texto sem a competência específica, de propósito: ao atualizar
        // dezenas de parcelas o alerta é o mesmo, e repeti-lo uma vez por
        // linha afogaria os demais avisos na seção.
        alertas.push(
          '[VERIFICAR] Termo inicial dos juros de mora não informado. Adotou-se, para cada valor, a sua própria competência de origem. O marco da mora — inadimplemento, citação ou outro — é decisão que precisa constar do laudo.'
        )
      }

      const base =
        premissas.baseDosJuros === 'valor-nominal' ? valor : valorCorrigido
      const r = calcularJurosMora(base, premissas, termo, ate)
      memoria.push(...r.memoria)
      alertas.push(...r.alertas)
      if (r.valorJuros === null) falhou = true
      else juros = r.valorJuros
    }
  }

  // --- Multa --------------------------------------------------------------
  let multa = 0

  if (premissas.multaPercentual !== undefined && premissas.multaPercentual > 0) {
    if (!premissas.baseDaMulta) {
      alertas.push(
        'DADOS INSUFICIENTES — não foi definido se a multa incide sobre o valor corrigido ou sobre o valor nominal.'
      )
      falhou = true
    } else {
      const base =
        premissas.baseDaMulta === 'valor-nominal' ? valor : valorCorrigido
      multa = arredondar(base * premissas.multaPercentual)
      memoria.push({
        referencia: 'Multa por inadimplemento',
        formula: 'M = base × percentual',
        substituicao: `M = ${base} × ${premissas.multaPercentual}`,
        resultado: multa,
        fundamento: premissas.fundamento,
      })
    }
  }

  const total = falhou ? null : arredondar(valorCorrigido + juros + multa)

  if (total !== null) {
    memoria.push({
      referencia: 'Valor atualizado',
      formula: 'Total = valor corrigido + juros de mora + multa',
      substituicao: `Total = ${valorCorrigido} + ${juros} + ${multa}`,
      resultado: total,
    })
  }

  return {
    valorOriginal: valor,
    correcaoMonetaria,
    juros,
    multa,
    total,
    competenciaInicial: de,
    competenciaFinal: ate,
    memoria,
    alertas,
  }
}

/**
 * Atualiza cada diferença apurada no confronto a partir da sua própria
 * competência, até a data-base do laudo.
 *
 * É assim que o indébito se apura: cada parcela tem termo inicial próprio, e
 * atualizar o total de uma vez só, a partir de uma data média, produz valor
 * diferente do correto.
 *
 * @param competenciaPorParcela competência de origem de cada parcela; parcela
 * sem competência informada não é atualizada e é reportada.
 */
export function atualizarConfronto(
  confronto: Confronto,
  competenciaPorParcela: Record<number, Competencia>,
  premissas: PremissasAtualizacao,
  dataBase: Competencia
): ConfrontoAtualizado {
  const alertas: string[] = [...confronto.alertas]
  const linhas: LinhaConfrontoAtualizada[] = []
  let falhou = false
  let somaAtualizada = 0

  for (const linha of confronto.linhas) {
    const competencia = competenciaPorParcela[linha.parcela]

    if (!competencia) {
      falhou = true
      alertas.push(
        `DADOS INSUFICIENTES — não foi informada a competência de origem da parcela ${linha.parcela}. Sem ela a diferença não pode ser atualizada até a data-base.`
      )
      continue
    }

    if (compararCompetencias(competencia, dataBase) > 0) {
      alertas.push(
        `[VERIFICAR] A competência da parcela ${linha.parcela} (${competencia}) é posterior à data-base (${dataBase}). Não houve atualização desse período.`
      )
    }

    const atualizacao = atualizarValor(
      linha.diferenca,
      premissas,
      competencia,
      dataBase
    )

    if (atualizacao.total === null) falhou = true
    else somaAtualizada = arredondar(somaAtualizada + atualizacao.total)

    alertas.push(...atualizacao.alertas)
    linhas.push({ ...linha, competenciaInicial: competencia, atualizacao })
  }

  const diferencaAtualizada = falhou ? null : somaAtualizada

  const chave = {
    premissas,
    dataBase,
    competencias: competenciaPorParcela,
    impressaoConfronto: confronto.prova.impressaoPremissas,
  }

  const parcial: ConfrontoAtualizado = {
    linhas,
    competenciaFinal: dataBase,
    diferencaNominal: confronto.diferencaTotal,
    diferencaAtualizada,
    sentido: sentido(diferencaAtualizada ?? confronto.diferencaTotal),
    alertas: Array.from(new Set(alertas)),
    prova: gerarProva(chave, []),
  }
  const violacoes = verificarAtualizacao(parcial)

  return {
    ...parcial,
    alertas: Array.from(
      new Set([...alertasDeViolacao(violacoes), ...parcial.alertas])
    ),
    prova: gerarProva(chave, [...confronto.prova.violacoes, ...violacoes]),
  }
}

/** Reexporta utilitários de competência de uso frequente junto da atualização. */
export { competenciasEntre, mesesEntre }
