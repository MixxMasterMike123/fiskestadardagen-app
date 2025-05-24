'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import GalleryMap from '@/components/GalleryMap'
import SocialShare from '@/components/SocialShare'
import { getSubmissions } from '@/lib/submissions'
import { Submission } from '@/types'
import { calculateImpactStats, formatNumber, getImpactMessage } from '@/lib/statistics'
import { MapPin, Calendar, TrendingUp } from 'lucide-react'

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const getQuantityLabel = (category: string, quantity: string) => {
    // Lines - show in meters
    if (category === 'lines') {
      switch (quantity) {
        case '1-5m': return '1-5 meter'
        case '5-10m': return '5-10 meter'
        case '10-20m': return '10-20 meter'
        case '20m+': return '20+ meter'
        default: return quantity
      }
    }
    
    // Nets - show specific counts
    if (category === 'nets') {
      switch (quantity) {
        case '1': return '1 nät'
        case '2': return '2 nät'
        case '3': return '3 nät'
        case '4': return '4 nät'
        case 'more': return '5+ nät'
        default: return quantity
      }
    }
    
    // Other equipment - show ranges
    switch (quantity) {
      case 'few': return 'Några få'
      case 'many': return 'Flera'
      case 'lots': return 'Många'
      case 'huge_haul': return 'Extremt mycket'
      default: return quantity
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Laddar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Återvinningsgalleri
            </h1>
            <p className="mt-3 md:mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Här kan du se all fiskeutrustning som har återvunnits från våra vatten av fantastiska volontärer.
            </p>
          </div>

          {/* Impact Summary - Mobile Optimized */}
          {stats.totalSubmissions > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 md:p-6 text-white">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <TrendingUp className="h-4 w-4 md:h-6 md:w-6" />
                    <h2 className="text-lg md:text-xl font-bold">Total miljöpåverkan</h2>
                  </div>
                  <div className="text-lg md:text-2xl">🌊</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm text-center">
                    <div className="text-lg md:text-2xl font-bold">{stats.totalSubmissions}</div>
                    <div className="text-green-100 text-xs md:text-sm">
                      <span className="block md:hidden">rapporter</span>
                      <span className="hidden md:block">Godkända rapporter</span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm text-center">
                    <div className="text-lg md:text-2xl font-bold">{formatNumber(stats.estimatedTotalPieces)}</div>
                    <div className="text-green-100 text-xs md:text-sm">
                      <span className="block md:hidden">delar</span>
                      <span className="hidden md:block">Uppskattade delar</span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 md:p-4 backdrop-blur-sm text-center">
                    <div className="text-lg md:text-2xl font-bold">{Math.round(stats.lineMeters + stats.netCount)}</div>
                    <div className="text-green-100 text-xs md:text-sm">
                      <span className="block md:hidden">m+nät</span>
                      <span className="hidden md:block">Meter lina + nät</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-4 text-green-100 text-xs md:text-sm">
                  🎯 {getImpactMessage(stats)}
                </div>
              </div>
            </div>
          )}
          
          {submissions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg md:text-xl text-gray-600">
                Inga godkända rapporter än. Bli den första att bidra!
              </p>
            </div>
          ) : (
            <>
              {/* Map Section */}
              <div className="mb-8 md:mb-12">
                <GalleryMap submissions={submissions} />
              </div>
              
              {/* Gallery Grid */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Alla godkända fynd</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="card">
                      {/* Image Gallery */}
                      <div className="mb-3 md:mb-4">
                        {submission.images.length > 0 && (
                          <div className="grid gap-2">
                            <img
                              src={submission.images[0]}
                              alt="Återvunnen fiskeutrustning"
                              className="w-full h-40 md:h-48 object-cover rounded-lg"
                            />
                            {submission.images.length > 1 && (
                              <div className="grid grid-cols-3 gap-1">
                                {submission.images.slice(1, 4).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Bild ${index + 2}`}
                                    className="w-full h-12 md:h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center mb-2 md:mb-3">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 text-accent mr-2 flex-shrink-0" />
                        <span className="font-medium text-gray-900 text-sm md:text-base truncate">{submission.location}</span>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center mb-2 md:mb-3">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-gray-600">
                          {submission.createdAt.toLocaleDateString('sv-SE')}
                        </span>
                      </div>
                      
                      {/* Equipment Info */}
                      {submission.equipment && submission.equipment.length > 0 && (
                        <div className="mb-2 md:mb-3 space-y-1">
                          {submission.equipment.map((equipment, index) => (
                            <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center text-xs md:text-sm">
                                <span className="text-sm md:text-lg mr-2 flex-shrink-0">
                                  {equipment.category === 'hooks' && '🪝'}
                                  {equipment.category === 'lures' && '🎣'}
                                  {equipment.category === 'lines' && '🧵'}
                                  {equipment.category === 'nets' && '🕸️'}
                                  {equipment.category === 'weights' && '⚖️'}
                                  {equipment.category === 'other' && '🔧'}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="font-medium text-orange-800 block md:inline">
                                    {equipment.category === 'hooks' && 'Krokar'}
                                    {equipment.category === 'lures' && 'Beten/Drag'}
                                    {equipment.category === 'lines' && 'Fiskelina'}
                                    {equipment.category === 'nets' && 'Nät'}
                                    {equipment.category === 'weights' && 'Vikter/Lod'}
                                    {equipment.category === 'other' && 'Övrigt'}
                                  </span>
                                  <span className="text-orange-700 text-xs md:text-sm block md:inline md:ml-2">
                                    {getQuantityLabel(equipment.category, equipment.quantity)}
                                  </span>
                                  {equipment.description && (
                                    <div className="text-orange-600 text-xs mt-1 truncate">{equipment.description}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Message */}
                      {submission.message && (
                        <div className="mb-3 md:mb-4">
                          <p className="text-gray-700 text-xs md:text-sm bg-gray-50 p-2 rounded border-l-4 border-accent">
                            {submission.message}
                          </p>
                        </div>
                      )}
                      
                      {/* Submitter */}
                      <div className="mb-3 md:mb-4">
                        <span className="text-xs md:text-sm text-gray-600">Rapporterad av: </span>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{submission.name}</span>
                      </div>
                      
                      {/* Social Share */}
                      <SocialShare submission={submission} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
} 