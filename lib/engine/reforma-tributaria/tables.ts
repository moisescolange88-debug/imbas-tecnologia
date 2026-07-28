// Tabelas oficiais da Reforma Tributária — LC 214/2025
// Fontes: Receita Federal, LC 214/2025 arts. 343-348, Banana Software

import type { CategoriaReduzida } from './tipos'

/** Transição CBS/IBS 2026-2033 */
export interface AnoTransicao {
  ano: number
  cbs: number // alíquota CBS em %
  ibs: number // alíquota IBS em %
  pisCofins: number // % do sistema antigo ainda vigente
  icmsIss: number // % do sistema antigo ainda vigente
  observacao: string
}

export const TABELA_TRANSICAO: AnoTransicao[] = [
  { ano: 2026, cbs: 0.9, ibs: 0.1, pisCofins: 100, icmsIss: 100, observacao: 'Alíquotas teste. CBS+IBS neutralizadas via compensação. Simples isento.' },
  { ano: 2027, cbs: 8.8, ibs: 0.1, pisCofins: 0, icmsIss: 100, observacao: 'CBS alíquota cheia. PIS/Cofins extintos. IPI zerado (exceto ZFM).' },
  { ano: 2028, cbs: 8.8, ibs: 0.1, pisCofins: 0, icmsIss: 100, observacao: 'Transição ICMS/ISS inalterados.' },
  { ano: 2029, cbs: 8.8, ibs: 1.77, pisCofins: 0, icmsIss: 90, observacao: 'IBS 10% da alíquota cheia. ICMS/ISS redução de 10%.' },
  { ano: 2030, cbs: 8.8, ibs: 3.54, pisCofins: 0, icmsIss: 80, observacao: 'IBS 20% da alíquota cheia. ICMS/ISS redução de 20%.' },
  { ano: 2031, cbs: 8.8, ibs: 5.31, pisCofins: 0, icmsIss: 70, observacao: 'IBS 30% da alíquota cheia. ICMS/ISS redução de 30%.' },
  { ano: 2032, cbs: 8.8, ibs: 7.08, pisCofins: 0, icmsIss: 60, observacao: 'IBS 40% da alíquota cheia. ICMS/ISS redução de 40%.' },
  { ano: 2033, cbs: 8.8, ibs: 17.7, pisCofins: 0, icmsIss: 0, observacao: 'Sistema consolidado. ICMS/ISS extintos.' },
]

export const CBS_ALIQUOTA_CHEIA = 8.8
export const IBS_ALIQUOTA_CHEIA = 17.7
export const ALIQUOTA_COMBINADA = CBS_ALIQUOTA_CHEIA + IBS_ALIQUOTA_CHEIA // 26.5%

/** Categorias de alíquotas reduzidas (art. 125 LC 214/2025) */
export interface AliquotaReduzida {
  categoria: CategoriaReduzida
  nome: string
  reducao: number // percentual de redução sobre a alíquota cheia
  aliquotaEfetiva: number // alíquota efetiva combinada em %
  exemplos: string
  baseLegal: string
}

export const ALIQUOTAS_REDUZIDAS: AliquotaReduzida[] = [
  { categoria: 'cesta-basica', nome: 'Cesta básica nacional', reducao: 100, aliquotaEfetiva: 0, exemplos: 'Arroz, feijão, leite, pão, frutas, ovos, carne', baseLegal: 'Anexo I LC 214/2025' },
  { categoria: 'saude', nome: 'Saúde', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Serviços médicos, hospitais, clínicas', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'educacao', nome: 'Educação', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Mensalidades escolares, cursos técnicos, graduação', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'medicamentos', nome: 'Medicamentos', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Medicamentos sob prescrição (lista Anvisa)', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'transporte-publico', nome: 'Transporte público', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Ônibus urbano, metrô, trem', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'insumos-agropecuarios', nome: 'Insumos agropecuários', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Fertilizantes, defensivos, sementes', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'producao-cultural', nome: 'Produção cultural', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Espetáculos, festivais, livros', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'profissoes-regulamentadas', nome: 'Profissões regulamentadas', reducao: 30, aliquotaEfetiva: 18.55, exemplos: 'Advocacia, contabilidade, engenharia', baseLegal: 'LC 214/2025' },
  { categoria: 'padrao', nome: 'Padrão (sem redução)', reducao: 0, aliquotaEfetiva: 26.5, exemplos: 'Demais bens e serviços', baseLegal: 'Alíquota cheia' },
]

/** Categorias de Imposto Seletivo (IS) — produtos nocivos */
export type ISCategoria =
  | 'cigarros'
  | 'bebidas-alcoolicas'
  | 'bebidas-acucaradas'
  | 'combustiveis-fosseis'
  | 'veiculos-poluentes'
  | 'agrotoxicos'

export interface ISConfig {
  categoria: ISCategoria
  nome: string
  aliquotaEstimada: string // % estimada (a definir por lei específica)
  inicio: number
}

export const IMPOSTO_SELETIVO: ISConfig[] = [
  { categoria: 'cigarros', nome: 'Cigarros e produtos de tabaco', aliquotaEstimada: 'A definir', inicio: 2027 },
  { categoria: 'bebidas-alcoolicas', nome: 'Bebidas alcoólicas', aliquotaEstimada: 'A definir', inicio: 2027 },
  { categoria: 'bebidas-acucaradas', nome: 'Bebidas açucaradas', aliquotaEstimada: 'A definir', inicio: 2027 },
  { categoria: 'combustiveis-fosseis', nome: 'Combustíveis fósseis', aliquotaEstimada: 'A definir', inicio: 2027 },
  { categoria: 'veiculos-poluentes', nome: 'Veículos poluentes', aliquotaEstimada: 'A definir', inicio: 2027 },
  { categoria: 'agrotoxicos', nome: 'Agrotóxicos', aliquotaEstimada: 'A definir', inicio: 2027 },
]

/** Marco legal */
export const LC_214_2025 = 'Lei Complementar nº 214, de 16 de janeiro de 2025'
export const LC_227_2026 = 'Lei Complementar nº 227, de 2026 (Comitê Gestor do IBS)'
