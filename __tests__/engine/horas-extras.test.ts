import { describe, it, expect } from 'vitest'
import { calcularHorasExtras } from '@/lib/engine/horas-extras'

describe('Horas Extras', () => {
  it('calcula hora extra para salário de R$ 2.200 com 20 HE', () => {
    const resultado = calcularHorasExtras({
      salario: 2200,
      horasExtras: 20,
    })

    // Hora normal = 2200/220 = 10
    expect(resultado.valorHoraNormal).toBeCloseTo(10, 2)
    // Hora extra = 10 * 1.5 = 15
    expect(resultado.valorHoraExtra).toBeCloseTo(15, 2)
    // Total HE = 20 * 15 = 300
    expect(resultado.totalHorasExtras).toBeCloseTo(300, 2)
    // DSR = (20/22) * 5 = 4.545 * 15 = 68.18
    expect(resultado.dsrHorasExtras).toBeGreaterThan(0)
    // Total com DSR = 300 + DSR
    expect(resultado.totalComDSR).toBeGreaterThan(300)
  })

  it('calcula com 100% de adicional', () => {
    const resultado = calcularHorasExtras({
      salario: 2200,
      horasExtras: 10,
      adicionalPercentual: 100,
    })

    expect(resultado.valorHoraExtra).toBeCloseTo(20, 2) // 10 * 2
    expect(resultado.totalHorasExtras).toBeCloseTo(200, 2) // 10 * 20
  })
})
