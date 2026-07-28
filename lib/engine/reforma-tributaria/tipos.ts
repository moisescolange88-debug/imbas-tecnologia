// Tipos para cálculos da Reforma Tributária

export interface CalculoCBSParams {
  receitaBruta: number // receita bruta mensal em R$
  ano: number
  aliquotaReduzida?: 'cesta-basica' | 'saude' | 'educacao' | 'medicamentos' | 'transporte-publico' | 'insumos-agropecuarios' | 'producao-cultural' | 'profissoes-regulamentadas' | 'padrao'
  creditos?: number // créditos a abater em R$
}

export interface CalculoIBSResult {
  aliquota: number
  baseCalculo: number
  impostoDevido: number
  creditos: number
  impostoLiquido: number
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

export interface ProjecaoAnual {
  ano: number
  receitaBruta: number
  cbsDevido: number
  ibsDevido: number
  totalNovo: number
  pisCofinsAtual: number
  icmsIssAtual: number
  totalAtual: number
  diferenca: number
  observacao: string
}

export interface SplitPaymentParams {
  valorOperacao: number
  aliquotaCombinada: number
}

export interface SplitPaymentResult {
  valorOperacao: number
  aliquota: number
  valorTributo: number
  valorLiquidoRecebido: number
}

export interface CashbackParams {
  rendaMensal: number
  valorConsumo: number
  cadUnico: boolean
}

export interface CashbackResult {
  valorConsumo: number
  percentualCashback: number
  valorCashback: number
}
