// Cálculo do INSS — alíquotas progressivas por faixa (2026)

import { TABELA_INSS, TETO_INSS } from './tables'
import { arredondar } from './common'

/**
 * Calcula o INSS do empregado sobre a base de cálculo.
 * As faixas são progressivas: cada faixa é tributada isoladamente.
 * Também retorna o resultado pelo método "alíquota efetiva × base − dedução" para conferência.
 */
export function calcularINSS(base: number): number {
  const baseEfetiva = Math.min(base, TETO_INSS)
  let total = 0
  let limiteAnterior = 0

  for (const faixa of TABELA_INSS) {
    if (baseEfetiva <= limiteAnterior) break
    const parcela = Math.min(baseEfetiva, faixa.ate) - limiteAnterior
    if (parcela > 0) {
      total += parcela * (faixa.aliquota / 100)
    }
    limiteAnterior = faixa.ate
  }

  return arredondar(total)
}

/**
 * Versão simplificada: aliquota efetiva - dedução
 * Útil para conferência rápida
 */
export function calcularINSSSimplificado(base: number): number {
  const baseEfetiva = Math.min(base, TETO_INSS)

  for (let i = TABELA_INSS.length - 1; i >= 0; i--) {
    const faixa = TABELA_INSS[i]
    if (baseEfetiva <= faixa.ate) {
      return arredondar(baseEfetiva * (faixa.aliquota / 100) - faixa.deducao)
    }
  }

  return 0
}
