'use client'

import Link from 'next/link'

export default function ReformaTributariaSolucaoPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding: '100px 0 60px' }}>
        <div className="wrap">
          <p className="eyebrow"><span className="glyph">ᚉ</span> Nova solucao</p>
          <h1 style={{ fontSize: 'clamp(2.2rem,4.8vw,3.8rem)', lineHeight: 1.12, margin: '20px 0 24px' }}>
            Reforma Tributaria: sua empresa preparada para <span className="lit">2026-2033</span>.
          </h1>
          <p className="lede" style={{ maxWidth: '38rem', fontSize: '1.12rem' }}>
            A LC 214/2025 substitui PIS, Cofins, IPI, ICMS e ISS por CBS, IBS e IS. 
            Nos ajudamos seu negocio a navegar essa transicao com <strong>projecoes, simulacoes e planejamento tributario</strong>.
          </p>
          <div className="hero-actions" style={{ marginTop: 36 }}>
            <Link className="btn btn-gold" href="/calculos/reforma-tributaria">Simular impacto agora</Link>
            <a className="btn btn-ghost" href="#como-funciona">Entender a reforma</a>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="method" id="como-funciona" style={{ padding: '80px 0' }}>
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚂ</span> Cronograma</p>
            <h2>A transicao acontece em 8 anos. Cada ano exige uma acao.</h2>
          </div>
          <div className="steps reveal" style={{ borderLeft: '1px solid var(--line-soft)' }}>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2026</div>
              <span className="step-name">Ano de teste</span>
              <h3>CBS 0,9% + IBS 0,1%</h3>
              <p>Aliquotas teste com compensacao. Obrigatoriedade de campos CBS/IBS na NF-e. Classificacao cClassTrib.</p>
            </div>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2027</div>
              <span className="step-name">Inicio efetivo</span>
              <h3>CBS 8,8% aliq. cheia</h3>
              <p>PIS/Cofins extintos. CBS em aliquota cheia. Imposto Seletivo (IS) entra em vigor. Simples comeca a transicao.</p>
            </div>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2029-2032</div>
              <span className="step-name">Fase de transicao</span>
              <h3>IBS substitui ICMS/ISS</h3>
              <p>IBS cresce gradativamente (10% a 40% da aliquota cheia). ICMS e ISS reduzem na mesma proporcao ano a ano.</p>
            </div>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2033</div>
              <span className="step-name">Sistema consolidado</span>
              <h3>CBS 8,8% + IBS 17,7%</h3>
              <p>ICMS e ISS extintos. IVA Dual opera em plenitude: aliquota combinada de 26,5%. Split payment obrigatorio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE MUDA */}
      <section className="section-pad" id="impactos">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚄ</span> Impactos</p>
            <h2>Cinco mudancas que redefinem a tributacao brasileira.</h2>
          </div>
          <div className="cards">
            <article className="card reveal">
              <h3>Nao cumulatividade plena</h3>
              <span className="card-tag">Credito amplo</span>
              <p>Toda despesa vinculada a atividade gera credito — locacao, energia, internet, servicos terceirizados. Diferente do modelo atual de PIS/Cofins, que limita creditos a uma lista de insumos.</p>
            </article>
            <article className="card reveal">
              <h3>Tributacao no destino</h3>
              <span className="card-tag">Fim da guerra fiscal</span>
              <p>O imposto acompanha o consumo, nao a origem. Acaba a guerra fiscal entre estados. Regras nacionais unificadas para IBS substituem 27 legislacoes de ICMS.</p>
            </article>
            <article className="card reveal">
              <h3>Split payment</h3>
              <span className="card-tag">Fim do float financeiro</span>
              <p>O tributo e separado automaticamente no momento do pagamento e enviado direto ao governo. A empresa recebe apenas o valor liquido da operacao. Impacto direto no fluxo de caixa.</p>
            </article>
            <article className="card reveal">
              <h3>Cesta basica com aliquota zero</h3>
              <span className="card-tag">Desoneracao</span>
              <p>Arroz, feijao, leite, pao, frutas, ovos, carne e outros itens essenciais com aliquota zero de CBS e IBS, conforme Anexo I da LC 214/2025.</p>
            </article>
            <article className="card reveal">
              <h3>Aliquotas reduzidas</h3>
              <span className="card-tag">60% e 30% de reducao</span>
              <p>Saude, educacao, medicamentos, transporte publico e insumos agropecuarios tem 60% de reducao. Profissoes regulamentadas (advocacia, contabilidade) tem 30%.</p>
            </article>
            <article className="card reveal">
              <h3>Cashback para baixa renda</h3>
              <span className="card-tag">Devolucao de tributos</span>
              <p>Familias do CadUnico tem direito a devolucao integral da CBS e IBS sobre o consumo. Mecanismo inedito de progressividade no sistema tributario brasileiro.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-final">
        <div className="wrap reveal">
          <p className="eyebrow"><span className="glyph">ᚉ</span> Simulacao</p>
          <h2>Quanto sua empresa vai pagar com a <span className="lit">Reforma Tributaria</span>?</h2>
          <p>Use nossa calculadora gratuita para projetar o impacto ano a ano, comparar regimes e identificar oportunidades de economia tributaria.</p>
          <Link className="btn btn-gold" href="/calculos/reforma-tributaria">Calcular impacto agora</Link>
        </div>
      </section>
    </>
  )
}
