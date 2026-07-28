// Cálculo do décimo terceiro salário

import { arredondar } from './common'
import { calcularINSS } from './inss'
import { calcularIRRF } from './irrf'
import type { DecimoTerceiroParams, DecimoTerceiroResult } from './tipos'

/**
 * Calcula o 13º salário (proporcional ou integral)
 * Fórmula: (remuneração base / 12) × meses trabalhados (mínimo 15 dias no mês)
 */
export function calcularDecimoTerceiro(params: DecimoTerceiroParams): DecimoTerceiroResult {
  const {
    salario,
    mesesTrabalhados,
    adiantamentoPrimeiraParcela = 0,
    dependentes = 0,
  } = params

  const mesesEfetivos = Math.min(Math.max(mesesTrabalhados, 0), 12)
  const bruto = arredondar((salario / 12) * mesesEfetivos)

  // 1ª parcela = metade do bruto (paga entre fevereiro e novembro, geralmente nas férias)
  const primeiraParcela = arredondar(bruto / 2)

  // INSS incide sobre o total (Súmula 45 TST)
  const inss = calcularINSS(bruto)

  // IRRF: base = bruto - INSS - (dependentes × dedução)
  const baseIRRF = arredondar(bruto - inss - adiantamentoPrimeiraParcela)
  const irrf = calcularIRRF(baseIRRF, dependentes)

  // Líquido = bruto - INSS - IRRF - 1ª parcela (já paga)
  const liquido = arredondar(bruto - inss - irrf - adiantamentoPrimeiraParcela)

  return {
    bruto,
    primeiraParcela,
    inss,
    irrf,
    liquido,
  }
}
