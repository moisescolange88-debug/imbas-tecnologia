// Cálculo de horas extras

import { calcularValorHora, arredondar } from './common'
import { ADICIONAL_HORA_EXTRA } from './tables'
import { calcularValorDSR } from './dsr'
import type { HoraExtraParams, HoraExtraResult } from './tipos'

export function calcularHorasExtras(params: HoraExtraParams): HoraExtraResult {
  const {
    salario,
    jornadaMensal = 220,
    horasExtras,
    adicionalPercentual = ADICIONAL_HORA_EXTRA,
    diasUteis = 22,
    domingosFeriados = 5,
  } = params

  const valorHoraNormal = calcularValorHora(salario, jornadaMensal)
  const valorHoraExtra = arredondar(valorHoraNormal * (1 + adicionalPercentual / 100))
  const totalHorasExtras = arredondar(horasExtras * valorHoraExtra)
  const dsrHorasExtras = calcularValorDSR(valorHoraExtra, horasExtras, diasUteis, domingosFeriados)
  const totalComDSR = arredondar(totalHorasExtras + dsrHorasExtras)

  return {
    valorHoraNormal,
    valorHoraExtra,
    totalHorasExtras,
    dsrHorasExtras,
    totalComDSR,
  }
}
