import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav className="ag-nav">
        <div className="ag-container ag-nav-inner">
          <a href="/" className="ag-logo">
            <span className="ag-logo-mark" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="ag-logo-word">AppGrid</span>
          </a>
          <div className="ag-nav-links">
            <Link href="#como">Cómo funciona</Link>
            <Link href="/marketplace">Marketplace</Link>
          </div>
          <div className="ag-nav-actions">
            <Link href="/admin" className="ag-btn ag-btn-primary ag-btn-sm">
              Publicar app
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="ag-hero">
        <div className="ag-container ag-hero-inner">
          <div className="ag-hero-copy">
            <div className="ag-eyebrow">
              <span className="ag-dot" />
              <span>Marketplace para devs · LATAM + España</span>
            </div>
            <h1 className="ag-h1">
              Convertí tus apps<br />en <span className="ag-h1-accent">ingresos</span>.
            </h1>
            <p className="ag-lede">
              AppGrid es el marketplace donde desarrolladores publican SaaS, scripts
              y automatizaciones. Nosotros nos encargamos de la parte que odiás:
              empaquetar, posicionar y vender.
            </p>
            <div className="ag-hero-ctas">
              <Link href="/admin" className="ag-btn ag-btn-primary">
                Publicá tu app →
              </Link>
              <Link href="/marketplace" className="ag-btn ag-btn-ghost">Ver marketplace</Link>
            </div>
            <div className="ag-hero-meta">
              <div><strong>5</strong> apps en catálogo</div>
              <div className="ag-meta-sep" />
              <div>LATAM + España</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ag-footer">
        <div className="ag-container">
          <p>© 2026 AppGrid. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
