import { LICENCAS } from './conhecimento'
import { LICENCAS_MUNICIPAIS, buscarCidade } from './municipais'
import type { Cotacao, ItemCotacao, Licenca, Orgao, PerfilEmpresa } from './types'

const LICENCAS_TOTAL = [...LICENCAS, ...LICENCAS_MUNICIPAIS]

const SEGMENTOS_ALIMENTO = [
  'alimentos',
  'bebidas',
  'suplementos',
  'nutricao',
  'restaurante',
  'foodservice',
  'foodservice',
  'panificacao',
  'congelados',
  'laticinios',
  'carnes',
  'producao-agricola',
  'organico',
]

const SEGMENTOS_COSMETICO = [
  'cosmeticos',
  'higiene',
  'beleza',
  'perfumaria',
  'estetica',
  'cabeleleiro',
  'salao',
  'spa',
]

const SEGMENTOS_MEDICAMENTO = [
  'medicamentos',
  'farmacia',
  'drogaria',
  'manipulacao',
  'biologicos',
  'fitoterapicos',
]

const SEGMENTOS_SAUDE = [
  'saude',
  'hospital',
  'laboratorio',
  'clinica',
  'clinica-medica',
  'medico',
  'odontologico',
  'fisioterapia',
  'veterinario',
  'diagnostico',
]

const SEGMENTOS_INDUSTRIAL = [
  'industria',
  'fabrica',
  'industrial',
  'manufatura',
  'transformacao',
  'metalurgica',
  'quimica',
  'plastico',
  'textil',
  'eletronico',
]

const SEGMENTOS_COMBUSTIVEL = [
  'posto',
  'combustivel',
  'gas-natural',
  'transportadora',
  'logistica',
  'armazenamento',
  'gasolinheiro',
]

const SEGMENTOS_EIA = [
  'novo',
  'novo-projeto',
  'ampliacao',
  'nova-fabrica',
  'loteamento',
  'empreendimento',
  'parque-industrial',
  'usina',
  'mineracao',
  'construcao-pesada',
  'shopping',
  'condominio',
  'grande',
]

const SEGMENTOS_RESIDUOS = [
  'residuossolidos',
  'reciclagem',
  'aterro',
  'incinerador',
  'gestao-de-residuos',
  'aterro-sanitario',
  'limpeza-publica',
]

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
}

function contem(segmento: string, termos: string[]): boolean {
  const s = normalizar(segmento)
  return termos.some(t => s.includes(t))
}

function diasPor(texto: string): number {
  const match = texto.match(/(\d+)\s*a\s*(\d+)/)
  if (match) return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2)
  const soNum = texto.match(/(\d+)/)
  if (soNum) return parseInt(soNum[1])
  if (/imediato/i.test(texto)) return 1
  return 90
}

function custoMedio(licenca: Licenca): number {
  const total = licenca.custos.reduce((acc, c) => acc + (c.valorMin + c.valorMax) / 2, 0)
  return total
}

