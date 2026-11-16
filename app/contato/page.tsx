import ContactForm from '@/components/contato/ContactForm'

export default function ContatoPage() {
  return (
    <div style={{ padding: '100px 0 120px' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 56px' }}>
          <p className="eyebrow"><span className="glyph">ᚑ</span> Contato Direto</p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4rem)', lineHeight: 1.08, margin: '20px 0 22px' }}>
            Vamos iluminar os dados e os documentos da sua empresa.
          </h1>
          <p className="lede" style={{ fontSize: '1.15rem', color: 'var(--ink-72)' }}>
            Envie as informações iniciais sobre o seu caso. Apresentaremos o escopo recomendado, os prazos e a melhor estratégia para sua demanda societária ou documental.
          </p>
          <div className="contact-direct-pills">
            <a className="btn btn-ghost btn-sm" href="mailto:moises@imbascontabilidade.com.br">
              moises@imbascontabilidade.com.br
            </a>
            <a
              className="btn btn-ghost btn-sm"
              href="https://wa.me/5519974128714?text=Ol%C3%A1%21%20Gostaria%20de%20falar%20com%20a%20Imbas%20Tecnologia."
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: (19) 97412-8714
            </a>
          </div>
        </div>

        <ContactForm
          titulo="Solicitar avaliação e orçamento"
          subtitulo="Preencha os campos abaixo. Retornaremos com a análise preliminar."
        />
      </div>
    </div>
  )
}
