import { describe, it, expect } from 'vitest'
import {
  MOTOR_VERSAO,
  PREFIXO_INTEGRIDADE,
  impressaoDigital,
  verificarQuadro,
  verificarConfronto,
  gerarQuadroAmortizacao,
  confrontar,
  atualizarConfronto,
  renderProva,
  renderMemoriaCompleta,
  type PremissasContrato,
  type QuadroAmortizacao,
  type SerieIndice,
  type SistemaAmortizacao,
  type CriterioCapitalizacao,
} from '@/lib/engine/bancario'

/** Gerador determinístico — o mesmo defeito reaparece na mesma execução. */
function prng(semente: number) {
  let s = semente >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 0x100000000
  }
}

const SISTEMAS: SistemaAmortizacao[] = ['price', 'sac', 'sam']
const CAPITALIZACOES: CriterioCapitalizacao[] = ['composta', 'simples']

describe('Impressão digital das premissas', () => {
  const base: PremissasContrato = {
    principal: 10000,
    prazo: 12,
    taxaPeriodo: 0.02,
    sistema: 'price',
    capitalizacao: 'composta',
    origem: 'fls. 30',
  }

  it('é estável para a mesma entrada', () => {
    expect(impressaoDigital(base)).toBe(impressaoDigital({ ...base }))
  })

  it('independe da ordem das chaves', () => {
    const invertido = {
      origem: 'fls. 30',
      capitalizacao: 'composta',
      sistema: 'price',
      taxaPeriodo: 0.02,
      prazo: 12,
      principal: 10000,
    }
    expect(impressaoDigital(invertido)).toBe(impressaoDigital(base))
  })

  it('muda quando qualquer premissa muda', () => {
    const original = impressaoDigital(base)
    expect(impressaoDigital({ ...base, sistema: 'sac' })).not.toBe(original)
    expect(impressaoDigital({ ...base, taxaPeriodo: 0.0201 })).not.toBe(original)
    expect(impressaoDigital({ ...base, origem: 'fls. 31' })).not.toBe(original)
  })
})

describe('Carimbo de versão', () => {
  it('acompanha todo quadro gerado', () => {
    const q = gerarQuadroAmortizacao({
      principal: 10000,
      prazo: 12,
      taxaPeriodo: 0.02,
      sistema: 'price',
      capitalizacao: 'composta',
      origem: 'fls. 30',
    })
    expect(q.prova.motorVersao).toBe(MOTOR_VERSAO)
    expect(q.prova.integro).toBe(true)
    expect(q.prova.violacoes).toHaveLength(0)
  })

  it('chega até a memória renderizada', () => {
    const q = gerarQuadroAmortizacao({
      principal: 10000,
      prazo: 6,
      taxaPeriodo: 0.02,
      sistema: 'sac',
      capitalizacao: 'composta',
      origem: 'fls. 30',
    })
    const md = renderMemoriaCompleta({ quadro: q })
    expect(md).toContain('Prova de integridade')
    expect(md).toContain(MOTOR_VERSAO)
    expect(md).toContain(q.prova.impressaoPremissas)
  })
})

