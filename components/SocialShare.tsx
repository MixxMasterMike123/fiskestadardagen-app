'use client'

import { useState, useEffect } from 'react'
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check } from 'lucide-react'
import { Submission } from '@/types'

interface SocialShareProps {
  submission: Submission
}

export default function SocialShare({ submission }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  // Create sharing content
  const shareText = `🎣 Fantastiskt! Mer fiskeutrustning återvunnen från ${submission.location}! 

Tillsammans håller vi våra svenska vatten rena. Varje bortplockat nät och krok gör skillnad för miljön! 🌊

#Fiskestädardagen #Miljö #Fiske #RenaVatten #Sverige`

  const shareUrl = `https://fiskestadardagen.web.app/galleri`
  const fullShareText = `${shareText}\n\n👉 Se fler fynd: ${shareUrl}`

  // Social media URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`

  const handleNativeShare = async () => {
    if (canShare && navigator.share) {
      try {
        await navigator.share({
          title: 'Fiskeutrustning återvunnen!',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#ee7e30] transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Dela</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Menu */}
          <div className="absolute right-0 bottom-full mb-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64">
            <h4 className="font-medium text-gray-900 mb-3">Dela detta fynd</h4>
            
            <div className="space-y-2">
              {/* Native Share (if supported) */}
              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Dela...</span>
                </button>
              )}
              
              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </a>
              
              {/* Twitter/X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Twitter className="h-5 w-5 text-gray-800" />
                <span className="text-sm">X (Twitter)</span>
              </a>
              
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">WhatsApp</span>
              </a>
              
              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-600" />
                )}
                <span className="text-sm">
                  {copied ? 'Kopierat!' : 'Kopiera text'}
                </span>
              </button>
            </div>
            
            {/* Preview */}
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 border-t">
              <strong>Förhandsvisning:</strong>
              <br />
              🎣 Fantastiskt! Mer fiskeutrustning återvunnen från {submission.location}!...
            </div>
          </div>
        </>
      )}
    </div>
  )
} 