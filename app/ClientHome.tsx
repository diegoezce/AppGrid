'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'
import Navigation from '@/app/components/Navigation'
import FeedPreview from '@/app/components/FeedPreview'

interface ClientHomeProps {
  appCount: number
}

export default function ClientHome({ appCount }: ClientHomeProps) {
  const { t } = useLanguage()

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="ag-hero">
        <div className="ag-container ag-hero-inner">
          <div className="ag-eyebrow">
            <span className="ag-dot" />
            <span>{t('hero.eyebrow')}</span>
          </div>
          <h1 className="ag-h1">
            {t('hero.title')}<br /><span className="ag-h1-accent">{t('hero.titleHighlight')}</span>.
          </h1>
          <p className="ag-lede">
            {t('hero.description')}
          </p>
          <div className="ag-hero-ctas">
            <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-lg">
              {t('hero.publishCta')}
            </Link>
            <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-btn-lg">
              {t('hero.exploreCta')}
            </Link>
          </div>
          <div className="ag-hero-stats">
            <div className="ag-stat">
              <strong>{appCount}</strong>
              <span>{t('stats.appsPublished')}</span>
            </div>
            <div className="ag-stat-sep" />
            <div className="ag-stat">
              <strong>LATAM</strong>
              <span>+ {t('stats.region').split('+ ')[1]}</span>
            </div>
            <div className="ag-stat-sep" />
            <div className="ag-stat">
              <strong>{t('pricing.free')}</strong>
              <span>{t('stats.freePricing')}</span>
            </div>
          </div>
        </div>
      </section>

      <FeedPreview />

      {/* Cómo funciona */}
      <section id="como" className="ag-section">
        <div className="ag-container">
          <div className="ag-section-header">
            <h2 className="ag-h2">{t('howWorks.title')}</h2>
            <p className="ag-section-sub">{t('howWorks.subtitle')}</p>
          </div>
          <div className="ag-steps">
            <div className="ag-step">
              <div className="ag-step-num">01</div>
              <h3 className="ag-h3">{t('howWorks.step1')}</h3>
              <p>{t('howWorks.step1Desc')}</p>
            </div>
            <div className="ag-step-arrow">→</div>
            <div className="ag-step">
              <div className="ag-step-num">02</div>
              <h3 className="ag-h3">{t('howWorks.step2')}</h3>
              <p>{t('howWorks.step2Desc')}</p>
            </div>
            <div className="ag-step-arrow">→</div>
            <div className="ag-step">
              <div className="ag-step-num">03</div>
              <h3 className="ag-h3">{t('howWorks.step3')}</h3>
              <p>{t('howWorks.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué AppGrid */}
      <section className="ag-section ag-section-alt">
        <div className="ag-container">
          <div className="ag-section-header">
            <h2 className="ag-h2">{t('features.title')}</h2>
            <p className="ag-section-sub">{t('features.subtitle')}</p>
          </div>
          <div className="ag-grid ag-grid-3">
            <div className="ag-feature-card">
              <div className="ag-feature-icon">⚡</div>
              <h3 className="ag-h3">{t('features.feature1')}</h3>
              <p>{t('features.feature1Desc')}</p>
            </div>
            <div className="ag-feature-card">
              <div className="ag-feature-icon">🌎</div>
              <h3 className="ag-h3">{t('features.feature2')}</h3>
              <p>{t('features.feature2Desc')}</p>
            </div>
            <div className="ag-feature-card">
              <div className="ag-feature-icon">💰</div>
              <h3 className="ag-h3">{t('features.feature3')}</h3>
              <p>{t('features.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximamente */}
      <section className="ag-section">
        <div className="ag-container">
          <div className="ag-section-header">
            <h2 className="ag-h2">{t('roadmap.title')}</h2>
            <p className="ag-section-sub">{t('roadmap.subtitle')}</p>
          </div>
          <div className="ag-roadmap">
            <div className="ag-roadmap-item">
              <span className="ag-roadmap-dot" />
              <div>
                <strong>{t('roadmap.item1')}</strong>
                <p>{t('roadmap.item1Desc')}</p>
              </div>
            </div>
            <div className="ag-roadmap-item">
              <span className="ag-roadmap-dot" />
              <div>
                <strong>{t('roadmap.item2')}</strong>
                <p>{t('roadmap.item2Desc')}</p>
              </div>
            </div>
            <div className="ag-roadmap-item">
              <span className="ag-roadmap-dot" />
              <div>
                <strong>{t('roadmap.item3')}</strong>
                <p>{t('roadmap.item3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="ag-section ag-cta-section">
        <div className="ag-container ag-cta-inner">
          <h2 className="ag-h2">{t('finalCta.title')}</h2>
          <p className="ag-lede">{t('finalCta.subtitle')}</p>
          <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-lg">
            {t('finalCta.button')}
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
            <Link href="/builders">{t('nav.builders') || 'Builders'}</Link>
            <Link href="/marketplace">{t('nav.marketplace')}</Link>
            <Link href="/auth">{t('nav.admin')}</Link>
          </div>
          <p className="ag-footer-copy">{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  )
}
