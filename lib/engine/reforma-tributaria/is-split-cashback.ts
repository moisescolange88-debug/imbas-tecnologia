// Cálculo do Imposto Seletivo (IS), Split Payment e Cashback (LC 214/2025)

import { arredondar } from '@/lib/engine/common'
import { IMPOSTO_SELETIVO, ALIQUOTA_COMBINADA } from './tables'
import type { SplitPaymentParams, SplitPaymentResult, CashbackParams, CashbackResult } from './tipos'

/**
 * Calcula o Split Payment — retenção automática do tributo no pagamento (art. 47 LC 214/2025)
 * O valor do tributo é retido no momento do pagamento e recolhido direto ao Fisco
 */
export function calcularSplitPayment(params: SplitPaymentParams): SplitPaymentResult {
  const { valorOperacao, aliquotaCombinada = ALIQUOTA_COMBINADA } = params
  const valorTributo = arredondar(valorOperacao * (aliquotaCombinada / 100))
  const valorLiquidoRecebido = arredondar(valorOperacao - valorTributo)

  return {
    valorOperacao,
    aliquota: aliquotaCombinada,
    valorTributo,
    valorLiquidoRecebido,
  }
}

/**
 * Calcula o Cashback (devolução de tributos para famílias do CadÚnico - art. 104 LC 214/2025)
 */
export function calcularCashback(params: CashbackParams): CashbackResult {
  const { valorConsumo, cadUnico, aliquotaCombinada = ALIQUOTA_COMBINADA } = params

  const percentualCashback = cadUnico ? 100 : 0
  const valorCashback = cadUnico ? arredondar(valorConsumo * (aliquotaCombinada / 100)) : 0

  return {
    valorConsumo,
    percentualCashback,
    valorCashback,
  }
}

/**
 * Retorna lista de produtos sujeitos ao Imposto Seletivo
 */
export function getProdutosIS() {
  return IMPOSTO_SELETIVO
}

/**
 * Alíquota combinada CBS + IBS para um dado ano
 */
export function getAliquotaCombinada(cbs: number, ibs: number): number {
  return arredondar(cbs + ibs)
}
