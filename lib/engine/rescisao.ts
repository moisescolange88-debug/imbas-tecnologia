// Orquestrador de rescisão — mapeia tipo → verbas devidas e executa todos os cálculos

import type { RescisaoParams, RescisaoResult, VerbaDetalhada, VerbaKey } from './tipos'
import { TIPO_RESCISAO_LABEL } from './tipos'
import { soma, arredondar, calcularAnosCompletos, calcularMesesDecimoTerceiro, calcularMesesFerias, calcularDiasCorridos } from './common'
import { MULTA_FGTS_SEM_JUSTA_CAUSA, MULTA_FGTS_PDI } from './tables'
import { calcularINSS } from './inss'
import { calcularIRRF } from './irrf'
import {
  saldoSalario, feriasProporcionais, feriasVencidas,
  decimoTerceiroProporcional, avisoPrevioIndenizado, avisoPrevioTrabalhado,
  multaFGTS, salarioFamilia, multaArt477, multaArt479, estimarFGTSDepositado
} from './verbas-rescisorias'

type VerbaAtiva = VerbaKey

/** Tabela declarativa: para cada tipo de rescisão, quais verbas são devidas */
const VERBAS_POR_TIPO: Record<string, VerbaAtiva[]> = {
  'sem-justa-causa': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro', 'avisoPrevio', 'multaFGTS', 'salarioFamilia', 'dsr'
  ],
  'por-justa-causa': [
    'saldoSalario', 'feriasVencidas' // sem 13º proporcional nem férias proporcionais nem aviso nem multa FGTS
  ],
  'pedido-demissao': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro' // sem multa FGTS, aviso pela metade
  ],
  'culpa-reciproca': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro', 'avisoPrevio', 'multaFGTS'
  ],
  'rescisao-antecipada-experiencia': [
    'saldoSalario', 'feriasProporcionais', 'decimoTerceiro', 'multaArt479'
  ],
  'morte-empregador': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro', 'avisoPrevio', 'multaFGTS'
  ],
  'morte-empregado': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas', 'decimoTerceiro'
  ],
  'reforma-trabalhista-culpa': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro'
  ],
  'plano-demissao-incentivada': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro', 'avisoPrevio', 'multaFGTS'
  ],
  'rescisao-indireta': [
    'saldoSalario', 'feriasProporcionais', 'feriasVencidas',
    'decimoTerceiro', 'avisoPrevio', 'multaFGTS', 'salarioFamilia', 'dsr'
  ],
}

const NOME_VERBA: Record<VerbaKey, string> = {
  saldoSalario: 'Saldo de salário',
  feriasProporcionais: 'Férias proporcionais + 1/3',
  feriasVencidas: 'Férias vencidas + 1/3',
  decimoTerceiro: '13º salário proporcional',
  avisoPrevio: 'Aviso prévio',
  multaFGTS: 'Multa do FGTS (40%)',
  salarioFamilia: 'Salário família',
  dsr: 'DSR',
  multaArt477: 'Multa art. 477 CLT (atraso)',
  multaArt479: 'Multa art. 479 CLT (experiência)',
}

/**
 * Calcula a rescisão completa
 */
