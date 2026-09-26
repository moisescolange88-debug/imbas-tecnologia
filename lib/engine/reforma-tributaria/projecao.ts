// Cálculo de projeção completa da Reforma Tributária (2026-2033)
// Compara o sistema atual (PIS/Cofins + ICMS + ISS) com o novo IVA Dual (CBS + IBS) e a transição da LC 214/2025

import { TABELA_TRANSICAO, CBS_ALIQUOTA_CHEIA, IBS_ALIQUOTA_CHEIA } from './tables'
import { arredondar } from '@/lib/engine/common'
import { getAliquotaCBSEfetiva } from './cbs'
import { getAliquotaIBSEfetiva } from './ibs'
import type { ProjecaoParams, ProjecaoAnual } from './tipos'

/**
 * Projeta a carga tributária ano a ano (2026-2033)
 * Compara o sistema atual com o novo e calcula o valor efetivo anual a recolher na transição
 */
export function projetarTransicao(params: ProjecaoParams): ProjecaoAnual[] {
  const {
    receitaBrutaAnual,
    aliquotaPISCOFINSAtual = 9.25,
    aliquotaICMSAtual = 18,
    aliquotaISSAtual = 3,
    aliquotaReduzida,
    comprasDespesasAnual = 0,
    percentualCreditoEstimado = 0,
  } = params

  // Base de despesas/compras operacionais que geram crédito no novo IVA Dual
  const baseDespesas = comprasDespesasAnual > 0
    ? comprasDespesasAnual
    : (percentualCreditoEstimado > 0 ? arredondar(receitaBrutaAnual * (percentualCreditoEstimado / 100)) : 0)

  // Carga atual de referência (baseline anual do que a empresa paga hoje com alíquotas cheias)
  const aliquotaBaselineAtual = arredondar(aliquotaPISCOFINSAtual + aliquotaICMSAtual + aliquotaISSAtual)
  const totalBaselineAtual = arredondar(receitaBrutaAnual * (aliquotaBaselineAtual / 100))

  return TABELA_TRANSICAO.map(ano => {
    // 1. Novos tributos vigentes no ano da transição
    const cbs = getAliquotaCBSEfetiva(ano.ano, aliquotaReduzida)
    const ibs = getAliquotaIBSEfetiva(ano.ano, aliquotaReduzida)
    const cbsDevido = arredondar(receitaBrutaAnual * (cbs.aliquotaEfetiva / 100))
    const ibsDevido = arredondar(receitaBrutaAnual * (ibs.aliquotaEfetiva / 100))
    const totalNovoDevido = arredondar(cbsDevido + ibsDevido)

    // Créditos da não-cumulatividade plena sobre despesas/compras
    const aliquotaCombinadaEfetiva = cbs.aliquotaEfetiva + ibs.aliquotaEfetiva
    const creditoNovo = ano.ano >= 2027 && baseDespesas > 0
      ? arredondar(baseDespesas * (aliquotaCombinadaEfetiva / 100))
      : 0
    const totalNovoLiquido = Math.max(0, arredondar(totalNovoDevido - creditoNovo))

    // 2. Tributos antigos remanescentes
    const aliquotaPISCOFINSRem = arredondar(aliquotaPISCOFINSAtual * (ano.pisCofins / 100))
    const pisCofinsRemanescente = arredondar(receitaBrutaAnual * (aliquotaPISCOFINSRem / 100))

    const aliquotaICMSISSRem = arredondar((aliquotaICMSAtual + aliquotaISSAtual) * (ano.icmsIss / 100))
    const icmsIssRemanescente = arredondar(receitaBrutaAnual * (aliquotaICMSISSRem / 100))

    const totalAntigoRemanescente = arredondar(pisCofinsRemanescente + icmsIssRemanescente)

    // 3. Carga efetiva real a recolher no ano
    let totalEfetivoAno: number
    if (ano.ano === 2026) {
      // 2026 é ano de teste: CBS (0,9%) e IBS (0,1%) são 100% compensados com PIS/Cofins devido.
      // O desembolso financeiro total do contribuinte é idêntico ao sistema atual.
      totalEfetivoAno = totalBaselineAtual
    } else {
      // A partir de 2027, o contribuinte recolhe os novos tributos (CBS + IBS líquido)
      // somados aos tributos do sistema antigo que ainda não foram totalmente extintos (ICMS/ISS remanescentes).
      totalEfetivoAno = arredondar(totalNovoLiquido + totalAntigoRemanescente)
    }

    const aliquotaEfetivaAno = receitaBrutaAnual > 0
      ? arredondar((totalEfetivoAno / receitaBrutaAnual) * 100)
      : 0

    // 4. Comparação direta com o sistema atual constante
    const diferencaVsAtual = arredondar(totalEfetivoAno - totalBaselineAtual)
    const percentualVariacao = totalBaselineAtual > 0
      ? arredondar(((totalEfetivoAno - totalBaselineAtual) / totalBaselineAtual) * 100)
      : 0

    return {
      ano: ano.ano,
      receitaBruta: receitaBrutaAnual,
      aliquotaCBS: cbs.aliquotaEfetiva,
      cbsDevido,
      aliquotaIBS: ibs.aliquotaEfetiva,
      ibsDevido,
      totalNovoDevido,
      totalNovo: totalNovoDevido, // alias compatibilidade
      creditoNovo,
      totalNovoLiquido,
      aliquotaPISCOFINS: aliquotaPISCOFINSRem,
      pisCofinsRemanescente,
      pisCofinsAtual: pisCofinsRemanescente, // alias compatibilidade
      aliquotaICMSISS: aliquotaICMSISSRem,
      icmsIssRemanescente,
      icmsIssAtual: icmsIssRemanescente, // alias compatibilidade
      totalAntigoRemanescente,
      totalAtual: totalAntigoRemanescente, // alias compatibilidade
      totalEfetivoAno,
      aliquotaEfetivaAno,
      totalBaselineAtual,
      aliquotaBaselineAtual,
      diferencaVsAtual,
      diferenca: diferencaVsAtual, // alias compatibilidade
      percentualVariacao,
      observacao: ano.observacao,
    }
  })
}
