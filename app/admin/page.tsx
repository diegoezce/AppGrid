'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './admin.css'

interface App {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  app_url: string
  price: string
  created_at?: string
}

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    image_url: '',
    app_url: '',
    price: '0',
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPassword, setAuthPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [apps, setApps] = useState<App[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(true)

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  useEffect(() => {
    if (isAuthenticated) {
      fetchApps()
    }
  }, [isAuthenticated])

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/apps')
      if (response.ok) {
        const data = await response.json()
        setApps(data)
      }
    } catch (error) {
      console.error('Error fetching apps:', error)
    }
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (authPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setAuthPassword('')
      setMessage('')
    } else {
      setMessage('❌ Contraseña incorrecta')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = '/api/apps'
      const body = editingId ? { ...formData, id: editingId } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setMessage(editingId ? '✅ App actualizada!' : '✅ App publicada!')
        setFormData({
          title: '',
          description: '',
          category: 'general',
          image_url: '',
          app_url: '',
          price: '0',
        })
        setEditingId(null)
        fetchApps()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Error al guardar la app')
      }
    } catch (error) {
      setMessage('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (app: App) => {
    setFormData({
      title: app.title,
      description: app.description,
      category: app.category,
      image_url: app.image_url || '',
      app_url: app.app_url,
      price: app.price,
    })
    setEditingId(app.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro que querés eliminar esta app?')) return

    try {
      const response = await fetch(`/api/apps?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('✅ App eliminada!')
        fetchApps()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Error al eliminar la app')
      }
    } catch (error) {
      setMessage('❌ Error de conexión')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      category: 'general',
      image_url: '',
      app_url: '',
      price: '0',
    })
    setShowForm(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="ag-admin-container">
        <div className="ag-admin-header">
          <Link href="/">← Volver al home</Link>
        </div>

        <div className="ag-auth-form">
          <h2>Acceso al Panel de Admin</h2>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="Ingresá la contraseña"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="ag-input"
            />
            <button type="submit" className="ag-btn ag-btn-primary" style={{ width: '100%' }}>
              Acceder
            </button>
          </form>
          {message && <p className={`ag-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="ag-admin-container">
      <div className="ag-admin-header">
        <div>
          <h1>Panel de Admin</h1>
          <p>{apps.length} apps publicadas</p>
        </div>
        <button className="ag-btn ag-btn-ghost" onClick={() => setIsAuthenticated(false)}>
          Salir
        </button>
      </div>

      <div className="ag-admin-content">
        {/* Tabs */}
        <div className="ag-admin-tabs">
          <button
            className={`ag-tab ${showForm ? 'active' : ''}`}
            onClick={() => { setShowForm(true); handleCancel(); }}
          >
            {editingId ? '✏️ Editar app' : '➕ Nueva app'}
          </button>
          <button
            className={`ag-tab ${!showForm ? 'active' : ''}`}
            onClick={() => setShowForm(false)}
          >
            📋 Ver todas ({apps.length})
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
        <form onSubmit={handleSubmit} className="ag-admin-form">
          <div className="ag-form-group">
            <label htmlFor="title">Nombre de la app *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="ej: GoPlanify"
              value={formData.title}
              onChange={handleChange}
              className="ag-input"
              required
            />
          </div>

          <div className="ag-form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe brevemente qué hace tu app..."
              value={formData.description}
              onChange={handleChange}
              className="ag-textarea"
              required
            />
          </div>

          <div className="ag-form-row">
            <div className="ag-form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="ag-select"
              >
                <option value="general">General</option>
                <option value="productivity">Productividad</option>
                <option value="health">Salud</option>
                <option value="education">Educación</option>
                <option value="finance">Finanzas</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div className="ag-form-group">
              <label htmlFor="price">Precio (USD)</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="0 = Gratis"
                value={formData.price}
                onChange={handleChange}
                className="ag-input"
                min="0"
                step="0.99"
              />
            </div>
          </div>

          <div className="ag-form-group">
            <label htmlFor="image_url">Logo/Imagen (URL)</label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={handleChange}
              className="ag-input"
            />
          </div>

          <div className="ag-form-group">
            <label htmlFor="app_url">URL de la app *</label>
            <input
              id="app_url"
              type="url"
              name="app_url"
              placeholder="https://tuapp.com"
              value={formData.app_url}
              onChange={handleChange}
              className="ag-input"
              required
            />
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
              {loading ? 'Guardando...' : editingId ? '💾 Guardar cambios' : '✨ Publicar app'}
            </button>
            {editingId && (
              <button
                type="button"
                className="ag-btn ag-btn-ghost"
                style={{ padding: '1rem', minWidth: '120px' }}
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        )}

        {/* Lista de apps */}
        {!showForm && (
          <div className="ag-apps-list">
            {apps.length === 0 ? (
              <div className="ag-empty-state">
                <p>No hay apps publicadas yet</p>
                <button className="ag-btn ag-btn-primary" onClick={() => setShowForm(true)}>
                  ➕ Crear la primera app
                </button>
              </div>
            ) : (
              <table className="ag-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.title}</strong><br />
                        <small>{app.description.substring(0, 50)}...</small>
                      </td>
                      <td>{app.category}</td>
                      <td>{app.price === '0' ? 'Gratis' : `$${app.price}`}</td>
                      <td className="ag-table-actions">
                        <button
                          className="ag-btn-sm ag-btn-edit"
                          onClick={() => handleEdit(app)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="ag-btn-sm ag-btn-delete"
                          onClick={() => handleDelete(app.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
