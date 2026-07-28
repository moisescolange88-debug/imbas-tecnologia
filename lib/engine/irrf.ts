// Cálculo do IRRF retido na fonte — 5 faixas progressivas (2026)

import { TABELA_IRRF, DEDUCAO_DEPENDENTE_IRRF } from './tables'
import { arredondar } from './common'

/**
 * Calcula o IRRF sobre a base de cálculo.
 * Base = salário bruto - INSS - (dependentes × dedução) - pensão alimentícia
 */
export function calcularIRRF(
  baseCalculo: number,
  dependentes: number = 0,
  pensaoAlimenticia: number = 0
): number {
  const baseAjustada = Math.max(0, baseCalculo - dependentes * DEDUCAO_DEPENDENTE_IRRF - pensaoAlimenticia)

  for (const faixa of TABELA_IRRF) {
    if (baseAjustada <= faixa.ate) {
      return arredondar(baseAjustada * (faixa.aliquota / 100) - faixa.deducao)
    }
  }

  // Faixa superior (Infinity) — não deve chegar aqui por causa do for, mas safety
  const ultimaFaixa = TABELA_IRRF[TABELA_IRRF.length - 1]
  return arredondar(baseAjustada * (ultimaFaixa.aliquota / 100) - ultimaFaixa.deducao)
}

/**
 * Retorna a alíquota efetiva do IRRF para a base ajustada
 */
export function aliquotaEfetivaIRRF(baseAjustada: number): number {
  for (const faixa of TABELA_IRRF) {
    if (baseAjustada <= faixa.ate) {
      return faixa.aliquota
    }
  }
  return TABELA_IRRF[TABELA_IRRF.length - 1].aliquota
}
