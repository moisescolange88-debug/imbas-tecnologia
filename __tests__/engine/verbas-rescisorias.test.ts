import { describe, it, expect } from 'vitest'
import {
  saldoSalario,
  feriasProporcionais,
  feriasVencidas,
  decimoTerceiroProporcional,
  avisoPrevioIndenizado,
} from '@/lib/engine/verbas-rescisorias'

describe('Verbas Rescisórias', () => {
  describe('saldoSalario', () => {
    it('calcula saldo de 12 dias com salário mínimo', () => {
      const resultado = saldoSalario(1518, 12)
      expect(resultado).toBeCloseTo(607.20, 2)
    })
  })

  describe('férias proporcionais', () => {
    it('calcula 6 meses de férias proporcionais com 1/3', () => {
      const resultado = feriasProporcionais(3000, 6)
      // 3000/12 * 6 = 1500, + 1/3 = 500, total = 2000
      expect(resultado.ferias).toBeCloseTo(1500, 2)
      expect(resultado.terco).toBeCloseTo(500, 2)
      expect(resultado.total).toBeCloseTo(2000, 2)
    })
  })

  describe('férias vencidas', () => {
    it('calcula férias vencidas + 1/3', () => {
      const resultado = feriasVencidas(3000)
      expect(resultado.ferias).toBe(3000)
      expect(resultado.terco).toBeCloseTo(1000, 2)
      expect(resultado.total).toBeCloseTo(4000, 2)
    })
  })

  describe('13º proporcional', () => {
    it('calcula 13º com 9 meses trabalhados', () => {
      const resultado = decimoTerceiroProporcional(4000, 9)
      expect(resultado).toBeCloseTo(3000, 2)
    })
  })

  describe('aviso prévio indenizado', () => {
    it('calcula 36 dias para 2 anos de serviço (salário R$ 3.000)', () => {
      const resultado = avisoPrevioIndenizado(3000, 2)
      expect(resultado.dias).toBe(36)
      // 3000/30 * 36 = 3600
      expect(resultado.valor).toBeCloseTo(3600, 2)
    })

    it('aviso mínimo de 30 dias para menos de 1 ano', () => {
      const resultado = avisoPrevioIndenizado(1518, 0)
      expect(resultado.dias).toBe(30)
      expect(resultado.valor).toBeCloseTo(1518, 2)
    })
  })
})
