'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import GalleryMap from '@/components/GalleryMap'
import { getSubmissions } from '@/lib/submissions'
import { Submission } from '@/types'
import { MapPin, Calendar } from 'lucide-react'

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

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
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Återvinningsgalleri
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Här kan du se all fiskeutrustning som har återvunnits från våra vatten av fantastiska volontärer.
            </p>
          </div>
          
          {submissions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                Inga godkända inlämningar än. Bli den första att bidra!
              </p>
            </div>
          ) : (
            <>
              {/* Map Section */}
              <div className="mb-12">
                <GalleryMap submissions={submissions} />
              </div>
              
              {/* Gallery Grid */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Alla godkända fynd</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="card">
                      {/* Image Gallery */}
                      <div className="mb-4">
                        {submission.images.length > 0 && (
                          <div className="grid gap-2">
                            <img
                              src={submission.images[0]}
                              alt="Återvunnen fiskeutrustning"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {submission.images.length > 1 && (
                              <div className="grid grid-cols-3 gap-1">
                                {submission.images.slice(1, 4).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Bild ${index + 2}`}
                                    className="w-full h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center mb-3">
                        <MapPin className="h-4 w-4 text-accent mr-2" />
                        <span className="font-medium text-gray-900">{submission.location}</span>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center mb-3">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {submission.createdAt.toLocaleDateString('sv-SE')}
                        </span>
                      </div>
                      
                      {/* Message */}
                      {submission.message && (
                        <p className="text-gray-700 text-sm mb-4">
                          {submission.message}
                        </p>
                      )}
                      
                      {/* Contributor */}
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500">
                          Inlämnad av: <span className="font-medium">{submission.name}</span>
                        </p>
                      </div>
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