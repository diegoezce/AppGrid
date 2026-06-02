'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '@/app/i18n/useLanguage'

export default function Navigation() {
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setIsAuthenticated(true)
          // Get user's profile
          const { data } = await supabase
            .from('users')
            .select('username')
            .eq('id', user.id)
            .single()

          if (data?.username) {
            setUsername(data.username)
          }
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
    <nav className="ag-nav">
      <div className="ag-container ag-nav-inner">
        <a href="/" className="ag-logo">
          <span className="ag-logo-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="ag-logo-word">AppGrid</span>
        </a>

        <div className="ag-nav-links">
          {isAuthenticated && !isLoading && (
            <>
              <Link href="/feed">{t('nav.feed') || 'Feed'}</Link>
              <Link href="/builders">{t('nav.explore') || 'Explore'}</Link>
            </>
          )}
          {!isAuthenticated && !isLoading && (
            <>
              <Link href="#como">{t('nav.howWorks')}</Link>
              <Link href="/marketplace">{t('nav.marketplace')}</Link>
            </>
          )}
        </div>

        <div className="ag-nav-actions">
          <LanguageToggle />
          {isAuthenticated && !isLoading ? (
            <>
              <Link href={username ? `/builders/${username}` : '/profile'} className="ag-btn ag-btn-secondary ag-btn-sm">
                {t('nav.profile') || 'Profile'}
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
  )
}
