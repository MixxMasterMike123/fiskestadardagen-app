'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SubmissionForm from '@/components/SubmissionForm'
import ImpactDashboard from '@/components/ImpactDashboard'
import { getSubmissions } from '@/lib/submissions'
import { calculateImpactStats, formatNumber } from '@/lib/statistics'
import { Submission } from '@/types'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [showFullStats, setShowFullStats] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await getSubmissions('approved')
      setSubmissions(data)
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = calculateImpactStats(submissions)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Rapportera återvunnen fiskeutrustning
            </h1>
            <p className="mt-3 md:mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hjälp oss hålla våra vatten rena! Rapportera fiskeutrustning som du har återvunnit från sjöar, älvar och andra vattendrag.
            </p>
          </div>
          
          {/* Compact Mobile Impact Stats */}
          {!loading && stats.totalSubmissions > 0 && (
            <div className="block lg:hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium text-sm">Hittills återvunnet</span>
                  </div>
                  <button
                    onClick={() => setShowFullStats(!showFullStats)}
                    className="text-white/80 hover:text-white"
                  >
                    {showFullStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold">{stats.totalSubmissions}</div>
                    <div className="text-xs text-green-100">rapporter</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{formatNumber(stats.estimatedTotalPieces)}</div>
                    <div className="text-xs text-green-100">delar</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{Math.round(stats.lineMeters + stats.netCount)}</div>
                    <div className="text-xs text-green-100">m+nät</div>
                  </div>
                </div>
                
                {showFullStats && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="text-xs text-green-100">
                      🎯 Tillsammans gör vi skillnad för miljön!
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Desktop: Side-by-side Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-3 lg:gap-8">
            {/* Left: Submission Form */}
            <div className="lg:col-span-3 xl:col-span-2">
              <SubmissionForm />
            </div>
            
            {/* Right: Impact Dashboard */}
            <div className="lg:col-span-2 xl:col-span-1">
              {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    <span className="ml-3 text-gray-600">Laddar statistik...</span>
                  </div>
                </div>
              ) : (
                <div className="sticky top-8">
                  <ImpactDashboard submissions={submissions} />
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile/Tablet: Stacked Layout */}
          <div className="block lg:hidden">
            <SubmissionForm />
          </div>
        </div>
      </main>
    </div>
  )
} 