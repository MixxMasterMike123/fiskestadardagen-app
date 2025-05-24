import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fiskestädardagen - Fiskeutrustning Återvinning',
  description: 'Rapportera hittad fiskeutrustning för återvinning och håll Sveriges vatten rena',
  icons: {
    icon: '/logos/fiskestadarna_logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 