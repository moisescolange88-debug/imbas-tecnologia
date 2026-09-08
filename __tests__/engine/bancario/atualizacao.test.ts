import { describe, it, expect } from 'vitest'
import {
  competenciaDeData,
  competenciasEntre,
  mesesEntre,
  proximaCompetencia,
  fatorAcumulado,
  somaAcumulada,
  corrigirMonetariamente,
  calcularJurosMora,
  atualizarValor,
  atualizarConfronto,
  gerarQuadroAmortizacao,
  confrontar,
  renderApendiceIV,
  renderResultadoAtualizacao,
  type PremissasAtualizacao,
  type SerieIndice,
} from '@/lib/engine/bancario'

/** Série fictícia de variação constante, para verificar a aritmética. */
function serieVariacao(
  de: number,
  ate: number,
  variacao: number
): SerieIndice {
  const valores: Record<string, number> = {}
  for (let m = de; m <= ate; m++) {
    valores[`2019-${String(m).padStart(2, '0')}`] = variacao
  }
  return {
    nome: 'ÍNDICE-TESTE',
    fonte: 'série fictícia de teste',
    tipo: 'variacao',
    valores,
  }
}

describe('Competências', () => {
  it('extrai a competência de uma data ISO', () => {
    expect(competenciaDeData('2019-03-14')).toBe('2019-03')
  })

  it('rejeita data inválida', () => {
    expect(() => competenciaDeData('2019-13-01')).toThrow()
  })

  it('vira o ano corretamente', () => {
    expect(proximaCompetencia('2019-12')).toBe('2020-01')
  })

  it('conta meses entre competências', () => {
    expect(mesesEntre('2019-01', '2019-07')).toBe(6)
    expect(mesesEntre('2019-01', '2020-01')).toBe(12)
  })

  it('exclui a competência do termo inicial do intervalo', () => {
    expect(competenciasEntre('2019-01', '2019-04')).toEqual([
      '2019-02',
      '2019-03',
      '2019-04',
    ])
  })

  it('retorna intervalo vazio quando não há período a percorrer', () => {
    expect(competenciasEntre('2019-04', '2019-04')).toEqual([])
  })
})

describe('Fator acumulado', () => {
  it('capitaliza as variações do intervalo', () => {
    const f = fatorAcumulado(serieVariacao(1, 6, 0.01), '2019-01', '2019-03')
    expect(f.fator).toBeCloseTo(1.0201, 6) // 1,01²
    expect(f.competenciasAplicadas).toEqual(['2019-02', '2019-03'])
  })

  it('usa a razão entre pontas na série de número-índice', () => {
    const serie: SerieIndice = {
      nome: 'NI',
      fonte: 'teste',
      tipo: 'numero-indice',
      valores: { '2019-01': 100, '2019-06': 110 },
    }
    expect(fatorAcumulado(serie, '2019-01', '2019-06').fator).toBeCloseTo(1.1, 6)
  })

  // Preencher competência ausente como variação zero produziria um número
  // plausível e errado. A falha tem que ser explícita.
  it('falha quando a série não cobre todo o intervalo', () => {
    const f = fatorAcumulado(serieVariacao(1, 3, 0.01), '2019-01', '2019-06')
    expect(f.fator).toBeNull()
    expect(f.competenciasFaltantes).toEqual(['2019-04', '2019-05', '2019-06'])
  })

  it('soma as taxas sem capitalizar no acumulado simples', () => {
    const s = somaAcumulada(serieVariacao(1, 6, 0.01), '2019-01', '2019-04')
    expect(s.fator).toBeCloseTo(0.03, 6)
  })
})

describe('Correção monetária', () => {
  it('corrige o valor pelo fator acumulado', () => {
    const r = corrigirMonetariamente(
      1000,
      serieVariacao(1, 6, 0.01),
      '2019-01',
      '2019-04'
    )
    expect(r.fator).toBeCloseTo(1.030301, 6)
    expect(r.valorCorrigido).toBeCloseTo(1030.3, 2)
  })

  it('registra a fonte do índice na memória', () => {
    const r = corrigirMonetariamente(
      1000,
      serieVariacao(1, 6, 0.01),
      '2019-01',
      '2019-04'
    )
    expect(r.memoria[0].fundamento).toBe('série fictícia de teste')
  })

  it('não corrige e reporta quando falta competência', () => {
    const r = corrigirMonetariamente(
      1000,
      serieVariacao(1, 2, 0.01),
      '2019-01',
      '2019-06'
    )
    expect(r.valorCorrigido).toBeNull()
    expect(r.alertas[0]).toContain('DADOS INSUFICIENTES')
    expect(r.alertas[0]).toContain('2019-03')
  })
})

