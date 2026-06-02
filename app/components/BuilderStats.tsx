'use client'

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
  return (
    <div className="ag-builder-stats-section">
      <div className="ag-stat-item">
        <div className="ag-stat-number">{apps_count}</div>
        <div className="ag-stat-label">Apps</div>
      </div>
      <div className="ag-stat-item">
        <div className="ag-stat-number">{followers_count}</div>
        <div className="ag-stat-label">Followers</div>
      </div>
      <div className="ag-stat-item">
        <div className="ag-stat-number">{following_count}</div>
        <div className="ag-stat-label">Following</div>
      </div>
    </div>
  )
}
