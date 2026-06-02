'use client'

import { useEffect, useState } from 'react'
import BuilderCard from '@/app/components/BuilderCard'
import Navigation from '@/app/components/Navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/app/i18n/useLanguage'
import './builders.css'

interface Builder {
  id: string
  display_name: string
  username: string
  bio: string | null
  avatar_url: string | null
  followers_count: number
  following_count: number
  apps_count: number
}

export default function BuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'followers' | 'apps'>('followers')
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id || null
        setCurrentUserId(userId)

        const [buildersRes, followsRes] = await Promise.all([
          fetch(`/api/builders?sort=${sortBy}&limit=50`),
          userId ? fetch(`/api/follows?user_id=${userId}&type=following`) : Promise.resolve(null)
        ])

        if (!buildersRes.ok) throw new Error('Failed to fetch builders')
        setBuilders(await buildersRes.json())

        if (followsRes?.ok) {
          const follows = await followsRes.json()
          setFollowingSet(new Set(follows.map((f: any) => f.following_id)))
        }
      } catch (error) {
        console.error('Fetch builders error:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [sortBy])

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="ag-builders-container">
          <div className="ag-loading">{t('builders.loading')}</div>
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Navigation />
        <div className="ag-builders-container">
          <div className="ag-error">{t('builders.error')}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="ag-builders-container">
        <div className="ag-builders-header">
          <h1>{t('builders.title')}</h1>
          <p>{t('builders.subtitle')}</p>

          <div className="ag-builders-sort">
            <span className="ag-builders-sort-label">{t('builders.sortLabel')}</span>
            <button
              className={sortBy === 'followers' ? 'active' : ''}
              onClick={() => setSortBy('followers')}
            >
              {t('builders.mostFollowers')}
            </button>
            <button
              className={sortBy === 'apps' ? 'active' : ''}
              onClick={() => setSortBy('apps')}
            >
              {t('builders.mostApps')}
            </button>
          </div>
        </div>

        {builders.length === 0 ? (
          <div className="ag-empty-state">
            <p>{t('builders.noBuilders')}</p>
          </div>
        ) : (
          <div className="ag-builders-grid">
            {builders.map(builder => (
              <BuilderCard
                key={builder.id}
                {...builder}
                isFollowing={followingSet.has(builder.id)}
                currentUserId={currentUserId || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