export function recomendarLicencas(perfil: PerfilEmpresa): Licenca[] {
  const seg = normalizar(perfil.segmento)
  const recomendadas = new Set<Licenca>()

  if (contem(seg, SEGMENTOS_ALIMENTO)) {
    LICENCAS_TOTAL.filter(l => l.orgao === 'ANVISA' && l.categoria === 'alimentos').forEach(l =>
      recomendadas.add(l)
    )
  }

  if (contem(seg, SEGMENTOS_COSMETICO)) {
    LICENCAS_TOTAL.filter(l => l.orgao === 'ANVISA' && l.categoria === 'cosmeticos').forEach(l =>
      recomendadas.add(l)
    )
  }

  if (contem(seg, SEGMENTOS_MEDICAMENTO)) {
    LICENCAS_TOTAL.filter(l => l.orgao === 'ANVISA' && l.categoria === 'medicamentos').forEach(l =>
      recomendadas.add(l)
    )
  }

  if (contem(seg, SEGMENTOS_SAUDE)) {
    LICENCAS_TOTAL.filter(l => l.orgao === 'ANVISA' && l.categoria === 'medicos-dispositivos').forEach(l =>
      recomendadas.add(l)
    )
    LICENCAS_TOTAL.filter(l => l.orgao === 'ANVISA' && l.categoria === 'produtos-saude').forEach(l =>
      recomendadas.add(l)
    )
  }

  if (contem(seg, SEGMENTOS_INDUSTRIAL) || contem(seg, SEGMENTOS_COMBUSTIVEL)) {
    LICENCAS_TOTAL.filter(l => l.orgao === 'CETESB').forEach(l => recomendadas.add(l))
  }

  if (contem(seg, SEGMENTOS_EIA)) {
    LICENCAS_TOTAL.find(l => l.sigla === 'LP') && recomendadas.add(LICENCAS_TOTAL.find(l => l.sigla === 'LP')!)
    LICENCAS_TOTAL.find(l => l.sigla === 'LI') && recomendadas.add(LICENCAS_TOTAL.find(l => l.sigla === 'LI')!)
    LICENCAS_TOTAL.find(l => l.sigla === 'LO') && recomendadas.add(LICENCAS_TOTAL.find(l => l.sigla === 'LO')!)
  }

  if (contem(seg, SEGMENTOS_RESIDUOS)) {
    LICENCAS_TOTAL.find(l => l.sigla === 'PGRS') && recomendadas.add(LICENCAS.find(l => l.sigla === 'PGRS')!)
    LICENCAS_TOTAL.find(l => l.sigla === 'CTF/APP') && recomendadas.add(LICENCAS.find(l => l.sigla === 'CTF/APP')!)
  }

  if (
    contem(seg, SEGMENTOS_INDUSTRIAL) ||
    contem(seg, SEGMENTOS_COMBUSTIVEL) ||
    contem(seg, SEGMENTOS_AGUA) ||
    contem(seg, ['com-agua', 'captacao'])
  ) {
    LICENCAS_TOTAL.find(l => l.sigla === 'Outorga') && recomendadas.add(LICENCAS_TOTAL.find(l => l.sigla === 'Outorga')!)
  }

  if (recomendadas.size === 0) {
    if (perfil.porte === 'MEDIO' || perfil.porte === 'GRANDE') {
      LICENCAS_TOTAL.find(l => l.sigla === 'CTF/APP') && recomendadas.add(LICENCAS_TOTAL.find(l => l.sigla === 'CTF/APP')!)
    }
  }

  // ----- SEMPRE INCLUI: Alvará de Funcionamento + AVCB/CLCB + Habite-se quando aplicável
  LICENCAS_TOTAL.find(l => l.id === 'municipal-alvara-funcionamento') &&
    recomendadas.add(LICENCAS_TOTAL.find(l => l.id === 'municipal-alvara-funcionamento')!)

  // Alvará sanitário municipal quando a empresa é indústria, manipula alimentos, saúde, etc.
  if (
    contem(seg, SEGMENTOS_ALIMENTO) ||
    contem(seg, SEGMENTOS_COSMETICO) ||
    contem(seg, SEGMENTOS_MEDICAMENTO) ||
    contem(seg, SEGMENTOS_SAUDE) ||
    contem(seg, SEGMENTOS_INDUSTRIAL) ||
    contem(seg, SEGMENTOS_COMBUSTIVEL)
  ) {
    LICENCAS_TOTAL.find(l => l.id === 'municipal-alvara-sanitario') &&
      recomendadas.add(LICENCAS_TOTAL.find(l => l.id === 'municipal-alvara-sanitario')!)
  }

  // CLCB por padrão (baixo risco); AVCB para atividades de maior porte
  if (perfil.porte === 'MEDIO' || perfil.porte === 'GRANDE' || contem(seg, SEGMENTOS_INDUSTRIAL) || contem(seg, SEGMENTOS_COMBUSTIVEL)) {
    LICENCAS_TOTAL.find(l => l.id === 'bombeiros-avcb') &&
      recomendadas.add(LICENCAS_TOTAL.find(l => l.id === 'bombeiros-avcb')!)
  } else {
    LICENCAS_TOTAL.find(l => l.id === 'bombeiros-clcb') &&
      recomendadas.add(LICENCAS_TOTAL.find(l => l.id === 'bombeiros-clcb')!)
  }

  // Habite-se quando há obra (ampliação, novo projeto, etc.)
  if (
    contem(seg, SEGMENTOS_EIA) ||
    contem(seg, SEGMENTOS_INDUSTRIAL) ||
    contem(seg, SEGMENTOS_AGUA) ||
    contem(seg, ['reforma', 'obras', 'construção'])
  ) {
    LICENCAS_TOTAL.find(l => l.id === 'municipal-habite-se') &&
      recomendadas.add(LICENCAS_TOTAL.find(l => l.id === 'municipal-habite-se')!)
  }

  return Array.from(recomendadas)
}

