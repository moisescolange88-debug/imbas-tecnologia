import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  MOTOR_VERSAO,
  gerarQuadroAmortizacao,
  confrontar,
  atualizarConfronto,
  type LancamentoCobrado,
  type PremissasAtualizacao,
  type PremissasContrato,
} from '@/lib/engine/bancario'

/**
 * Regressão de caso real.
 *
 * Cada arquivo em `casos/` congela as premissas e os resultados de um trabalho
 * concreto. Qualquer alteração no motor que mude um número de caso já emitido
 * quebra o build — que é exatamente a barreira que falta quando o defeito só
 * apareceria no laudo seguinte.
 *
 * Ver `casos/README.md` para o procedimento de inclusão.
 */

interface Caso {
  id: string
  descricao: string
  premissas: PremissasContrato
  lancamentos?: LancamentoCobrado[]
  atualizacao?: {
    premissas: PremissasAtualizacao
    competencias: Record<string, string>
    dataBase: string
  }
  esperado: Record<string, unknown>
}

const DIR = join(__dirname, 'casos')

const arquivos = readdirSync(DIR).filter((f) => f.endsWith('.json'))

const casos: Caso[] = arquivos.map(
  (f) => JSON.parse(readFileSync(join(DIR, f), 'utf-8')) as Caso
)

describe('Regressão de casos', () => {
  it('há pelo menos um caso congelado', () => {
    expect(casos.length).toBeGreaterThan(0)
  })

  it.each(casos.map((c) => [c.id, c] as const))(
    'caso %s reproduz os valores congelados',
    (_id, caso) => {
      const e = caso.esperado
      const quadro = gerarQuadroAmortizacao(caso.premissas)

      expect(quadro.prova.integro).toBe(true)
      expect(quadro.prova.impressaoPremissas).toBe(e.impressaoPremissas)

      expect(quadro.totais.amortizacao).toBeCloseTo(
        e.totalAmortizacao as number,
        2
      )
      expect(quadro.totais.juros).toBeCloseTo(e.totalJuros as number, 2)
      expect(quadro.totais.encargosAcessorios).toBeCloseTo(
        e.totalEncargos as number,
        2
      )
      expect(quadro.totais.parcelasTotais).toBeCloseTo(
        e.totalParcelas as number,
        2
      )
      expect(quadro.linhas[0].parcelaTotal).toBeCloseTo(
        e.primeiraParcelaTotal as number,
        2
      )
      expect(quadro.linhas[quadro.linhas.length - 1].saldoFinal).toBeCloseTo(
        e.ultimoSaldoFinal as number,
        2
      )

      if (!caso.lancamentos) return

      const confronto = confrontar(quadro, caso.lancamentos)
      expect(confronto.totalDevido).toBeCloseTo(e.totalDevido as number, 2)
      expect(confronto.totalCobrado).toBeCloseTo(e.totalCobrado as number, 2)
      expect(confronto.diferencaTotal).toBeCloseTo(
        e.diferencaNominal as number,
        2
      )

      if (!caso.atualizacao) return

      const competencias = Object.fromEntries(
        Object.entries(caso.atualizacao.competencias).map(([k, v]) => [
          Number(k),
          v,
        ])
      )
      const atualizado = atualizarConfronto(
        confronto,
        competencias,
        caso.atualizacao.premissas,
        caso.atualizacao.dataBase
      )

      expect(atualizado.prova.integro).toBe(true)
      expect(atualizado.diferencaAtualizada).toBeCloseTo(
        e.diferencaAtualizada as number,
        2
      )
      expect(atualizado.sentido).toBe(e.sentido)
    }
  )

  // Se o motor mudou de versão mas nenhum número de caso mudou, o congelamento
  // segue válido — e isso precisa ser dito, não presumido.
  it.each(casos.map((c) => [c.id, c] as const))(
    'caso %s declara a versão do motor que o gerou',
    (_id, caso) => {
      expect(caso.esperado.motorVersao).toBeDefined()
      if (caso.esperado.motorVersao !== MOTOR_VERSAO) {
        console.warn(
          `[regressão] O caso ${caso.id} foi congelado na versão ${caso.esperado.motorVersao}; ` +
            `o motor está em ${MOTOR_VERSAO}. Os valores acima continuam conferindo, ` +
            `mas revalide o caso e atualize o campo antes de citá-lo como conferência.`
        )
      }
    }
  )
})
