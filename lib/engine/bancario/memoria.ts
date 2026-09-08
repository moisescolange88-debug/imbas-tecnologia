// Renderização da memória de cálculo nos formatos exigidos pelo laudo.
//
// Gera os Apêndices I, II e III conforme a estrutura da seção VII do modelo de
// laudo pericial financeiro (NBC TP 01 R2, itens 52 e 58).

import {
  CAPITALIZACAO_LABEL,
  SISTEMA_LABEL,
  type Confronto,
  type ConfrontoAtualizado,
  type LancamentoCobrado,
  type PremissasAtualizacao,
  type ProvaDeIntegridade,
  type QuadroAmortizacao,
} from './tipos'
import { PREFIXO_INTEGRIDADE } from './integridade'

export const AVISO_REVISAO_HUMANA =
  'AVISO: Esta minuta foi gerada com auxílio de ferramenta computacional. ' +
  'Revisão técnica, conferência de dados, verificação de premissas, validação ' +
  'metodológica e assinatura do perito habilitado são obrigatórias antes do ' +
  'protocolo judicial.'

const moeda = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function brl(v: number): string {
  return moeda.format(v)
}

function percentual(taxaDecimal: number): string {
  return `${moeda.format(taxaDecimal * 100)}%`
}

/** Bloco de premissas — abre a seção 7.1 do laudo. */
export function renderPremissas(quadro: QuadroAmortizacao): string {
  const p = quadro.premissas
  const linhas = [
    ['Valor principal (PV)', `R$ ${brl(p.principal)}`],
    ['Prazo', `${p.prazo} parcelas`],
    ['Taxa do período', percentual(p.taxaPeriodo)],
    ['Sistema de amortização', SISTEMA_LABEL[p.sistema]],
    ['Critério de capitalização', CAPITALIZACAO_LABEL[p.capitalizacao]],
    ['TAC', p.tac ? `R$ ${brl(p.tac)}` : 'não aplicável'],
    [
      'Seguro mensal',
      p.seguroMensal ? `R$ ${brl(p.seguroMensal)}` : 'não aplicável',
    ],
    [
      'Outras tarifas mensais',
      p.outrasTarifasMensais
        ? `R$ ${brl(p.outrasTarifasMensais)}`
        : 'não aplicável',
    ],
    ['Origem das premissas', p.origem ?? 'DADOS INSUFICIENTES'],
  ]

  return [
    '| Premissa | Valor adotado |',
    '| --- | --- |',
    ...linhas.map(([k, v]) => `| ${k} | ${v} |`),
  ].join('\n')
}

/** Apêndice I — Planilha de Evolução do Saldo Devedor Contratual. */
export function renderApendiceI(quadro: QuadroAmortizacao): string {
  const cab =
    '| Parcela | Saldo inicial | Amortização | Juros | Enc. acess. | Parcela teórica | Parcela total | Saldo final |'
  const sep = '| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'

  const corpo = quadro.linhas.map(
    (l) =>
      `| ${l.parcela} | ${brl(l.saldoInicial)} | ${brl(l.amortizacao)} | ${brl(l.juros)} | ${brl(l.encargosAcessorios)} | ${brl(l.parcelaTeorica)} | ${brl(l.parcelaTotal)} | ${brl(l.saldoFinal)} |`
  )

  const t = quadro.totais
  const total = `| **Totais** | — | **${brl(t.amortizacao)}** | **${brl(t.juros)}** | **${brl(t.encargosAcessorios)}** | **${brl(t.parcelasTeoricas)}** | **${brl(t.parcelasTotais)}** | — |`

  return [cab, sep, ...corpo, total].join('\n')
}

/** Apêndice II — Planilha de Valores Cobrados. */
export function renderApendiceII(lancamentos: LancamentoCobrado[]): string {
  const cab =
    '| Parcela | Vencimento | Pagamento | Amortização | Juros | Enc. acess. | Total cobrado | Status | Fonte |'
  const sep =
    '| ---: | --- | --- | ---: | ---: | ---: | ---: | --- | --- |'

  const corpo = lancamentos.map((l) => {
    const cel = (v?: number) => (v === undefined ? '—' : brl(v))
    return `| ${l.parcela} | ${l.vencimento ?? '—'} | ${l.pagamento ?? '—'} | ${cel(l.amortizacao)} | ${cel(l.juros)} | ${cel(l.encargosAcessorios)} | ${brl(l.total)} | ${l.status ?? '—'} | ${l.fonte ?? 'DADOS INSUFICIENTES'} |`
  })

  const total = lancamentos.reduce((acc, l) => acc + l.total, 0)
  return [
    cab,
    sep,
    ...corpo,
    `| **Total** | — | — | — | — | — | **${brl(total)}** | — | — |`,
  ].join('\n')
}

