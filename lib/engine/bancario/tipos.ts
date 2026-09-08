// Tipos do motor de perícia financeira em contratos bancários.
//
// Estrutura espelha os Apêndices I, II e III do laudo pericial financeiro
// (NBC TP 01 R2, item 58) e as abas 2, 3 e 5 do template de caso pericial.

export type SistemaAmortizacao = 'price' | 'sac' | 'sam'

export type CriterioCapitalizacao = 'composta' | 'simples'

export const SISTEMA_LABEL: Record<SistemaAmortizacao, string> = {
  price: 'Sistema Francês de Amortização (Price)',
  sac: 'Sistema de Amortização Constante (SAC)',
  sam: 'Sistema de Amortização Misto (SAM)',
}

export const CAPITALIZACAO_LABEL: Record<CriterioCapitalizacao, string> = {
  composta: 'Capitalização composta',
  simples: 'Capitalização simples (juros sobre o capital inicial)',
}

/**
 * Premissas de um recálculo. Todo campo aqui é decisão do perito ou dado
 * extraído do instrumento contratual — o motor não arbitra nenhum deles.
 */
export interface PremissasContrato {
  /** Valor principal financiado (PV), em reais */
  principal: number
  /** Número total de parcelas */
  prazo: number
  /** Taxa de juros do período, em decimal (0.02 = 2% ao mês) */
  taxaPeriodo: number
  sistema: SistemaAmortizacao
  capitalizacao: CriterioCapitalizacao
  /** Tarifa de abertura de crédito, cobrada integralmente na parcela 1 */
  tac?: number
  /** Seguro vinculado, cobrado em toda parcela */
  seguroMensal?: number
  /** Demais tarifas recorrentes por parcela */
  outrasTarifasMensais?: number
  /** Rastreabilidade: cláusula e folha dos autos de onde a premissa foi extraída */
  origem?: string
}

/** Uma linha do quadro de amortização — corresponde a uma parcela. */
export interface LinhaAmortizacao {
  parcela: number
  saldoInicial: number
  amortizacao: number
  juros: number
  encargosAcessorios: number
  /** Amortização + juros, sem encargos acessórios */
  parcelaTeorica: number
  /** Parcela teórica + encargos acessórios */
  parcelaTotal: number
  saldoFinal: number
}

/**
 * Passo rastreável da memória de cálculo. É o que distingue um resultado
 * pericial de um número solto: fórmula, substituição e resultado.
 */
export interface PassoMemoria {
  referencia: string
  formula: string
  substituicao: string
  resultado: number
  fundamento?: string
}

export interface TotaisQuadro {
  amortizacao: number
  juros: number
  encargosAcessorios: number
  parcelasTeoricas: number
  parcelasTotais: number
}

/** Invariante do motor que não se sustentou no resultado produzido. */
export interface Violacao {
  regra: string
  esperado: number
  obtido: number
  diferenca: number
  /** Linha ou seção onde a violação foi detectada. */
  local?: string
}

/**
 * Carimbo que acompanha todo resultado, para que um defeito descoberto no
 * futuro possa ser rastreado até os laudos que ele atingiu.
 */
export interface ProvaDeIntegridade {
  motorVersao: string
  /** Impressão digital das premissas — muda se qualquer entrada mudar. */
  impressaoPremissas: string
  violacoes: Violacao[]
  integro: boolean
}

export interface QuadroAmortizacao {
  premissas: PremissasContrato
  linhas: LinhaAmortizacao[]
  totais: TotaisQuadro
  memoria: PassoMemoria[]
  /**
   * Marcações [VERIFICAR] e DADOS INSUFICIENTES emitidas pelo motor.
   * Devem ser resolvidas pelo perito antes do protocolo.
   */
  alertas: string[]
  prova: ProvaDeIntegridade
}

/** Lançamento extraído do extrato ou carnê — Apêndice II do laudo. */
export interface LancamentoCobrado {
  parcela: number
  vencimento?: string
  pagamento?: string
  amortizacao?: number
  juros?: number
  encargosAcessorios?: number
  /** Total efetivamente cobrado na parcela */
  total: number
  status?: 'pago' | 'aberto' | 'mora'
  /** Folha dos autos de onde o lançamento foi extraído */
  fonte?: string
}

export interface LinhaConfronto {
  parcela: number
  devido: number
  cobrado: number
  /** Cobrado − devido. Positivo indica excesso cobrado. */
  diferenca: number
  observacao?: string
}

