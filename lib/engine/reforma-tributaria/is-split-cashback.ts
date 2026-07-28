// Cálculo do Imposto Seletivo (IS), Split Payment e Cashback

import { arredondar } from '@/lib/engine/common'
import { IMPOSTO_SELETIVO, ALIQUOTA_COMBINADA, CBS_ALIQUOTA_CHEIA, IBS_ALIQUOTA_CHEIA } from './tables'
import type { SplitPaymentParams, SplitPaymentResult, CashbackParams, CashbackResult } from './tipos'

/**
 * Calcula o Split Payment — separação automática do tributo no pagamento
 * O valor do tributo é retido na hora, sem passar pela conta da empresa
 */
export function calcularSplitPayment(params: SplitPaymentParams): SplitPaymentResult {
  const { valorOperacao, aliquotaCombinada = ALIQUOTA_COMBINADA } = params
  const valorTributo = arredondar(valorOperacao * aliquotaCombinada / 100)
  const valorLiquidoRecebido = arredondar(valorOperacao - valorTributo)

  return {
    valorOperacao,
    aliquota: aliquotaCombinada,
    valorTributo,
    valorLiquidoRecebido,
  }
}

/**
 * Calcula o Cashback (devolução de tributos para famílias de baixa renda)
 * Famílias do CadÚnico têm direito a devolução de parte da CBS+IBS sobre o consumo
 */
export function calcularCashback(params: CashbackParams): CashbackResult {
  const { valorConsumo, cadUnico } = params

  // Percentual de cashback estimado para famílias do CadÚnico
  const percentualCashback = cadUnico ? 100 : 0 // 100% da CBS+IBS devolvida até um limite
  const valorCashback = cadUnico ? arredondar(valorConsumo * ALIQUOTA_COMBINADA / 100) : 0

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
export function getAliquotaCombinada(ano: number, cbs: number, ibs: number): number {
  return arredondar(cbs + ibs)
}
