'use client'

import { useLanguage } from '@/app/i18n/useLanguage'

interface BuilderStatsProps {
  apps_count: number
  followers_count: number
  following_count: number
}

export default function BuilderStats({
  apps_count,
  followers_count,
  following_count
}: BuilderStatsProps) {
  const { t } = useLanguage()

  return (
    <div className="ag-builder-stats-section">
      <div className="ag-stat-item">
        <div className="ag-stat-number">{apps_count}</div>
        <div className="ag-stat-label">{t('stats.apps')}</div>
      </div>
      <div className="ag-stat-item">
        <div className="ag-stat-number">{followers_count}</div>
        <div className="ag-stat-label">{t('stats.followers')}</div>
      </div>
      <div className="ag-stat-item">
        <div className="ag-stat-number">{following_count}</div>
        <div className="ag-stat-label">{t('stats.following')}</div>
      </div>
    </div>
  )
}
