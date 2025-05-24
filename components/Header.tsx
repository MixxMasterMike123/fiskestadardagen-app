'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logos/fiskestadarna_logo.svg"
                alt="Fiskestädarna"
                width={180}
                height={39}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Rapportera fynd
            </Link>
            <Link 
              href="/galleri" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/galleri' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Galleri
            </Link>
            <Link 
              href="/admin" 
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/admin') 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 