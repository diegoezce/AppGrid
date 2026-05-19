'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './auth.css'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ text: error.message, ok: false })
      } else {
        router.push('/admin')
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ text: error.message, ok: false })
      } else {
        setMessage({ text: 'Revisá tu email para confirmar la cuenta.', ok: true })
      }
    }

    setLoading(false)
  }

  return (
    <div className="ag-auth-page">
      <div className="ag-auth-card">
        <Link href="/" className="ag-logo ag-auth-logo">
          <span className="ag-logo-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="ag-logo-word">AppGrid</span>
        </Link>

        <div className="ag-auth-tabs">
          <button
            className={`ag-auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setMessage(null) }}
          >
            Iniciar sesión
          </button>
          <button
            className={`ag-auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setMessage(null) }}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ag-auth-form">
          <div className="ag-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="ag-input"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="ag-form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="ag-input"
              placeholder={tab === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {message && (
            <p className={`ag-auth-message ${message.ok ? 'success' : 'error'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            className="ag-btn ag-btn-primary ag-auth-submit"
            disabled={loading}
          >
            {loading ? 'Cargando...' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
