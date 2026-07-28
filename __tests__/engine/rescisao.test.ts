import { describe, it, expect } from 'vitest'
import { calcularRescisao } from '@/lib/engine/rescisao'

describe('Rescisão', () => {
  it('calcula rescisão sem justa causa com dados básicos', () => {
    const resultado = calcularRescisao({
      tipo: 'sem-justa-causa',
      salario: 3000,
      dataAdmissao: '2023-01-01',
      dataDemissao: '2026-06-15',
      diasTrabalhadosUltimoMes: 15,
      avisoIndenizado: true,
      dependentes: 0,
    })

    expect(resultado.tipo).toBe('sem-justa-causa')
    expect(resultado.totais.bruto).toBeGreaterThan(0)
    expect(resultado.detalhamento.length).toBeGreaterThan(0)
    expect(resultado.totais.liquido).toBeGreaterThan(0)
    expect(resultado.totais.liquido).toBeLessThan(resultado.totais.bruto)
  })

  it('calcula rescisão por justa causa (verbas limitadas)', () => {
    const resultado = calcularRescisao({
      tipo: 'por-justa-causa',
      salario: 3000,
      dataAdmissao: '2024-01-01',
      dataDemissao: '2026-06-15',
      diasTrabalhadosUltimoMes: 15,
    })

    // Por justa causa só tem saldo de salário e férias vencidas
    expect(resultado.verba.avisoPrevio).toBe(0)
    expect(resultado.verba.multaFGTS).toBe(0)
  })

  it('calcula pedido de demissão', () => {
    const resultado = calcularRescisao({
      tipo: 'pedido-demissao',
      salario: 3000,
      dataAdmissao: '2025-01-01',
      dataDemissao: '2026-06-15',
      diasTrabalhadosUltimoMes: 10,
    })

    // Pedido de demissão: sem multa FGTS, aviso pela metade
    expect(resultado.verba.multaFGTS).toBe(0)
  })
})
