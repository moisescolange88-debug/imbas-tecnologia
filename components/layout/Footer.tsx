import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="ogham-strip ogham-strip--dark" aria-hidden="true">
        <svg preserveAspectRatio="none"></svg>
      </div>
      <div className="foot-inner">
        <div className="foot-brand">
          <Link className="logo" href="/">
            <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="none" stroke="#3CC489" strokeWidth="1.6">
                <circle cx="20" cy="14.5" r="8.5" />
                <circle cx="14.8" cy="23.5" r="8.5" />
                <circle cx="25.2" cy="23.5" r="8.5" />
              </g>
              <circle cx="20" cy="20.5" r="2.2" fill="#D6A844" />
            </svg>
            <span>
              <span className="logo-name">
                Imbas <em>Tecnologia</em>
              </span>
            </span>
          </Link>
          <p>
            Transformação digital com inteligência artificial para escritórios de contabilidade, advocacia, empresas de
            marketplace e de serviços.
          </p>
        </div>
        <div className="foot-cols">
          <div className="foot-col">
            <h4>Soluções</h4>
            <ul>
              <li><Link href="/solucoes/dossie-societario">Dossiê Societário</Link></li>
              <li><Link href="/solucoes/gestao-documental">Gestão Documental</Link></li>
              <li><Link href="/solucoes/reforma-tributaria">Reforma Tributária</Link></li>
              <li><Link href="/#solucoes">Contabilidade com IA</Link></li>
              <li><Link href="/#solucoes">Advocacia Aumentada</Link></li>
              <li><Link href="/#solucoes">Marketplaces Autônomos</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Ferramentas &amp; Empresa</h4>
            <ul>
              <li><Link href="/calculos">Calculadora Trabalhista</Link></li>
              <li><Link href="/calculos/reforma-tributaria">Simulador Reforma Tributária</Link></li>
              <li><Link href="/conhecimento/licenciamento">Licenças ANVISA/CETESB</Link></li>
              <li><Link href="/conhecimento/cotacao">Cotação com IA</Link></li>
              <li><Link href="/#metodo">Método Imbas</Link></li>
              <li><Link href="/#porque">Por que Imbas</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Fale conosco</h4>
            <ul>
              <li><Link href="/contato">Solicitar Diagnóstico</Link></li>
              <li><a href="mailto:contato@imbastecnologia.com.br">contato@imbastecnologia.com.br</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="foot-legal">
        <div>
          <span>&copy; 2026 Imbas Tecnologia. Todos os direitos reservados.</span>
          <span>ᚔᚋᚁᚐᚄ · conhecimento que ilumina</span>
        </div>
      </div>
    </footer>
  )
}
