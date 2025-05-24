'use client'

import { useState, useEffect, useRef } from 'react'
import { loadGoogleMaps } from '@/lib/googleMaps'
import { Submission } from '@/types'

interface GalleryMapProps {
  submissions: Submission[]
}

export default function GalleryMap({ submissions }: GalleryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps()
        setIsLoaded(true)

        if (mapRef.current) {
          // Center on Sweden
          const swedenCenter = { lat: 62.0, lng: 15.0 }
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: swedenCenter,
            zoom: 5,
            mapTypeId: 'terrain',
            styles: [
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#4A90E2' }]
              }
            ],
            // Disable detailed controls for public view
            disableDefaultUI: true,
            zoomControl: true,
            scrollwheel: true,
            draggable: true
          })

          setMap(mapInstance)

          // Add markers for approved submissions with coordinates (with reduced precision for privacy)
          submissions
            .filter(s => s.status === 'approved' && s.coordinates)
            .forEach(submission => {
              if (submission.coordinates) {
                // Add some randomness for privacy (within ~5km radius)
                const randomLat = submission.coordinates.lat + (Math.random() - 0.5) * 0.1
                const randomLng = submission.coordinates.lng + (Math.random() - 0.5) * 0.1

                const marker = new google.maps.Marker({
                  position: { lat: randomLat, lng: randomLng },
                  map: mapInstance,
                  title: `Fynd nära ${submission.location}`,
                  icon: {
                    url: 'data:image/svg+xml,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ee7e30" width="28" height="28">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    `)
                  }
                })

                // Create info window with limited info for privacy and include image
                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div style="max-width: 250px;">
                      ${submission.images.length > 0 ? `
                        <img src="${submission.images[0]}" alt="Återvunnen utrustning" 
                             style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                      ` : ''}
                      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">🎣 Återvunnen utrustning</h3>
                      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;"><strong>Område:</strong> ${submission.location}</p>
                      ${submission.message ? `
                        <p style="margin: 4px 0; color: #6b7280; font-size: 11px;"><strong>Beskrivning:</strong> ${submission.message.substring(0, 100)}${submission.message.length > 100 ? '...' : ''}</p>
                      ` : ''}
                      <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 11px;">
                        <em>Ungefärlig plats för integritetsskydd</em>
                      </p>
                    </div>
                  `
                })

                marker.addListener('click', () => {
                  infoWindow.open(mapInstance, marker)
                })
              }
            })

          // Fit bounds if we have submissions
          const submissionsWithCoords = submissions.filter(s => s.status === 'approved' && s.coordinates)
          if (submissionsWithCoords.length > 0) {
            const bounds = new google.maps.LatLngBounds()
            submissionsWithCoords.forEach(submission => {
              if (submission.coordinates) {
                bounds.extend({ lat: submission.coordinates.lat, lng: submission.coordinates.lng })
              }
            })
            mapInstance.fitBounds(bounds)
            
            // Ensure minimum zoom level
            const listener = google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
              if (mapInstance.getZoom()! > 8) mapInstance.setZoom(8)
              google.maps.event.removeListener(listener)
            })
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [submissions])

  const approvedWithCoords = submissions.filter(s => s.status === 'approved' && s.coordinates).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Fynd runt om i Sverige</h3>
        <div className="text-sm text-gray-600">
          {approvedWithCoords} godkända fynd visas på kartan
        </div>
      </div>

      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-300"
          style={{ minHeight: '250px' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ee7e30] mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Laddar karta...</p>
            </div>
          </div>
        )}

        {approvedWithCoords === 0 && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600">Inga fynd med platsdata att visa ännu</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>🔒 Integritetsskydd:</strong> Exakta koordinater visas inte på denna publika karta. 
          Markörer visar ungefärliga områden där fiskeutrustning har återvunnits.
        </p>
      </div>
    </div>
  )
} 