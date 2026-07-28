// Tabelas oficiais 2026 — INSS, IRRF, Salário Mínimo, Salário Família, FGTS
// Base legal: Portarias Interministeriais vigentes em Julho/2026

/** Salário Mínimo Nacional 2026 */
export const SALARIO_MINIMO = 1518.00
export const VALOR_DIA_SM = 50.60
export const VALOR_HORA_SM = 6.51

/** Jornada contratual padrão */
export const JORNADA_PADRAO = 220 // horas mensais (44h semanais)

/** Tabela INSS empregado 2026 — alíquotas progressivas */
export const TABELA_INSS = [
  { ate: 1518.00, aliquota: 7.5, deducao: 0 },
  { ate: 2796.29, aliquota: 9.0, deducao: 22.77 },
  { ate: 4194.29, aliquota: 12.0, deducao: 106.59 },
  { ate: 8189.29, aliquota: 14.0, deducao: 190.48 },
] as const

export const TETO_INSS = 8189.29

/** Tabela IRRF 2026 */
export const TABELA_IRRF = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { ate: 3751.05, aliquota: 15.0, deducao: 381.44 },
  { ate: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { ate: Infinity, aliquota: 27.5, deducao: 896.00 },
] as const

export const DEDUCAO_DEPENDENTE_IRRF = 189.59

/** Salário Família 2026 */
export const SALARIO_FAMILIA_LIMITE = 1906.39
export const SALARIO_FAMILIA_VALOR = 56.47

/** FGTS */
export const ALIQUOTA_FGTS = 8 // percentual mensal
export const MULTA_FGTS_SEM_JUSTA_CAUSA = 40
export const MULTA_FGTS_PDI = 20

/** Adicionais legais */
export const ADICIONAL_HORA_EXTRA = 50 // percentual mínimo
export const ADICIONAL_NOTURNO = 20 // percentual mínimo
export const ADICIONAL_INSALUBRIDADE = { minimo: 10, medio: 20, maximo: 40 } as const
export const ADICIONAL_PERICULOSIDADE = 30

/** Aviso prévio */
export const AVISO_PREVIO_BASE = 30 // dias
export const AVISO_PREVIO_ACRESCIMO_POR_ANO = 3 // dias
export const AVISO_PREVIO_MAXIMO = 90 // dias

/** Jornada noturna */
export const HORA_NOTURNA_REDUZIDA = 52.5 // minutos (52min30s)
export const PERIODO_NOTURNO_INICIO = 22
export const PERIODO_NOTURNO_FIM = 5

/** DSR */
export const DIAS_UTEIS_PADRAO = 22 // referência para cálculo de DSR
