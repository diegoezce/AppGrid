import Link from 'next/link'
import './page.css'

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
            <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-sm">
              Publicar app
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="ag-hero">
        <div className="ag-container ag-hero-inner">
          <div className="ag-eyebrow">
            <span className="ag-dot" />
            <span>Marketplace para devs · LATAM + España</span>
          </div>
          <h1 className="ag-h1">
            Convertí tus apps<br />en <span className="ag-h1-accent">ingresos reales</span>.
          </h1>
          <p className="ag-lede">
            AppGrid es el marketplace donde desarrolladores publican SaaS, scripts
            y automatizaciones. Nosotros nos encargamos de la parte que odiás:
            empaquetar, posicionar y vender.
          </p>
          <div className="ag-hero-ctas">
            <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-lg">
              Publicá tu app →
            </Link>
            <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-btn-lg">
              Ver marketplace
            </Link>
          </div>
          <div className="ag-hero-stats">
            <div className="ag-stat">
              <strong>5</strong>
              <span>apps publicadas</span>
            </div>
            <div className="ag-stat-sep" />
            <div className="ag-stat">
              <strong>LATAM</strong>
              <span>+ España</span>
            </div>
            <div className="ag-stat-sep" />
            <div className="ag-stat">
              <strong>Gratis</strong>
              <span>publicar hoy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como" className="ag-section">
        <div className="ag-container">
          <div className="ag-section-header">
            <h2 className="ag-h2">Cómo funciona</h2>
            <p className="ag-section-sub">En tres pasos tenés tu app generando ingresos.</p>
          </div>
          <div className="ag-steps">
            <div className="ag-step">
              <div className="ag-step-num">01</div>
              <h3 className="ag-h3">Publicás tu app</h3>
              <p>Subís tu SaaS, script o automatización desde el panel de admin. Precio, descripción, categoría — listo.</p>
            </div>
            <div className="ag-step-arrow">→</div>
            <div className="ag-step">
              <div className="ag-step-num">02</div>
              <h3 className="ag-h3">Llegamos a compradores</h3>
              <p>Tu app aparece en el marketplace frente a developers y empresas de LATAM y España buscando soluciones.</p>
            </div>
            <div className="ag-step-arrow">→</div>
            <div className="ag-step">
              <div className="ag-step-num">03</div>
              <h3 className="ag-h3">Cobrás directo</h3>
              <p>El comprador paga por tu link de MercadoPago. Vos recibís el dinero y le dás acceso. Sin intermediarios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué AppGrid */}
      <section className="ag-section ag-section-alt">
        <div className="ag-container">
          <div className="ag-section-header">
            <h2 className="ag-h2">Por qué AppGrid</h2>
            <p className="ag-section-sub">Todo lo que necesitás para monetizar tu código.</p>
          </div>
          <div className="ag-grid ag-grid-3">
            <div className="ag-feature-card">
              <div className="ag-feature-icon">⚡</div>
              <h3 className="ag-h3">Setup en minutos</h3>
              <p>Sin configurar servidores de pagos ni landing pages. Publicás y ya estás vendiendo.</p>
            </div>
            <div className="ag-feature-card">
              <div className="ag-feature-icon">🌎</div>
              <h3 className="ag-h3">Mercado hispanohablante</h3>
              <p>Accedé a millones de desarrolladores y empresas en España, Argentina, México, Colombia y más.</p>
            </div>
            <div className="ag-feature-card">
              <div className="ag-feature-icon">💰</div>
              <h3 className="ag-h3">Vos fijás el precio</h3>
              <p>Precio único, suscripción mensual, o lo que mejor funcione para tu producto. Sin restricciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="ag-section ag-cta-section">
        <div className="ag-container ag-cta-inner">
          <h2 className="ag-h2">¿Tenés una app lista?</h2>
          <p className="ag-lede">Publicala hoy. Es gratis y tarda menos de 5 minutos.</p>
          <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-lg">
            Empezar ahora →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="ag-footer">
        <div className="ag-container ag-footer-inner">
          <a href="/" className="ag-logo ag-logo-light">
            <span className="ag-logo-mark ag-logo-mark-light" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="ag-logo-word">AppGrid</span>
          </a>
          <div className="ag-footer-links">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/auth">Admin</Link>
          </div>
          <p className="ag-footer-copy">© 2026 AppGrid. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
