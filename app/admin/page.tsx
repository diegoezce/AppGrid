'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'
import LanguageToggle from '@/app/components/LanguageToggle'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DescriptionEditor from './DescriptionEditor'
import './admin.css'

interface App {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  app_url: string
  price: string
  pricing_type?: string
  currency?: string
  created_at?: string
}

function formatPrice(price: string, currency?: string, t?: any) {
  const freeLabel = t ? t('pricing.free') : 'Free'
  if (price === '0' || price === '0.00' || !price) return freeLabel

  const localeMap: { [key: string]: string } = {
    USD: 'en-US',
    ARS: 'es-AR',
    MXN: 'es-MX',
  }
  const locale = localeMap[currency || 'USD'] || 'en-US'

  const numPrice = parseFloat(price)
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice)

  return `$${formatted}`
}

const emptyForm = {
  title: '',
  description: '',
  category: 'general',
  image_url: '',
  app_url: '',
  payment_url: '',
  price: '0',
  pricing_type: 'one_time',
  currency: 'USD',
  keywords: '',
}

interface Purchase {
  id: string
  app_id: string
  buyer_email: string
  status: 'pending' | 'approved' | 'access_sent'
  created_at: string
  apps: { title: string }
}

interface AppUpdate {
  id: string
  app_id: string
  title: string
  content: string
  likes_count: number
  created_at: string
}

const emptyUpdateForm = {
  app_id: '',
  title: '',
  content: '',
}