const SEGMENTOS_AGUA = ['bebidas', 'laticinios', 'ind-agua', 'com-agua']

function prioridadePor(licenca: Licenca, perfil: PerfilEmpresa): ItemCotacao['prioridade'] {
  if (['AFE', 'LO', 'LP', 'LI'].includes(licenca.sigla)) return 'essencial'
  if (perfil.porte === 'GRANDE' || perfil.porte === 'MEDIO') {
    if (['CBPF', 'CTF/APP', 'RAPP', 'Outorga'].includes(licenca.sigla)) return 'essencial'
  }
  if (licenca.sigla === 'CBPF' && (licenca.categoria === 'medicamentos' || licenca.categoria === 'medicos-dispositivos')) {
    return 'essencial'
  }
  return 'recomendada'
}

function alertasPara(licenca: Licenca, perfil: PerfilEmpresa): string[] {
  const a: string[] = []
  if (licenca.orgao === 'ANVISA' && licenca.categoria === 'medicamentos' && perfil.porte !== 'GRANDE') {
    a.push('Registro de medicamento é tipicamente executado por indústrias estruturadas; PMEs devem considerar terceirização.')
  }
  if (licenca.sigla === 'AFE' && perfil.porte === 'MEI') {
    a.push('MEI em geral não pode atuar com fabricação de produtos sob vigilância sanitária; verifique enquadramento.')
  }
  if (licenca.sigla === 'LP' && (perfil.observacoes || '').length === 0) {
    a.push('LP exige EIA/RIMA com audiência pública; confirme a vizinhança e impactos do projeto.')
  }
  if (licencia_sem_alerta(licenca) === false && licenca.sigla === 'CTF/APP') {
    a.push('TCFA é anual e calculada conforme potencial poluidor; valores podem crescer com risco da atividade.')
  }
  return a
}

function licencia_sem_alerta(_l: Licenca) {
  return true
}

export function montarCotacao(perfil: PerfilEmpresa): Cotacao {
  const licencas = recomendarLicencas(perfil)
  const itens: ItemCotacao[] = licencas.map(lic => {
    const custo = custoMedio(lic)
    const prazo = diasPor(lic.prazos.analise)
    return {
      licencaId: lic.id,
      sigla: lic.sigla,
      nome: lic.nome,
      orgao: lic.orgao,
      custoEstimado: {
        min: lic.custos.reduce((acc, c) => acc + c.valorMin, 0),
        max: lic.custos.reduce((acc, c) => acc + c.valorMax, 0),
        total: custo,
      },
      prazoEstimadoDias: prazo,
      prioridade: prioridadePor(lic, perfil),
      justificativa: gerarJustificativa(lic, perfil),
      alertas: alertasPara(lic, perfil),
    }
  })

  itens.sort((a, b) => {
    const ordem = { essencial: 0, recomendada: 1, opcional: 2 }
    return ordem[a.prioridade] - ordem[b.prioridade]
  })

  const totalMin = itens.reduce((acc, i) => acc + i.custoEstimado.min, 0)
  const totalMax = itens.reduce((acc, i) => acc + i.custoEstimado.max, 0)
  const totalMedio = itens.reduce((acc, i) => acc + i.custoEstimado.total, 0)
  const prazoTotal = itens.reduce((acc, i) => acc + i.prazoEstimadoDias, 0)

  return {
    data: new Date().toISOString(),
    perfil,
    itens,
    custoTotal: { min: totalMin, max: totalMax, medio: totalMedio },
    prazoTotalDias: prazoTotal,
    cidadeDetected: (() => {
      const c = buscarCidade(perfil.municipio ?? '')
      if (!c) return undefined
      return {
        nome: c.info.nome,
        uf: c.info.uf,
        particularidades: c.info.particularidades,
        alvaraNomes: c.info.alvaraNomes,
        prazoAlvara: c.info.prazoAlvara,
        obsAlvara: c.info.obsAlvara,
        alvaraSanitario: c.info.alvaraSanitario,
        bombeiros: c.info.bombeiros,
      }
    })(),
    observacoes: observacoesGerais(perfil, licencas),
    promptIA: promptParaIA(perfil, itens),
  }
}

