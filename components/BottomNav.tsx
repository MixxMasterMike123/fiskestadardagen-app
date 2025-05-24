'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Image, Shield } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  
  const navItems = [
    {
      href: '/',
      label: 'Rapportera',
      icon: Camera,
      active: pathname === '/'
    },
    {
      href: '/galleri',
      label: 'Galleri',
      icon: Image,
      active: pathname === '/galleri'
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: Shield,
      active: pathname.startsWith('/admin')
    }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'text-accent bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${item.active ? 'text-accent' : ''}`} />
              <span className={`text-xs font-medium ${item.active ? 'text-accent' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 