'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/app/i18n/useLanguage'
import './PostComposer.css'

interface App {
  id: string
  title: string
}

interface PostComposerProps {
  userId: string
  username: string | null
  onPosted: (newUpdate: any) => void
}

export default function PostComposer({ userId, username, onPosted }: PostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [apps, setApps] = useState<App[]>([])
  const [appsLoaded, setAppsLoaded] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { t } = useLanguage()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!appsLoaded) {
      fetch(`/api/apps?user_id=${userId}`)
        .then(r => r.json())
        .then(data => {
          const list: App[] = Array.isArray(data) ? data : []
          setApps(list)
          if (list.length > 0) setSelectedAppId(list[0].id)
          setAppsLoaded(true)
        })
        .catch(() => setAppsLoaded(true))
    }
  }, [userId, appsLoaded])

  // Close on outside click
  useEffect(() => {
    if (!isExpanded) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (!title && !content) setIsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isExpanded, title, content])

  const handleFocus = () => {
    setIsExpanded(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppId || !title.trim() || !content.trim()) return
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: selectedAppId, author_id: userId, title: title.trim(), content: content.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('composer.error'))
        return
      }
      const created = await res.json()
      // Enrich with app + author for immediate render
      const selectedApp = apps.find(a => a.id === selectedAppId)
      onPosted({
        ...created,
        app: { id: selectedApp?.id, title: selectedApp?.title },
        author: { id: userId, display_name: username || '', username: username || '', avatar_url: null },
        liked_by_user: false,
      })
      setTitle('')
      setContent('')
      setIsExpanded(false)
    } catch {
      setError(t('composer.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const avatarInitial = (username || '?')[0].toUpperCase()

  // Don't render if user has no apps
  if (appsLoaded && apps.length === 0) return null

  return (
    <div className={`ag-composer ${isExpanded ? 'ag-composer--expanded' : ''}`} ref={wrapperRef}>
      <div className="ag-composer-avatar">{avatarInitial}</div>

      {!isExpanded ? (
        <button className="ag-composer-trigger" onClick={handleFocus}>
          {t('composer.placeholder')}
        </button>
      ) : (
        <form className="ag-composer-form" onSubmit={handleSubmit}>
          <div className="ag-composer-fields">
            <select
              value={selectedAppId}
              onChange={e => setSelectedAppId(e.target.value)}
              className="ag-composer-select"
            >
              {apps.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('composer.titlePlaceholder')}
              maxLength={100}
              className="ag-composer-title"
              required
            />
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('composer.contentPlaceholder')}
            maxLength={500}
            rows={3}
            className="ag-composer-textarea"
            required
          />
          {error && <p className="ag-composer-error">{error}</p>}
          <div className="ag-composer-actions">
            <span className="ag-composer-count">{content.length}/500</span>
            <button
              type="button"
              onClick={() => { setIsExpanded(false); setTitle(''); setContent(''); setError('') }}
              className="ag-btn ag-btn-ghost ag-btn-sm"
            >
              {t('composer.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim() || !selectedAppId}
              className="ag-btn ag-btn-primary ag-btn-sm"
            >
              {isSubmitting ? t('composer.posting') : t('composer.post')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
