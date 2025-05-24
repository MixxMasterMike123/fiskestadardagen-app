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
    <div className="space-y-4 lg:space-y-6">
      {/* Main Impact Header - Responsive for sidebar */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 lg:p-6 text-white">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
            <h2 className="text-lg lg:text-xl font-bold">Total miljöpåverkan</h2>
          </div>
          <div className="text-xl lg:text-2xl">🌊</div>
        </div>

        {/* Key Metrics - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm text-center">
            <div className="text-xl lg:text-2xl font-bold">{stats.totalSubmissions}</div>
            <div className="text-xs lg:text-sm text-green-100">Godkända rapporter</div>
          </div>

          <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm text-center">
            <div className="text-xl lg:text-2xl font-bold">{formatNumber(stats.estimatedTotalPieces)}</div>
            <div className="text-xs lg:text-sm text-green-100">Uppskattade delar</div>
          </div>

          <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm text-center">
            <div className="text-xl lg:text-2xl font-bold">{Math.round(stats.lineMeters)}</div>
            <div className="text-xs lg:text-sm text-green-100">Meter fiskelina</div>
          </div>
        </div>
        
        {/* Summary line - More compact on sidebar */}
        <div className="mt-3 lg:mt-4 text-green-100 text-xs lg:text-sm">
          🎯 {stats.totalSubmissions} rapporter • 📊 {formatNumber(stats.estimatedTotalPieces)} delar • 🧵 {Math.round(stats.lineMeters)}m fiskelina
        </div>
      </div>

      {/* Equipment Breakdown - More compact */}
      {stats.equipmentByCategory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">
            Återvunnen utrustning per kategori
          </h3>
          
          <div className="grid grid-cols-1 gap-3 lg:gap-4">
            {stats.equipmentByCategory.map((equipment) => (
              <div key={equipment.category} className="border border-gray-200 rounded-lg p-3 lg:p-4">
                <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
                  <span className="text-lg lg:text-2xl">{equipment.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm lg:text-base">{equipment.name}</div>
                    <div className="text-xs text-gray-500">{equipment.rangeText}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg lg:text-xl font-bold text-accent">
                      {equipment.category === 'lines' 
                        ? Math.round(equipment.estimatedCount)
                        : formatNumber(equipment.estimatedCount)
                      }
                    </span>
                    <span className="text-xs lg:text-sm text-gray-600">{equipment.unit}</span>
                  </div>
                  
                  {equipment.category === 'lines' && equipment.estimatedCount >= 100 && (
                    <div className="text-xs text-green-600 font-medium">
                      Det motsvarar {Math.round(equipment.estimatedCount / 10)} fiskespön!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Message - Compact */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-4">
        <div className="flex items-start space-x-2 lg:space-x-3">
          <div className="text-lg lg:text-2xl">🎯</div>
          <div>
            <h4 className="font-medium text-green-900 mb-1 text-sm lg:text-base">
              Fantastisk insats för miljön!
            </h4>
            <p className="text-xs lg:text-sm text-green-800">
              Varje återvunnen fiskeutrustning minskar risken för att djur fastnar och 
              att mikroplaster sprids i våra vatten. Tillsammans gör vi verklig skillnad!
            </p>
            
            {stats.lineMeters > 0 && (
              <div className="mt-2 lg:mt-3">
                <div className="text-xs text-green-700">
                  🧵 {Math.round(stats.lineMeters)} meter fiskelina = mindre risk för fåglar och marina djur
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No data message */}
      {stats.totalSubmissions === 0 && (
        <div className="text-center py-6 lg:py-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">🎣</div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
            Inga godkända rapporter ännu
          </h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4">
            Bli den första att rapportera återvunnen fiskeutrustning!
          </p>
          <p className="text-xs text-gray-500">
            Varje rapport hjälper till att hålla våra vatten rena 🌊
          </p>
        </div>
      )}
    </div>
  )
} 