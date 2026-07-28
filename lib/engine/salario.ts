// Cálculo de salário líquido mensal

import { soma, arredondar } from './common'
import { calcularINSS } from './inss'
import { calcularIRRF } from './irrf'
import type { SalarioLiquidoParams, SalarioLiquidoResult } from './tipos'

/**
 * Calcula o salário líquido a partir do bruto + adicionais - descontos
 */
export function calcularSalarioLiquido(params: SalarioLiquidoParams): SalarioLiquidoResult {
  const {
    salarioBruto,
    adicionais = 0,
    horasExtras = 0,
    dsr = 0,
    dependentes = 0,
    pensaoAlimenticia = 0,
    valeTransporte = false,
    valeTransportePercentual = 6,
    faltas = 0,
    faltasValor,
    outrosDescontos = 0,
  } = params

  // Base de cálculo
  const baseCalculo = soma(salarioBruto, adicionais, horasExtras, dsr)

  // Faltas
  const descontoFaltas = faltasValor ?? arredondar((salarioBruto / 30) * faltas)
  const baseComFaltas = Math.max(0, baseCalculo - descontoFaltas)

  // INSS
  const inss = calcularINSS(baseComFaltas)

  // VT (até 6% do salário bruto)
  const valeTransporteValor = valeTransporte
    ? arredondar(salarioBruto * valeTransportePercentual / 100)
    : 0

  // IRRF
  const baseIRRF = Math.max(0, baseComFaltas - inss)
  const irrf = calcularIRRF(baseIRRF, dependentes, pensaoAlimenticia)

  const totalDescontos = soma(inss, irrf, valeTransporteValor, outrosDescontos, descontoFaltas)
  const liquido = arredondar(baseComFaltas - totalDescontos)

  return {
    baseCalculo,
    inss,
    baseIRRF,
    irrf,
    valeTransporte: valeTransporteValor,
    totalDescontos,
    liquido,
  }
}
