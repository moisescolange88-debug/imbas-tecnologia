import { describe, it, expect } from 'vitest'
import {
  projetarTransicao,
  calcularCBS,
  calcularIBS,
  calcularSplitPayment,
  calcularCashback,
  getAliquotaCBS,
  getAliquotaIBS,
  getAliquotaCBSEfetiva,
  getAliquotaIBSEfetiva,
  TABELA_TRANSICAO,
  ALIQUOTAS_REDUZIDAS,
} from '@/lib/engine/reforma-tributaria'

describe('Motor Reforma Tributária (LC 214/2025)', () => {
  describe('Alíquotas e Reduções', () => {
    it('deve retornar alíquotas cheias em 2033', () => {
      expect(getAliquotaCBS(2033)).toBe(8.8)
      expect(getAliquotaIBS(2033)).toBe(17.7)
    })

    it('deve aplicar 60% de redução para categoria saúde', () => {
      const cbsSaude = getAliquotaCBSEfetiva(2033, 'saude')
      const ibsSaude = getAliquotaIBSEfetiva(2033, 'saude')
      expect(cbsSaude.aliquotaEfetiva).toBe(3.52)
      expect(ibsSaude.aliquotaEfetiva).toBe(7.08)
      expect(cbsSaude.aliquotaEfetiva + ibsSaude.aliquotaEfetiva).toBe(10.6)
    })

    it('deve aplicar 30% de redução para profissões regulamentadas', () => {
      const cbsProf = getAliquotaCBSEfetiva(2033, 'profissoes-regulamentadas')
      const ibsProf = getAliquotaIBSEfetiva(2033, 'profissoes-regulamentadas')
      expect(cbsProf.aliquotaEfetiva).toBe(6.16)
      expect(ibsProf.aliquotaEfetiva).toBe(12.39)
      expect(cbsProf.aliquotaEfetiva + ibsProf.aliquotaEfetiva).toBe(18.55)
    })

    it('deve zerar alíquotas para cesta básica', () => {
      const cbsCesta = getAliquotaCBSEfetiva(2033, 'cesta-basica')
      const ibsCesta = getAliquotaIBSEfetiva(2033, 'cesta-basica')
      expect(cbsCesta.aliquotaEfetiva).toBe(0)
      expect(ibsCesta.aliquotaEfetiva).toBe(0)
    })
  })

  describe('Projeção da Transição (2026-2033)', () => {
    it('deve projetar transição para comércio (PIS 9,25%, ICMS 18%, ISS 0%)', () => {
      const receita = 1_000_000
      const proj = projetarTransicao({
        receitaBrutaAnual: receita,
        aliquotaPISCOFINSAtual: 9.25,
        aliquotaICMSAtual: 18,
        aliquotaISSAtual: 0,
      })

      expect(proj).toHaveLength(8)

      // Baseline atual: 27.25% de 1.000.000 = 272.500
      expect(proj[0].totalBaselineAtual).toBe(272500)

      // 2026: compensado com PIS/Cofins, custo líquido idêntico ao atual
      expect(proj[0].totalEfetivoAno).toBe(272500)
      expect(proj[0].diferencaVsAtual).toBe(0)

      // 2033: CBS 8.8% + IBS 17.7% = 26.5% = 265.000
      const consolidado2033 = proj[7]
      expect(consolidado2033.ano).toBe(2033)
      expect(consolidado2033.totalEfetivoAno).toBe(265000)
      // Economia de R$ 7.500 em relação ao atual (265.000 - 272.500)
      expect(consolidado2033.diferencaVsAtual).toBe(-7500)
      expect(consolidado2033.percentualVariacao).toBe(-2.75)
    })

    it('deve projetar transição para serviços com redução de saúde (60%)', () => {
      const receita = 2_000_000
      const proj = projetarTransicao({
        receitaBrutaAnual: receita,
        aliquotaPISCOFINSAtual: 3.65,
        aliquotaICMSAtual: 0,
        aliquotaISSAtual: 5,
        aliquotaReduzida: 'saude',
      })

      // Baseline atual: 8.65% de 2.000.000 = 173.000
      expect(proj[0].totalBaselineAtual).toBe(173000)

      // 2033 com redução de saúde: 10.6% de 2.000.000 = 212.000
      const consolidado2033 = proj[7]
      expect(consolidado2033.totalEfetivoAno).toBe(212000)
      expect(consolidado2033.diferencaVsAtual).toBe(39000)
    })

    it('deve abater créditos de despesas e compras no novo sistema', () => {
      const receita = 1_000_000
      const comprasDespesas = 400_000 // R$ 400k em insumos/despesas
      const proj = projetarTransicao({
        receitaBrutaAnual: receita,
        aliquotaPISCOFINSAtual: 9.25,
        aliquotaICMSAtual: 18,
        aliquotaISSAtual: 0,
        comprasDespesasAnual: comprasDespesas,
      })

      // Em 2033: 26.5% sobre 1M = 265k bruto.
      // Crédito de 26.5% sobre 400k = 106k.
      // Imposto novo líquido = 265k - 106k = 159k.
      const consolidado2033 = proj[7]
      expect(consolidado2033.creditoNovo).toBe(106000)
      expect(consolidado2033.totalNovoLiquido).toBe(159000)
      expect(consolidado2033.totalEfetivoAno).toBe(159000)
      // Economia fantástica: 159.000 vs baseline de 272.500
      expect(consolidado2033.diferencaVsAtual).toBe(-113500)
    })
  })

  describe('Split Payment e Cashback', () => {
    it('deve calcular split payment com retenção automática', () => {
      const res = calcularSplitPayment({ valorOperacao: 10000, aliquotaCombinada: 26.5 })
      expect(res.valorTributo).toBe(2650)
      expect(res.valorLiquidoRecebido).toBe(7350)
    })

    it('deve calcular split payment com alíquota reduzida de 10.6%', () => {
      const res = calcularSplitPayment({ valorOperacao: 10000, aliquotaCombinada: 10.6 })
      expect(res.valorTributo).toBe(1060)
      expect(res.valorLiquidoRecebido).toBe(8940)
    })

    it('deve calcular cashback para inscritos no CadÚnico', () => {
      const resComCad = calcularCashback({ valorConsumo: 1000, cadUnico: true })
      expect(resComCad.valorCashback).toBe(265)

      const resSemCad = calcularCashback({ valorConsumo: 1000, cadUnico: false })
      expect(resSemCad.valorCashback).toBe(0)
    })
  })
})