export default function AdminPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [formData, setFormData] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [apps, setApps] = useState<App[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'form' | 'apps' | 'buyers' | 'updates'>('form')
  const [showForm, setShowForm] = useState(true)
  const [updates, setUpdates] = useState<AppUpdate[]>([])
  const [updateForm, setUpdateForm] = useState(emptyUpdateForm)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

  const getCategoryLabel = (cat: string): string => {
    return t(`categories.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/auth')
      } else {
        setUser(data.session.user)
        setLoadingAuth(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') router.replace('/auth')
      if (session) setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    if (user) {
      fetchApps()
      fetchPurchases()
      fetchUpdates()
    }
  }, [user])

  const fetchApps = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/apps?user_id=${user.id}`)
      if (response.ok) setApps(await response.json())
    } catch (error) {
      console.error('Error fetching apps:', error)
    }
  }

  const fetchPurchases = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/purchases?user_id=${user.id}`)
      if (response.ok) setPurchases(await response.json())
    } catch (error) {
      console.error('Error fetching purchases:', error)
    }
  }

  const fetchUpdates = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/updates?user_id=${user.id}`)
      if (response.ok) setUpdates(await response.json())
    } catch (error) {
      console.error('Error fetching updates:', error)
    }
  }

  const handleUpdateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setUpdateForm(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setUpdateMessage('')

    try {
      const response = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateForm, author_id: user?.id }),
      })

      if (response.ok) {
        setUpdateMessage('✅ Update published!')
        setUpdateForm(emptyUpdateForm)
        fetchUpdates()
        setTimeout(() => setUpdateMessage(''), 3000)
      } else {
        const data = await response.json()
        setUpdateMessage(`❌ ${data.error || 'Error publishing update'}`)
      }
    } catch {
      setUpdateMessage('❌ Connection error')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteUpdate = async (id: string) => {
    if (!confirm('Delete this update?')) return
    try {
      const response = await fetch(`/api/updates?id=${id}&author_id=${user?.id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchUpdates()
      }
    } catch (error) {
      console.error('Error deleting update:', error)
    }
  }

  const updatePurchaseStatus = async (purchaseId: string, status: string) => {
    await fetch(`/api/purchases/${purchaseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchPurchases()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? { ...formData, id: editingId, user_id: user?.id }
        : { ...formData, user_id: user?.id }

      const response = await fetch('/api/apps', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setMessage(editingId ? t('admin.appUpdated') : t('admin.appSuccess'))
        setFormData(emptyForm)
        setEditingId(null)
        fetchApps()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(t('admin.appError'))
      }
    } catch {
      setMessage(t('admin.connectionError'))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (app: App & { payment_url?: string; pricing_type?: string }) => {
    setFormData({
      title: app.title,
      description: app.description,
      category: app.category,
      image_url: app.image_url || '',
      app_url: app.app_url,
      payment_url: app.payment_url || '',
      price: app.price,
      pricing_type: app.pricing_type || 'one_time',
      currency: (app as any).currency || 'USD',
      keywords: (app as any).keywords || '',
    })
    setEditingId(app.id)
    setActiveTab('form')
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return
    try {
      const response = await fetch(`/api/apps?id=${id}&user_id=${user?.id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessage(t('admin.appDeleted'))
        fetchApps()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(t('admin.deleteError'))
      }
    } catch {
      setMessage(t('admin.connectionError'))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setActiveTab('apps')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loadingAuth) {
    return <div className="ag-admin-loading">{t('admin.loading')}</div>
  }

  return (
    <div className="ag-admin-container">
      <div className="ag-admin-header">
        <div>
          <h1>{t('admin.title')}</h1>
          <p>{user?.email} · {apps.length} {t('admin.appsPublished')}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LanguageToggle />
          <Link href="/marketplace" className="ag-btn ag-btn-ghost ag-btn-sm">
            {t('admin.viewMarketplace')}
          </Link>
          <button className="ag-btn ag-btn-ghost ag-btn-sm" onClick={handleLogout}>
            {t('admin.logout')}
          </button>
        </div>
      </div>

      <div className="ag-admin-content">
        <div className="ag-admin-tabs">
          <button
            className={`ag-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => { setActiveTab('form'); setShowForm(true) }}
          >
            {editingId ? t('admin.editApp') : t('admin.newApp')}
          </button>
          <button
            className={`ag-tab ${activeTab === 'apps' ? 'active' : ''}`}
            onClick={() => { setActiveTab('apps'); setShowForm(false) }}
          >
            {t('admin.myApps')} ({apps.length})
          </button>
          <button
            className={`ag-tab ${activeTab === 'buyers' ? 'active' : ''}`}
            onClick={() => setActiveTab('buyers')}
          >
            {t('admin.buyers')} {purchases.filter(p => p.status === 'pending').length > 0 && (
              <span className="ag-tab-badge">{purchases.filter(p => p.status === 'pending').length}</span>
            )}
          </button>
          <button
            className={`ag-tab ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            Updates ({updates.length})
          </button>
        </div>

        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="ag-admin-form">
            <div className="ag-form-group">
              <label htmlFor="title">{t('admin.appName')} *</label>
              <input
                id="title" type="text" name="title"
                placeholder={t('admin.appNamePlaceholder')}
                value={formData.title} onChange={handleChange}
                className="ag-input" required
              />
            </div>

            <div className="ag-form-group">
              <label htmlFor="description">{t('admin.description')} *</label>
              <DescriptionEditor
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>

            <div className="ag-form-group">
              <label htmlFor="keywords">{t('admin.keywords')}</label>
              <input
                id="keywords" type="text" name="keywords"
                placeholder={t('admin.keywordsPlaceholder')}
                value={(formData as any).keywords} onChange={handleChange}
                className="ag-input"
              />
              <small style={{ color: 'var(--ag-ink-3)', fontSize: '0.8rem' }}>
                {t('admin.keywordsHelp')}
              </small>
            </div>

            <div className="ag-form-row">
              <div className="ag-form-group">
                <label htmlFor="category">{t('admin.category')}</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="ag-select">
                  {['general', 'productivity', 'health', 'education', 'finance', 'sports', 'community', 'other'].map(cat => (
                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                  ))}
                </select>
              </div>
              <div className="ag-form-group">
                <label htmlFor="price">{t('admin.price')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select id="currency" name="currency" value={(formData as any).currency} onChange={handleChange} className="ag-select" style={{ width: '90px', flexShrink: 0 }}>
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                    <option value="MXN">MXN</option>
                  </select>
                  <input
                    id="price" type="number" name="price"
                    placeholder={t('admin.priceFreeNote')}
                    value={formData.price} onChange={handleChange}
                    className="ag-input" min="0" step="0.01"
                  />
                </div>
              </div>
              <div className="ag-form-group">
                <label htmlFor="pricing_type">{t('admin.pricingType')}</label>
                <select id="pricing_type" name="pricing_type" value={formData.pricing_type} onChange={handleChange} className="ag-select">
                  <option value="one_time">{t('admin.oneTime')}</option>
                  <option value="weekly">{t('admin.weeklySub')}</option>
                  <option value="monthly">{t('admin.monthlySub')}</option>
                  <option value="yearly">{t('admin.yearlySub')}</option>
                </select>
              </div>
            </div>

            <div className="ag-form-group">
              <label htmlFor="image_url">{t('admin.image')}</label>
              <input
                id="image_url" type="url" name="image_url"
                placeholder={t('admin.imagePlaceholder')}
                value={formData.image_url} onChange={handleChange}
                className="ag-input"
              />
            </div>

            <div className="ag-form-group">
              <label htmlFor="app_url">{t('admin.appUrl')} *</label>
              <input
                id="app_url" type="url" name="app_url"
                placeholder={t('admin.appUrlPlaceholder')}
                value={formData.app_url} onChange={handleChange}
                className="ag-input" required
              />
            </div>

            <div className="ag-form-group">
              <label htmlFor="payment_url">{t('admin.paymentUrl')}</label>
              <input
                id="payment_url" type="url" name="payment_url"
                placeholder={t('admin.paymentUrlPlaceholder')}
                value={formData.payment_url} onChange={handleChange}
                className="ag-input"
              />
              <small style={{ color: 'var(--ag-ink-3)', fontSize: '0.8rem' }}>
                {t('admin.paymentUrlHelp')}
              </small>
            </div>

            {message && (
              <p className={`ag-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                className="ag-btn ag-btn-primary"
                style={{ flex: 1, padding: '1rem' }}
                disabled={loading}
              >
                {loading ? t('admin.saving') : editingId ? t('admin.saveChanges') : t('admin.publishApp')}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="ag-btn ag-btn-ghost"
                  style={{ padding: '1rem', minWidth: '120px' }}
                  onClick={handleCancel}
                >
                  {t('admin.cancel')}
                </button>
              )}
            </div>
          </form>
        )}

        {activeTab === 'apps' && (
          <div className="ag-apps-list">
            {apps.length === 0 ? (
              <div className="ag-empty-state">
                <p>{t('admin.noApps')}</p>
                <button className="ag-btn ag-btn-primary" onClick={() => setActiveTab('form')}>
                  {t('admin.createFirst')}
                </button>
              </div>
            ) : (
              <table className="ag-table">
                <thead>
                  <tr>
                    <th>{t('admin.app')}</th>
                    <th>{t('admin.category')}</th>
                    <th>{t('admin.price')}</th>
                    <th>{t('admin.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.title}</strong><br />
                        <small>{app.description.substring(0, 50)}...</small>
                      </td>
                      <td>{getCategoryLabel(app.category)}</td>
                      <td>{formatPrice(app.price, app.currency, t)}</td>
                      <td className="ag-table-actions">
                        <button className="ag-btn-sm ag-btn-edit" onClick={() => handleEdit(app)}>{t('admin.edit')}</button>
                        <button className="ag-btn-sm ag-btn-delete" onClick={() => handleDelete(app.id)}>{t('admin.delete')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'buyers' && (
          <div className="ag-apps-list">
            {purchases.length === 0 ? (
              <div className="ag-empty-state">
                <p>{t('admin.noBuyers')}</p>
              </div>
            ) : (
              <table className="ag-table">
                <thead>
                  <tr>
                    <th>{t('admin.email')}</th>
                    <th>{t('admin.app')}</th>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.buyer_email}</strong></td>
                      <td>{p.apps?.title}</td>
                      <td><small>{new Date(p.created_at).toLocaleDateString('en-US')}</small></td>
                      <td>
                        <span className={`ag-status ag-status-${p.status}`}>
                          {p.status === 'pending' && t('admin.pending')}
                          {p.status === 'approved' && t('admin.approved')}
                          {p.status === 'access_sent' && t('admin.accessSent')}
                        </span>
                      </td>
                      <td className="ag-table-actions">
                        {p.status === 'pending' && (
                          <button
                            className="ag-btn-sm ag-btn-edit"
                            onClick={() => updatePurchaseStatus(p.id, 'approved')}
                          >
                            {t('admin.approve')}
                          </button>
                        )}
                        {p.status === 'approved' && (
                          <button
                            className="ag-btn-sm ag-btn-edit"
                            onClick={() => updatePurchaseStatus(p.id, 'access_sent')}
                          >
                            {t('admin.markAccessSent')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="ag-updates-admin">
            <form onSubmit={handleUpdateSubmit} className="ag-admin-form" style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
                New Update
              </h3>

              <div className="ag-form-group">
                <label htmlFor="update_app_id">App *</label>
                {apps.length === 0 ? (
                  <p style={{ color: 'var(--ag-ink-3)', fontSize: '0.9rem' }}>
                    You need to publish an app first.
                  </p>
                ) : (
                  <select
                    id="update_app_id"
                    name="app_id"
                    value={updateForm.app_id}
                    onChange={handleUpdateFormChange}
                    className="ag-select"
                    required
                  >
                    <option value="">Select an app...</option>
                    {apps.map(app => (
                      <option key={app.id} value={app.id}>{app.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="ag-form-group">
                <label htmlFor="update_title">Title *</label>
                <input
                  id="update_title"
                  type="text"
                  name="title"
                  placeholder="e.g. Added recurring appointments"
                  value={updateForm.title}
                  onChange={handleUpdateFormChange}
                  className="ag-input"
                  required
                />
              </div>

              <div className="ag-form-group">
                <label htmlFor="update_content">Content *</label>
                <textarea
                  id="update_content"
                  name="content"
                  placeholder="Describe what you shipped..."
                  value={updateForm.content}
                  onChange={handleUpdateFormChange}
                  className="ag-textarea"
                  rows={4}
                  required
                />
              </div>

              {updateMessage && (
                <p className={`ag-message ${updateMessage.startsWith('✅') ? 'success' : 'error'}`}>
                  {updateMessage}
                </p>
              )}

              <button
                type="submit"
                className="ag-btn ag-btn-primary"
                style={{ width: '100%', padding: '1rem' }}
                disabled={updateLoading || apps.length === 0}
              >
                {updateLoading ? 'Publishing...' : 'Publish Update'}
              </button>
            </form>

            {updates.length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
                  Your Updates
                </h3>
                <table className="ag-table">
                  <thead>
                    <tr>
                      <th>Update</th>
                      <th>App</th>
                      <th>Date</th>
                      <th>Likes</th>
                      <th>{t('admin.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updates.map(update => {
                      const app = apps.find(a => a.id === update.app_id)
                      return (
                        <tr key={update.id}>
                          <td>
                            <strong>{update.title}</strong><br />
                            <small>{update.content.substring(0, 60)}{update.content.length > 60 ? '...' : ''}</small>
                          </td>
                          <td>{app?.title || '—'}</td>
                          <td><small>{new Date(update.created_at).toLocaleDateString('en-US')}</small></td>
                          <td>{update.likes_count}</td>
                          <td className="ag-table-actions">
                            <button
                              className="ag-btn-sm ag-btn-delete"
                              onClick={() => handleDeleteUpdate(update.id)}
                            >
                              {t('admin.delete')}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {updates.length === 0 && (
              <div className="ag-empty-state">
                <p>No updates yet. Share what you've been building!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
