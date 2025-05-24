'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      setShowPrompt(false)
    }
  }, [])

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Download className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">
            Installera Fiskestädarna
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Få en bättre upplevelse med vår app - fungerar offline!
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleInstall}
              className="bg-accent text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Installera
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-600 px-3 py-1.5 rounded text-sm font-medium hover:text-gray-800 transition-colors"
            >
              Inte nu
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 