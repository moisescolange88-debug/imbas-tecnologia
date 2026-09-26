// Tabelas oficiais da Reforma Tributária — LC 214/2025 e LC 227/2026
// Fontes: Receita Federal, LC 214/2025 arts. 343-348, Comitê Gestor do IBS

import type { CategoriaReduzida } from './tipos'

/** Transição CBS/IBS 2026-2033 */
export interface AnoTransicao {
  ano: number
  cbs: number // alíquota CBS em % (nominal de referência)
  ibs: number // alíquota IBS em % (nominal de referência)
  pisCofins: number // % do sistema antigo PIS/Cofins ainda vigente
  icmsIss: number // % do sistema antigo ICMS/ISS ainda vigente
  observacao: string
}

export const TABELA_TRANSICAO: AnoTransicao[] = [
  { ano: 2026, cbs: 0.9, ibs: 0.1, pisCofins: 100, icmsIss: 100, observacao: 'Alíquotas teste (1%). CBS (0,9%) e IBS (0,1%) compensadas com PIS/Cofins devido. Simples isento.' },
  { ano: 2027, cbs: 8.8, ibs: 0.1, pisCofins: 0, icmsIss: 100, observacao: 'CBS em alíquota plena (8,8%). PIS/Cofins e IPI extintos. IBS teste (0,1%). ICMS e ISS mantidos integrais.' },
  { ano: 2028, cbs: 8.8, ibs: 0.1, pisCofins: 0, icmsIss: 100, observacao: 'CBS plena em vigor. ICMS e ISS estaduais e municipais permanecem inalterados.' },
  { ano: 2029, cbs: 8.8, ibs: 1.77, pisCofins: 0, icmsIss: 90, observacao: 'IBS em 10% da alíquota plena (1,77%). Início da redução de 10% no ICMS e ISS.' },
  { ano: 2030, cbs: 8.8, ibs: 3.54, pisCofins: 0, icmsIss: 80, observacao: 'IBS em 20% da alíquota plena (3,54%). Redução de 20% no ICMS e ISS.' },
  { ano: 2031, cbs: 8.8, ibs: 5.31, pisCofins: 0, icmsIss: 70, observacao: 'IBS em 30% da alíquota plena (5,31%). Redução de 30% no ICMS e ISS.' },
  { ano: 2032, cbs: 8.8, ibs: 7.08, pisCofins: 0, icmsIss: 60, observacao: 'IBS em 40% da alíquota plena (7,08%). Redução de 40% no ICMS e ISS.' },
  { ano: 2033, cbs: 8.8, ibs: 17.7, pisCofins: 0, icmsIss: 0, observacao: 'Sistema consolidado. ICMS e ISS extintos. Vigoram CBS (8,8%) e IBS (17,7%).' },
]

export const CBS_ALIQUOTA_CHEIA = 8.8
export const IBS_ALIQUOTA_CHEIA = 17.7
export const ALIQUOTA_COMBINADA = CBS_ALIQUOTA_CHEIA + IBS_ALIQUOTA_CHEIA // 26.5%

/** Categorias de alíquotas reduzidas (art. 125 e Anexo I da LC 214/2025) */
export interface AliquotaReduzida {
  categoria: CategoriaReduzida
  nome: string
  reducao: number // percentual de redução sobre a alíquota cheia
  aliquotaEfetiva: number // alíquota efetiva combinada em %
  exemplos: string
  baseLegal: string
}

