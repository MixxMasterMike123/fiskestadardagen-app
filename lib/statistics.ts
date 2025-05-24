import { Submission } from '@/types'

export interface EquipmentStats {
  category: 'hooks' | 'lures' | 'lines' | 'weights' | 'floats' | 'other'
  emoji: string
  name: string
  unit: string
  estimatedCount: number
  rangeText: string
}

export interface ImpactStats {
  totalSubmissions: number
  totalEquipmentItems: number
  estimatedTotalPieces: number
  lineMeters: number
  equipmentByCategory: EquipmentStats[]
}

export function calculateImpactStats(submissions: Submission[]): ImpactStats {
  const approvedSubmissions = submissions.filter(s => s.status === 'approved')
  
  let totalEquipmentItems = 0
  let estimatedTotalPieces = 0
  let lineMeters = 0
  
  const categoryStats: Record<string, {
    count: number
    estimatedPieces: number
    ranges: string[]
  }> = {
    hooks: { count: 0, estimatedPieces: 0, ranges: [] },
    lures: { count: 0, estimatedPieces: 0, ranges: [] },
    lines: { count: 0, estimatedPieces: 0, ranges: [] },
    weights: { count: 0, estimatedPieces: 0, ranges: [] },
    floats: { count: 0, estimatedPieces: 0, ranges: [] },
    other: { count: 0, estimatedPieces: 0, ranges: [] }
  }
  
  approvedSubmissions.forEach(submission => {
    if (submission.equipment && submission.equipment.length > 0) {
      submission.equipment.forEach(equipment => {
        const category = equipment.category
        categoryStats[category].count++
        totalEquipmentItems++
        
        // Calculate estimated counts based on quantity
        let estimatedCount = 0
        
        if (category === 'lines') {
          // Lines - convert to estimated meters
          switch (equipment.quantity) {
            case '1-5m':
              estimatedCount = 3 // Average of 1-5
              lineMeters += 3
              break
            case '5-10m':
              estimatedCount = 7.5 // Average of 5-10
              lineMeters += 7.5
              break
            case '10-20m':
              estimatedCount = 15 // Average of 10-20
              lineMeters += 15
              break
            case '20m+':
              estimatedCount = 25 // Conservative estimate
              lineMeters += 25
              break
          }
          categoryStats[category].ranges.push(equipment.quantity)
        } else {
          // Other equipment - estimated ranges
          switch (equipment.quantity) {
            case 'few':
              estimatedCount = 5 // Average of 1-10
              break
            case 'many':
              estimatedCount = 30 // Average of 10-50
              break
            case 'lots':
              estimatedCount = 75 // Average of 50-100
              break
            case 'huge_haul':
              estimatedCount = 150 // Conservative estimate for 100+
              break
          }
          categoryStats[category].ranges.push(equipment.quantity)
        }
        
        // Use admin-adjusted count if available
        if (equipment.adminAdjustedCount) {
          estimatedCount = equipment.adminAdjustedCount
        }
        
        categoryStats[category].estimatedPieces += estimatedCount
        estimatedTotalPieces += estimatedCount
      })
    }
  })
  
  // Convert to equipment stats array
  const equipmentByCategory: EquipmentStats[] = [
    {
      category: 'hooks' as const,
      emoji: '🪝',
      name: 'Krokar',
      unit: 'st',
      estimatedCount: categoryStats.hooks.estimatedPieces,
      rangeText: `${categoryStats.hooks.count} rapporter`
    },
    {
      category: 'lures' as const,
      emoji: '🎣',
      name: 'Beten/Drag',
      unit: 'st',
      estimatedCount: categoryStats.lures.estimatedPieces,
      rangeText: `${categoryStats.lures.count} rapporter`
    },
    {
      category: 'lines' as const,
      emoji: '🧵',
      name: 'Fiskelina',
      unit: 'meter',
      estimatedCount: lineMeters,
      rangeText: `${categoryStats.lines.count} rapporter`
    },
    {
      category: 'weights' as const,
      emoji: '⚖️',
      name: 'Vikter/Lod',
      unit: 'st',
      estimatedCount: categoryStats.weights.estimatedPieces,
      rangeText: `${categoryStats.weights.count} rapporter`
    },
    {
      category: 'floats' as const,
      emoji: '🎈',
      name: 'Flöten',
      unit: 'st',
      estimatedCount: categoryStats.floats.estimatedPieces,
      rangeText: `${categoryStats.floats.count} rapporter`
    },
    {
      category: 'other' as const,
      emoji: '🔧',
      name: 'Övrigt',
      unit: 'st',
      estimatedCount: categoryStats.other.estimatedPieces,
      rangeText: `${categoryStats.other.count} rapporter`
    }
  ].filter(stat => stat.estimatedCount > 0) // Only show categories with data
  
  return {
    totalSubmissions: approvedSubmissions.length,
    totalEquipmentItems,
    estimatedTotalPieces,
    lineMeters,
    equipmentByCategory
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

export function getImpactMessage(stats: ImpactStats): string {
  const messages = [
    `🎣 ${stats.totalSubmissions} rapporter godkända`,
    `🧹 Uppskattningsvis ${formatNumber(stats.estimatedTotalPieces)} delar återvunna`,
  ]
  
  if (stats.lineMeters > 0) {
    messages.push(`🧵 ${Math.round(stats.lineMeters)} meter fiskelina`)
  }
  
  return messages.join(' • ')
} 