'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Upload, X, Camera } from 'lucide-react'
import { submitReport } from '@/lib/submissions'
import LocationPicker from './LocationPicker'

interface FormData {
  name: string
  email: string
  phone: string
  location: string
  message: string
}

export default function SubmissionForm() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationData, setLocationData] = useState<{address: string, lat: number, lng: number} | null>(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedImages(prev => [...prev, ...newFiles].slice(0, 5)) // Max 5 images
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
        location: locationData.address
      }, selectedImages, locationData)
      toast.success('Tack för din rapport! Den kommer att granskas innan publicering.')
      reset()
      setSelectedImages([])
      setLocationData(null)
    } catch (error) {
      toast.error('Något gick fel. Försök igen.')
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Rapportera återvunnen utrustning
        </h2>
        <p className="text-gray-600 mb-8">
          Hjälp oss hålla våra vatten rena! Ladda upp ett foto av fiskeutrustning som du har hämtat från sjöar eller vattendrag.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ditt namn *
            </label>
            <input
              {...register('name', { required: 'Du måste ange ditt namn' })}
              type="text"
              className="input-field"
              placeholder="Förnamn Efternamn"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
              className="input-field"
              placeholder="din@email.se"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
              className="input-field"
              placeholder="070-123 45 67"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plats *
            </label>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrivning av fynd
            </label>
            <textarea
              {...register('message')}
              className="input-field"
              rows={4}
              placeholder="Berätta kort om vad du hittade och omständigheterna..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto av återvunnen utrustning *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Klicka för att ladda upp bilder
                </p>
                <p className="text-xs text-gray-500">
                  Välj en bild som visar den återvunna fiskeutrustningen
                </p>
              </label>
            </div>
            
            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Required Fields Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Obligatoriska fält:</strong>
            </p>
            <ul className="text-sm text-orange-700 mt-1 space-y-1">
              <li>• Du måste välja en bild</li>
              <li>• Du måste ange en plats</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Skickar...' : 'Skicka in rapport'}
          </button>

          {/* Privacy Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              Fyll i alla obligatoriska fält (*) för att kunna skicka inlämningen
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 