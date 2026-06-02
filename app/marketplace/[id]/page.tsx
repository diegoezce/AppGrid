'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'
import LanguageToggle from '@/app/components/LanguageToggle'
import AppRating from '@/app/components/AppRating'
import './app-detail.css'

const parseMarkdown = (text: string): string => {
  if (!text) return ''

  return text
    .split('\n\n')
    .map(paragraph => {
      let content = paragraph
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')

      if (content.includes('<li>')) {
        content = `<ul>${content}</ul>`
      }

      return `<p>${content}</p>`
    })
    .join('')
}

interface App {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  app_url: string
  payment_url?: string
  price: string
  pricing_type: string
  currency: string
  rating: number
  rating_count: number
  created_at: string
}

export default function AppDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useLanguage()
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'form' | 'paying'>('form')
  const [submitting, setSubmitting] = useState(false)

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

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!app) return
    setSubmitting(true)
    await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: app.id, buyer_email: email }),
    })
    setSubmitting(false)
    setStep('paying')
    window.open(app.payment_url, '_blank')
  }

  const closeModal = () => {
    setModalOpen(false)
    setStep('form')
    setEmail('')
  }

  if (loading) {
    return (
      <div className="ag-detail-loading">
        <div className="ag-detail-spinner" />
      </div>
    )
  }

  if (!app) return null

  const isFree = app.price === '0' || app.price === '0.00' || !app.price
  const currency = app.currency || 'USD'
  const periodLabel = app.pricing_type === 'weekly' ? ' / sem' : app.pricing_type === 'monthly' ? ' / mes' : app.pricing_type === 'yearly' ? ' / año' : ''

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
            <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-btn-sm">
              {t('appDetail.backMarketplace')}
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
              {isFree
                ? <span className="ag-price-free">{t('appDetail.free')}</span>
                : <span className="ag-price-paid">
                    ${app.price} <small>{currency}{periodLabel}</small>
                  </span>
              }
            </div>
            {isFree ? (
              <a
                href={app.app_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ag-btn ag-btn-primary ag-btn-lg ag-detail-btn"
              >
                {t('appDetail.goToApp')}
              </a>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={app.app_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ag-btn ag-btn-ghost ag-btn-lg ag-detail-btn"
                  style={{ flex: 1, minWidth: '150px' }}
                >
                  {t('appDetail.tryApp')}
                </a>
                {app.payment_url && (
                  <button
                    className="ag-btn ag-btn-primary ag-btn-lg ag-detail-btn"
                    onClick={() => setModalOpen(true)}
                    style={{ flex: 1, minWidth: '150px' }}
                  >
                    {t('appDetail.buyAccess')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="ag-detail-divider" />

        <div className="ag-detail-body">
          <h2 className="ag-detail-section-title">{t('appDetail.aboutApp')}</h2>
          <div
            className="ag-detail-description"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(app.description) }}
          />
        </div>

      </div>

      <footer className="ag-footer" style={{ marginTop: '6rem' }}>
        <div className="ag-container">
          <p>© 2026 AppGrid. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modal de compra */}
      {modalOpen && (
        <div className="ag-modal-overlay" onClick={closeModal}>
          <div className="ag-modal" onClick={e => e.stopPropagation()}>
            <button className="ag-modal-close" onClick={closeModal}>✕</button>

            {step === 'form' ? (
              <>
                <h2 className="ag-modal-title">{t('appDetail.buyTitle')} {app.title}</h2>
                <p className="ag-modal-sub">
                  {t('appDetail.checkoutMessage')}
                </p>
                <form onSubmit={handleBuy} className="ag-modal-form">
                  <input
                    type="email"
                    className="ag-input"
                    placeholder={t('appDetail.emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="ag-btn ag-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
                    disabled={submitting}
                  >
                    {submitting ? t('appDetail.loading') : `${t('appDetail.goToPayment')} $${app.price} ${currency}${periodLabel} →`}
                  </button>
                </form>
              </>
            ) : (
              <div className="ag-modal-success">
                <div className="ag-modal-check">✓</div>
                <h2 className="ag-modal-title">{t('appDetail.paymentStarted')}</h2>
                <p className="ag-modal-sub">
                  {t('appDetail.paymentMessage')} <strong>{email}</strong>.
                </p>
                <button className="ag-btn ag-btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={closeModal}>
                  {t('appDetail.close')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
