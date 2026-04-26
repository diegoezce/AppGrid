// AppGrid landing page

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C6F24E",
  "ink": "#0A0A0A",
  "bg": "#FAFAF7",
  "density": "regular",
  "heroVariant": "grid",
  "showMonoTags": true
}/*EDITMODE-END*/;

// ──────────────────────────────────────────────────────────────────
// Tiny SVG icons (stroke-based, monoline)

const Icon = ({ d, size = 18, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  upload:    "M12 16V4M12 4l-4 4M12 4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  package:   ["M3 7l9-4 9 4M3 7l9 4 9-4M3 7v10l9 4 9-4V7M12 11v10"],
  globe:     ["M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18", "M3 12h18M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"],
  cash:      ["M2 7h20v10H2zM6 12h.01M18 12h.01", "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"],
  bolt:      "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  wallet:    ["M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3", "M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3", "M16 13h5v-3h-5a1.5 1.5 0 0 0 0 3z"],
  share:     ["M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7", "M16 6l-4-4-4 4M12 2v14"],
  hammer:    ["M14 6l4-4 4 4-4 4-4-4z", "M14 6L3 17l4 4L18 10"],
  arrowRight:"M5 12h14M13 6l6 6-6 6",
  check:     "M5 12l5 5L20 7",
  plus:      "M12 5v14M5 12h14",
  minus:     "M5 12h14",
  terminal:  ["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M7 9l3 3-3 3M13 15h4"],
  cog:       ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"],
  briefcase: ["M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8z", "M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"],
  target:    ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M12 12h.01"],
  github:    "M9 19c-4 1.5-4-2.5-6-3m12 5v-3.87a3.4 3.4 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19.1 5.4 5.07 5.07 0 0 0 19 1.4S17.7.94 15 2.78a13.4 13.4 0 0 0-7 0C5.3.94 4 1.4 4 1.4a5.07 5.07 0 0 0-.1 4 5.44 5.44 0 0 0-1.4 3.7c0 5.43 3.3 6.62 6.44 7a3.41 3.41 0 0 0-.94 2.59V22",
};

// ──────────────────────────────────────────────────────────────────
// Sections

const Nav = ({ accent }) => (
  <nav className="ag-nav">
    <div className="ag-nav-inner">
      <a href="#" className="ag-logo">
        <span className="ag-logo-mark" style={{ background: accent }} aria-hidden="true">
          <span /><span /><span /><span />
        </span>
        <span className="ag-logo-word">AppGrid</span>
      </a>
      <div className="ag-nav-links">
        <a href="#problema">Problema</a>
        <a href="#como">Cómo funciona</a>
        <a href="#casos">Casos</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="ag-nav-actions">
        <a href="#" className="ag-link-quiet">Ingresar</a>
        <a href="#cta" className="ag-btn ag-btn-primary ag-btn-sm">
          Subí tu app <Icon d={ICONS.arrowRight} size={14} />
        </a>
      </div>
    </div>
  </nav>
);

const Hero = ({ accent, variant, showTags }) => {
  return (
    <section className="ag-hero">
      <div className="ag-container ag-hero-inner">
        <div className="ag-hero-copy">
          {showTags && (
            <div className="ag-eyebrow">
              <span className="ag-dot" style={{ background: accent }} />
              <span>Marketplace para devs · LATAM + España</span>
            </div>
          )}
          <h1 className="ag-h1">
            Convertí tus apps<br />en <span className="ag-h1-accent" style={{ background: accent }}>ingresos</span>.
          </h1>
          <p className="ag-lede">
            AppGrid es el marketplace donde desarrolladores publican SaaS, scripts
            y automatizaciones. Nosotros nos encargamos de la parte que odiás:
            empaquetar, posicionar y vender.
          </p>
          <div className="ag-hero-ctas">
            <a href="#cta" className="ag-btn ag-btn-primary">
              Subí tu app <Icon d={ICONS.arrowRight} size={16} />
            </a>
            <a href="#casos" className="ag-btn ag-btn-ghost">Ver apps</a>
          </div>
          <div className="ag-hero-meta">
            <div><strong>+100</strong> devs construyendo</div>
            <div className="ag-meta-sep" />
            <div><strong>USD</strong> · ARS · MXN · EUR</div>
            <div className="ag-meta-sep" />
            <div>Comisión <strong>solo al vender</strong></div>
          </div>
        </div>

        <div className="ag-hero-visual">
          <HeroGrid accent={accent} variant={variant} />
        </div>
      </div>
    </section>
  );
};

const HERO_APPS = [
  { name: "csv-genie",       cat: "Script",   price: "USD 19",  hue: 1, sales: "127" },
  { name: "Notion → Slack",  cat: "Automatización", price: "USD 9/mo", hue: 2, sales: "84" },
  { name: "PDF Redactor",    cat: "Tool",     price: "USD 29",  hue: 3, sales: "412" },
  { name: "Stripe Insights", cat: "SaaS",     price: "USD 24/mo", hue: 4, sales: "61" },
  { name: "regex-buddy",     cat: "Tool",     price: "USD 12",  hue: 5, sales: "208" },
  { name: "Cal API Sync",    cat: "SaaS",     price: "USD 14/mo", hue: 6, sales: "33" },
];

const HeroGrid = ({ accent, variant }) => {
  if (variant === "terminal") return <HeroTerminal accent={accent} />;
  return (
    <div className="ag-grid-card">
      <div className="ag-grid-head">
        <div className="ag-grid-dot" style={{ background: accent }} />
        <span className="ag-mono">appgrid.io / explorar</span>
        <div className="ag-grid-search">
          <span className="ag-mono ag-grid-search-text">/ buscar</span>
        </div>
      </div>
      <div className="ag-grid-body">
        {HERO_APPS.map((a, i) => (
          <article key={a.name} className="ag-app-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="ag-app-thumb" data-hue={a.hue}>
              <span className="ag-mono">{a.name.slice(0, 2)}</span>
            </div>
            <div className="ag-app-body">
              <div className="ag-app-name">{a.name}</div>
              <div className="ag-app-cat ag-mono">{a.cat}</div>
            </div>
            <div className="ag-app-foot">
              <span className="ag-app-price">{a.price}</span>
              <span className="ag-app-sales ag-mono">{a.sales} ventas</span>
            </div>
          </article>
        ))}
        <div className="ag-grid-fade" />
      </div>
    </div>
  );
};

const HeroTerminal = ({ accent }) => (
  <div className="ag-term-card">
    <div className="ag-term-head">
      <div className="ag-term-lights"><i /><i /><i /></div>
      <span className="ag-mono">~/projects/csv-genie</span>
    </div>
    <pre className="ag-term-body ag-mono"><code>{
`$ appgrid push
→ analizando proyecto…              ✓
→ generando landing + checkout      ✓
→ pricing sugerido: USD 19          ✓
→ publicando en appgrid.io/csv-genie ✓

`}<span style={{ color: accent }}>{`✦ tu app está vendiendo.`}</span>
{`
`}</code></pre>
  </div>
);

// ──────────────────────────────────────────────────────────────────

const Logos = () => (
  <div className="ag-logos">
    <div className="ag-container ag-logos-inner">
      <span className="ag-mono ag-logos-label">Construido por devs que vienen de</span>
      <div className="ag-logos-row">
        {["MercadoLibre", "Globant", "Rappi", "Auth0", "Kavak", "Platzi"].map(n => (
          <span key={n} className="ag-logo-text">{n}</span>
        ))}
      </div>
    </div>
  </div>
);

const Problem = () => (
  <section id="problema" className="ag-section">
    <div className="ag-container">
      <SectionHeader kicker="01 / Problema" title="Construís cosas útiles. Que nadie usa." />
      <div className="ag-prob-grid">
        <ProblemCard
          n="01"
          title="Sabés construir, no vender"
          body="Marketing, copy, pricing, landing, pasarela de pago. Cada cosa es un mundo nuevo y cada una te aleja del código."
        />
        <ProblemCard
          n="02"
          title="Vender es más difícil que construir"
          body="Tu script funciona en 20 minutos. Convertirlo en algo que la gente compre puede llevar meses."
        />
        <ProblemCard
          n="03"
          title="Tus proyectos quedan en GitHub"
          body="Repos privados, scripts en /tmp, automatizaciones que solo usás vos. Trabajo real que nunca generó un peso."
        />
      </div>
    </div>
  </section>
);

const ProblemCard = ({ n, title, body }) => (
  <div className="ag-prob-card">
    <span className="ag-mono ag-prob-n">{n}</span>
    <h3>{title}</h3>
    <p>{body}</p>
  </div>
);

const Solution = ({ accent }) => (
  <section className="ag-section ag-section-dark">
    <div className="ag-container">
      <SectionHeader kicker="02 / Solución" title="Vos construís. Nosotros vendemos." dark />
      <div className="ag-sol-grid">
        <div className="ag-sol-main">
          <p className="ag-sol-lede">
            AppGrid es el puente entre <em>construir</em> y <em>monetizar</em>.
            Subís el repo o el binario; nosotros lo convertimos en producto:
            página, descripción, pricing, checkout y distribución.
          </p>
          <ul className="ag-sol-list">
            <li><Icon d={ICONS.check} size={16} /> Empaquetado en horas, no semanas</li>
            <li><Icon d={ICONS.check} size={16} /> Tráfico compartido del marketplace</li>
            <li><Icon d={ICONS.check} size={16} /> Pagos en USD a tu cuenta o billetera</li>
            <li><Icon d={ICONS.check} size={16} /> Vos te enfocás en construir</li>
          </ul>
        </div>
        <div className="ag-sol-side">
          <div className="ag-sol-stat">
            <span className="ag-mono ag-sol-stat-k">tiempo medio para publicar</span>
            <span className="ag-sol-stat-v">
              <span style={{ color: accent }}>48h</span>
            </span>
          </div>
          <div className="ag-sol-stat">
            <span className="ag-mono ag-sol-stat-k">comisión</span>
            <span className="ag-sol-stat-v">15%<span className="ag-sol-stat-sub"> · solo si vendés</span></span>
          </div>
          <div className="ag-sol-stat">
            <span className="ag-mono ag-sol-stat-k">payout</span>
            <span className="ag-sol-stat-v">semanal</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────

const STEPS = [
  { n: "01", t: "Subí tu app",          d: "Repo, binario, script o link a tu SaaS. Soportamos casi todo lo que corre en una terminal o un browser.", icon: ICONS.upload },
  { n: "02", t: "La convertimos en producto", d: "Empaquetado, copy en español, pricing sugerido, página de venta y checkout. Listo para mostrar.", icon: ICONS.package },
  { n: "03", t: "La publicamos",        d: "Aparece en el marketplace, en categorías y en búsquedas. Tráfico compartido entre todas las apps.", icon: ICONS.globe },
  { n: "04", t: "Generás ingresos",     d: "Cobrás en USD a tu cuenta o billetera. Sin mínimos. Sin contratos. Pagás solo cuando vendés.", icon: ICONS.cash },
];

const HowItWorks = () => (
  <section id="como" className="ag-section">
    <div className="ag-container">
      <SectionHeader kicker="03 / Cómo funciona" title="De repo a ingreso en cuatro pasos." />
      <div className="ag-steps">
        {STEPS.map((s, i) => (
          <div key={s.n} className="ag-step">
            <div className="ag-step-head">
              <span className="ag-mono ag-step-n">{s.n}</span>
              <span className="ag-step-icon"><Icon d={s.icon} size={18} /></span>
            </div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            {i < STEPS.length - 1 && <span className="ag-step-arrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────

const BENEFITS = [
  { t: "No necesitás saber marketing", d: "Nosotros escribimos la página, el copy y la descripción. Vos revisás y publicás.", icon: ICONS.target },
  { t: "Tráfico compartido",           d: "Cada app suma audiencia al resto. Búsqueda, categorías y newsletter incluidos.", icon: ICONS.share },
  { t: "Monetización rápida",          d: "Checkout en USD desde el día uno. Stripe, MercadoPago y crypto.", icon: ICONS.bolt },
  { t: "Enfocate en construir",        d: "Soporte de pagos, fraude y reembolsos los manejamos nosotros.", icon: ICONS.hammer },
];

const Benefits = () => (
  <section className="ag-section">
    <div className="ag-container">
      <SectionHeader kicker="04 / Beneficios" title="Lo que ganás dejándonos vender." />
      <div className="ag-ben-grid">
        {BENEFITS.map(b => (
          <div key={b.t} className="ag-ben-card">
            <span className="ag-ben-icon"><Icon d={b.icon} size={20} /></span>
            <h3>{b.t}</h3>
            <p>{b.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────

const CASES = [
  { tag: "Scripts",       t: "Automatizaciones",   d: "Ese script de Python que limpia CSVs, renombra archivos o scrapea precios. Lo vendés como herramienta CLI o web.", icon: ICONS.terminal, ex: "csv-genie · regex-buddy · pdf-merge" },
  { tag: "SaaS",          t: "SaaS simples",       d: "Una idea, una pantalla, una suscripción. Sin equipo de growth ni billing propio.", icon: ICONS.cog, ex: "Stripe Insights · Cal API Sync" },
  { tag: "Internas",      t: "Herramientas internas", d: "Lo que hiciste para tu equipo y nunca compartiste. Otros equipos también lo necesitan.", icon: ICONS.briefcase, ex: "deploy-monitor · oncall-bot" },
  { tag: "Nicho",         t: "Soluciones de nicho", d: "Para 200 personas en el mundo. Mercado chico, intención altísima, precio premium.", icon: ICONS.target, ex: "Tax LATAM CLI · Notion → Linear" },
];

const UseCases = () => (
  <section id="casos" className="ag-section">
    <div className="ag-container">
      <SectionHeader kicker="05 / Casos de uso" title="Ya vendiste algo así. No lo sabías." />
      <div className="ag-case-grid">
        {CASES.map(c => (
          <div key={c.t} className="ag-case-card">
            <div className="ag-case-head">
              <span className="ag-case-icon"><Icon d={c.icon} size={20} /></span>
              <span className="ag-mono ag-case-tag">{c.tag}</span>
            </div>
            <h3>{c.t}</h3>
            <p>{c.d}</p>
            <div className="ag-case-ex ag-mono">{c.ex}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    q: "Tenía un script que usaba para limpiar bases de clientes. Lo subí a AppGrid un martes y el viernes ya tenía las primeras 8 ventas. Yo solo escribí el README.",
    n: "Mariana C.",
    r: "Backend dev · Buenos Aires",
    app: "csv-genie",
  },
  {
    q: "Lo que más me gustó: no tuve que pelearme con Stripe ni hacer una landing. Subí el repo, ellos hicieron todo lo demás. Ya llevo USD 2.400 en tres meses.",
    n: "Diego R.",
    r: "Indie hacker · CDMX",
    app: "regex-buddy",
  },
  {
    q: "Construí una herramienta interna para mi equipo. Ahora la usan equipos en cuatro empresas distintas. Nunca hubiera salido a venderla yo solo.",
    n: "Sofía L.",
    r: "Staff engineer · Madrid",
    app: "deploy-monitor",
  },
];

const Social = ({ accent }) => (
  <section className="ag-section">
    <div className="ag-container">
      <SectionHeader kicker="06 / Comunidad" title="Devs que ya están vendiendo." />
      <div className="ag-test-grid">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="ag-test-card">
            <blockquote>{t.q}</blockquote>
            <figcaption>
              <div className="ag-test-avatar" style={{ background: i === 1 ? accent : undefined }}>
                {t.n.split(" ").map(s => s[0]).join("")}
              </div>
              <div>
                <div className="ag-test-name">{t.n}</div>
                <div className="ag-test-role ag-mono">{t.r}</div>
              </div>
              <div className="ag-test-app ag-mono">/{t.app}</div>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="ag-test-strip">
        <div><strong>+100</strong> desarrolladores</div>
        <div><strong>+340</strong> apps publicadas</div>
        <div><strong>USD 180k</strong> pagados a devs</div>
        <div><strong>14</strong> países</div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────

const FinalCTA = ({ accent }) => (
  <section id="cta" className="ag-section ag-cta">
    <div className="ag-container">
      <div className="ag-cta-card">
        <div className="ag-cta-grid" aria-hidden="true">
          {Array.from({ length: 96 }).map((_, i) => <span key={i} />)}
        </div>
        <div className="ag-cta-content">
          <span className="ag-mono ag-cta-kicker">/ empezá hoy</span>
          <h2>Empezá a vender tu app hoy.</h2>
          <p>Sin contrato, sin mínimos, sin meses de marketing. Subís el repo, nosotros hacemos el resto.</p>
          <div className="ag-cta-actions">
            <a href="#" className="ag-btn ag-btn-primary ag-btn-lg">
              Subí tu app <Icon d={ICONS.arrowRight} size={18} />
            </a>
            <a href="#" className="ag-btn ag-btn-ghost-dark ag-btn-lg">
              <Icon d={ICONS.github} size={16} /> Conectar con GitHub
            </a>
          </div>
          <div className="ag-cta-fine ag-mono">comisión 15% · payout semanal · cancelás cuando quieras</div>
        </div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "¿Qué tipo de apps puedo subir?",
    a: "SaaS, scripts CLI, automatizaciones, herramientas web, plugins de Notion/Slack/Figma, y soluciones internas. Si corre en una terminal, en un browser o como API, encaja. Revisamos cada app antes de publicarla."
  },
  {
    q: "¿Cuánto cuesta? ¿Cuál es la comisión?",
    a: "Subir es gratis. Cobramos 15% solo cuando vendés. No hay mensualidad, ni costo de setup, ni mínimos. Si tu app no genera nada, AppGrid no cobra nada."
  },
  {
    q: "¿Cómo y cuándo me pagan?",
    a: "Payout semanal en USD a tu cuenta bancaria, MercadoPago, Wise o billetera crypto. Soportamos pagos a Argentina, México, Colombia, Chile, España y otros 9 países."
  },
  {
    q: "¿Qué soporte ofrecen?",
    a: "Te ayudamos con onboarding, copy, pricing y checkout. Manejamos pagos, fraude y reembolsos. El soporte técnico de tu app sigue siendo tuyo, pero te damos las herramientas (tickets, changelog, docs)."
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="ag-section">
      <div className="ag-container ag-faq">
        <div className="ag-faq-head">
          <SectionHeader kicker="07 / FAQ" title="Preguntas honestas." compact />
          <p>Lo que te ibas a preguntar antes de subir tu primera app.</p>
        </div>
        <div className="ag-faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={"ag-faq-item" + (isOpen ? " is-open" : "")}>
                <button className="ag-faq-q" onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="ag-faq-icon"><Icon d={isOpen ? ICONS.minus : ICONS.plus} size={16} /></span>
                </button>
                <div className="ag-faq-a"><p>{f.a}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────

const Footer = ({ accent }) => (
  <footer className="ag-footer">
    <div className="ag-container ag-footer-inner">
      <div className="ag-footer-brand">
        <a href="#" className="ag-logo">
          <span className="ag-logo-mark" style={{ background: accent }} aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="ag-logo-word">AppGrid</span>
        </a>
        <p>El marketplace para devs hispanohablantes que ya construyeron algo y quieren empezar a cobrar por eso.</p>
      </div>
      <div className="ag-footer-cols">
        <div>
          <h4 className="ag-mono">Producto</h4>
          <a href="#">Explorar apps</a>
          <a href="#">Subir app</a>
          <a href="#">Pricing</a>
          <a href="#">Changelog</a>
        </div>
        <div>
          <h4 className="ag-mono">Comunidad</h4>
          <a href="#">Discord</a>
          <a href="#">Twitter / X</a>
          <a href="#">GitHub</a>
          <a href="#">Newsletter</a>
        </div>
        <div>
          <h4 className="ag-mono">Legal</h4>
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Comisiones</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </div>
    <div className="ag-container ag-footer-foot">
      <span className="ag-mono">© 2026 AppGrid · Hecho en LATAM</span>
      <span className="ag-mono">v1.0 · status: <span className="ag-status-ok">all systems operational</span></span>
    </div>
  </footer>
);

// ──────────────────────────────────────────────────────────────────

const SectionHeader = ({ kicker, title, dark, compact }) => (
  <header className={"ag-sec-head" + (dark ? " is-dark" : "") + (compact ? " is-compact" : "")}>
    <span className="ag-mono ag-sec-kicker">{kicker}</span>
    <h2>{title}</h2>
  </header>
);

// ──────────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // CSS variables
  const cssVars = {
    "--ag-accent": t.accent,
    "--ag-ink":    t.ink,
    "--ag-bg":     t.bg,
    "--ag-density": t.density === "compact" ? "0.85" : t.density === "comfy" ? "1.15" : "1",
  };

  return (
    <div className="ag-root" style={cssVars}>
      <Nav accent={t.accent} />
      <Hero accent={t.accent} variant={t.heroVariant} showTags={t.showMonoTags} />
      <Logos />
      <Problem />
      <Solution accent={t.accent} />
      <HowItWorks />
      <Benefits />
      <UseCases />
      <Social accent={t.accent} />
      <FinalCTA accent={t.accent} />
      <FAQ />
      <Footer accent={t.accent} />

      <TweaksPanel>
        <TweakSection label="Color" />
        <TweakColor label="Acento" value={t.accent} onChange={v => setTweak("accent", v)} />
        <TweakColor label="Tinta"  value={t.ink}    onChange={v => setTweak("ink", v)} />
        <TweakColor label="Fondo"  value={t.bg}     onChange={v => setTweak("bg", v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="Densidad" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={v => setTweak("density", v)} />
        <TweakRadio label="Hero visual" value={t.heroVariant}
          options={["grid", "terminal"]}
          onChange={v => setTweak("heroVariant", v)} />
        <TweakToggle label="Tags monoespaciadas" value={t.showMonoTags}
          onChange={v => setTweak("showMonoTags", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
