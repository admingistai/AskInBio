'use client'

import { MousePointer2, Link2, TrendingUp, Eye } from 'lucide-react'
import { Link } from '@prisma/client'

interface QuickStatsProps {
  links: Link[]
  profileViews?: number
}

export default function QuickStats({ links, profileViews = 0 }: QuickStatsProps) {
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter(link => link.active).length
  const clickRate = links.length > 0 ? Math.round((totalClicks / (links.length * 100)) * 100) : 0
  
  const stats = [
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      icon: MousePointer2,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Links',
      value: `${activeLinks}/${links.length}`,
      icon: Link2,
      subtitle: `${links.length - activeLinks} inactive`,
    },
    {
      title: 'Click Rate',
      value: `${clickRate}%`,
      icon: TrendingUp,
      subtitle: 'Average per link',
    },
    {
      title: 'Profile Views',
      value: profileViews.toLocaleString(),
      icon: Eye,
      trend: '+8%',
      trendUp: true,
    },
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        
        return (
          <div key={stat.title} className="dashboard-panel p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="glass-card p-3 rounded-xl">
                <Icon className="h-5 w-5 text-white/80" />
              </div>
              {stat.trend && (
                <span className={`text-xs font-medium ${
                  stat.trendUp ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend}
                </span>
              )}
            </div>
            
            <h3 className="text-sm font-medium text-white/60 mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </p>
            {stat.subtitle && (
              <p className="text-xs text-white/40">
                {stat.subtitle}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}