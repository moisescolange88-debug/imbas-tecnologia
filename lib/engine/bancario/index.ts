// Motor de perícia financeira em contratos bancários.
//
// Reconstitui o saldo devedor conforme premissas contratuais, confronta com os
// valores efetivamente cobrados, atualiza as diferenças até a data-base e
// emite a memória de cálculo nos formatos dos Apêndices I a IV do laudo.

export * from './tipos'
export {
  parcelaPrice,
  amortizacaoConstante,
  taxaEfetivaAnual,
  gerarQuadroAmortizacao,
} from './amortizacao'
export { confrontar, confrontarMetodologias } from './confronto'
export {
  MOTOR_VERSAO,
  PREFIXO_INTEGRIDADE,
  impressaoDigital,
  verificarQuadro,
  verificarConfronto,
  verificarAtualizacao,
  alertasDeViolacao,
  gerarProva,
} from './integridade'
export {
  ehCompetencia,
  competenciaDeData,
  compararCompetencias,
  proximaCompetencia,
  mesesEntre,
  competenciasEntre,
  fatorAcumulado,
  somaAcumulada,
  type FatorAcumulado,
} from './indices'
export {
  corrigirMonetariamente,
  calcularJurosMora,
  atualizarValor,
  atualizarConfronto,
} from './atualizacao'
export {
  AVISO_REVISAO_HUMANA,
  renderPremissas,
  renderPremissasAtualizacao,
  renderApendiceI,
  renderApendiceII,
  renderApendiceIII,
  renderApendiceIV,
  renderResultadoConfronto,
  renderResultadoAtualizacao,
  renderProva,
  renderPassos,
  renderMemoriaCompleta,
  type MemoriaCompleta,
} from './memoria'
