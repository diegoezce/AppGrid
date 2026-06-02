'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/app/i18n/useLanguage'
import './CreateUpdateFAB.css'

interface App {
  id: string
  title: string
}

interface CreateUpdateFABProps {
  userId: string
}

type ActiveModal = 'update' | 'profile' | null

interface ProfileForm {
  display_name: string
  username: string
  bio: string
}

export default function CreateUpdateFAB({ userId }: CreateUpdateFABProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  // Update state
  const [apps, setApps] = useState<App[]>([])
  const [appsLoaded, setAppsLoaded] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Profile state
  const [profileForm, setProfileForm] = useState<ProfileForm>({ display_name: '', username: '', bio: '' })
  const [profileLoaded, setProfileLoaded] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const { t } = useLanguage()
  const router = useRouter()
  const dialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  useEffect(() => {
    if (activeModal === 'update' && !appsLoaded) {
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
  }, [activeModal, userId, appsLoaded])

  useEffect(() => {
    if (activeModal === 'profile' && !profileLoaded) {
      supabase
        .from('users')
        .select('display_name, username, bio')
        .eq('id', userId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProfileForm({
              display_name: data.display_name || '',
              username: data.username || '',
              bio: data.bio || '',
            })
          }
          setProfileLoaded(true)
        })
    }
  }, [activeModal, userId, profileLoaded])

  const handleNewApp = () => {
    setIsOpen(false)
    router.push('/admin')
  }

  const openModal = (modal: ActiveModal) => {
    setIsOpen(false)
    setError('')
    setSuccessMsg('')
    setActiveModal(modal)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setTitle('')
    setContent('')
    setError('')
    setSuccessMsg('')
  }

  const handleSubmitUpdate = async (e: React.FormEvent) => {
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
        setError(data.error || t('createUpdate.error'))
        return
      }
      handleCloseModal()
      router.refresh()
    } catch {
      setError(t('createUpdate.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ...profileForm })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('editProfile.error'))
        return
      }
      setSuccessMsg(t('editProfile.saved'))
      setTimeout(handleCloseModal, 1200)
    } catch {
      setError(t('editProfile.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleCloseModal()
  }

  return (
    <>
      {/* Speed dial */}
      <div className="ag-fab-wrapper" ref={dialRef}>
        {isOpen && (
          <div className="ag-fab-dial">
            <button className="ag-fab-action" onClick={() => openModal('profile')}>
              <span className="ag-fab-action-label">{t('editProfile.action')}</span>
              <span className="ag-fab-action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </button>
            <button className="ag-fab-action" onClick={() => openModal('update')}>
              <span className="ag-fab-action-label">{t('createUpdate.newUpdate')}</span>
              <span className="ag-fab-action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </span>
            </button>
            <button className="ag-fab-action" onClick={handleNewApp}>
              <span className="ag-fab-action-label">{t('createUpdate.newApp')}</span>
              <span className="ag-fab-action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M17.5 14v6M14.5 17h6" />
                </svg>
              </span>
            </button>
          </div>
        )}
        <button
          className={`ag-fab ${isOpen ? 'ag-fab--open' : ''}`}
          onClick={() => setIsOpen(o => !o)}
          aria-label={t('createUpdate.new')}
          aria-expanded={isOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Create update modal */}
      {activeModal === 'update' && (
        <div className="ag-modal-overlay" onClick={handleOverlayClick}>
          <div className="ag-modal" role="dialog" aria-modal="true">
            <div className="ag-modal-header">
              <h2>{t('createUpdate.title')}</h2>
              <button className="ag-modal-close" onClick={handleCloseModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {appsLoaded && apps.length === 0 ? (
              <p className="ag-modal-no-apps">{t('createUpdate.noApps')}</p>
            ) : (
              <form onSubmit={handleSubmitUpdate} className="ag-modal-form">
                <div className="ag-modal-field">
                  <label htmlFor="fab-app">{t('createUpdate.appLabel')}</label>
                  <select id="fab-app" value={selectedAppId} onChange={e => setSelectedAppId(e.target.value)} className="ag-modal-select">
                    {apps.map(app => <option key={app.id} value={app.id}>{app.title}</option>)}
                  </select>
                </div>
                <div className="ag-modal-field">
                  <label htmlFor="fab-title">{t('createUpdate.updateTitle')}</label>
                  <input id="fab-title" type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder={t('createUpdate.titlePlaceholder')} maxLength={100} className="ag-input" required autoFocus />
                </div>
                <div className="ag-modal-field">
                  <label htmlFor="fab-content">{t('createUpdate.contentLabel')}</label>
                  <textarea id="fab-content" value={content} onChange={e => setContent(e.target.value)}
                    placeholder={t('createUpdate.contentPlaceholder')} maxLength={500} rows={4} className="ag-textarea" required />
                  <span className="ag-modal-char-count">{content.length}/500</span>
                </div>
                {error && <p className="ag-modal-error">{error}</p>}
                <div className="ag-modal-actions">
                  <button type="button" onClick={handleCloseModal} className="ag-btn ag-btn-ghost ag-btn-sm">{t('createUpdate.cancel')}</button>
                  <button type="submit" disabled={isSubmitting || !title.trim() || !content.trim() || !selectedAppId} className="ag-btn ag-btn-primary ag-btn-sm">
                    {isSubmitting ? t('createUpdate.publishing') : t('createUpdate.publish')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit profile modal */}
      {activeModal === 'profile' && (
        <div className="ag-modal-overlay" onClick={handleOverlayClick}>
          <div className="ag-modal" role="dialog" aria-modal="true">
            <div className="ag-modal-header">
              <h2>{t('editProfile.title')}</h2>
              <button className="ag-modal-close" onClick={handleCloseModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitProfile} className="ag-modal-form">
              <div className="ag-modal-field">
                <label htmlFor="prof-name">{t('editProfile.displayName')}</label>
                <input id="prof-name" type="text" value={profileForm.display_name}
                  onChange={e => setProfileForm(p => ({ ...p, display_name: e.target.value }))}
                  placeholder={t('editProfile.displayNamePlaceholder')} maxLength={60} className="ag-input" autoFocus />
              </div>
              <div className="ag-modal-field">
                <label htmlFor="prof-username">{t('editProfile.username')}</label>
                <input id="prof-username" type="text" value={profileForm.username}
                  onChange={e => setProfileForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  placeholder={t('editProfile.usernamePlaceholder')} maxLength={30} className="ag-input" />
                <span className="ag-modal-char-count">/builders/{profileForm.username || '…'}</span>
              </div>
              <div className="ag-modal-field">
                <label htmlFor="prof-bio">{t('editProfile.bio')}</label>
                <textarea id="prof-bio" value={profileForm.bio}
                  onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder={t('editProfile.bioPlaceholder')} maxLength={200} rows={3} className="ag-textarea" />
                <span className="ag-modal-char-count">{profileForm.bio.length}/200</span>
              </div>
              {error && <p className="ag-modal-error">{error}</p>}
              {successMsg && <p className="ag-modal-success">{successMsg}</p>}
              <div className="ag-modal-actions">
                <button type="button" onClick={handleCloseModal} className="ag-btn ag-btn-ghost ag-btn-sm">{t('editProfile.cancel')}</button>
                <button type="submit" disabled={isSubmitting} className="ag-btn ag-btn-primary ag-btn-sm">
                  {isSubmitting ? t('editProfile.saving') : t('editProfile.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
