// Cálculos do IBS — Imposto sobre Bens e Serviços (estadual/municipal, substitui ICMS/ISS)

import { IBS_ALIQUOTA_CHEIA, TABELA_TRANSICAO, ALIQUOTAS_REDUZIDAS } from './tables'
import { arredondar } from '@/lib/engine/common'
import type { CalculoIBSParams, CalculoCBSResult } from './tipos'

/**
 * Obtém a alíquota de IBS para um ano específico
 */
export function getAliquotaIBS(ano: number): number {
  const anoData = TABELA_TRANSICAO.find(a => a.ano === ano)
  return anoData?.ibs ?? IBS_ALIQUOTA_CHEIA
}

/**
 * Obtém a alíquota IBS efetiva após aplicar redução
 */
export function getAliquotaIBSEfetiva(ano: number, categoria?: string): { aliquotaNominal: number; aliquotaEfetiva: number; descricao: string } {
  const aliquotaNominal = getAliquotaIBS(ano)

  if (!categoria || categoria === 'padrao') {
    return { aliquotaNominal, aliquotaEfetiva: aliquotaNominal, descricao: 'Sem redução' }
  }

  const aliquotaReduzida = ALIQUOTAS_REDUZIDAS.find(a => a.categoria === categoria)
  if (!aliquotaReduzida) {
    return { aliquotaNominal, aliquotaEfetiva: aliquotaNominal, descricao: 'Sem redução' }
  }

  const aliquotaEfetiva = arredondar(aliquotaNominal * (1 - aliquotaReduzida.reducao / 100))
  return { aliquotaNominal, aliquotaEfetiva, descricao: `${aliquotaReduzida.reducao}% de redução — ${aliquotaReduzida.nome}` }
}

/**
 * Calcula o valor devido de IBS
 */
export function calcularIBS(params: CalculoIBSParams): CalculoCBSResult {
  const { receitaBruta, ano, aliquotaReduzida, creditos = 0 } = params
  const { aliquotaEfetiva } = getAliquotaIBSEfetiva(ano, aliquotaReduzida)

  const baseCalculo = receitaBruta
  const impostoDevido = arredondar(baseCalculo * aliquotaEfetiva / 100)
  const impostoLiquido = Math.max(0, arredondar(impostoDevido - creditos))

  return {
    aliquota: aliquotaEfetiva,
    baseCalculo,
    impostoDevido,
    creditos,
    impostoLiquido,
  }
}