describe('Juros de mora', () => {
  const premissas: PremissasAtualizacao = {
    jurosTaxaMensal: 0.01,
    regimeJuros: 'simples',
    baseDosJuros: 'valor-corrigido',
    fundamento: 'art. 406 do Código Civil',
  }

  it('aplica juros simples proporcionais aos meses', () => {
    const r = calcularJurosMora(1000, premissas, '2019-01', '2019-07')
    expect(r.meses).toBe(6)
    expect(r.valorJuros).toBeCloseTo(60, 2)
  })

  it('capitaliza no regime composto', () => {
    const r = calcularJurosMora(
      1000,
      { ...premissas, regimeJuros: 'composto' },
      '2019-01',
      '2019-07'
    )
    expect(r.valorJuros).toBeCloseTo(61.52, 2) // 1,01⁶ − 1
  })

  it('não cobra juros quando o termo inicial não antecede a data-base', () => {
    const r = calcularJurosMora(1000, premissas, '2019-07', '2019-07')
    expect(r.valorJuros).toBe(0)
    expect(r.meses).toBe(0)
  })

  it('assume regime simples com alerta quando não informado', () => {
    const r = calcularJurosMora(
      1000,
      { jurosTaxaMensal: 0.01, baseDosJuros: 'valor-nominal' },
      '2019-01',
      '2019-07'
    )
    expect(r.valorJuros).toBeCloseTo(60, 2)
    expect(r.alertas.some((a) => a.includes('[VERIFICAR]'))).toBe(true)
  })

  it('soma as taxas da série no regime simples', () => {
    const r = calcularJurosMora(
      1000,
      {
        jurosSerie: serieVariacao(1, 12, 0.005),
        regimeJuros: 'simples',
        baseDosJuros: 'valor-nominal',
      },
      '2019-01',
      '2019-05'
    )
    expect(r.valorJuros).toBeCloseTo(20, 2) // 4 meses × 0,5%
  })
})

describe('Atualização de valor', () => {
  const completas: PremissasAtualizacao = {
    correcao: serieVariacao(1, 12, 0.01),
    jurosTaxaMensal: 0.01,
    regimeJuros: 'simples',
    baseDosJuros: 'valor-corrigido',
    termoInicialJuros: '2019-01',
    multaPercentual: 0.02,
    baseDaMulta: 'valor-corrigido',
    fundamento: 'Cláusula 9ª, fls. 33',
  }

  it('compõe correção, juros e multa na ordem declarada', () => {
    const r = atualizarValor(1000, completas, '2019-01', '2019-04')
    expect(r.correcaoMonetaria).toBeCloseTo(30.3, 2)
    expect(r.juros).toBeCloseTo(30.91, 2)
    expect(r.multa).toBeCloseTo(20.61, 2)
    expect(r.total).toBeCloseTo(1081.82, 2)
  })

  it('incide juros sobre o nominal quando essa é a premissa', () => {
    const r = atualizarValor(
      1000,
      { ...completas, baseDosJuros: 'valor-nominal' },
      '2019-01',
      '2019-04'
    )
    expect(r.juros).toBeCloseTo(30, 2)
  })

  // Sem default defensável: o motor recusa-se a escolher.
  it('falha de forma explícita sem a base de incidência dos juros', () => {
    const r = atualizarValor(
      1000,
      { ...completas, baseDosJuros: undefined },
      '2019-01',
      '2019-04'
    )
    expect(r.total).toBeNull()
    expect(
      r.alertas.some(
        (a) => a.startsWith('DADOS INSUFICIENTES') && a.includes('nominal')
      )
    ).toBe(true)
  })

  it('falha de forma explícita sem a base da multa', () => {
    const r = atualizarValor(
      1000,
      { ...completas, baseDaMulta: undefined },
      '2019-01',
      '2019-04'
    )
    expect(r.total).toBeNull()
  })

  it('exige fundamento declarado das premissas', () => {
    const r = atualizarValor(
      1000,
      { ...completas, fundamento: undefined },
      '2019-01',
      '2019-04'
    )
    expect(
      r.alertas.some(
        (a) => a.startsWith('DADOS INSUFICIENTES') && a.includes('fundamento')
      )
    ).toBe(true)
  })

  // SELIC já embute recomposição inflacionária; cumular com IPCA é atualizar
  // duas vezes o mesmo período.
  it('alerta sobre atualização em duplicidade', () => {
    const r = atualizarValor(
      1000,
      { ...completas, jurosEmbutemCorrecao: true },
      '2019-01',
      '2019-04'
    )
    expect(
      r.alertas.some(
        (a) => a.includes('[VERIFICAR]') && a.includes('duplicidade')
      )
    ).toBe(true)
  })

  it('propaga a falha da correção para o total', () => {
    const r = atualizarValor(
      1000,
      { ...completas, correcao: serieVariacao(1, 2, 0.01) },
      '2019-01',
      '2019-06'
    )
    expect(r.total).toBeNull()
  })
})

