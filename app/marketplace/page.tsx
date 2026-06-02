'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'
import LanguageToggle from '@/app/components/LanguageToggle'
import AppRating from '@/app/components/AppRating'
import './marketplace.css'

interface App {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  app_url: string
  price: string
  pricing_type: string
  currency: string
  keywords?: string
  rating: number
  rating_count: number
  created_at?: string
}

function formatPrice(price: string, currency: string, pricingType: string, t: any) {
  if (price === '0' || price === '0.00' || !price) return t('pricing.free')

  const localeMap: { [key: string]: string } = {
    USD: 'en-US',
    ARS: 'es-AR',
    MXN: 'es-MX',
  }
  const locale = localeMap[currency] || 'en-US'

  const numPrice = parseFloat(price)
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice)

  const suffixMap: Record<string, string> = {
    weekly: 'pricing.weekly',
    monthly: 'pricing.monthly',
    yearly: 'pricing.yearly',
  }
  const suffix = suffixMap[pricingType] ? t(suffixMap[pricingType]) : ''
  return `$${formatted}${suffix}`
}

export default function MarketplacePage() {
  const { t } = useLanguage()
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/apps')
      .then(r => r.ok ? r.json() : [])
      .then(setApps)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getCategoryLabel = (cat: string): string => {
    return t(`categories.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))
  }

  const categories = Array.from(new Set(apps.map(app => app.category)))

  const featured = [...apps]
    .filter(a => a.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  const filteredApps = apps.filter(app => {
    const matchesCategory = !selectedCategory || app.category === selectedCategory
    const q = search.toLowerCase()
    const matchesSearch = !search ||
      app.title.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      (app.keywords || '').toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  const updateRating = (id: string, rating: number, count: number) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, rating, rating_count: count } : a))

  return (
    <main>
      <nav className="ag-nav">
        <div className="ag-container ag-nav-inner">
          <Link href="/" className="ag-logo">
            <span className="ag-logo-mark" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="ag-logo-word">AppGrid</span>
          </Link>
          <div className="ag-nav-actions">
            <LanguageToggle />
            <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-sm">
              {t('nav.publish')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="ag-mkt-hero">
        <div className="ag-container ag-mkt-hero-inner">
          <p className="ag-mkt-eyebrow">{apps.length} {t('marketplace.eyebrow')}</p>
          <h1 className="ag-h1">{t('marketplace.title')}<br />{t('marketplace.titleHighlight')}</h1>
          <div className="ag-mkt-search">
            <span className="ag-mkt-search-icon">⌕</span>
            <input
              type="search"
              className="ag-mkt-search-input"
              placeholder={t('marketplace.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search && (
              <button className="ag-mkt-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </section>

      {/* Mejor valoradas */}
      {!loading && featured.length > 0 && !search && !selectedCategory && (
        <section className="ag-mkt-featured">
          <div className="ag-container">
            <h2 className="ag-mkt-section-title">{t('marketplace.featured')}</h2>
            <div className="ag-featured-grid">
              {featured.map((app, i) => (
                <Link href={`/marketplace/${app.id}`} key={app.id} className="ag-featured-card">
                  <div className="ag-featured-rank">#{i + 1}</div>
                  <div className="ag-featured-logo">
                    {app.image_url
                      ? <img src={app.image_url} alt={app.title} />
                      : <span>{app.title[0]}</span>
                    }
                  </div>
                  <div className="ag-featured-info">
                    <div className="ag-featured-top">
                      <h3>{app.title}</h3>
                      <span className="ag-featured-price">{formatPrice(app.price, app.currency, app.pricing_type, t)}</span>
                    </div>
                    <p className="ag-featured-desc">{app.description}</p>
                    <AppRating rating={app.rating || 0} count={app.rating_count || 0} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filtros */}
      {categories.length > 0 && (
        <div className="ag-marketplace-filters">
          <div className="ag-container">
            <button
              className={`ag-filter-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              {t('marketplace.allCategories')}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`ag-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <section className="ag-marketplace-content">
        <div className="ag-container">
          {search && (
            <p className="ag-mkt-search-label">
              {filteredApps.length} {filteredApps.length === 1 ? t('marketplace.resultLabel') : t('marketplace.resultLabelPlural')} {t('marketplace.for')} <strong>"{search}"</strong>
            </p>
          )}
          {loading ? (
            <div className="ag-loading">{t('marketplace.loading')}</div>
          ) : filteredApps.length === 0 ? (
            <div className="ag-empty">
              <h2>{search ? t('marketplace.noResults') : t('marketplace.noAppsCategory')}</h2>
              <p>{search ? t('marketplace.noResultsDesc') : t('marketplace.noAppsCategoryDesc')}</p>
              {!search && (
                <Link href="/auth" className="ag-btn ag-btn-primary">{t('nav.publish')}</Link>
              )}
            </div>
          ) : (
            <div className="ag-apps-grid">
              {filteredApps.map(app => (
                <div key={app.id} className="ag-app-card">
                  {app.image_url && (
                    <div className="ag-app-image">
                      <img src={app.image_url} alt={app.title} />
                    </div>
                  )}
                  <div className="ag-app-content">
                    <h3>{app.title}</h3>
                    <p className="ag-app-description">{app.description}</p>
                    <AppRating
                      rating={app.rating || 0}
                      count={app.rating_count || 0}
                      appId={app.id}
                      onRate={(r, c) => updateRating(app.id, r, c)}
                    />
                    <div className="ag-app-footer">
                      <span className="ag-app-category">{getCategoryLabel(app.category)}</span>
                      <span className="ag-app-price">{formatPrice(app.price, app.currency, app.pricing_type, t)}</span>
                    </div>
                  </div>
                  <div className="ag-app-card-actions">
                    <Link href={`/marketplace/${app.id}`} className="ag-btn ag-btn-ghost ag-btn-card">
                      {t('marketplace.viewDetail')}
                    </Link>
                    <a
                      href={app.app_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ag-btn ag-btn-primary ag-btn-card"
                    >
                      {t('marketplace.goToApp')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="ag-footer">
        <div className="ag-container">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </main>
  )
}
