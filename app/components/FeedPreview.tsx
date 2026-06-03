'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'
import './FeedPreview.css'

interface PreviewUpdate {
  id: string
  title: string
  content: string
  created_at: string
  app: { id: string; title: string }
  author: { display_name: string; username: string; avatar_url?: string }
}

function timeAgo(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export default function FeedPreview() {
  const [updates, setUpdates] = useState<PreviewUpdate[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/updates?limit=4')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setUpdates(data.filter(u => u.app && u.author).slice(0, 4))
      })
      .catch(() => {})
  }, [])

  if (updates.length === 0) return null

  return (
    <section className="ag-section ag-feed-preview-section">
      <div className="ag-container">
        <div className="ag-feed-preview-header">
          <div>
            <span className="ag-feed-preview-eyebrow">
              <span className="ag-dot ag-dot-live" />
              {t('landing.feedLive')}
            </span>
            <h2 className="ag-h2">{t('landing.feedTitle')}</h2>
            <p className="ag-section-sub">{t('landing.feedSubtitle')}</p>
          </div>
          <Link href="/feed" className="ag-btn ag-btn-ghost ag-btn-sm ag-feed-preview-cta-desktop">
            {t('landing.feedCta')} →
          </Link>
        </div>

        <div className="ag-feed-preview-grid">
          {updates.map(u => (
            <div key={u.id} className="ag-feed-preview-card">
              <div className="ag-feed-preview-card-top">
                <div className="ag-feed-preview-avatar">
                  {u.author.avatar_url
                    ? <img src={u.author.avatar_url} alt={u.author.display_name} />
                    : <span>{(u.author.display_name || u.author.username || '?')[0].toUpperCase()}</span>
                  }
                </div>
                <div className="ag-feed-preview-meta">
                  <span className="ag-feed-preview-author">{u.author.display_name || u.author.username}</span>
                  <span className="ag-feed-preview-app">{u.app.title}</span>
                </div>
                <span className="ag-feed-preview-time">{timeAgo(u.created_at)}</span>
              </div>
              <p className="ag-feed-preview-title">{u.title}</p>
              <p className="ag-feed-preview-content">{u.content}</p>
            </div>
          ))}
        </div>

        <div className="ag-feed-preview-cta-mobile">
          <Link href="/feed" className="ag-btn ag-btn-ghost ag-btn-sm">
            {t('landing.feedCta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