export function calcularRescisao(params: RescisaoParams): RescisaoResult {
  const {
    tipo,
    salario,
    dataAdmissao,
    dataDemissao,
    jornadaMensal = 220,
    avisoTrabalhado = false,
    avisoIndenizado = false,
    dependentes = 0,
    pensaoAlimenticia = 0,
    diasTrabalhadosUltimoMes = 0,
    dataPagamento,
    temEstabilidade = false,
  } = params

  const verbasAtivas = VERBAS_POR_TIPO[tipo] || VERBAS_POR_TIPO['sem-justa-causa']
  const anosCompletos = calcularAnosCompletos(dataAdmissao, dataDemissao)
  const meses13 = calcularMesesDecimoTerceiro(dataAdmissao, dataDemissao)
  const mesesFerias = calcularMesesFerias(dataAdmissao, dataDemissao)
  const mesesServico = Math.max(meses13, mesesFerias)

  const detalhamento: VerbaDetalhada[] = []
  const verba: Record<string, number> = {
    saldoSalario: 0,
    feriasProporcionais: 0,
    feriasVencidas: 0,
    decimoTerceiro: 0,
    avisoPrevio: 0,
    multaFGTS: 0,
    salarioFamilia: 0,
    dsr: 0,
    multaArt477: 0,
    multaArt479: 0,
  }

  // Saldo de salário
  if (verbasAtivas.includes('saldoSalario') && diasTrabalhadosUltimoMes > 0) {
    verba.saldoSalario = saldoSalario(salario, diasTrabalhadosUltimoMes)
    detalhamento.push({ chave: 'saldoSalario', nome: NOME_VERBA.saldoSalario, valor: verba.saldoSalario })
  }

  // Férias proporcionais
  if (verbasAtivas.includes('feriasProporcionais') && mesesFerias > 0) {
    const fp = feriasProporcionais(salario, mesesFerias)
    verba.feriasProporcionais = fp.total
    detalhamento.push({ chave: 'feriasProporcionais', nome: NOME_VERBA.feriasProporcionais, valor: fp.total })
  }

  // Férias vencidas (se houver período aquisitivo completo — assume-se que sim se > 12 meses)
  if (verbasAtivas.includes('feriasVencidas') && mesesServico >= 12) {
    const fv = feriasVencidas(salario)
    verba.feriasVencidas = fv.total
    detalhamento.push({ chave: 'feriasVencidas', nome: NOME_VERBA.feriasVencidas, valor: fv.total })
  }

  // 13º proporcional
  if (verbasAtivas.includes('decimoTerceiro') && meses13 > 0) {
    verba.decimoTerceiro = decimoTerceiroProporcional(salario, meses13)
    detalhamento.push({ chave: 'decimoTerceiro', nome: NOME_VERBA.decimoTerceiro, valor: verba.decimoTerceiro })
  }

  // Aviso prévio
  if (verbasAtivas.includes('avisoPrevio')) {
    if (avisoIndenizado) {
      const ap = avisoPrevioIndenizado(salario, anosCompletos)
      verba.avisoPrevio = ap.valor
      detalhamento.push({ chave: 'avisoPrevio', nome: `${NOME_VERBA.avisoPrevio} (${ap.dias} dias indenizado)`, valor: ap.valor })
    } else if (avisoTrabalhado) {
      const ap = avisoPrevioTrabalhado(salario, anosCompletos)
      verba.avisoPrevio = ap.valor
      detalhamento.push({ chave: 'avisoPrevio', nome: `${NOME_VERBA.avisoPrevio} (${ap.dias} dias trabalhado)`, valor: ap.valor })
    }
  }

  // Pedido de demissão: aviso prévio é metade (se empregado não cumprir)
  if (tipo === 'pedido-demissao' && !avisoIndenizado && !avisoTrabalhado) {
    const ap = avisoPrevioIndenizado(salario, anosCompletos)
    verba.avisoPrevio = arredondar(ap.valor / 2)
    if (verba.avisoPrevio > 0) {
      detalhamento.push({ chave: 'avisoPrevio', nome: `${NOME_VERBA.avisoPrevio} (metade — pedido de demissão)`, valor: verba.avisoPrevio })
    }
  }

  // Culpa recíproca: 50% de cada verba
  if (tipo === 'culpa-reciproca') {
    verba.avisoPrevio = arredondar(verba.avisoPrevio / 2)
    verba.multaFGTS = arredondar(verba.multaFGTS / 2)
  }

  // FGTS + multa
  const verbasSalariais = verba.saldoSalario + verba.feriasProporcionais + verba.feriasVencidas +
    verba.decimoTerceiro + verba.avisoPrevio
  const fgtsEstimado = estimarFGTSDepositado(salario, mesesServico, verba.decimoTerceiro, verba.feriasProporcionais)

  if (verbasAtivas.includes('multaFGTS')) {
    const multaPercentual = tipo === 'plano-demissao-incentivada' ? MULTA_FGTS_PDI : MULTA_FGTS_SEM_JUSTA_CAUSA
    verba.multaFGTS = multaFGTS(fgtsEstimado, multaPercentual)
    detalhamento.push({ chave: 'multaFGTS', nome: `${NOME_VERBA.multaFGTS} (${multaPercentual}%)`, valor: verba.multaFGTS, descricao: `Base FGTS estimado: R$ ${fgtsEstimado.toFixed(2)}` })
  }

  // Salário família
  if (verbasAtivas.includes('salarioFamilia')) {
    verba.salarioFamilia = salarioFamilia(salario, dependentes)
    if (verba.salarioFamilia > 0) {
      detalhamento.push({ chave: 'salarioFamilia', nome: NOME_VERBA.salarioFamilia, valor: verba.salarioFamilia })
    }
  }

  // Multa art. 477 (atraso)
  if (dataPagamento && verbasAtivas.includes('multaArt477')) {
    const dataDem = new Date(dataDemissao)
    const dataPg = new Date(dataPagamento)
    const diasAtraso = Math.round((dataPg.getTime() - dataDem.getTime()) / (1000 * 60 * 60 * 24)) - 10
    if (diasAtraso > 0) {
      verba.multaArt477 = multaArt477(salario)
      detalhamento.push({ chave: 'multaArt477', nome: NOME_VERBA.multaArt477, valor: verba.multaArt477, descricao: `${diasAtraso} dias de atraso` })
    }
  }

  // Multa art. 479 (experiência)
  if (verbasAtivas.includes('multaArt479')) {
    // Estima dias restantes de experiência
    const diasContrato = 90 // contrato típico de experiência
    const diasCumpridos = calcularDiasCorridos(dataAdmissao, dataDemissao)
    const diasRestantes = Math.max(0, diasContrato - diasCumpridos)
    if (diasRestantes > 0) {
      verba.multaArt479 = multaArt479(salario, diasRestantes)
      detalhamento.push({ chave: 'multaArt479', nome: NOME_VERBA.multaArt479, valor: verba.multaArt479, descricao: `${diasRestantes} dias restantes` })
    }
  }

  // Totais
  const bruto = soma(...Object.values(verba))

  // INSS sobre verbas salariais (exceto multas e verbas indenizatórias)
  const verbasTributaveis = soma(verba.saldoSalario, verba.feriasProporcionais, verba.feriasVencidas,
    verba.decimoTerceiro, verba.avisoPrevio)
  const inss = calcularINSS(verbasTributaveis)

  // IRRF sobre verbas tributáveis - INSS
  const baseIRRF = Math.max(0, verbasTributaveis - inss)
  const irrf = calcularIRRF(baseIRRF, dependentes, pensaoAlimenticia)

  const descontos = soma(inss, irrf)
  const liquido = arredondar(bruto - descontos)

  return {
    tipo,
    verba: {
      saldoSalario: verba.saldoSalario,
      feriasProporcionais: verba.feriasProporcionais,
      feriasVencidas: verba.feriasVencidas,
      decimoTerceiro: verba.decimoTerceiro,
      avisoPrevio: verba.avisoPrevio,
      multaFGTS: verba.multaFGTS,
      salarioFamilia: verba.salarioFamilia,
      dsr: verba.dsr,
      multaArt477: verba.multaArt477,
      multaArt479: verba.multaArt479,
    },
    descontos: { inss, irrf, total: descontos },
    totais: { bruto, descontos, liquido },
    detalhamento,
  }
}
