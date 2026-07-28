import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-brand">
          <Link className="logo" href="/">
            <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="none" stroke="#4BE8A0" strokeWidth="1.6">
                <circle cx="20" cy="14.5" r="8.5"/>
                <circle cx="14.8" cy="23.5" r="8.5"/>
                <circle cx="25.2" cy="23.5" r="8.5"/>
              </g>
              <circle cx="20" cy="20.5" r="2.2" fill="#E3B860"/>
            </svg>
            <span><span className="logo-name">Imbas <em>Tecnologia</em></span></span>
          </Link>
          <p>Transformação digital com inteligência artificial para escritórios de contabilidade, advocacia, empresas de marketplace e de serviços.</p>
        </div>
        <div className="foot-cols">
          <div className="foot-col">
            <h4>Soluções</h4>
            <ul>
              <li><Link href="/#solucoes">Contabilidade</Link></li>
              <li><Link href="/#solucoes">Advocacia</Link></li>
              <li><Link href="/#solucoes">Marketplaces</Link></li>
              <li><Link href="/#solucoes">Sob medida</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Empresa</h4>
            <ul>
              <li><Link href="/#metodo">Método</Link></li>
              <li><Link href="/#porque">Por que Imbas</Link></li>
              <li><Link href="/calculos">Calculadora Trabalhista</Link></li>
              <li><a href="/#contato">Contato</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Fale conosco</h4>
            <ul>
              <li><a href="mailto:contato@imbastecnologia.com.br">contato@imbastecnologia.com.br</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="foot-legal">
        <div>
          <span>© 2026 Imbas Tecnologia · Todos os direitos reservados</span>
          <span>ᚔᚋᚁᚐᚄ · conhecimento que ilumina</span>
        </div>
      </div>
    </footer>
  )
}
