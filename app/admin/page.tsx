'use client'

import { useState } from 'react'
import Link from 'next/link'
import './admin.css'

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    image_url: '',
    app_url: '',
    price: '0',
    password: '',
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPassword, setAuthPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

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
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('✅ App publicada exitosamente!')
        setFormData({
          title: '',
          description: '',
          category: 'general',
          image_url: '',
          app_url: '',
          price: '0',
          password: '',
        })
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Error al publicar la app')
      }
    } catch (error) {
      setMessage('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
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
          <p>Publica tu app en AppGrid</p>
        </div>
        <button className="ag-btn ag-btn-ghost" onClick={() => setIsAuthenticated(false)}>
          Salir
        </button>
      </div>

      <div className="ag-admin-content">
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

          <button
            type="submit"
            className="ag-btn ag-btn-primary"
            style={{ width: '100%', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Publicando...' : '✨ Publicar app'}
          </button>
        </form>
      </div>
    </div>
  )
}
