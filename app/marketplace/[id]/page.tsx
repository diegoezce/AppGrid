'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AppRating from '@/app/components/AppRating'
import './app-detail.css'

interface App {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  app_url: string
  price: string
  rating: number
  rating_count: number
  created_at: string
}

export default function AppDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/apps/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(setApp)
      .catch(() => router.replace('/marketplace'))
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) {
    return (
      <div className="ag-detail-loading">
        <div className="ag-detail-spinner" />
      </div>
    )
  }

  if (!app) return null

  const isFree = app.price === '0' || app.price === '0.00' || !app.price

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
            <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-btn-sm">
              ← Marketplace
            </Link>
          </div>
        </div>
      </nav>

      <div className="ag-detail-container ag-container">

        {/* Header */}
        <div className="ag-detail-header">
          <div className="ag-detail-logo">
            {app.image_url
              ? <img src={app.image_url} alt={app.title} />
              : <span className="ag-detail-logo-placeholder">{app.title[0]}</span>
            }
          </div>

          <div className="ag-detail-meta">
            <span className="ag-app-category">{app.category}</span>
            <h1 className="ag-h1">{app.title}</h1>
            <AppRating
              rating={app.rating || 0}
              count={app.rating_count || 0}
              appId={app.id}
              onRate={(newRating, newCount) =>
                setApp(prev => prev ? { ...prev, rating: newRating, rating_count: newCount } : prev)
              }
            />
          </div>

          <div className="ag-detail-cta">
            <div className="ag-detail-price">
              {isFree ? <span className="ag-price-free">Gratis</span> : <span className="ag-price-paid">${app.price} <small>USD</small></span>}
            </div>
            <a
              href={app.app_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ag-btn ag-btn-primary ag-btn-lg ag-detail-btn"
            >
              Ir a la app →
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="ag-detail-divider" />

        {/* Description */}
        <div className="ag-detail-body">
          <h2 className="ag-detail-section-title">Sobre esta app</h2>
          <p className="ag-detail-description">{app.description}</p>
        </div>

      </div>

      <footer className="ag-footer" style={{ marginTop: '6rem' }}>
        <div className="ag-container">
          <p>© 2026 AppGrid. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
