// Cálculo de cada verba rescisória individual

import { arredondar, calcularValorDia, calcularDiasAviso, calcularValorHora } from './common'
import { SALARIO_FAMILIA_VALOR, SALARIO_FAMILIA_LIMITE, ALIQUOTA_FGTS, MULTA_FGTS_SEM_JUSTA_CAUSA } from './tables'
import { calcularINSS } from './inss'
import { calcularFGTSCompleto } from './fgts'

/**
 * Saldo de salário — dias trabalhados no mês da rescisão
 * Fórmula: (remuneração / 30) × dias trabalhados
 */
export function saldoSalario(salario: number, diasTrabalhados: number): number {
  return arredondar((salario / 30) * diasTrabalhados)
}

/**
 * Férias vencidas — período aquisitivo completo + 1/3 constitucional
 * Deve ser paga em dobro se paga fora do prazo (art. 137 CLT)
 */
export function feriasVencidas(salario: number, emDobro: boolean = false): { ferias: number; terco: number; total: number } {
  const ferias = salario
  const terco = arredondar(ferias / 3)
  const total = emDobro ? arredondar((ferias + terco) * 2) : arredondar(ferias + terco)
  return { ferias, terco, total }
}

/**
 * Férias proporcionais — meses trabalhados no período aquisitivo incompleto + 1/3
 * Deve ter pelo menos 6 meses de contrato (art. 146 CLT)
 * Fórmula: (remuneração / 12) × meses trabalhados
 */
export function feriasProporcionais(salario: number, mesesTrabalhados: number): { ferias: number; terco: number; total: number } {
  const ferias = arredondar((salario / 12) * Math.min(mesesTrabalhados, 12))
  const terco = arredondar(ferias / 3)
  const total = arredondar(ferias + terco)
  return { ferias, terco, total }
}

/**
 * 13º salário proporcional
 * Fórmula: (remuneração / 12) × meses com 15+ dias trabalhados
 */
export function decimoTerceiroProporcional(salario: number, meses: number): number {
  return arredondar((salario / 12) * Math.min(meses, 12))
}

/**
 * Aviso prévio indenizado
 * Fórmula: (remuneração / 30) × dias de aviso
 * Dias = 30 + (3 × anos completos), máx 90
 */
export function avisoPrevioIndenizado(salario: number, anosCompletos: number): { dias: number; valor: number } {
  const dias = calcularDiasAviso(anosCompletos)
  const valor = arredondar(calcularValorDia(salario) * dias)
  return { dias, valor }
}

/**
 * Aviso prévio trabalhado — empregado trabalha com redução de 2h/dia ou 7 dias
 */
export function avisoPrevioTrabalhado(salario: number, anosCompletos: number): { dias: number; valor: number } {
  const dias = calcularDiasAviso(anosCompletos)
  const valor = arredondar(calcularValorDia(salario) * dias)
  return { dias, valor }
}

/**
 * Multa do FGTS (40% sem justa causa, 20% PDI)
 * @param totalFGTSDepositado Total de depósitos de FGTS no período
 * @param percentual 40 ou 20
 */
export function multaFGTS(totalFGTSDepositado: number, percentual: number = MULTA_FGTS_SEM_JUSTA_CAUSA): number {
  return arredondar(totalFGTSDepositado * percentual / 100)
}

/**
 * Salário família (se renda até o limite)
 * @param salario Salário do empregado
 * @param dependentesFilhos Número de dependentes (filhos até 14 anos ou inválidos)
 */
export function salarioFamilia(salario: number, dependentesFilhos: number = 0): number {
  if (salario > SALARIO_FAMILIA_LIMITE || dependentesFilhos <= 0) return 0
  return arredondar(SALARIO_FAMILIA_VALOR * dependentesFilhos)
}

/**
 * Multa art. 477 CLT — atraso no pagamento das verbas rescisórias (>10 dias)
 * Valor = remuneração do empregado (um salário)
 */
export function multaArt477(salario: number): number {
  return salario
}

/**
 * Multa art. 479 CLT — rescisão antecipada de contrato de experiência
 * Metade da remuneração que teria direito até o término
 */
export function multaArt479(salario: number, diasRestantes: number): number {
  return arredondar((salario / 30) * diasRestantes * 0.5)
}

/**
 * Estima FGTS depositado total baseado no salário e meses de serviço
 * Para cálculos rescisórios quando não se tem o extrato
 */
export function estimarFGTSDepositado(
  salario: number,
  mesesServico: number,
  decimoTerceiroBruto: number = 0,
  feriasBruto: number = 0
): number {
  const fgts = calcularFGTSCompleto(salario, mesesServico, decimoTerceiroBruto, feriasBruto)
  return fgts.totalDepositado
}
