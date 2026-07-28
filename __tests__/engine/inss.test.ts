import { describe, it, expect } from 'vitest'
import { calcularINSS } from '@/lib/engine/inss'

// Exemplo do guia: salário R$ 3.500 → INSS = R$ 313,34
describe('INSS', () => {
  it('calcula corretamente para salário até 1 SM', () => {
    const resultado = calcularINSS(1518)
    expect(resultado).toBeCloseTo(113.85, 2)
  })

  it('calcula corretamente para salário de R$ 3.500 (exemplo do guia)', () => {
    const resultado = calcularINSS(3500)
    // Guia: 113.85 + 115.05 + 84.44 = 313.34
    expect(resultado).toBeCloseTo(313.34, 2)
  })

  it('calcula corretamente para salário acima do teto', () => {
    const resultado = calcularINSS(10000)
    expect(resultado).toBeCloseTo(955.96, 2) // progressivo no teto 8189.29
  })

  it('retorna 0 para salário 0', () => {
    expect(calcularINSS(0)).toBe(0)
  })
})