function gerarJustificativa(lic: Licenca, perfil: PerfilEmpresa): string {
  if (lic.sigla === 'AFE') {
    return `Empresa do segmento ${perfil.segmento} enquadrada como produto sob vigilância sanitária — AFE necessária para iniciar a operação.`
  }
  if (lic.sigla === 'LO') {
    return `Atividade potencialmente poluidora exige licença operativa ambiental válida (CETESB).`
  }
  if (lic.sigla === 'LP') {
    return `Empreendimentos de maior porte ou de nova instalação exigem licença prévia como primeira etapa de licenciamento.`
  }
  if (lic.sigla === 'LI') {
    return `Para iniciar a construção ou ampliação é obrigatória a licença de instalação.`
  }
  if (lic.sigla === 'CBPF') {
    return `Pré-requisito para o registro de produtos; atesta conformidade BPF.`
  }
  if (lic.sigla === 'CTF/APP') {
    return `Cadastro federal de atividades potencialmente poluidoras com efeitos regulatórios e tributários (TCFA).`
  }
  if (lic.categoria === 'alimentos' || lic.categoria === 'cosmeticos' || lic.categoria === 'saneantes') {
    return `Regularização de produto no segmento ${perfil.segmento} conforme requisitos da ANVISA.`
  }
  return `Recomendável para regularização completa do segmento ${perfil.segmento}.`
}

function observacoesGerais(perfil: PerfilEmpresa, licencas: Licenca[]): string[] {
  const obs: string[] = []
  const orgaos = new Set(licencas.map(l => l.orgao))
  if (orgaos.has('ANVISA') && orgaos.has('CETESB')) {
    obs.push('Haverá interação entre ANVISA e CETESB; sincronize os cronogramas para evitar bloqueios.')
  }
  if (orgaos.has('ANVISA') && orgaos.has('MUNICIPAL')) {
    obs.push('O alvará de funcionamento costuma depender da licença sanitária municipal; verifique a ordem emitida pelo município.')
  }
  if (perfil.porte === 'MEI') {
    obs.push('MEI tem atividades restritas; algumas regularizações podem exigir empresa de porte superior.')
  }
  if (perfil.estado && perfil.estado.toUpperCase() !== 'SP' && orgaos.has('CETESB')) {
    obs.push('Para este estado, o licenciamento ambiental é conduzido por órgão estadual equivalente (não CETESB).')
  }
  const cidade = buscarCidade(perfil.municipio ?? "")
  if (cidade) {
    obs.push(`Município identificado: ${cidade.info.nome}/${cidade.info.uf}. ${cidade.info.prazoAlvara}.`)
    if (cidade.info.alvaraSanitario) {
      obs.push(`Vigilância Sanitária local: ${cidade.info.alvaraSanitario}.`)
    }
    obs.push(`Corpo de Bombeiros: ${cidade.info.bombeiros}.`)
  }
  obs.push('Valores são estimativas baseadas em mercado; orçamento real exige cotação com consultoria licenciada.')
  obs.push('A cotação não substitui consulta jurídica ou técnica para o caso concreto.')
  return obs
}

