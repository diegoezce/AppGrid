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
  rating: number
  rating_count: number
  created_at?: string
}

function formatPrice(price: string, currency: string, pricingType: string) {
  if (price === '0' || price === '0.00' || !price) return 'Gratis'
  const symbols: Record<string, string> = { USD: 'USD', ARS: 'ARS', MXN: 'MXN' }
  const suffix = pricingType === 'weekly' ? '/sem' : pricingType === 'monthly' ? '/mes' : pricingType === 'yearly' ? '/año' : ''
  return `$${price} ${symbols[currency] || currency}${suffix}`
}

export default function MarketplacePage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps')
        if (response.ok) {
          const data = await response.json()
          setApps(data)
        }
      } catch (error) {
        console.error('Error fetching apps:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [])

  const categories = Array.from(new Set(apps.map(app => app.category)))
  const filteredApps = selectedCategory
    ? apps.filter(app => app.category === selectedCategory)
    : apps

  return (
    <main>
      {/* Nav */}
      <nav className="ag-nav">
        <div className="ag-container ag-nav-inner">
          <Link href="/" className="ag-logo">
            <span className="ag-logo-mark" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="ag-logo-word">AppGrid</span>
          </Link>
          <div className="ag-nav-actions">
            <Link href="/admin" className="ag-btn ag-btn-primary ag-btn-sm">
              Publicar app
            </Link>
          </div>
        </div>
      </nav>

      {/* Marketplace Header */}
      <section className="ag-marketplace-header">
        <div className="ag-container">
          <h1 className="ag-h1">Marketplace</h1>
          <p className="ag-lede">Descubre las mejores apps creadas por developers en LATAM y España.</p>
        </div>
      </section>

      {/* Filters */}
      {categories.length > 0 && (
        <div className="ag-marketplace-filters">
          <div className="ag-container">
            <button
              className={`ag-filter-btn ${selectedCategory === null ? 'active' : ''}`}
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

      {/* Apps Grid */}
      <section className="ag-marketplace-content">
        <div className="ag-container">
          {loading ? (
            <div className="ag-loading">Cargando apps...</div>
          ) : filteredApps.length === 0 ? (
            <div className="ag-empty">
              <h2>No hay apps en esta categoría</h2>
              <p>Sé el primero en publicar tu app</p>
              <Link href="/admin" className="ag-btn ag-btn-primary">
                Publicar app
              </Link>
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
                      onRate={(newRating, newCount) => {
                        setApps(prev => prev.map(a =>
                          a.id === app.id ? { ...a, rating: newRating, rating_count: newCount } : a
                        ))
                      }}
                    />
                    <div className="ag-app-footer">
                      <span className="ag-app-category">{app.category}</span>
                      <span className="ag-app-price">
                        {formatPrice(app.price, app.currency, app.pricing_type)}
                      </span>
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

      {/* Footer */}
      <footer className="ag-footer">
        <div className="ag-container">
          <p>© 2026 AppGrid. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
