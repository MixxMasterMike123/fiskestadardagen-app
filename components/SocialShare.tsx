'use client'

import { useState, useEffect } from 'react'
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
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

  // Helper function to format equipment data
  const getEquipmentText = () => {
    if (!submission.equipment || submission.equipment.length === 0) {
      return ''
    }

    const equipmentSummary = submission.equipment.map(equipment => {
      const categoryEmoji = {
        'hooks': '🪝',
        'lures': '🎣', 
        'lines': '🧵',
        'weights': '⚖️',
        'floats': '🎈',
        'other': '🔧'
      }[equipment.category] || '🎣'

      const categoryName = {
        'hooks': 'krokar',
        'lures': 'beten',
        'lines': 'fiskelina',
        'weights': 'vikter',
        'floats': 'flöten',
        'other': 'övrigt'
      }[equipment.category] || 'utrustning'

      const quantityText = (() => {
        if (equipment.category === 'lines') {
          const lineQuantities: Record<string, string> = {
            '1-5m': '1-5m',
            '5-10m': '5-10m', 
            '10-20m': '10-20m',
            '20m+': '20m+'
          }
          return lineQuantities[equipment.quantity] || equipment.quantity
        }
        
        const generalQuantities: Record<string, string> = {
          'few': 'några',
          'many': 'flera',
          'lots': 'många', 
          'huge_haul': 'extremt många'
        }
        return generalQuantities[equipment.quantity] || equipment.quantity
      })()

      return `${categoryEmoji} ${quantityText} ${categoryName}`
    }).join(', ')

    return `\n\nÅtervunnet: ${equipmentSummary}`
  }

  // Create sharing content with equipment details
  const equipmentText = getEquipmentText()
  const shareText = `🎣 Fantastiskt! Mer fiskeutrustning återvunnen från ${submission.location}!${equipmentText}

Tillsammans håller vi våra svenska vatten rena. Varje bortplockat nät och krok gör skillnad för miljön! 🌊

#Fiskestädardagen #Miljö #Fiske #RenaVatten #Sverige`

  const shareUrl = `https://app.fiskestadarna.se/galleri/`
  const fullShareText = `${shareText}\n\n👉 Se fler fynd: ${shareUrl}`

  // Social media URLs - Facebook and Twitter can include images via URL parameters
  const imageUrl = submission.images?.[0] || ''
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`

  const handleNativeShare = async () => {
    if (canShare && navigator.share) {
      try {
        const shareData: any = {
          title: 'Fiskeutrustning återvunnen!',
          text: shareText,
          url: shareUrl,
        }

        // Try to include image if available and supported
        if (submission.images?.[0]) {
          try {
            const response = await fetch(submission.images[0])
            const blob = await response.blob()
            const file = new File([blob], 'fishing-equipment.jpg', { type: blob.type })
            shareData.files = [file]
          } catch (error) {
            console.log('Could not include image in share:', error)
          }
        }

        await navigator.share(shareData)
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    }
  }

  const handleFacebookShare = async () => {
    // Copy text to clipboard for Facebook (since FB doesn't allow pre-populated text)
    try {
      await navigator.clipboard.writeText(shareText)
      // Show clear toast notification
      toast.success(
        '📋 Text kopierad! Klistra in (Ctrl+V) i Facebook-inlägget när det öppnas.',
        { 
          duration: 6000,
          position: 'top-center',
          style: {
            background: '#1877f2',
            color: 'white',
            fontSize: '14px',
            maxWidth: '400px'
          }
        }
      )
      // Open Facebook share dialog after a short delay
      setTimeout(() => {
        window.open(facebookUrl, '_blank', 'width=600,height=400')
      }, 1000)
      // Close share menu
      setIsOpen(false)
    } catch (error) {
      // If clipboard fails, show different message
      toast.error('Kunde inte kopiera text. Öppnar Facebook utan text.', { duration: 3000 })
      window.open(facebookUrl, '_blank', 'width=600,height=400')
      setIsOpen(false)
    }
  }

  const copyForFacebook = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
      toast.success('Text kopierad för Facebook! Klistra nu in i ditt inlägg.', { duration: 4000 })
    } catch (error) {
      toast.error('Kunde inte kopiera text')
    }
  }

  const copyToClipboard = async () => {
    try {
      const textToCopy = imageUrl 
        ? `${fullShareText}\n\n📷 Bild: ${imageUrl}`
        : fullShareText
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  // Create preview text (shortened for display)
  const previewText = shareText.length > 100 
    ? `${shareText.substring(0, 100)}...`
    : shareText

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
          <div className="absolute right-0 bottom-full mb-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
            <h4 className="font-medium text-gray-900 mb-3">Dela detta fynd</h4>
            
            {/* Equipment Summary */}
            {equipmentText && (
              <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                <span className="font-medium text-orange-800">Inkluderar:</span>
                <span className="text-orange-700">{equipmentText.replace('\n\n', ' ')}</span>
              </div>
            )}
            
            <div className="space-y-2">
              {/* Native Share (if supported) */}
              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Dela{imageUrl ? ' (med bild)' : ''}...</span>
                </button>
              )}
              
              {/* Facebook - Two options */}
              <div className="border border-blue-200 rounded-lg p-2 bg-blue-50">
                <div className="flex items-center mb-2">
                  <Facebook className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Facebook</span>
                  <Info className="h-3 w-3 text-blue-600 ml-1" />
                </div>
                
                <div className="space-y-1">
                  <button
                    onClick={handleFacebookShare}
                    className="w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-xs font-medium text-blue-800">1. Automatisk dela</div>
                    <div className="text-xs text-blue-600">Kopierar text + öppnar Facebook</div>
                  </button>
                  
                  <button
                    onClick={copyForFacebook}
                    className="w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-xs font-medium text-blue-800">2. Kopiera endast text</div>
                    <div className="text-xs text-blue-600">Du öppnar Facebook själv</div>
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-blue-700 bg-white p-2 rounded border">
                  💡 <strong>Tips:</strong> Facebook kräver att du klistrar in texten själv (Ctrl+V eller Cmd+V)
                </div>
              </div>
              
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
                  {copied ? 'Kopierat!' : `Kopiera text${imageUrl ? ' & bild-URL' : ''}`}
                </span>
              </button>
            </div>
            
            {/* Preview */}
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 border-t">
              <strong>Förhandsvisning:</strong>
              <br />
              {previewText}
              {imageUrl && (
                <div className="mt-1 flex items-center">
                  <span>📷 Inkluderar bild</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
} 