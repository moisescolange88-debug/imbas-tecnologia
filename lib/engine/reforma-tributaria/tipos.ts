// Tipos para cálculos da Reforma Tributária (LC 214/2025 e LC 227/2026)

export type CategoriaReduzida =
  | 'cesta-basica'
  | 'saude'
  | 'educacao'
  | 'medicamentos'
  | 'transporte-publico'
  | 'insumos-agropecuarios'
  | 'producao-cultural'
  | 'profissoes-regulamentadas'
  | 'padrao'

export interface CalculoCBSParams {
  receitaBruta: number // receita bruta mensal/anual em R$
  ano: number
  aliquotaReduzida?: CategoriaReduzida
  creditos?: number // créditos a abater em R$
}

export interface CalculoCBSResult {
  aliquota: number
  baseCalculo: number
  impostoDevido: number
  creditos: number
  impostoLiquido: number
}

export interface CalculoIBSParams {
  receitaBruta: number
  ano: number
  aliquotaReduzida?: CategoriaReduzida
  creditos?: number
}

export interface CalculoIBSResult {
  aliquota: number
  baseCalculo: number
  impostoDevido: number
  creditos: number
  impostoLiquido: number
}

export interface ProjecaoParams {
  receitaBrutaAnual: number
  aliquotaPISCOFINSAtual?: number // 9.25% (Lucro Real), 3.65% (Lucro Presumido) ou 0%
  aliquotaICMSAtual?: number // média estadual ~18% ou 0%
  aliquotaISSAtual?: number // média municipal ~2% a 5% ou 0%
  aliquotaReduzida?: CategoriaReduzida
  comprasDespesasAnual?: number // Compras e despesas que geram crédito no novo IVA
  percentualCreditoEstimado?: number // % estimada de compras/despesas geradoras de crédito
}

export interface ProjecaoAnual {
  ano: number
  receitaBruta: number
  // Tributos novos (CBS e IBS)
  aliquotaCBS: number
  cbsDevido: number
  aliquotaIBS: number
  ibsDevido: number
  totalNovoDevido: number // cbsDevido + ibsDevido
  totalNovo: number // alias de compatibilidade para totalNovoDevido
  creditoNovo: number
  totalNovoLiquido: number // max(0, totalNovoDevido - creditoNovo)
  // Tributos antigos remanescentes
  aliquotaPISCOFINS: number
  pisCofinsRemanescente: number
  pisCofinsAtual: number // alias de compatibilidade
  aliquotaICMSISS: number
  icmsIssRemanescente: number
  icmsIssAtual: number // alias de compatibilidade
  totalAntigoRemanescente: number
  totalAtual: number // alias de compatibilidade para tributos do sistema antigo
  // Carga efetiva anual a recolher
  totalEfetivoAno: number
  aliquotaEfetivaAno: number
  // Baseline de comparação (sistema atual constante)
  totalBaselineAtual: number
  aliquotaBaselineAtual: number
  // Comparativo ano vs sistema atual
  diferencaVsAtual: number // totalEfetivoAno - totalBaselineAtual (<0 economia, >0 aumento)
  diferenca: number // alias de compatibilidade
  percentualVariacao: number
  observacao: string
}

export interface SplitPaymentParams {
  valorOperacao: number
  aliquotaCombinada?: number
}

export interface SplitPaymentResult {
  valorOperacao: number
  aliquota: number
  valorTributo: number
  valorLiquidoRecebido: number
}

export interface CashbackParams {
  rendaMensal?: number
  valorConsumo: number
  cadUnico: boolean
  aliquotaCombinada?: number
}

export interface CashbackResult {
  valorConsumo: number
  percentualCashback: number
  valorCashback: number
}
