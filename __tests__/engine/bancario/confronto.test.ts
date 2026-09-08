import { describe, it, expect } from 'vitest'
import {
  gerarQuadroAmortizacao,
  confrontar,
  confrontarMetodologias,
  renderApendiceI,
  renderResultadoConfronto,
  type LancamentoCobrado,
  type PremissasContrato,
} from '@/lib/engine/bancario'

const premissas: PremissasContrato = {
  principal: 12000,
  prazo: 12,
  taxaPeriodo: 0.01,
  sistema: 'sac',
  capitalizacao: 'composta',
  origem: 'Cláusula 4ª, fls. 30',
}

const quadro = gerarQuadroAmortizacao(premissas)

/** Espelha o quadro reconstituído, com acréscimo opcional por parcela. */
function lancamentosEspelho(acrescimo = 0): LancamentoCobrado[] {
  return quadro.linhas.map((l) => ({
    parcela: l.parcela,
    total: Number((l.parcelaTotal + acrescimo).toFixed(2)),
    status: 'pago' as const,
    fonte: 'fls. 45',
  }))
}

describe('Confronto contratual', () => {
  it('não aponta diferença quando o cobrado espelha o devido', () => {
    const c = confrontar(quadro, lancamentosEspelho())
    expect(c.diferencaTotal).toBeCloseTo(0, 2)
    expect(c.sentido).toBe('sem-diferenca')
  })

  it('apura excesso quando o cobrado supera o devido', () => {
    const c = confrontar(quadro, lancamentosEspelho(10))
    expect(c.diferencaTotal).toBeCloseTo(120, 2)
    expect(c.sentido).toBe('excesso-cobrado')
  })

  it('apura cobrança a menor quando o cobrado fica abaixo do devido', () => {
    const c = confrontar(quadro, lancamentosEspelho(-5))
    expect(c.diferencaTotal).toBeCloseTo(-60, 2)
    expect(c.sentido).toBe('cobranca-a-menor')
  })

  it('sinaliza parcela contratada sem lançamento correspondente', () => {
    const parciais = lancamentosEspelho().slice(0, 10)
    const c = confrontar(quadro, parciais)

    expect(c.linhas).toHaveLength(12)
    expect(c.linhas[11].cobrado).toBe(0)
    expect(c.linhas[11].observacao).toContain('sem lançamento correspondente')
    expect(
      c.alertas.some(
        (a) => a.startsWith('DADOS INSUFICIENTES') && a.includes('parcela 12')
      )
    ).toBe(true)
  })

  it('sinaliza lançamento além do prazo contratado', () => {
    const excedente = [
      ...lancamentosEspelho(),
      { parcela: 13, total: 1050, fonte: 'fls. 46' },
    ]
    const c = confrontar(quadro, excedente)

    expect(c.linhas).toHaveLength(13)
    expect(c.linhas[12].devido).toBe(0)
    expect(c.linhas[12].observacao).toContain('sem correspondência')
  })

  it('sinaliza lançamento sem indicação da folha dos autos', () => {
    const semFonte = lancamentosEspelho().map((l, i) =>
      i === 0 ? { ...l, fonte: undefined } : l
    )
    const c = confrontar(quadro, semFonte)
    expect(c.linhas[0].observacao).toContain('sem indicação da folha')
  })

  it('sinaliza lançamento duplicado para a mesma parcela', () => {
    const dup = [...lancamentosEspelho(), { parcela: 3, total: 999 }]
    const c = confrontar(quadro, dup)
    expect(
      c.alertas.some(
        (a) => a.includes('[VERIFICAR]') && a.includes('mais de um lançamento')
      )
    ).toBe(true)
  })

  it('propaga os alertas do quadro para o confronto', () => {
    const semOrigem = gerarQuadroAmortizacao({
      ...premissas,
      origem: undefined,
    })
    const c = confrontar(semOrigem, lancamentosEspelho())
    expect(c.alertas.some((a) => a.startsWith('DADOS INSUFICIENTES'))).toBe(
      true
    )
  })
})

describe('Confronto entre metodologias', () => {
  it('quantifica a divergência entre a metodologia adotada e a tese alternativa', () => {
    const adotada = gerarQuadroAmortizacao(premissas)
    const tese = gerarQuadroAmortizacao({ ...premissas, sistema: 'price' })
    const c = confrontarMetodologias(adotada, tese)

    expect(c.linhas).toHaveLength(12)
    expect(Math.abs(c.diferencaTotal)).toBeGreaterThan(0)
  })
})

describe('Renderização da memória', () => {
  it('fecha o Apêndice I com linha de totais', () => {
    const md = renderApendiceI(quadro)
    expect(md).toContain('| Parcela | Saldo inicial |')
    expect(md).toContain('**Totais**')
    expect(md.split('\n')).toHaveLength(15) // cabeçalho + separador + 12 + totais
  })

  it('descreve o resultado em linguagem impessoal, sem qualificação jurídica', () => {
    const texto = renderResultadoConfronto(
      confrontar(quadro, lancamentosEspelho(10))
    )
    expect(texto).toContain('apura-se')
    expect(texto).not.toMatch(/abusiv|ilegal|indevid/i)
  })
})