export type SentidoDiferenca =
  | 'excesso-cobrado'
  | 'cobranca-a-menor'
  | 'sem-diferenca'

export interface Confronto {
  linhas: LinhaConfronto[]
  totalDevido: number
  totalCobrado: number
  diferencaTotal: number
  sentido: SentidoDiferenca
  alertas: string[]
  prova: ProvaDeIntegridade
}

// ---------------------------------------------------------------------------
// Atualização de valores — correção monetária, juros de mora e multa
// ---------------------------------------------------------------------------

/** Competência no formato `AAAA-MM`. */
export type Competencia = string

export type TipoSerie = 'variacao' | 'numero-indice'

/**
 * Série histórica de um índice.
 *
 * O motor não embute nenhum valor de IPCA, IGPM, INPC, TR, Poupança ou SELIC.
 * A série é sempre fornecida pelo perito, com a fonte declarada, porque índice
 * citado sem origem verificável não sustenta laudo.
 */
export interface SerieIndice {
  /** Identificação do índice — ex.: 'IPCA-E' */
  nome: string
  /** Origem verificável — ex.: 'IBGE, SIDRA tabela 1686, consulta em 01/08/2026' */
  fonte: string
  /**
   * `variacao` — variação do período em decimal (0.0045 = 0,45% no mês).
   * `numero-indice` — número-índice; o fator é a razão entre as pontas.
   */
  tipo: TipoSerie
  valores: Record<Competencia, number>
}

export type RegimeJuros = 'simples' | 'composto'

export type BaseDeIncidencia = 'valor-corrigido' | 'valor-nominal'

/**
 * Premissas de atualização. Todas são decisão do perito ou comando judicial —
 * nenhuma tem padrão implícito no motor.
 */
export interface PremissasAtualizacao {
  /** Série de correção monetária. Ausente = sem correção. */
  correcao?: SerieIndice
  /** Taxa fixa de juros moratórios ao mês, em decimal (0.01 = 1% a.m.). */
  jurosTaxaMensal?: number
  /** Série de juros moratórios variáveis — ex.: SELIC mensal. */
  jurosSerie?: SerieIndice
  regimeJuros?: RegimeJuros
  /** Sobre o que os juros incidem. Exigido quando há juros. */
  baseDosJuros?: BaseDeIncidencia
  /** Competência a partir da qual correm os juros de mora. */
  termoInicialJuros?: Competencia
  /**
   * Declare `true` quando a série de juros já embutir recomposição
   * inflacionária — caso da SELIC. Cumular com correção monetária configura
   * duplicidade, e o motor alerta.
   */
  jurosEmbutemCorrecao?: boolean
  /** Multa por inadimplemento, em decimal (0.02 = 2%). */
  multaPercentual?: number
  baseDaMulta?: BaseDeIncidencia
  /** Cláusula, folha dos autos ou decisão que fundamenta estas premissas. */
  fundamento?: string
}

export interface ResultadoCorrecao {
  valorOriginal: number
  /** `null` quando a série não cobre todo o intervalo — falha explícita. */
  fator: number | null
  valorCorrigido: number | null
  competenciaInicial: Competencia
  competenciaFinal: Competencia
  memoria: PassoMemoria[]
  alertas: string[]
}

export interface ResultadoJuros
  extends Omit<ResultadoCorrecao, 'fator' | 'valorCorrigido'> {
  baseDeCalculo: number
  meses: number
  /** `null` quando a série de juros não cobre todo o intervalo. */
  valorJuros: number | null
}

export interface ValorAtualizado {
  valorOriginal: number
  correcaoMonetaria: number
  juros: number
  multa: number
  /** `null` quando alguma etapa não pôde ser apurada. */
  total: number | null
  competenciaInicial: Competencia
  competenciaFinal: Competencia
  memoria: PassoMemoria[]
  alertas: string[]
}

export interface LinhaConfrontoAtualizada extends LinhaConfronto {
  competenciaInicial: Competencia
  atualizacao: ValorAtualizado
}

export interface ConfrontoAtualizado {
  linhas: LinhaConfrontoAtualizada[]
  competenciaFinal: Competencia
  diferencaNominal: number
  diferencaAtualizada: number | null
  sentido: SentidoDiferenca
  alertas: string[]
  prova: ProvaDeIntegridade
}
