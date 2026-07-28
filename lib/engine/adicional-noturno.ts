// Cálculo de adicional noturno — jornada reduzida (52min30s) + adicional de 20%

import { arredondar, calcularValorHora } from './common'
import { ADICIONAL_NOTURNO } from './tables'

/**
 * Calcula horas noturnas equivalentes (considerando hora reduzida de 52min30s)
 * @param horasRelogio Horas relógio trabalhadas no período noturno (22h-5h)
 */
export function converterHorasNoturnas(horasRelogio: number): number {
  // Cada hora noturna tem 52.5 minutos → hora relógio = 60 min
  // Fator de conversão: 60 / 52.5
  return arredondar(horasRelogio * (60 / 52.5))
}

/**
 * Calcula o valor do adicional noturno
 * @param salario Salário base
 * @param horasNoturnasRelogio Horas trabalhadas no período noturno (medidas no relógio)
 * @param adicionalPercentual Percentual do adicional (20% default)
 * @param jornadaMensal Jornada mensal contratual (220h default)
 */
export function calcularAdicionalNoturno(
  salario: number,
  horasNoturnasRelogio: number,
  adicionalPercentual: number = ADICIONAL_NOTURNO,
  jornadaMensal: number = 220
): { horasNoturnasReduzidas: number; valorHoraNormal: number; valorAdicional: number; totalAdicional: number } {
  const horasReduzidas = converterHorasNoturnas(horasNoturnasRelogio)
  const valorHoraNormal = calcularValorHora(salario, jornadaMensal)
  const valorAdicional = arredondar(valorHoraNormal * (adicionalPercentual / 100))
  const totalAdicional = arredondar(horasReduzidas * valorAdicional)

  return {
    horasNoturnasReduzidas: horasReduzidas,
    valorHoraNormal,
    valorAdicional,
    totalAdicional,
  }
}
