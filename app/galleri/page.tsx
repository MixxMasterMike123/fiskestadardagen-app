'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import GalleryMap from '@/components/GalleryMap'
import SocialShare from '@/components/SocialShare'
import ImageLightbox from '@/components/ImageLightbox'
import { getSubmissions } from '@/lib/submissions'
import { Submission } from '@/types'
import { calculateImpactStats, formatNumber, getImpactMessage } from '@/lib/statistics'
import { MapPin, Calendar, TrendingUp } from 'lucide-react'

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

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
            <div className="mb-6 md:mb-8 lg:hidden">
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
                    <div className="text-lg md:text-2xl font-bold">{Math.round(stats.lineMeters)}</div>
                    <div className="text-green-100 text-xs md:text-sm">
                      <span className="block md:hidden">meter lina</span>
                      <span className="hidden md:block">Meter fiskelina</span>
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
              {/* Desktop: Side-by-side Layout */}
              <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-3 lg:gap-8">
                {/* Left: Gallery Content */}
                <div className="lg:col-span-3 xl:col-span-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Alla godkända fynd</h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="card">
                        {/* Image Gallery */}
                        <div className="mb-3 md:mb-4">
                          {submission.images.length > 0 && (
                            <div className="grid gap-2">
                              <img
                                src={submission.images[0]}
                                alt="Återvunnen fiskeutrustning"
                                className="w-full h-40 md:h-48 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => openLightbox(submission.images, 0)}
                              />
                              {submission.images.length > 1 && (
                                <div className="grid grid-cols-3 gap-1">
                                  {submission.images.slice(1, 4).map((image, index) => (
                                    <img
                                      key={index}
                                      src={image}
                                      alt={`Bild ${index + 2}`}
                                      className="w-full h-12 md:h-16 object-cover rounded cursor-pointer hover:opacity-95 transition-opacity"
                                      onClick={() => openLightbox(submission.images, index + 1)}
                                    />
                                  ))}
                                  {submission.images.length > 4 && (
                                    <div className="w-full h-12 md:h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                                      +{submission.images.length - 4}
                                    </div>
                                  )}
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
                                    {equipment.category === 'weights' && '⚖️'}
                                    {equipment.category === 'floats' && '🎈'}
                                    {equipment.category === 'other' && '🔧'}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-medium text-orange-800 block md:inline">
                                      {equipment.category === 'hooks' && 'Krokar'}
                                      {equipment.category === 'lures' && 'Beten/Drag'}
                                      {equipment.category === 'lines' && 'Fiskelina'}
                                      {equipment.category === 'weights' && 'Vikter/Lod'}
                                      {equipment.category === 'floats' && 'Flöten'}
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
                
                {/* Right: Map & Impact Dashboard */}
                <div className="lg:col-span-2 xl:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    {/* Impact Summary - Desktop Sidebar */}
                    {stats.totalSubmissions > 0 && (
                      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 lg:p-6 text-white">
                        <div className="flex items-center justify-between mb-3 lg:mb-4">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
                            <h2 className="text-lg lg:text-xl font-bold">Total miljöpåverkan</h2>
                          </div>
                          <div className="text-xl lg:text-2xl">🌊</div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 lg:gap-4">
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
                        
                        <div className="mt-3 lg:mt-4 text-green-100 text-xs lg:text-sm">
                          🎯 {getImpactMessage(stats)}
                        </div>
                      </div>
                    )}
                    
                    {/* Map Section - Compact for Sidebar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Kartvy över fynd</h3>
                      <GalleryMap submissions={submissions} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile/Tablet: Stacked Layout */}
              <div className="block lg:hidden">
                {/* Map Section */}
                <div className="mb-8 md:mb-12">
                  <GalleryMap submissions={submissions} />
                </div>
                
                {/* Gallery Grid */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Alla godkända fynd</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="card">
                        {/* Image Gallery */}
                        <div className="mb-3 md:mb-4">
                          {submission.images.length > 0 && (
                            <div className="grid gap-2">
                              <img
                                src={submission.images[0]}
                                alt="Återvunnen fiskeutrustning"
                                className="w-full h-40 md:h-48 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => openLightbox(submission.images, 0)}
                              />
                              {submission.images.length > 1 && (
                                <div className="grid grid-cols-3 gap-1">
                                  {submission.images.slice(1, 4).map((image, index) => (
                                    <img
                                      key={index}
                                      src={image}
                                      alt={`Bild ${index + 2}`}
                                      className="w-full h-12 md:h-16 object-cover rounded cursor-pointer hover:opacity-95 transition-opacity"
                                      onClick={() => openLightbox(submission.images, index + 1)}
                                    />
                                  ))}
                                  {submission.images.length > 4 && (
                                    <div className="w-full h-12 md:h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                                      +{submission.images.length - 4}
                                    </div>
                                  )}
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
                                    {equipment.category === 'weights' && '⚖️'}
                                    {equipment.category === 'floats' && '🎈'}
                                    {equipment.category === 'other' && '🔧'}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-medium text-orange-800 block md:inline">
                                      {equipment.category === 'hooks' && 'Krokar'}
                                      {equipment.category === 'lures' && 'Beten/Drag'}
                                      {equipment.category === 'lines' && 'Fiskelina'}
                                      {equipment.category === 'weights' && 'Vikter/Lod'}
                                      {equipment.category === 'floats' && 'Flöten'}
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
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </div>
  )
} 