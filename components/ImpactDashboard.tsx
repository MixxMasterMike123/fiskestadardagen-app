'use client'

import { Submission } from '@/types'
import { calculateImpactStats, formatNumber } from '@/lib/statistics'
import { TrendingUp, Award, Droplets } from 'lucide-react'

interface ImpactDashboardProps {
  submissions: Submission[]
}

export default function ImpactDashboard({ submissions }: ImpactDashboardProps) {
  const stats = calculateImpactStats(submissions)

  return (
    <div className="space-y-6">
      {/* Main Impact Header - Updated to match gallery gradient */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-xl font-bold">Total miljöpåverkan</h2>
          </div>
          <div className="text-2xl">🌊</div>
        </div>

        {/* Key Metrics - More compact grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <div className="text-sm text-green-100">Godkända rapporter</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">{formatNumber(stats.estimatedTotalPieces)}</div>
            <div className="text-sm text-green-100">Uppskattade delar</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">{Math.round(stats.lineMeters + stats.netCount)}</div>
            <div className="text-sm text-green-100">Meter lina + nät</div>
          </div>
        </div>
        
        {/* Summary line */}
        <div className="mt-4 text-green-100 text-sm">
          🎯 {stats.totalSubmissions} rapporter godkända • 📊 Uppskattningsvis {formatNumber(stats.estimatedTotalPieces)} delar återvunna • 🧵 {Math.round(stats.lineMeters)} meter fiskelina • 🕸️ {stats.netCount} nät
        </div>
      </div>

      {/* Equipment Breakdown */}
      {stats.equipmentByCategory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Återvunnen utrustning per kategori
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.equipmentByCategory.map((equipment) => (
              <div key={equipment.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{equipment.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-900">{equipment.name}</div>
                    <div className="text-xs text-gray-500">{equipment.rangeText}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold text-accent">
                      {equipment.category === 'lines' 
                        ? Math.round(equipment.estimatedCount)
                        : formatNumber(equipment.estimatedCount)
                      }
                    </span>
                    <span className="text-sm text-gray-600">{equipment.unit}</span>
                  </div>
                  
                  {equipment.category === 'lines' && equipment.estimatedCount >= 100 && (
                    <div className="text-xs text-green-600 font-medium">
                      Det motsvarar {Math.round(equipment.estimatedCount / 10)} fiskespön!
                    </div>
                  )}
                  
                  {equipment.category === 'nets' && equipment.estimatedCount >= 5 && (
                    <div className="text-xs text-blue-600 font-medium">
                      Viktig miljövinst - nät är extremt skadliga
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h4 className="font-medium text-green-900 mb-1">
              Fantastisk insats för miljön!
            </h4>
            <p className="text-sm text-green-800">
              Varje återvunnen fiskeutrustning minskar risken för att djur fastnar och 
              att mikroplaster sprids i våra vatten. Tillsammans gör vi verklig skillnad!
            </p>
            
            {(stats.lineMeters > 0 || stats.netCount > 0) && (
              <div className="mt-3 space-y-1">
                {stats.lineMeters > 0 && (
                  <div className="text-xs text-green-700">
                    🧵 {Math.round(stats.lineMeters)} meter fiskelina = mindre risk för fåglar och marina djur
                  </div>
                )}
                {stats.netCount > 0 && (
                  <div className="text-xs text-green-700">
                    🕸️ {stats.netCount} nät = förhindrat spökfiske som kan pågå i åratal
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No data message */}
      {stats.totalSubmissions === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎣</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Inga godkända rapporter ännu
          </h3>
          <p className="text-gray-600">
            Bli den första att rapportera återvunnen fiskeutrustning!
          </p>
        </div>
      )}
    </div>
  )
} 