/** Apêndice III — Planilha de Confronto e Diferenças. */
export function renderApendiceIII(confronto: Confronto): string {
  const cab = '| Parcela | Devido | Cobrado | Diferença | Observação |'
  const sep = '| ---: | ---: | ---: | ---: | --- |'

  const corpo = confronto.linhas.map(
    (l) =>
      `| ${l.parcela} | ${brl(l.devido)} | ${brl(l.cobrado)} | ${brl(l.diferenca)} | ${l.observacao ?? '—'} |`
  )

  const total = `| **Totais** | **${brl(confronto.totalDevido)}** | **${brl(confronto.totalCobrado)}** | **${brl(confronto.diferencaTotal)}** | — |`

  return [cab, sep, ...corpo, total].join('\n')
}

const SENTIDO_TEXTO: Record<Confronto['sentido'], string> = {
  'excesso-cobrado':
    'valor cobrado superior ao apurado conforme as premissas adotadas',
  'cobranca-a-menor':
    'valor cobrado inferior ao apurado conforme as premissas adotadas',
  'sem-diferenca':
    'não se apurou diferença entre o valor cobrado e o apurado conforme as premissas adotadas',
}

/**
 * Texto corrido do resultado do confronto, em linguagem impessoal, para a
 * subseção 7.4 do laudo. Sem adjetivação de parte e sem qualificação jurídica
 * dos fatos apurados.
 */
export function renderResultadoConfronto(confronto: Confronto): string {
  const abs = Math.abs(confronto.diferencaTotal)
  if (confronto.sentido === 'sem-diferenca') {
    return `Do confronto entre os valores reconstituídos e os valores efetivamente cobrados, ${SENTIDO_TEXTO[confronto.sentido]}.`
  }
  return (
    `Do confronto entre os valores reconstituídos e os valores efetivamente cobrados, ` +
    `apura-se ${SENTIDO_TEXTO[confronto.sentido]}, no montante de R$ ${brl(abs)}, ` +
    `considerado o período e as premissas descritos na subseção 7.1.`
  )
}

/** Premissas de atualização — abre a subseção 7.5 do laudo. */
export function renderPremissasAtualizacao(p: PremissasAtualizacao): string {
  const juros = p.jurosSerie
    ? `${p.jurosSerie.nome} (${p.jurosSerie.fonte})`
    : p.jurosTaxaMensal !== undefined
      ? percentual(p.jurosTaxaMensal) + ' ao mês'
      : 'não aplicável'

  const linhas = [
    [
      'Índice de correção monetária',
      p.correcao ? `${p.correcao.nome} — ${p.correcao.fonte}` : 'não aplicável',
    ],
    ['Juros de mora', juros],
    ['Regime dos juros', p.regimeJuros ?? 'não informado'],
    ['Base de incidência dos juros', p.baseDosJuros ?? 'DADOS INSUFICIENTES'],
    ['Termo inicial dos juros', p.termoInicialJuros ?? 'não informado'],
    [
      'Multa',
      p.multaPercentual ? percentual(p.multaPercentual) : 'não aplicável',
    ],
    ['Fundamento', p.fundamento ?? 'DADOS INSUFICIENTES'],
  ]

  return [
    '| Premissa de atualização | Valor adotado |',
    '| --- | --- |',
    ...linhas.map(([k, v]) => `| ${k} | ${v} |`),
  ].join('\n')
}

/**
 * Apêndice IV — Planilha de Atualização das Diferenças.
 *
 * Cada diferença é atualizada da sua própria competência até a data-base, e
 * não em bloco a partir de uma data média.
 */
export function renderApendiceIV(c: ConfrontoAtualizado): string {
  const cab =
    '| Parcela | Competência | Diferença nominal | Correção | Juros | Multa | Diferença atualizada |'
  const sep = '| ---: | --- | ---: | ---: | ---: | ---: | ---: |'

  const corpo = c.linhas.map((l) => {
    const a = l.atualizacao
    const total = a.total === null ? 'não apurado' : brl(a.total)
    return `| ${l.parcela} | ${l.competenciaInicial} | ${brl(l.diferenca)} | ${brl(a.correcaoMonetaria)} | ${brl(a.juros)} | ${brl(a.multa)} | ${total} |`
  })

  const totalAtualizado =
    c.diferencaAtualizada === null ? 'não apurado' : brl(c.diferencaAtualizada)

  const total = `| **Totais** | até ${c.competenciaFinal} | **${brl(c.diferencaNominal)}** | — | — | — | **${totalAtualizado}** |`

  return [cab, sep, ...corpo, total].join('\n')
}

/**
 * Texto do resultado atualizado, para a subseção 7.5. Quando alguma etapa não
 * pôde ser apurada, o texto diz isso — não apresenta total parcial como se
 * fosse o resultado.
 */
export function renderResultadoAtualizacao(c: ConfrontoAtualizado): string {
  if (c.diferencaAtualizada === null) {
    return (
      'A atualização das diferenças apuradas não pôde ser concluída em razão ' +
      'das lacunas registradas nesta seção. O valor nominal apurado é de R$ ' +
      `${brl(Math.abs(c.diferencaNominal))}, pendente de atualização até a data-base.`
    )
  }
  return (
    `Atualizadas as diferenças de suas respectivas competências até ${c.competenciaFinal}, ` +
    `apura-se o montante de R$ ${brl(Math.abs(c.diferencaAtualizada))}, ` +
    `correspondente ao valor nominal de R$ ${brl(Math.abs(c.diferencaNominal))} ` +
    'acrescido de correção monetária, juros de mora e multa, conforme as premissas descritas.'
  )
}