// A barreira central: as invariantes têm de valer para qualquer entrada, e não
// apenas para os casos que alguém pensou em testar.
describe('Invariantes sob entradas aleatórias', () => {
  it('sustenta o fechamento em 600 combinações de premissas', () => {
    const rnd = prng(20260801)
    const falhas: Array<{ premissas: PremissasContrato; violacoes: unknown }> =
      []

    for (let i = 0; i < 600; i++) {
      const premissas: PremissasContrato = {
        principal: Math.round(rnd() * 500000 * 100) / 100 + 100,
        prazo: 1 + Math.floor(rnd() * 120),
        taxaPeriodo: Math.round(rnd() * 0.05 * 1e6) / 1e6,
        sistema: SISTEMAS[Math.floor(rnd() * SISTEMAS.length)],
        capitalizacao:
          CAPITALIZACOES[Math.floor(rnd() * CAPITALIZACOES.length)],
        tac: rnd() > 0.5 ? Math.round(rnd() * 2000 * 100) / 100 : undefined,
        seguroMensal: rnd() > 0.5 ? Math.round(rnd() * 200 * 100) / 100 : undefined,
        origem: 'fuzz',
      }

      const q = gerarQuadroAmortizacao(premissas)
      if (!q.prova.integro) falhas.push({ premissas, violacoes: q.prova.violacoes })
    }

    expect(falhas).toEqual([])
  })

  it('sustenta o fechamento com taxa zero e prazo unitário', () => {
    for (const sistema of SISTEMAS) {
      for (const capitalizacao of CAPITALIZACOES) {
        const zero = gerarQuadroAmortizacao({
          principal: 5000,
          prazo: 10,
          taxaPeriodo: 0,
          sistema,
          capitalizacao,
          origem: 'limite',
        })
        expect(zero.prova.integro).toBe(true)
        expect(zero.totais.juros).toBeCloseTo(0, 2)

        const unitario = gerarQuadroAmortizacao({
          principal: 5000,
          prazo: 1,
          taxaPeriodo: 0.03,
          sistema,
          capitalizacao,
          origem: 'limite',
        })
        expect(unitario.prova.integro).toBe(true)
        expect(unitario.linhas[0].saldoFinal).toBe(0)
      }
    }
  })

  it('mantém o confronto íntegro sob lançamentos aleatórios', () => {
    const rnd = prng(7)
    for (let i = 0; i < 100; i++) {
      const q = gerarQuadroAmortizacao({
        principal: 20000,
        prazo: 12,
        taxaPeriodo: 0.015,
        sistema: SISTEMAS[i % SISTEMAS.length],
        capitalizacao: 'composta',
        origem: 'fuzz',
      })
      const lanc = q.linhas
        .filter(() => rnd() > 0.15)
        .map((l) => ({
          parcela: l.parcela,
          total: Math.round((l.parcelaTotal + (rnd() - 0.5) * 200) * 100) / 100,
          fonte: 'fls. 45',
        }))
      const c = confrontar(q, lanc)
      expect(verificarConfronto(c)).toEqual([])
    }
  })

  it('mantém a atualização íntegra sob diferenças aleatórias', () => {
    const rnd = prng(99)
    const serie: SerieIndice = {
      nome: 'FUZZ',
      fonte: 'teste',
      tipo: 'variacao',
      valores: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => {
          const ano = 2019 + Math.floor(i / 12)
          const mes = String((i % 12) + 1).padStart(2, '0')
          return [`${ano}-${mes}`, 0.003 + rnd() * 0.004]
        })
      ),
    }

    const q = gerarQuadroAmortizacao({
      principal: 18000,
      prazo: 12,
      taxaPeriodo: 0.012,
      sistema: 'sac',
      capitalizacao: 'composta',
      origem: 'fuzz',
    })
    const lanc = q.linhas.map((l) => ({
      parcela: l.parcela,
      total: Math.round((l.parcelaTotal + rnd() * 150) * 100) / 100,
      fonte: 'fls. 45',
    }))
    const c = confrontar(q, lanc)
    const comp = Object.fromEntries(
      q.linhas.map((l) => [l.parcela, `2019-${String(l.parcela).padStart(2, '0')}`])
    )

    const a = atualizarConfronto(
      c,
      comp,
      {
        correcao: serie,
        jurosTaxaMensal: 0.01,
        regimeJuros: 'simples',
        baseDosJuros: 'valor-corrigido',
        multaPercentual: 0.02,
        baseDaMulta: 'valor-corrigido',
        fundamento: 'fuzz',
      },
      '2020-12'
    )

    expect(a.prova.integro).toBe(true)
    expect(a.diferencaAtualizada).not.toBeNull()
  })
})

// A verificação precisa realmente detectar corrupção — senão é decoração.
describe('Detecção de resultado corrompido', () => {
  function quadroValido(): QuadroAmortizacao {
    return gerarQuadroAmortizacao({
      principal: 10000,
      prazo: 6,
      taxaPeriodo: 0.02,
      sistema: 'price',
      capitalizacao: 'composta',
      origem: 'fls. 30',
    })
  }

  it('acusa amortização que não fecha com o principal', () => {
    const q = quadroValido()
    const corrompido: QuadroAmortizacao = {
      ...q,
      totais: { ...q.totais, amortizacao: q.totais.amortizacao + 50 },
    }
    const v = verificarQuadro(corrompido)
    expect(v.some((x) => x.regra.includes('principal'))).toBe(true)
  })

  it('acusa saldo que não encerra em zero', () => {
    const q = quadroValido()
    const linhas = [...q.linhas]
    linhas[5] = { ...linhas[5], saldoFinal: 12.5 }
    const v = verificarQuadro({ ...q, linhas })
    expect(v.some((x) => x.regra.includes('encerrar em zero'))).toBe(true)
  })

  it('acusa quebra no encadeamento de saldo', () => {
    const q = quadroValido()
    const linhas = [...q.linhas]
    linhas[2] = { ...linhas[2], saldoInicial: linhas[2].saldoInicial + 100 }
    const v = verificarQuadro({ ...q, linhas })
    expect(v.some((x) => x.regra.includes('encadear'))).toBe(true)
    expect(v[0].local).toBeDefined()
  })

  it('acusa parcela total que não bate com teórica mais encargos', () => {
    const q = quadroValido()
    const linhas = [...q.linhas]
    linhas[0] = { ...linhas[0], parcelaTotal: linhas[0].parcelaTotal + 1 }
    const v = verificarQuadro({ ...q, linhas })
    expect(v.some((x) => x.regra.includes('encargos'))).toBe(true)
  })

  it('grita de forma inequívoca na memória renderizada', () => {
    const q = quadroValido()
    const linhas = [...q.linhas]
    linhas[5] = { ...linhas[5], saldoFinal: 99 }
    const violacoes = verificarQuadro({ ...q, linhas })
    const md = renderProva({
      motorVersao: MOTOR_VERSAO,
      impressaoPremissas: 'abcd1234',
      violacoes,
      integro: false,
    })
    expect(md).toContain(PREFIXO_INTEGRIDADE)
    expect(md).toContain('não deve ser utilizado em laudo')
    expect(md).toContain('VIOLAÇÃO')
  })

  it('não acusa nada em resultado íntegro', () => {
    expect(verificarQuadro(quadroValido())).toEqual([])
  })
})
