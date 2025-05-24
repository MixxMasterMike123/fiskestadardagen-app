'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full"></div>
              <h1 className="text-xl font-bold text-gray-900">
                Fiskestädardagen
              </h1>
            </div>
          </div>
          
          <nav className="flex space-x-8">
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