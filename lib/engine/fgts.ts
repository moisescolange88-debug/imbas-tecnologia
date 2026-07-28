// Cálculo do FGTS — depósitos mensais + multa

import { ALIQUOTA_FGTS, MULTA_FGTS_SEM_JUSTA_CAUSA, MULTA_FGTS_PDI } from './tables'
import { arredondar } from './common'
import type { FGTSResult } from './tipos'

/**
 * Calcula o depósito mensal de FGTS (8% sobre a remuneração)
 */
export function calcularFGTSMensal(remuneracao: number): number {
  return arredondar(remuneracao * ALIQUOTA_FGTS / 100)
}

/**
 * Calcula a multa do FGTS
 * @param totalDepositado Total de FGTS depositado no período
 * @param tipoMulta 40 (sem justa causa) ou 20 (PDI)
 */
export function calcularMultaFGTS(
  totalDepositado: number,
  tipoMulta: number = MULTA_FGTS_SEM_JUSTA_CAUSA
): number {
  return arredondar(totalDepositado * tipoMulta / 100)
}

/**
 * Calcula FGTS completo para um período
 * @param salario Salário mensal
 * @param mesesPeriodo Meses do período contratual
 * @param decimoTerceiroBruto Valor do 13º no período
 * @param feriasBruto Valor das férias no período
 * @param multaPercentual 40 ou 20
 */
export function calcularFGTSCompleto(
  salario: number,
  mesesPeriodo: number,
  decimoTerceiroBruto: number = 0,
  feriasBruto: number = 0,
  multaPercentual: number = MULTA_FGTS_SEM_JUSTA_CAUSA
): FGTSResult {
  const depositosMensais = calcularFGTSMensal(salario) * mesesPeriodo
  const depositosDecimoTerceiro = calcularFGTSMensal(decimoTerceiroBruto)
  const depositosFerias = calcularFGTSMensal(feriasBruto)
  const totalDepositado = arredondar(depositosMensais + depositosDecimoTerceiro + depositosFerias)
  const multa = calcularMultaFGTS(totalDepositado, multaPercentual)
  const totalComMulta = arredondar(totalDepositado + multa)

  return {
    depositosMensais,
    depositosDecimoTerceiro,
    depositosFerias,
    totalDepositado,
    multa,
    totalComMulta,
  }
}
