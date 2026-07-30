'use client'

import Link from 'next/link'

export default function ReformaTributariaSolucaoPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding: '100px 0 60px' }}>
        <div className="wrap">
          <p className="eyebrow"><span className="glyph">ᚉ</span> Nova solução</p>
          <h1 style={{ fontSize: 'clamp(2.2rem,4.8vw,3.8rem)', lineHeight: 1.12, margin: '20px 0 24px' }}>
            Reforma Tributária: sua empresa preparada para <span className="lit">2026-2033</span>.
          </h1>
          <p className="lede" style={{ maxWidth: '38rem', fontSize: '1.12rem' }}>
            A LC 214/2025 substitui PIS, Cofins, IPI, ICMS e ISS por CBS, IBS e IS. 
            Nós ajudamos seu negócio a navegar essa transição com <strong>projeções, simulações e planejamento tributário</strong>.
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
            <h2>A transição acontece em 8 anos. Cada ano exige uma ação.</h2>
          </div>
          <div className="steps reveal" style={{ borderLeft: '1px solid var(--line-soft)' }}>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2026</div>
              <span className="step-name">Ano de teste</span>
              <h3>CBS 0,9% + IBS 0,1%</h3>
              <p>Alíquotas teste com compensação. Obrigatoriedade de campos CBS/IBS na NF-e. Classificação cClassTrib.</p>
            </div>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2027</div>
              <span className="step-name">Início efetivo</span>
              <h3>CBS 8,8% alíq. cheia</h3>
              <p>PIS/Cofins extintos. CBS em alíquota cheia. Imposto Seletivo (IS) entra em vigor. Simples começa a transição.</p>
            </div>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2029-2032</div>
              <span className="step-name">Fase de transição</span>
              <h3>IBS substitui ICMS/ISS</h3>
              <p>IBS cresce gradativamente (10% a 40% da alíquota cheia). ICMS e ISS reduzem na mesma proporção ano a ano.</p>
            </div>
            <div className="step">
              <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>2033</div>
              <span className="step-name">Sistema consolidado</span>
              <h3>CBS 8,8% + IBS 17,7%</h3>
              <p>ICMS e ISS extintos. IVA Dual opera em plenitude: alíquota combinada de 26,5%. Split payment obrigatório.</p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE MUDA */}
      <section className="section-pad" id="impactos">
        <div className="wrap">
          <div className="section-head reveal" style={{ maxWidth: 'none' }}>
            <p className="eyebrow"><span className="glyph">ᚄ</span> Impactos</p>
            <h2>Cinco mudanças que redefinem a tributação brasileira.</h2>
          </div>
          <div className="cards">
            <article className="card reveal">
              <h3>Não cumulatividade plena</h3>
              <span className="card-tag">Crédito amplo</span>
              <p>Toda despesa vinculada à atividade gera crédito — locação, energia, internet, serviços terceirizados. Diferente do modelo atual de PIS/Cofins, que limita créditos a uma lista de insumos.</p>
            </article>
            <article className="card reveal">
              <h3>Tributação no destino</h3>
              <span className="card-tag">Fim da guerra fiscal</span>
              <p>O imposto acompanha o consumo, não a origem. Acaba a guerra fiscal entre estados. Regras nacionais unificadas para IBS substituem 27 legislações de ICMS.</p>
            </article>
            <article className="card reveal">
              <h3>Split payment</h3>
              <span className="card-tag">Fim do float financeiro</span>
              <p>O tributo é separado automaticamente no momento do pagamento e enviado direto ao governo. A empresa recebe apenas o valor líquido da operação. Impacto direto no fluxo de caixa.</p>
            </article>
            <article className="card reveal">
              <h3>Cesta básica com alíquota zero</h3>
              <span className="card-tag">Desoneração</span>
              <p>Arroz, feijão, leite, pão, frutas, ovos, carne e outros itens essenciais com alíquota zero de CBS e IBS, conforme Anexo I da LC 214/2025.</p>
            </article>
            <article className="card reveal">
              <h3>Alíquotas reduzidas</h3>
              <span className="card-tag">60% e 30% de redução</span>
              <p>Saúde, educação, medicamentos, transporte público e insumos agropecuários têm 60% de redução. Profissões regulamentadas (advocacia, contabilidade) têm 30%.</p>
            </article>
            <article className="card reveal">
              <h3>Cashback para baixa renda</h3>
              <span className="card-tag">Devolução de tributos</span>
              <p>Famílias do CadÚnico têm direito à devolução integral da CBS e IBS sobre o consumo. Mecanismo inédito de progressividade no sistema tributário brasileiro.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-final">
        <div className="wrap reveal">
          <p className="eyebrow"><span className="glyph">ᚉ</span> Simulação</p>
          <h2>Quanto sua empresa vai pagar com a <span className="lit">Reforma Tributária</span>?</h2>
          <p>Use nossa calculadora gratuita para projetar o impacto ano a ano, comparar regimes e identificar oportunidades de economia tributária.</p>
          <Link className="btn btn-gold" href="/calculos/reforma-tributaria">Calcular impacto agora</Link>
        </div>
      </section>
    </>
  )
}
