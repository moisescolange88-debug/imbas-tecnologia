// Tipos para o motor de cálculos trabalhistas

export type TipoRescisao =
  | 'sem-justa-causa'
  | 'por-justa-causa'
  | 'pedido-demissao'
  | 'culpa-reciproca'
  | 'rescisao-antecipada-experiencia'
  | 'morte-empregador'
  | 'morte-empregado'
  | 'reforma-trabalhista-culpa'
  | 'plano-demissao-incentivada'
  | 'rescisao-indireta'

export type TipoRescisaoLabel = Record<TipoRescisao, string>

export const TIPO_RESCISAO_LABEL: TipoRescisaoLabel = {
  'sem-justa-causa': 'Dispensa sem justa causa',
  'por-justa-causa': 'Dispensa por justa causa',
  'pedido-demissao': 'Pedido de demissão',
  'culpa-reciproca': 'Culpa recíproca',
  'rescisao-antecipada-experiencia': 'Rescisão antecipada de contrato de experiência',
  'morte-empregador': 'Morte do empregador',
  'morte-empregado': 'Morte do empregado',
  'reforma-trabalhista-culpa': 'Reforma trabalhista com culpa',
  'plano-demissao-incentivada': 'Plano de demissão incentivada',
  'rescisao-indireta': 'Rescisão indireta',
}

export type VerbaKey =
  | 'saldoSalario'
  | 'feriasProporcionais'
  | 'feriasVencidas'
  | 'decimoTerceiro'
  | 'avisoPrevio'
  | 'multaFGTS'
  | 'salarioFamilia'
  | 'dsr'
  | 'multaArt477'
  | 'multaArt479'

export interface VerbaDetalhada {
  chave: VerbaKey
  nome: string
  valor: number
  descricao?: string
}

export interface RescisaoParams {
  tipo: TipoRescisao
  salario: number
  dataAdmissao: string // ISO date
  dataDemissao: string // ISO date
  jornadaMensal?: number // 220h default
  avisoTrabalhado?: boolean
  avisoIndenizado?: boolean
  dependentes?: number
  pensaoAlimenticia?: number
  verbasExtras?: VerbaExtra[]
  dataPagamento?: string // para multa art. 477
  temEstabilidade?: boolean
  diasTrabalhadosUltimoMes?: number // para saldo de salário
}

export interface VerbaExtra {
  descricao: string
  valorMensal: number
  meses: number
}

export interface RescisaoResult {
  tipo: TipoRescisao
  verba: {
    saldoSalario: number
    feriasProporcionais: number
    feriasVencidas: number
    decimoTerceiro: number
    avisoPrevio: number
    multaFGTS: number
    salarioFamilia: number
    dsr: number
    multaArt477: number
    multaArt479: number
  }
  descontos: {
    inss: number
    irrf: number
    total: number
  }
  totais: {
    bruto: number
    descontos: number
    liquido: number
  }
  detalhamento: VerbaDetalhada[]
}

export interface FeriasParams {
  salario: number
  mesesTrabalhados: number
  diasFerias?: number // 30 default
  abonoPecuniario?: number // dias de abono (max 10)
  dependentes?: number
}

export interface FeriasResult {
  ferias: number
  tercoConstitucional: number
  abonoPecuniario: number
  tercoAbono: number
  baseINSS: number
  baseIRRF: number
  inss: number
  irrf: number
  liquido: number
}

export interface DecimoTerceiroParams {
  salario: number
  mesesTrabalhados: number
  adiantamentoPrimeiraParcela?: number
  dependentes?: number
  verbasExtras?: VerbaExtra[]
}

export interface DecimoTerceiroResult {
  bruto: number
  primeiraParcela: number
  inss: number
  irrf: number
  liquido: number
}

export interface HoraExtraParams {
  salario: number
  jornadaMensal?: number
  horasExtras: number
  adicionalPercentual?: number // 50 default
  diasUteis?: number
  domingosFeriados?: number
}

export interface HoraExtraResult {
  valorHoraNormal: number
  valorHoraExtra: number
  totalHorasExtras: number
  dsrHorasExtras: number
  totalComDSR: number
}

export interface SalarioLiquidoParams {
  salarioBruto: number
  adicionais?: number
  horasExtras?: number
  dsr?: number
  dependentes?: number
  pensaoAlimenticia?: number
  valeTransporte?: boolean
  valeTransportePercentual?: number // 6% default
  faltas?: number
  faltasValor?: number
  outrosDescontos?: number
}

export interface SalarioLiquidoResult {
  baseCalculo: number
  inss: number
  baseIRRF: number
  irrf: number
  valeTransporte: number
  totalDescontos: number
  liquido: number
}

export interface FGTSResult {
  depositosMensais: number
  depositosDecimoTerceiro: number
  depositosFerias: number
  totalDepositado: number
  multa: number
  totalComMulta: number
}
