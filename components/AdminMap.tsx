'use client'

import { useState, useEffect, useRef } from 'react'
import { loadGoogleMaps } from '@/lib/googleMaps'
import { Submission } from '@/types'

interface AdminMapProps {
  submissions: Submission[]
}

export default function AdminMap({ submissions }: AdminMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const markersRef = useRef<google.maps.Marker[]>([])

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
            ]
          })

          setMap(mapInstance)
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (map && isLoaded) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // Add markers for submissions with coordinates
      submissions.forEach(submission => {
        if (submission.coordinates) {
          const marker = new google.maps.Marker({
            position: { lat: submission.coordinates.lat, lng: submission.coordinates.lng },
            map: map,
            title: `${submission.name} - ${submission.location}`,
            icon: {
              url: submission.status === 'approved' ? 
                'data:image/svg+xml,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ee7e30" width="32" height="32">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                `) :
                submission.status === 'rejected' ?
                'data:image/svg+xml,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DC2626" width="32" height="32">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                `) :
                'data:image/svg+xml,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" width="32" height="32">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                `)
            }
          })

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 300px;">
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${submission.name}</h3>
                <p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Plats:</strong> ${submission.location}</p>
                <p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Status:</strong> 
                  <span style="color: ${
                    submission.status === 'approved' ? '#ee7e30' : 
                    submission.status === 'rejected' ? '#DC2626' : '#F59E0B'
                  }">
                    ${submission.status === 'approved' ? 'Godkänd' : 
                      submission.status === 'rejected' ? 'Avvisad' : 'Väntar'}
                  </span>
                </p>
                ${submission.message ? `<p style="margin: 0; color: #6b7280;"><strong>Meddelande:</strong> ${submission.message}</p>` : ''}
              </div>
            `
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })

          markersRef.current.push(marker)
        }
      })

      // If we have submissions with coordinates, adjust map bounds
      const submissionsWithCoords = submissions.filter(s => s.coordinates)
      if (submissionsWithCoords.length > 0) {
        const bounds = new google.maps.LatLngBounds()
        submissionsWithCoords.forEach(submission => {
          if (submission.coordinates) {
            bounds.extend({ lat: submission.coordinates.lat, lng: submission.coordinates.lng })
          }
        })
        map.fitBounds(bounds)
        
        // Ensure minimum zoom level
        const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
          if (map.getZoom()! > 10) map.setZoom(10)
          google.maps.event.removeListener(listener)
        })
      }
    }
  }, [map, isLoaded, submissions])

  const submissionsWithCoords = submissions.filter(s => s.coordinates)
  const submissionsWithoutCoords = submissions.filter(s => !s.coordinates)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Rapporter på karta</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#ee7e30]"></div>
            <span>Godkänd ({submissions.filter(s => s.status === 'approved').length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Väntar ({submissions.filter(s => s.status === 'pending').length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Avvisad ({submissions.filter(s => s.status === 'rejected').length})</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-gray-300"
          style={{ minHeight: '400px' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ee7e30] mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Laddar karta...</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">
            {submissionsWithCoords.length} rapporter med platsdata
          </h4>
          <p className="text-sm text-green-700">
            Visas som markörer på kartan ovan
          </p>
        </div>

        {submissionsWithoutCoords.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 mb-2">
              {submissionsWithoutCoords.length} rapporter utan platsdata
            </h4>
            <p className="text-sm text-orange-700">
              Dessa rapporter gjordes före kartfunktionen implementerades
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 