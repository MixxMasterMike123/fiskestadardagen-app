'use client'

import { useState, useEffect, useRef } from 'react'
import { loadGoogleMaps } from '@/lib/googleMaps'
import { MapPin, Search } from 'lucide-react'

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
  initialLocation?: string
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation || '')

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

          // Add click listener to map
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              updateMarker(e.latLng, mapInstance)
            }
          })

          // Setup places autocomplete for search - keep using the old API for now since new one is complex
          if (searchInputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
              componentRestrictions: { country: 'se' },
              fields: ['place_id', 'geometry', 'name', 'formatted_address'],
              types: ['establishment', 'geocode']
            })

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace()
              if (place.geometry && place.geometry.location) {
                const location = place.geometry.location
                updateMarker(location, mapInstance)
                mapInstance.setCenter(location)
                mapInstance.setZoom(12)
              }
            })
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [])

  const updateMarker = async (location: google.maps.LatLng, mapInstance: google.maps.Map) => {
    // Remove existing marker first - use callback to ensure state update
    setMarker(currentMarker => {
      if (currentMarker) {
        currentMarker.setMap(null)
        currentMarker.setVisible(false)
      }
      return null
    })

    // Small delay to ensure cleanup is complete
    setTimeout(() => {
      // Add new marker
      const newMarker = new google.maps.Marker({
        position: location,
        map: mapInstance,
        title: 'Plats för fynd',
        animation: google.maps.Animation.DROP
      })
      
      setMarker(newMarker)
    }, 10)

    // Reverse geocode to get address
    const geocoder = new google.maps.Geocoder()
    try {
      const result = await geocoder.geocode({ location })
      if (result.results[0]) {
        const address = result.results[0].formatted_address
        setSelectedLocation(address)
        
        onLocationSelect({
          address,
          lat: location.lat(),
          lng: location.lng()
        })
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
          updateMarker(pos, map)
          map.setCenter(pos)
          map.setZoom(15)
        },
        () => {
          console.error('Geolocation failed')
        }
      )
    }
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Sök plats (t.ex. Vänern, Göta älv, Stockholms skärgård)"
          className="input-field pl-10"
          defaultValue={initialLocation}
        />
      </div>

      {/* Clear Instructions Above Map - Mobile Optimized */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4">
        <p className="text-xs md:text-sm font-semibold text-orange-900 mb-1 md:mb-2">
          📍 Välj plats på 3 olika sätt:
        </p>
        <ul className="text-xs md:text-sm text-orange-800 space-y-0.5 md:space-y-1">
          <li><strong>1. Klicka direkt på kartan</strong> där du hittade utrustningen</li>
          <li><strong>2. Sök</strong> i rutan ovan (t.ex. "Vänern" eller "Göta älv")</li>
          <li><strong>3. Använd GPS</strong> med knappen under kartan</li>
        </ul>
      </div>

      {/* Click Instruction - Now Above Map */}
      {!selectedLocation && isLoaded && (
        <div className="bg-white border border-orange-300 rounded-lg p-2 md:p-3 shadow-sm">
          <p className="text-xs md:text-sm font-medium text-orange-800 text-center">
            👆 <strong>Klicka på kartan</strong> för att välja exakt plats
          </p>
        </div>
      )}

      {/* Map Container - Bigger for Mobile */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-80 md:h-64 rounded-lg border border-gray-300 cursor-crosshair"
          style={{ minHeight: '320px' }}
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

      {/* Current Location Button and Selected Location */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 text-xs md:text-sm text-[#ee7e30] hover:text-[#d66b1a] transition-colors font-medium"
        >
          <MapPin className="h-3 w-3 md:h-4 md:w-4" />
          <span>📱 Använd min nuvarande position</span>
        </button>

        {selectedLocation && (
          <div className="text-xs md:text-sm text-green-700 bg-green-50 px-2 md:px-3 py-1 rounded-lg border border-green-200">
            <strong>✅ Vald:</strong> {selectedLocation.length > 30 ? selectedLocation.substring(0, 30) + '...' : selectedLocation}
          </div>
        )}
      </div>

      {/* Success Message */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3">
          <p className="text-xs md:text-sm text-green-800">
            <strong>✅ Perfekt!</strong> Du har valt en plats. Du kan ändra genom att klicka på en annan punkt på kartan.
          </p>
        </div>
      )}
    </div>
  )
} 