/**
 * Prova de integridade — fecha a seção.
 *
 * A versão do motor e a impressão digital das premissas ficam no laudo para
 * que, descoberto um defeito no futuro, seja possível dizer com precisão quais
 * trabalhos foram atingidos e reconferir cada um.
 */
export function renderProva(prova: ProvaDeIntegridade): string {
  const cabecalho = [
    '| Verificação | Resultado |',
    '| --- | --- |',
    `| Versão do motor de cálculo | ${prova.motorVersao} |`,
    `| Impressão digital das premissas | \`${prova.impressaoPremissas}\` |`,
    `| Invariantes de fechamento | ${prova.integro ? 'conferidas, sem divergência' : `**${prova.violacoes.length} VIOLAÇÃO(ÕES)**`} |`,
  ].join('\n')

  if (prova.integro) return cabecalho

  const detalhe = prova.violacoes
    .map(
      (v) =>
        `- [${v.local ?? 'geral'}] ${v.regra} — esperado ${v.esperado}, obtido ${v.obtido} (divergência ${v.diferenca})`
    )
    .join('\n')

  return (
    cabecalho +
    '\n\n' +
    `> ${PREFIXO_INTEGRIDADE}\n>\n> O resultado abaixo não deve ser utilizado em laudo enquanto as divergências não forem sanadas.\n\n` +
    detalhe
  )
}

/** Passos demonstrativos — a memória propriamente dita. */
export function renderPassos(quadro: QuadroAmortizacao): string {
  return quadro.memoria
    .map(
      (p) =>
        `**${p.referencia}**\n\n` +
        `Fórmula: \`${p.formula}\`\n\n` +
        `Substituição: \`${p.substituicao}\`\n\n` +
        `Resultado: R$ ${brl(p.resultado)}` +
        (p.fundamento ? `\n\nFundamento: ${p.fundamento}` : '')
    )
    .join('\n\n---\n\n')
}

export interface MemoriaCompleta {
  quadro: QuadroAmortizacao
  lancamentos?: LancamentoCobrado[]
  confronto?: Confronto
  atualizacao?: ConfrontoAtualizado
  premissasAtualizacao?: PremissasAtualizacao
}

/**
 * Monta a seção VII completa do laudo — análise técnica e memória de cálculo.
 * Os alertas são impressos no início, e não no rodapé, porque condicionam a
 * leitura de todos os valores que vêm depois.
 */
export function renderMemoriaCompleta(m: MemoriaCompleta): string {
  const partes: string[] = []
  const alertas = Array.from(
    new Set([
      ...(m.confronto?.alertas ?? m.quadro.alertas),
      ...(m.atualizacao?.alertas ?? []),
    ])
  )

  partes.push('## VII — ANÁLISE TÉCNICA E MEMÓRIA DE CÁLCULO')

  if (alertas.length > 0) {
    partes.push(
      '### Pontos pendentes de definição ou de complementação documental\n\n' +
        alertas.map((a) => `- ${a}`).join('\n')
    )
  }

  partes.push('### 7.1. Premissas contratuais adotadas\n\n' + renderPremissas(m.quadro))
  partes.push(
    '### 7.2. Reconstituição do saldo devedor conforme contrato\n\n' +
      '*Apêndice I — Planilha de Evolução do Saldo Devedor Contratual*\n\n' +
      renderApendiceI(m.quadro)
  )

  if (m.lancamentos && m.lancamentos.length > 0) {
    partes.push(
      '### 7.3. Apuração dos valores efetivamente cobrados\n\n' +
        '*Apêndice II — Planilha de Valores Cobrados*\n\n' +
        renderApendiceII(m.lancamentos)
    )
  }

  if (m.confronto) {
    partes.push(
      '### 7.4. Confronto e apuração de diferenças\n\n' +
        '*Apêndice III — Planilha de Confronto e Diferenças*\n\n' +
        renderApendiceIII(m.confronto) +
        '\n\n' +
        renderResultadoConfronto(m.confronto)
    )
  }

  if (m.atualizacao) {
    const premissas = m.premissasAtualizacao
      ? renderPremissasAtualizacao(m.premissasAtualizacao) + '\n\n'
      : ''
    partes.push(
      '### 7.5. Atualização das diferenças apuradas\n\n' +
        premissas +
        '*Apêndice IV — Planilha de Atualização das Diferenças*\n\n' +
        renderApendiceIV(m.atualizacao) +
        '\n\n' +
        renderResultadoAtualizacao(m.atualizacao)
    )
  }

  partes.push('### Demonstração dos cálculos\n\n' + renderPassos(m.quadro))

  const prova =
    m.atualizacao?.prova ?? m.confronto?.prova ?? m.quadro.prova
  partes.push('### Prova de integridade do cálculo\n\n' + renderProva(prova))

  partes.push(`> ${AVISO_REVISAO_HUMANA}`)

  return partes.join('\n\n')
}