function promptParaIA(perfil: PerfilEmpresa, itens: ItemCotacao[]): string {
  const licencasLista = itens.map(i => `- ${i.sigla} (${i.orgao}) — ${i.nome} • ~R$ ${i.custoEstimado.total.toFixed(0)} • ${i.prazoEstimadoDias} dias`).join('\n')
  const cidade = buscarCidade(perfil.municipio ?? "")
  const cidadeDetalhe = cidade
    ? `\nMUNICÍPIO DETECTADO NA BASE: ${cidade.info.nome}/${cidade.info.uf}
   - ${cidade.info.prazoAlvara}
   - Alvará típico: ${cidade.info.alvaraNomes.join(', ')}
   - ${cidade.info.obsAlvara}
   - ${cidade.info.obsAlvara ? '' : ''}${cidade.info.particularidades.map(p => '• ' + p).join('\n   - ')}`
    : '\nMUNICÍPIO NÃO MAPEADO: usar regras gerais para capitais/metrópoles e considerar particularidade do estado.'

  return `Você é um(a) consultor(a) sênior de licenciamento sanitário, ambiental, municipal e do Corpo de Bombeiros brasileiro.

EMPRESA:
- Segmento: ${perfil.segmento}
- Porte: ${perfil.porte}
- Estado: ${perfil.estado || 'não informado'}
- Município: ${perfil.municipio || 'não informado'}
- Faturamento anual (R$): ${perfil.faturamentoAnual?.toFixed(2) || 'não informado'}
- Funcionários: ${perfil.numeroFuncionarios || 'não informado'}
- Observações: ${perfil.observacoes || 'nenhuma'}
${cidadeDetalhe}

LICENÇAS RECOMENDADAS PELA NOSSA BASE DE CONHECIMENTO:
${licencasLista}

TAREFA:
1. Refine a lista, adicionando licenças que possamos ter esquecido e removendo as que não se aplicam.
2. Para cada item, detalhe:
   - Documentos adicionais (locais, municipais, estaduais, federais, sindicatos).
   - Exigências peculiares do município "${perfil.municipio || 'informado'}" e do segmento "${perfil.segmento}".
   - Particularidades da Vigilância Sanitária municipal, Corpo de Bombeiros (AVCB / CLCB) e autorização municipal de funcionamento.
   - Riscos regulatórios e estratégias de mitigação.
3. Apresente um cronograma realista (atividades paralelas e sequenciais).
4. Apresente o orçamento detalhado em planilha (Markdown), separado por custo direto, consultoria e taxas.
5. Indique condições em que ANVISA, CETESB, Vigilância Sanitária municipal e Bombeiros exigem estudos complementares (EIA, CBPF, validação laboratorial, brigada, ART).
6. Aponte eventuais benefícios (redução de alíquota, isenção, fast-track) aplicáveis.

Responda em português, com objetividade e profundidade técnica.`
}

export function normalizarPerfil(input: Partial<PerfilEmpresa>): PerfilEmpresa {
  return {
    segmento: input.segmento?.trim() || 'indústria',
    faturamentoAnual: input.faturamentoAnual ?? 0,
    numeroFuncionarios: input.numeroFuncionarios ?? 0,
    estado: input.estado?.trim() || 'SP',
    municipio: input.municipio?.trim() || '',
    porte: input.porte || 'ME',
    observacoes: input.observacoes?.trim() || '',
  }
}

export function pesquisarLicencas(texto: string, orgao?: Orgao): Licenca[] {
  const t = normalizar(texto)
  return LICENCAS_TOTAL.filter(l => {
    if (orgao && l.orgao !== orgao) return false
    return (
      t.length === 0 ||
      normalizar(l.sigla).includes(t) ||
      normalizar(l.nome).includes(t) ||
      normalizar(l.descricao).includes(t) ||
      normalizar(l.resumo).includes(t) ||
      l.tags.some(tag => normalizar(tag).includes(t))
    )
  })
}

export function getLicenca(id: string): Licenca | undefined {
  return LICENCAS_TOTAL.find(l => l.id === id)
}

export function getLicencaBySigla(sigla: string): Licenca | undefined {
  return LICENCAS_TOTAL.find(l => l.sigla === sigla)
}

export function getCidadeInfo(municipio: string) {
  return buscarCidade(municipio)
}

export const TODAS_LICENCAS = LICENCAS_TOTAL
