'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

function formatPrice(price: string, currency: string, pricingType: string) {
  if (price === '0' || price === '0.00' || !price) return 'Gratis'
  const suffix = pricingType === 'weekly' ? '/sem' : pricingType === 'monthly' ? '/mes' : pricingType === 'yearly' ? '/año' : ''
  return `$${price} ${currency}${suffix}`
}

export default function MarketplacePage() {
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
            <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-sm">
              Publicar app
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="ag-mkt-hero">
        <div className="ag-container ag-mkt-hero-inner">
          <p className="ag-mkt-eyebrow">{apps.length} apps disponibles · LATAM + España</p>
          <h1 className="ag-h1">Encontrá la app<br />perfecta para tu negocio.</h1>
          <div className="ag-mkt-search">
            <span className="ag-mkt-search-icon">⌕</span>
            <input
              type="search"
              className="ag-mkt-search-input"
              placeholder="Buscar apps..."
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
            <h2 className="ag-mkt-section-title">Mejor valoradas</h2>
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
                      <span className="ag-featured-price">{formatPrice(app.price, app.currency, app.pricing_type)}</span>
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
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`ag-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
              {filteredApps.length} resultado{filteredApps.length !== 1 ? 's' : ''} para <strong>"{search}"</strong>
            </p>
          )}
          {loading ? (
            <div className="ag-loading">Cargando apps...</div>
          ) : filteredApps.length === 0 ? (
            <div className="ag-empty">
              <h2>{search ? 'Sin resultados' : 'No hay apps en esta categoría'}</h2>
              <p>{search ? 'Probá con otra búsqueda.' : 'Sé el primero en publicar tu app.'}</p>
              {!search && (
                <Link href="/auth" className="ag-btn ag-btn-primary">Publicar app</Link>
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
                      <span className="ag-app-category">{app.category}</span>
                      <span className="ag-app-price">{formatPrice(app.price, app.currency, app.pricing_type)}</span>
                    </div>
                  </div>
                  <div className="ag-app-card-actions">
                    <Link href={`/marketplace/${app.id}`} className="ag-btn ag-btn-ghost ag-btn-card">
                      Ver detalle
                    </Link>
                    <a
                      href={app.app_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ag-btn ag-btn-primary ag-btn-card"
                    >
                      Ir a la app →
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
          <p>© 2026 AppGrid. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
