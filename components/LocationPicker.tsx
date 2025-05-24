'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
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
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['places', 'marker'],
        region: 'SE',
        language: 'sv'
      })

      try {
        await loader.load()
        setIsLoaded(true)

        if (mapRef.current) {
          // Center on Sweden
          const swedenCenter = { lat: 62.0, lng: 15.0 }
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: swedenCenter,
            zoom: 5,
            mapTypeId: 'terrain',
            mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
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

      {/* Map Container */}
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
      </div>

      {/* Current Location Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 text-sm text-[#ee7e30] hover:text-[#d66b1a] transition-colors"
        >
          <MapPin className="h-4 w-4" />
          <span>Använd min nuvarande position</span>
        </button>

        {selectedLocation && (
          <div className="text-sm text-gray-600">
            <strong>Vald plats:</strong> {selectedLocation}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Så här väljer du plats:</strong>
        </p>
        <ul className="text-sm text-blue-700 mt-1 space-y-1">
          <li>• Sök efter platsen i sökrutan ovan</li>
          <li>• Eller klicka direkt på kartan där du hittade utrustningen</li>
          <li>• Du kan även använda din nuvarande position</li>
        </ul>
      </div>
    </div>
  )
} 