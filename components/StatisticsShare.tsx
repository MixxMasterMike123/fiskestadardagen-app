'use client'

import { useState, useEffect, useRef } from 'react'
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ImpactStats, formatNumber } from '@/lib/statistics'

interface StatisticsShareProps {
  stats: ImpactStats
}

export default function StatisticsShare({ stats }: StatisticsShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top')
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  // Calculate popup position based on button position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const spaceAbove = buttonRect.top
      const spaceBelow = window.innerHeight - buttonRect.bottom
      
      // If there's more space below or insufficient space above, show popup below
      if (spaceBelow > spaceAbove || spaceAbove < 400) {
        setPopupPosition('bottom')
      } else {
        setPopupPosition('top')
      }
    }
  }, [isOpen])

  // Create sharing content with statistics
  const shareText = `🌊 Fantastiska resultat från Fiskestädardagen!

📊 Hittills återvunnet:
🎯 ${stats.totalSubmissions} rapporter godkända
🧹 ${formatNumber(stats.estimatedTotalPieces)} delar fiskeutrustning
🧵 ${Math.round(stats.lineMeters)} meter fiskelina

Tillsammans håller vi våra svenska vatten rena! Varje bortplockat nät och krok gör skillnad för miljön! 🌊

#Fiskestädardagen #Miljö #Fiske #RenaVatten #Sverige`

  const shareUrl = `https://fiskestadardagen.web.app/galleri`
  const fullShareText = `${shareText}\n\n👉 Se alla fynd: ${shareUrl}`

  // Social media URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`

  const handleNativeShare = async () => {
    if (canShare && navigator.share) {
      try {
        await navigator.share({
          title: 'Fiskestädardagen - Miljöpåverkan',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    }
  }

  const handleFacebookShare = async () => {
    // Copy text to clipboard for Facebook
    try {
      await navigator.clipboard.writeText(shareText)
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
      setTimeout(() => {
        window.open(facebookUrl, '_blank', 'width=600,height=400')
      }, 1000)
      setIsOpen(false)
    } catch (error) {
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
      await navigator.clipboard.writeText(fullShareText)
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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        title="Dela statistik"
      >
        <Share2 className="h-4 w-4 lg:h-5 lg:w-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Menu with Dynamic Positioning */}
          <div className={`absolute right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 ${
            popupPosition === 'top' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          }`}>
            <h4 className="font-medium text-gray-900 mb-3">Dela miljöpåverkan</h4>
            
            {/* Statistics Summary */}
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
              <span className="font-medium text-green-800">Statistik:</span>
              <span className="text-green-700 block mt-1">
                {stats.totalSubmissions} rapporter • {formatNumber(stats.estimatedTotalPieces)} delar • {Math.round(stats.lineMeters)}m lina
              </span>
            </div>
            
            <div className="space-y-2">
              {/* Native Share (if supported) */}
              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Dela statistik...</span>
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
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
                  {copied ? 'Kopierat!' : 'Kopiera text & länk'}
                </span>
              </button>
            </div>
            
            {/* Preview */}
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 border-t">
              <strong>Förhandsvisning:</strong>
              <br />
              {previewText}
              <div className="mt-1 flex items-center">
                <span>🔗 Länk till galleri inkluderad</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 