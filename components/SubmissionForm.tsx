'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Upload, X, Camera } from 'lucide-react'
import { submitReport } from '@/lib/submissions'
import LocationPicker from './LocationPicker'
import EquipmentTracker from './EquipmentTracker'

interface FormData {
  name: string
  email: string
  phone: string
  location: string
  message: string
}

interface EquipmentData {
  category: 'hooks' | 'lures' | 'lines' | 'nets' | 'weights' | 'floats' | 'other'
  quantity: 'few' | 'many' | 'lots' | 'huge_haul' | '1-5m' | '5-10m' | '10-20m' | '20m+' | '1' | '2' | '3' | '4' | 'more'
  description?: string
}

export default function SubmissionForm() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [locationData, setLocationData] = useState<{address: string, lat: number, lng: number} | null>(null)
  const [equipmentData, setEquipmentData] = useState<EquipmentData[]>([])
  const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageUploading(true)
      try {
        const newFiles = Array.from(e.target.files)
        
        // Validate file types
        const supportedTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
          'image/heic', 'image/heif', 'image/avif'
        ]
        const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.avif']
        
        const invalidFiles = newFiles.filter(file => {
          const isValidType = supportedTypes.includes(file.type.toLowerCase())
          const isValidExtension = supportedExtensions.some(ext => 
            file.name.toLowerCase().endsWith(ext)
          )
          return !isValidType && !isValidExtension
        })
        
        if (invalidFiles.length > 0) {
          toast.error(`Ogiltiga filformat: ${invalidFiles.map(f => f.name).join(', ')}. Använd JPG, PNG, WEBP eller HEIC.`)
          return
        }
        
        // Validate file sizes (max 5MB each)
        const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024)
        if (oversizedFiles.length > 0) {
          toast.error(`Följande bilder är för stora (max 5MB): ${oversizedFiles.map(f => f.name).join(', ')}`)
          return
        }
        
        const validFiles = newFiles.filter(file => 
          file.size <= 5 * 1024 * 1024 && 
          (supportedTypes.includes(file.type.toLowerCase()) || 
           supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))
        )
        
        setSelectedImages(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 images
        
        if (validFiles.length > 0) {
          toast.success(`${validFiles.length} bild(er) tillagd${validFiles.length > 1 ? 'a' : ''}`)
        }
      } catch (error) {
        toast.error('Fel vid bildhantering')
      } finally {
        setImageUploading(false)
      }
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    if (selectedImages.length === 0) {
      toast.error('Du måste ladda upp minst en bild')
      return
    }

    if (!locationData) {
      toast.error('Du måste välja en plats på kartan')
      return
    }

    setIsSubmitting(true)
    try {
      await submitReport({
        ...data,
        location: locationData.address,
        equipment: equipmentData.length > 0 ? equipmentData : undefined
      }, selectedImages, locationData)
      
      // Enhanced success feedback
      toast.success(
        '🎉 Tack för din rapport! Vi granskar den inom 24 timmar och publicerar den sedan i galleriet.',
        { duration: 6000 }
      )
      
      reset()
      setSelectedImages([])
      setLocationData(null)
      setEquipmentData([])
      
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } catch (error) {
      toast.error('Något gick fel vid skickning. Kontrollera din internetanslutning och försök igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocationSelect = (location: {address: string, lat: number, lng: number}) => {
    setLocationData(location)
    setValue('location', location.address)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
          Rapportera återvunnen utrustning
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          Hjälp oss hålla våra vatten rena! Ladda upp ett foto av fiskeutrustning som du har hämtat från sjöar eller vattendrag.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ditt namn *
            </label>
            <input
              {...register('name', { required: 'Du måste ange ditt namn' })}
              type="text"
              autoComplete="name"
              className="input-field text-sm md:text-base"
              placeholder="Förnamn Efternamn"
            />
            {errors.name && (
              <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-post *
            </label>
            <input
              {...register('email', { 
                required: 'Du måste ange din e-post',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Ogiltig e-postadress'
                }
              })}
              type="email"
              autoComplete="email"
              inputMode="email"
              className="input-field text-sm md:text-base"
              placeholder="din@email.se"
            />
            {errors.email && (
              <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefonnummer *
            </label>
            <input
              {...register('phone', { required: 'Du måste ange ditt telefonnummer' })}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className="input-field text-sm md:text-base"
              placeholder="070-123 45 67"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plats *
            </label>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>

          {/* Equipment Tracker */}
          <div className="border-t border-gray-200 pt-4 md:pt-6">
            <EquipmentTracker onEquipmentChange={setEquipmentData} />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrivning av fynd
            </label>
            <textarea
              {...register('message')}
              className="input-field text-sm md:text-base"
              rows={3}
              placeholder="Berätta kort om vad du hittade och omständigheterna..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto av återvunnen utrustning * {selectedImages.length > 0 && `(${selectedImages.length}/5)`}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,.heic,.heif,.avif"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={imageUploading || isSubmitting}
              />
              <label htmlFor="image-upload" className={`cursor-pointer ${imageUploading ? 'opacity-50' : ''}`}>
                <Camera className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {imageUploading ? 'Bearbetar bilder...' : 'Klicka för att ladda upp bilder'}
                </p>
                <p className="text-xs text-gray-500">
                  Max 5 bilder, 5MB per bild • JPG, PNG, WEBP, HEIC, AVIF
                </p>
              </label>
            </div>
            
            {/* Image Preview - Mobile Optimized */}
            {selectedImages.length > 0 && (
              <div className="mt-3 md:mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-16 md:h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"
                    >
                      <X size={12} className="md:w-3.5 md:h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Required Fields Notice - Mobile Compact */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-orange-800">
              <strong>Obligatoriska fält:</strong> Du måste välja en bild och ange en plats
            </p>
          </div>

          {/* Submit Button - Mobile Sticky */}
          <div className="sticky bottom-0 bg-white p-3 md:p-0 border-t md:border-0 -mx-4 md:mx-0 md:static md:bg-transparent">
            <button
              type="submit"
              disabled={isSubmitting || imageUploading}
              aria-label={isSubmitting ? 'Skickar rapport...' : 'Skicka in din rapport'}
              className="w-full btn-primary text-sm md:text-base py-3 md:py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Skickar...' : 'Skicka in rapport'}
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 mb-4 md:mb-0">
            <p className="text-xs text-gray-600">
              Fyll i alla obligatoriska fält (*) för att kunna skicka rapporten
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 