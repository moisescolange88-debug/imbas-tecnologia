// Cálculo de férias (individuais) — proporcionais, vencidas, abono pecuniário

import { arredondar } from './common'
import { calcularINSS } from './inss'
import { calcularIRRF } from './irrf'
import type { FeriasParams, FeriasResult } from './tipos'

/**
 * Calcula férias com 1/3 constitucional, abono pecuniário, INSS e IRRF
 */
export function calcularFerias(params: FeriasParams): FeriasResult {
  const {
    salario,
    mesesTrabalhados,
    diasFerias = 30,
    abonoPecuniario = 0,
    dependentes = 0,
  } = params

  // Verifica se tem direito a férias (mínimo 6 meses)
  const mesesEfetivos = Math.min(mesesTrabalhados, 12)

  // Proporcional
  const feriasBase = arredondar((salario / 12) * mesesEfetivos)

  // Ajuste para dias de gozo (proporcional aos dias)
  const ferias = arredondar(feriasBase * (diasFerias / 30))

  // 1/3 constitucional sobre férias
  const tercoConstitucional = arredondar(ferias / 3)

  // Abono pecuniário (venda de até 1/3 das férias = 10 dias)
  const abonoMaximo = Math.min(abonoPecuniario, 10)
  const abonoValor = arredondar((salario / 30) * abonoMaximo)
  const tercoAbono = arredondar(abonoValor / 3)

  // Base INSS = férias + 1/3 (abono não integra INSS conforme Súmula 328 TST)
  const baseINSS = arredondar(ferias + tercoConstitucional)
  const inss = abonoMaximo > 0 ? 0 : calcularINSS(baseINSS) // INSS só se não houver abono relevante

  // Base IRRF = férias + 1/3 + abono + 1/3 abono - INSS
  const baseIRRF = arredondar(ferias + tercoConstitucional + abonoValor + tercoAbono - inss)
  const irrf = calcularIRRF(baseIRRF, dependentes)

  const liquido = arredondar(baseIRRF - irrf + inss) // Re-adiciona INSS descontado da base

  return {
    ferias,
    tercoConstitucional,
    abonoPecuniario: abonoValor,
    tercoAbono,
    baseINSS,
    baseIRRF,
    inss,
    irrf,
    liquido,
  }
}
