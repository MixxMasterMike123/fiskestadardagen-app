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
    // Remove existing marker
    if (marker) {
      marker.setMap(null)
    }

    // Add new marker
    const newMarker = new google.maps.Marker({
      position: location,
      map: mapInstance,
      title: 'Plats för fynd'
    })
    setMarker(newMarker)

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
    <div className="space-y-4">
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

      {/* Clear Instructions Above Map */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-orange-900 mb-2">
          📍 Välj plats på 3 olika sätt:
        </p>
        <ul className="text-sm text-orange-800 space-y-1">
          <li><strong>1. Klicka direkt på kartan</strong> där du hittade utrustningen</li>
          <li><strong>2. Sök</strong> i rutan ovan (t.ex. "Vänern" eller "Göta älv")</li>
          <li><strong>3. Använd GPS</strong> med knappen under kartan</li>
        </ul>
      </div>

      {/* Map Container */}
      <div className="relative">
        {/* Click Instruction Overlay */}
        {!selectedLocation && isLoaded && (
          <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm border border-orange-300 rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-orange-800 text-center">
              👆 <strong>Klicka på kartan</strong> för att välja exakt plats
            </p>
          </div>
        )}
        
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-300 cursor-crosshair"
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
      </div>

      {/* Current Location Button and Selected Location */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 text-sm text-[#ee7e30] hover:text-[#d66b1a] transition-colors font-medium"
        >
          <MapPin className="h-4 w-4" />
          <span>📱 Använd min nuvarande position</span>
        </button>

        {selectedLocation && (
          <div className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
            <strong>✅ Vald:</strong> {selectedLocation.length > 40 ? selectedLocation.substring(0, 40) + '...' : selectedLocation}
          </div>
        )}
      </div>

      {/* Success Message */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>✅ Perfekt!</strong> Du har valt en plats. Du kan ändra genom att klicka på en annan punkt på kartan.
          </p>
        </div>
      )}
    </div>
  )
} 