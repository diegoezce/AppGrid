'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'
import { supabase } from '@/lib/supabase'
import './auth.css'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/admin'
  const { t } = useLanguage()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirectTo)
    })
  }, [router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ text: error.message, ok: false })
      } else {
        router.push(redirectTo)
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ text: error.message, ok: false })
      } else {
        setMessage({ text: t('auth.confirmEmail'), ok: true })
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
            {t('auth.login')}
          </button>
          <button
            className={`ag-auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setMessage(null) }}
          >
            {t('auth.signup')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ag-auth-form">
          <div className="ag-form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              className="ag-input"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="ag-form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              className="ag-input"
              placeholder={tab === 'signup' ? t('auth.minCharacters') : t('auth.passwordPlaceholder')}
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
            {loading ? t('auth.loading') : tab === 'login' ? t('auth.submit') : t('auth.submitSignup')}
          </button>
        </form>
      </div>
    </div>
  )
}
