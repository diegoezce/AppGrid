'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LanguageToggle from './LanguageToggle'
import CreateUpdateFAB from './CreateUpdateFAB'
import { useLanguage } from '@/app/i18n/useLanguage'
import './navigation.css'

export default function Navigation() {
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setIsAuthenticated(true)
          setUserId(session.user.id)
          const { data } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .maybeSingle()

          if (data?.username) setUsername(data.username)
        }
      } catch (error) {
        console.error('Check auth error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <>
    <nav className="ag-nav">
      <div className="ag-container ag-nav-inner">
        <a href="/" className="ag-logo">
          <span className="ag-logo-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="ag-logo-word">AppGrid</span>
        </a>

        <div className="ag-nav-links">
          {!isLoading && isAuthenticated ? (
            <>
              <Link href="/feed">{t('nav.feed') || 'Feed'}</Link>
              <Link href="/builders">{t('nav.builders') || 'Builders'}</Link>
              <Link href="/marketplace">{t('nav.marketplace')}</Link>
            </>
          ) : !isLoading ? (
            <>
              <Link href="/#como">{t('nav.howWorks')}</Link>
              <Link href="/builders">{t('nav.builders') || 'Builders'}</Link>
              <Link href="/marketplace">{t('nav.marketplace')}</Link>
            </>
          ) : null}
        </div>

        <div className="ag-nav-actions">
          <LanguageToggle />
          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href={username ? `/builders/${username}` : '/profile'}
                className="ag-btn ag-btn-ghost ag-btn-sm ag-nav-user"
              >
                <span className="ag-nav-avatar">{username ? username[0].toUpperCase() : '?'}</span>
                {username ? `@${username}` : (t('nav.profile') || 'Profile')}
              </Link>
              <Link href="/admin" className="ag-btn ag-btn-primary ag-btn-sm">
                {t('nav.admin') || 'Admin'}
              </Link>
            </>
          ) : !isLoading ? (
            <Link href="/auth" className="ag-btn ag-btn-primary ag-btn-sm">
              {t('nav.publish')}
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
    {!isLoading && isAuthenticated && userId && (
      <CreateUpdateFAB userId={userId} />
    )}
    </>
  )
}
