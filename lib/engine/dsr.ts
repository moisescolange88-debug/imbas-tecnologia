// Cálculo do DSR (Descanso Semanal Remunerado) sobre horas extras e adicionais

import { arredondar } from './common'

/**
 * Calcula o DSR sobre horas extras
 * Fórmula: (total horas extras no mês / dias úteis) × domingos e feriados
 */
export function calcularDSRHorasExtras(
  totalHorasExtras: number,
  diasUteis: number = 22,
  domingosFeriados: number = 5
): number {
  if (diasUteis === 0) return 0
  return arredondar((totalHorasExtras / diasUteis) * domingosFeriados)
}

/**
 * Calcula o valor do DSR sobre horas extras
 * @param valorHoraExtra Valor de uma hora extra
 * @param totalHorasExtras Total de horas extras no mês
 * @param diasUteis Dias úteis no mês
 * @param domingosFeriados Domingos e feriados no mês
 */
export function calcularValorDSR(
  valorHoraExtra: number,
  totalHorasExtras: number,
  diasUteis: number = 22,
  domingosFeriados: number = 5
): number {
  const horasDSR = calcularDSRHorasExtras(totalHorasExtras, diasUteis, domingosFeriados)
  return arredondar(horasDSR * valorHoraExtra)
}

/**
 * Calcula DSR sobre adicional noturno
 * @param totalAdicionalNoturno Valor total do adicional noturno no mês
 */
export function calcularDSRAdicional(
  valorAdicional: number,
  diasUteis: number = 22,
  domingosFeriados: number = 5
): number {
  return arredondar((valorAdicional / diasUteis) * domingosFeriados)
}
