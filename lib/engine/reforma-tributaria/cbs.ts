// Cálculos da CBS — Contribuição sobre Bens e Serviços (tributo federal que substitui PIS/Cofins)

import { CBS_ALIQUOTA_CHEIA, TABELA_TRANSICAO, ALIQUOTAS_REDUZIDAS } from './tables'
import { arredondar } from '@/lib/engine/common'
import type { CalculoCBSParams, CalculoCBSResult } from './tipos'

/**
 * Obtém a alíquota de CBS para um ano específico
 */
export function getAliquotaCBS(ano: number): number {
  const anoData = TABELA_TRANSICAO.find(a => a.ano === ano)
  return anoData?.cbs ?? CBS_ALIQUOTA_CHEIA
}

/**
 * Obtém a alíquota CBS após aplicar redução (se houver)
 */
export function getAliquotaCBSEfetiva(ano: number, categoria?: string): { aliquotaNominal: number; aliquotaEfetiva: number; descricao: string } {
  const aliquotaNominal = getAliquotaCBS(ano)

  if (!categoria || categoria === 'padrao') {
    return { aliquotaNominal, aliquotaEfetiva: aliquotaNominal, descricao: 'Sem redução' }
  }

  const aliquotaReduzida = ALIQUOTAS_REDUZIDAS.find(a => a.categoria === categoria)
  if (!aliquotaReduzida) {
    return { aliquotaNominal, aliquotaEfetiva: aliquotaNominal, descricao: 'Sem redução' }
  }

  // Para CBS, a redução % incide sobre a alíquota da CBS proporcionalmente
  const aliquotaEfetiva = arredondar(aliquotaNominal * (1 - aliquotaReduzida.reducao / 100))
  return { aliquotaNominal, aliquotaEfetiva, descricao: `${aliquotaReduzida.reducao}% de redução — ${aliquotaReduzida.nome}` }
}

/**
 * Calcula o valor devido de CBS
 */
export function calcularCBS(params: CalculoCBSParams): CalculoCBSResult {
  const { receitaBruta, ano, aliquotaReduzida, creditos = 0 } = params
  const { aliquotaEfetiva } = getAliquotaCBSEfetiva(ano, aliquotaReduzida)

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
