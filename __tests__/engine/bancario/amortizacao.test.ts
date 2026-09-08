import { describe, it, expect } from 'vitest'
import {
  parcelaPrice,
  amortizacaoConstante,
  gerarQuadroAmortizacao,
  type PremissasContrato,
} from '@/lib/engine/bancario'

const base: PremissasContrato = {
  principal: 10000,
  prazo: 12,
  taxaPeriodo: 0.02,
  sistema: 'price',
  capitalizacao: 'composta',
  origem: 'Cláusula 4ª do contrato, fls. 30',
}

describe('Amortização bancária', () => {
  describe('parcelaPrice', () => {
    it('calcula a prestação do Sistema Francês', () => {
      // PV 10.000, i 2% a.m., n 12 → PMT ≈ 945,60
      expect(parcelaPrice(10000, 0.02, 12)).toBeCloseTo(945.6, 2)
    })

    it('degenera em PV/n quando a taxa é zero', () => {
      expect(parcelaPrice(12000, 0, 12)).toBeCloseTo(1000, 2)
    })

    it('retorna zero para prazo inválido', () => {
      expect(parcelaPrice(10000, 0.02, 0)).toBe(0)
    })
  })

  describe('amortizacaoConstante', () => {
    it('divide o principal pelo prazo', () => {
      expect(amortizacaoConstante(12000, 12)).toBeCloseTo(1000, 2)
    })
  })

  describe('quadro Price', () => {
    const quadro = gerarQuadroAmortizacao(base)

    it('gera uma linha por parcela', () => {
      expect(quadro.linhas).toHaveLength(12)
    })

    it('zera o saldo devedor na última parcela', () => {
      expect(quadro.linhas[11].saldoFinal).toBe(0)
    })

    it('amortiza exatamente o principal contratado', () => {
      expect(quadro.totais.amortizacao).toBeCloseTo(10000, 2)
    })

    it('cobra juros crescentes sobre saldo decrescente', () => {
      expect(quadro.linhas[0].juros).toBeCloseTo(200, 2)
      expect(quadro.linhas[11].juros).toBeLessThan(quadro.linhas[0].juros)
    })

    it('registra a fórmula da prestação na memória de cálculo', () => {
      const passo = quadro.memoria.find((p) =>
        p.referencia.includes('Prestação constante')
      )
      expect(passo).toBeDefined()
      expect(passo?.formula).toContain('PMT')
      expect(passo?.resultado).toBeCloseTo(945.6, 2)
    })
  })

  describe('quadro SAC', () => {
    const quadro = gerarQuadroAmortizacao({
      ...base,
      principal: 12000,
      taxaPeriodo: 0.01,
      sistema: 'sac',
    })

    it('mantém a amortização constante', () => {
      expect(quadro.linhas[0].amortizacao).toBeCloseTo(1000, 2)
      expect(quadro.linhas[5].amortizacao).toBeCloseTo(1000, 2)
    })

    it('apura o total de juros da progressão aritmética', () => {
      // i × PV × (n+1)/2 = 0,01 × 12.000 × 6,5
      expect(quadro.totais.juros).toBeCloseTo(780, 2)
    })

    it('zera o saldo devedor na última parcela', () => {
      expect(quadro.linhas[11].saldoFinal).toBe(0)
    })
  })

  // Regressão: no template Excel do kit pericial o campo "sistema de
  // amortização" é meramente descritivo — a planilha calcula Price em qualquer
  // hipótese. Este teste garante que aqui a premissa é efetivamente aplicada.
  describe('o sistema de amortização altera o resultado', () => {
    const price = gerarQuadroAmortizacao({ ...base, sistema: 'price' })
    const sac = gerarQuadroAmortizacao({ ...base, sistema: 'sac' })
    const sam = gerarQuadroAmortizacao({ ...base, sistema: 'sam' })

    it('produz totais de juros distintos entre Price e SAC', () => {
      expect(price.totais.juros).not.toBeCloseTo(sac.totais.juros, 2)
    })

    it('cobra mais juros no Price que no SAC', () => {
      expect(price.totais.juros).toBeGreaterThan(sac.totais.juros)
    })

    it('posiciona o SAM entre os dois sistemas', () => {
      expect(sam.totais.juros).toBeGreaterThan(sac.totais.juros)
      expect(sam.totais.juros).toBeLessThan(price.totais.juros)
    })

    it('amortiza o principal integralmente em qualquer sistema', () => {
      for (const q of [price, sac, sam]) {
        expect(q.totais.amortizacao).toBeCloseTo(10000, 2)
        expect(q.linhas[q.linhas.length - 1].saldoFinal).toBe(0)
      }
    })
  })

  describe('o critério de capitalização altera o resultado', () => {
    const composta = gerarQuadroAmortizacao(base)
    const simples = gerarQuadroAmortizacao({
      ...base,
      capitalizacao: 'simples',
    })

    it('mantém os juros constantes na capitalização simples', () => {
      expect(simples.linhas[0].juros).toBeCloseTo(200, 2)
      expect(simples.linhas[11].juros).toBeCloseTo(200, 2)
    })

    it('apura juros totais maiores na capitalização composta', () => {
      expect(composta.totais.juros).not.toBeCloseTo(simples.totais.juros, 2)
    })

    it('emite alerta de verificação para a capitalização simples', () => {
      expect(simples.alertas.some((a) => a.includes('[VERIFICAR]'))).toBe(true)
    })
  })

  describe('encargos acessórios', () => {
    const quadro = gerarQuadroAmortizacao({
      ...base,
      tac: 500,
      seguroMensal: 30,
    })

    it('cobra a TAC apenas na primeira parcela', () => {
      expect(quadro.linhas[0].encargosAcessorios).toBeCloseTo(530, 2)
      expect(quadro.linhas[1].encargosAcessorios).toBeCloseTo(30, 2)
    })

    it('não contamina a parcela teórica com encargos', () => {
      const l = quadro.linhas[0]
      expect(l.parcelaTeorica).toBeCloseTo(l.amortizacao + l.juros, 2)
      expect(l.parcelaTotal).toBeCloseTo(l.parcelaTeorica + 530, 2)
    })
  })

  describe('conduta diante de lacunas', () => {
    it('sinaliza dados insuficientes quando falta a origem das premissas', () => {
      const q = gerarQuadroAmortizacao({ ...base, origem: undefined })
      expect(
        q.alertas.some((a) => a.startsWith('DADOS INSUFICIENTES'))
      ).toBe(true)
    })

    it('não calcula com principal ou prazo inválidos', () => {
      const q = gerarQuadroAmortizacao({ ...base, principal: 0 })
      expect(q.linhas).toHaveLength(0)
      expect(q.alertas[0]).toContain('DADOS INSUFICIENTES')
    })
  })
})
