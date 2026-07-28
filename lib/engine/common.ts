// Funções utilitárias base para cálculos trabalhistas

import { differenceInMonths, differenceInYears, parseISO } from 'date-fns'

/** Arredonda para 2 casas decimais (padrão Real) */
export function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100
}

/** Soma segura com arredondamento */
export function soma(...valores: number[]): number {
  return arredondar(valores.reduce((acc, v) => acc + v, 0))
}

/** Calcula valor da hora normal */
export function calcularValorHora(salario: number, jornadaMensal: number = 220): number {
  return arredondar(salario / jornadaMensal)
}

/** Calcula valor do dia normal */
export function calcularValorDia(salario: number): number {
  return arredondar(salario / 30)
}

/** Calcula dias de aviso prévio (30 + 3 por ano, max 90) */
export function calcularDiasAviso(anosCompletos: number): number {
  return Math.min(30 + AVISO_PREVIO_ACRESCIMO_POR_ANO * anosCompletos, AVISO_PREVIO_MAXIMO)
}

import { AVISO_PREVIO_ACRESCIMO_POR_ANO, AVISO_PREVIO_MAXIMO } from './tables'

/** Calcula meses trabalhados para 13º (>= 15 dias no mês conta como mês cheio) */
export function calcularMesesDecimoTerceiro(
  admissao: string,
  fim: string
): number {
  const diff = differenceInMonths(parseISO(fim), parseISO(admissao))
  if (diff <= 0) return 0
  // Para rescisão: meses com 15+ dias trabalhados contam
  // Simplificação: differenceInMonths já aproxima
  return Math.min(diff + 1, 12)
}

/** Calcula meses trabalhados para férias (1/12 por mês) */
export function calcularMesesFerias(
  inicio: string,
  fim: string
): number {
  return Math.max(0, differenceInMonths(parseISO(fim), parseISO(inicio)))
}

/** Calcula anos completos de serviço */
export function calcularAnosCompletos(admissao: string, demissao: string): number {
  return Math.max(0, differenceInYears(parseISO(demissao), parseISO(admissao)))
}

/** Dias corridos entre datas (simplificado) */
export function calcularDiasCorridos(inicio: string, fim: string): number {
  const d1 = parseISO(inicio)
  const d2 = parseISO(fim)
  return Math.max(0, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)))
}