export const ALIQUOTAS_REDUZIDAS: AliquotaReduzida[] = [
  { categoria: 'padrao', nome: 'Padrão (sem redução)', reducao: 0, aliquotaEfetiva: 26.5, exemplos: 'Demais bens, produtos e serviços em geral', baseLegal: 'Alíquota de referência' },
  { categoria: 'saude', nome: 'Saúde (60% de redução)', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Serviços médicos, hospitais, clínicas, laboratórios', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'educacao', nome: 'Educação (60% de redução)', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Mensalidades escolares, cursos técnicos, graduação, pós', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'medicamentos', nome: 'Medicamentos (60% de redução)', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Medicamentos registrados na Anvisa sob prescrição', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'transporte-publico', nome: 'Transporte público (60% de redução)', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Ônibus urbano, coletivo metropolitano, metrô, trem', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'insumos-agropecuarios', nome: 'Insumos agropecuários (60% de redução)', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Fertilizantes, defensivos, sementes, rações', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'producao-cultural', nome: 'Produção cultural e artística (60% de redução)', reducao: 60, aliquotaEfetiva: 10.6, exemplos: 'Espetáculos teatrais, shows, festivais, livros', baseLegal: 'Art. 125 LC 214/2025' },
  { categoria: 'profissoes-regulamentadas', nome: 'Profissões regulamentadas (30% de redução)', reducao: 30, aliquotaEfetiva: 18.55, exemplos: 'Advocacia, contabilidade, medicina, engenharia, arquitetura', baseLegal: 'Art. 125, § 1º LC 214/2025' },
  { categoria: 'cesta-basica', nome: 'Cesta básica nacional (alíquota zero)', reducao: 100, aliquotaEfetiva: 0, exemplos: 'Arroz, feijão, leite, pão, frutas, ovos, carnes, café', baseLegal: 'Anexo I LC 214/2025' },
]

/** Categorias de Imposto Seletivo (IS) — produtos nocivos */
export type ISCategoria =
  | 'cigarros'
  | 'bebidas-alcoolicas'
  | 'bebidas-acucaradas'
  | 'combustiveis-fosseis'
  | 'veiculos-poluentes'
  | 'agrotoxicos'
  | 'mineracao'

export interface ISConfig {
  categoria: ISCategoria
  nome: string
  aliquotaEstimada: string // % estimada (a definir por lei específica)
  inicio: number
  descricao: string
}

export const IMPOSTO_SELETIVO: ISConfig[] = [
  { categoria: 'cigarros', nome: 'Cigarros e produtos de tabaco', aliquotaEstimada: 'Ad valorem / Específica', inicio: 2027, descricao: 'Incidência monofásica na produção ou importação de produtos de tabaco.' },
  { categoria: 'bebidas-alcoolicas', nome: 'Bebidas alcoólicas', aliquotaEstimada: 'Graduada por teor alcoólico', inicio: 2027, descricao: 'Tributação progressiva conforme graduação alcoólica da bebida.' },
  { categoria: 'bebidas-acucaradas', nome: 'Bebidas açucaradas', aliquotaEstimada: 'Por teor de açúcar', inicio: 2027, descricao: 'Refrigerantes, energéticos e bebidas com adição de açúcares.' },
  { categoria: 'combustiveis-fosseis', nome: 'Combustíveis e derivados de petróleo', aliquotaEstimada: 'Definição em lei', inicio: 2027, descricao: 'Extração e produção de petróleo, gás natural e derivados fósseis.' },
  { categoria: 'veiculos-poluentes', nome: 'Veículos poluentes e embarcações', aliquotaEstimada: 'Por emissão de carbono', inicio: 2027, descricao: 'Tributação diferenciada por eficiência energética e índice de poluição.' },
  { categoria: 'agrotoxicos', nome: 'Agrotóxicos e defensivos químicos', aliquotaEstimada: 'Definição em lei', inicio: 2027, descricao: 'Defensivos de alta toxicidade ao meio ambiente e à saúde.' },
  { categoria: 'mineracao', nome: 'Bens minerais extraídos', aliquotaEstimada: 'Máx. 1% na extração', inicio: 2027, descricao: 'Incide sobre minério de ferro, bauxita, cobre e petróleo (teto de 1%).' },
]

/** Marco legal */
export const LC_214_2025 = 'Lei Complementar nº 214, de 16 de janeiro de 2025'
export const LC_227_2026 = 'Lei Complementar nº 227, de 2026 (Comitê Gestor do IBS)'
