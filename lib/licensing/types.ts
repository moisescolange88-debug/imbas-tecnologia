export type Orgao = 'ANVISA' | 'CETESB' | 'MUNICIPAL' | 'BOMBEIROS'

export type CategoriaANVISA =
  | 'alimentos'
  | 'cosmeticos'
  | 'medicamentos'
  | 'produtos-saude'
  | 'saneantes'
  | 'medicos-dispositivos'

export type CategoriaCETESB =
  | 'licenca-operacao'
  | 'licenca-instalacao'
  | 'licenca-previa'
  | 'autorizacao-ambiental'
  | 'cadastro-tecnico'

export type CategoriaMunicipal =
  | 'alvara-municipal'
  | 'alvara-sanitario'
  | 'avcb'
  | 'clcb'
  | 'habite-se'

export type TipoLicenca = CategoriaANVISA | CategoriaCETESB | CategoriaMunicipal

export interface DocumentoRequerido {
  nome: string
  descricao: string
  obrigatorio: boolean
}

export interface CustoEstimado {
  descricao: string
  valorMin: number
  valorMax: number
  unidade: string
  observacao?: string
}

export interface Licenca {
  id: string
  orgao: Orgao
  sigla: string
  nome: string
  categoria: TipoLicenca
  descricao: string
  resumo: string
  publicoAlvo: string[]
  requisitos: string[]
  documentos: DocumentoRequerido[]
  prazos: {
    analise: string
    validade: string
    observacao?: string
  }
  custos: CustoEstimado[]
  fundamentacaoLegal: string[]
  urlOficial: string
  tags: string[]
  exemplosAplicacao: string[]
}

export interface PerfilEmpresa {
  segmento: string
  faturamentoAnual?: number
  numeroFuncionarios?: number
  estado?: string
  municipio?: string
  porte: 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE'
  observacoes?: string
}

export interface ItemCotacao {
  licencaId: string
  sigla: string
  nome: string
  orgao: Orgao
  custoEstimado: { min: number; max: number; total: number }
  prazoEstimadoDias: number
  prioridade: 'essencial' | 'recomendada' | 'opcional'
  justificativa: string
  alertas: string[]
}

export interface Cotacao {
  data: string
  perfil: PerfilEmpresa
  itens: ItemCotacao[]
  custoTotal: { min: number; max: number; medio: number }
  prazoTotalDias: number
  observacoes: string[]
  cidadeDetected?: { nome: string; uf: string; particularidades: string[]; alvaraNomes: string[]; prazoAlvara: string; obsAlvara: string; alvaraSanitario?: string; bombeiros: string }
  promptIA?: string
}
