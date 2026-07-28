// Cálculo de projeção completa da Reforma Tributária (2026-2033)
// Compara sistema atual vs novo e mostra diferença anual

import { TABELA_TRANSICAO, CBS_ALIQUOTA_CHEIA, IBS_ALIQUOTA_CHEIA } from './tables'
import { arredondar } from '@/lib/engine/common'
import { getAliquotaCBSEfetiva } from './cbs'
import { getAliquotaIBSEfetiva } from './ibs'
import type { ProjecaoAnual } from './tipos'

interface ProjecaoParams {
  receitaBrutaAnual: number
  aliquotaPISCOFINSAtual?: number // 9.25% média (cumulativo) ou 3.65% (não cumulativo)
  aliquotaICMSAtual?: number // média estadual ~18%
  aliquotaISSAtual?: number // média municipal ~3%
  aliquotaReduzida?: string
}

/**
 * Projeta a carga tributária ano a ano (2026-2033)
 * Compara o sistema atual (PIS/Cofins + ICMS/ISS) com o novo (CBS + IBS)
 */
export function projetarTransicao(params: ProjecaoParams): ProjecaoAnual[] {
  const {
    receitaBrutaAnual,
    aliquotaPISCOFINSAtual = 9.25,
    aliquotaICMSAtual = 18,
    aliquotaISSAtual = 3,
    aliquotaReduzida,
  } = params

  const receitaMensal = arredondar(receitaBrutaAnual / 12)

  return TABELA_TRANSICAO.map(ano => {
    // Sistema atual (proporcional ao que ainda vigora)
    const pisCofinsAnual = arredondar(receitaBrutaAnual * (aliquotaPISCOFINSAtual / 100) * (ano.pisCofins / 100))
    const icmsIssAnual = arredondar(receitaBrutaAnual * ((aliquotaICMSAtual + aliquotaISSAtual) / 100) * (ano.icmsIss / 100))
    const totalAtual = arredondar(pisCofinsAnual + icmsIssAnual)

    // Sistema novo
    const cbs = getAliquotaCBSEfetiva(ano.ano, aliquotaReduzida)
    const ibs = getAliquotaIBSEfetiva(ano.ano, aliquotaReduzida)
    const cbsAnual = arredondar(receitaBrutaAnual * cbs.aliquotaEfetiva / 100)
    const ibsAnual = arredondar(receitaBrutaAnual * ibs.aliquotaEfetiva / 100)
    const totalNovo = arredondar(cbsAnual + ibsAnual)

    const diferenca = arredondar(totalNovo - totalAtual)

    return {
      ano: ano.ano,
      receitaBruta: receitaBrutaAnual,
      cbsDevido: cbsAnual,
      ibsDevido: ibsAnual,
      totalNovo,
      pisCofinsAtual: pisCofinsAnual,
      icmsIssAtual: icmsIssAnual,
      totalAtual,
      diferenca,
      observacao: ano.observacao,
    }
  })
}