describe('Atualização do confronto', () => {
  const quadro = gerarQuadroAmortizacao({
    principal: 12000,
    prazo: 6,
    taxaPeriodo: 0.01,
    sistema: 'sac',
    capitalizacao: 'composta',
    origem: 'Cláusula 4ª, fls. 30',
  })

  const lancamentos = quadro.linhas.map((l) => ({
    parcela: l.parcela,
    total: Number((l.parcelaTotal + 100).toFixed(2)),
    fonte: 'fls. 45',
  }))

  const confronto = confrontar(quadro, lancamentos)

  const competencias = Object.fromEntries(
    quadro.linhas.map((l) => [
      l.parcela,
      `2019-${String(l.parcela).padStart(2, '0')}`,
    ])
  )

  const premissas: PremissasAtualizacao = {
    correcao: serieVariacao(1, 12, 0.01),
    jurosTaxaMensal: 0.01,
    regimeJuros: 'simples',
    baseDosJuros: 'valor-corrigido',
    fundamento: 'decisão de fls. 120',
  }

  it('atualiza cada parcela a partir da sua própria competência', () => {
    const a = atualizarConfronto(confronto, competencias, premissas, '2019-12')

    expect(a.linhas).toHaveLength(6)
    expect(a.diferencaNominal).toBeCloseTo(600, 2)
    expect(a.diferencaAtualizada).not.toBeNull()
    // A parcela 1 corre por mais meses que a 6, logo é mais atualizada.
    expect(a.linhas[0].atualizacao.total!).toBeGreaterThan(
      a.linhas[5].atualizacao.total!
    )
  })

  it('atualiza para valor superior ao nominal', () => {
    const a = atualizarConfronto(confronto, competencias, premissas, '2019-12')
    expect(a.diferencaAtualizada!).toBeGreaterThan(a.diferencaNominal)
    expect(a.sentido).toBe('excesso-cobrado')
  })

  it('falha quando falta a competência de uma parcela', () => {
    const incompleto = { ...competencias }
    delete incompleto[3]
    const a = atualizarConfronto(confronto, incompleto, premissas, '2019-12')

    expect(a.diferencaAtualizada).toBeNull()
    expect(
      a.alertas.some(
        (x) => x.startsWith('DADOS INSUFICIENTES') && x.includes('parcela 3')
      )
    ).toBe(true)
  })

  it('alerta quando a competência é posterior à data-base', () => {
    const a = atualizarConfronto(confronto, competencias, premissas, '2019-03')
    expect(
      a.alertas.some(
        (x) => x.includes('[VERIFICAR]') && x.includes('posterior à data-base')
      )
    ).toBe(true)
  })

  it('renderiza o Apêndice IV com totais', () => {
    const a = atualizarConfronto(confronto, competencias, premissas, '2019-12')
    const md = renderApendiceIV(a)
    expect(md).toContain('| Parcela | Competência | Diferença nominal |')
    expect(md).toContain('**Totais**')
    expect(md).toContain('até 2019-12')
  })

  it('não apresenta total parcial quando a atualização não fecha', () => {
    const incompleto = { ...competencias }
    delete incompleto[3]
    const a = atualizarConfronto(confronto, incompleto, premissas, '2019-12')
    const texto = renderResultadoAtualizacao(a)
    expect(texto).toContain('não pôde ser concluída')
    expect(texto).toContain('pendente de atualização')
  })
})
