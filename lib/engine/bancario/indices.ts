// Séries de índices e aritmética de competências.
//
// O motor não embute nenhum valor de índice. Toda série é fornecida pelo
// perito com a fonte declarada — ver `SerieIndice` em ./tipos.

import type { Competencia, SerieIndice } from './tipos'

const FORMATO = /^(\d{4})-(0[1-9]|1[0-2])$/

export function ehCompetencia(valor: string): boolean {
  return FORMATO.test(valor)
}

function partes(c: Competencia): { ano: number; mes: number } {
  const m = FORMATO.exec(c)
  if (!m) {
    throw new Error(
      `Competência inválida: "${c}". Formato esperado AAAA-MM (ex.: 2019-03).`
    )
  }
  return { ano: Number(m[1]), mes: Number(m[2]) }
}

/** Converte uma data ISO (`AAAA-MM-DD`) na competência correspondente. */
export function competenciaDeData(dataISO: string): Competencia {
  const c = dataISO.slice(0, 7)
  if (!ehCompetencia(c)) {
    throw new Error(`Data inválida para extração de competência: "${dataISO}".`)
  }
  return c
}

/** Ordena duas competências: negativo se `a` antecede `b`. */
export function compararCompetencias(a: Competencia, b: Competencia): number {
  const pa = partes(a)
  const pb = partes(b)
  return pa.ano - pb.ano || pa.mes - pb.mes
}

export function proximaCompetencia(c: Competencia): Competencia {
  const { ano, mes } = partes(c)
  const proximo = mes === 12 ? { ano: ano + 1, mes: 1 } : { ano, mes: mes + 1 }
  return `${proximo.ano}-${String(proximo.mes).padStart(2, '0')}`
}

/** Número de meses de `de` até `ate`. Negativo se `ate` antecede `de`. */
export function mesesEntre(de: Competencia, ate: Competencia): number {
  const a = partes(de)
  const b = partes(ate)
  return (b.ano - a.ano) * 12 + (b.mes - a.mes)
}

/**
 * Competências do intervalo, em ordem.
 *
 * Por convenção, a competência do termo inicial **não** é incluída: a
 * atualização corre a partir do mês seguinte ao marco. É premissa explícita e
 * fica registrada na memória de cálculo.
 */
export function competenciasEntre(
  de: Competencia,
  ate: Competencia
): Competencia[] {
  if (compararCompetencias(de, ate) >= 0) return []
  const lista: Competencia[] = []
  let atual = proximaCompetencia(de)
  while (compararCompetencias(atual, ate) <= 0) {
    lista.push(atual)
    atual = proximaCompetencia(atual)
  }
  return lista
}

export interface FatorAcumulado {
  /** `null` quando a série não cobre todo o intervalo. */
  fator: number | null
  competenciasFaltantes: Competencia[]
  competenciasAplicadas: Competencia[]
}

/**
 * Fator de atualização acumulado no intervalo `(de, ate]`.
 *
 * Série de variações: produto de (1 + variação) das competências do intervalo.
 * Série de número-índice: razão entre o índice final e o inicial.
 *
 * Competência ausente na série **não é tratada como variação zero**. O fator
 * retorna `null` e a lacuna é reportada — deixar passar como zero produziria
 * um valor plausível e errado.
 */
export function fatorAcumulado(
  serie: SerieIndice,
  de: Competencia,
  ate: Competencia
): FatorAcumulado {
  if (compararCompetencias(de, ate) > 0) {
    return { fator: null, competenciasFaltantes: [], competenciasAplicadas: [] }
  }

  if (serie.tipo === 'numero-indice') {
    const faltantes = [de, ate].filter((c) => serie.valores[c] === undefined)
    if (faltantes.length > 0) {
      return {
        fator: null,
        competenciasFaltantes: faltantes,
        competenciasAplicadas: [],
      }
    }
    const inicial = serie.valores[de]
    if (inicial === 0) {
      return {
        fator: null,
        competenciasFaltantes: [],
        competenciasAplicadas: [de, ate],
      }
    }
    return {
      fator: serie.valores[ate] / inicial,
      competenciasFaltantes: [],
      competenciasAplicadas: [de, ate],
    }
  }

  const intervalo = competenciasEntre(de, ate)
  const faltantes = intervalo.filter((c) => serie.valores[c] === undefined)
  if (faltantes.length > 0) {
    return {
      fator: null,
      competenciasFaltantes: faltantes,
      competenciasAplicadas: [],
    }
  }

  const fator = intervalo.reduce((acc, c) => acc * (1 + serie.valores[c]), 1)
  return { fator, competenciasFaltantes: [], competenciasAplicadas: intervalo }
}

/**
 * Soma simples das taxas do intervalo `(de, ate]`.
 *
 * É o tratamento usual da SELIC acumulada na atualização judicial de débitos,
 * em que as taxas mensais são somadas e não capitalizadas.
 */
export function somaAcumulada(
  serie: SerieIndice,
  de: Competencia,
  ate: Competencia
): FatorAcumulado {
  const intervalo = competenciasEntre(de, ate)
  const faltantes = intervalo.filter((c) => serie.valores[c] === undefined)
  if (faltantes.length > 0) {
    return {
      fator: null,
      competenciasFaltantes: faltantes,
      competenciasAplicadas: [],
    }
  }
  const soma = intervalo.reduce((acc, c) => acc + serie.valores[c], 0)
  return { fator: soma, competenciasFaltantes: [], competenciasAplicadas: intervalo }
}
