import { Loader } from '@googlemaps/js-api-loader'

// Singleton loader instance
let loader: Loader | null = null

export const getGoogleMapsLoader = (): Loader => {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places', 'marker'], // All libraries needed by any component
      region: 'SE',
      language: 'sv'
    })
  }
  return loader
}

export const loadGoogleMaps = async (): Promise<void> => {
  const loader = getGoogleMapsLoader()
  await loader.load()
} 