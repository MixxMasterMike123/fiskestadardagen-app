import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Footer from '../components/Footer'
import InstallPrompt from '../components/InstallPrompt'
import BottomNav from '../components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fiskestädardagen - Fiskeutrustning Återvinning',
  description: 'Rapportera hittad fiskeutrustning för återvinning och håll Sveriges vatten rena',
  keywords: ['fiskeutrustning', 'återvinning', 'miljö', 'vatten', 'sverige'],
  authors: [{ name: 'Fiskestädarna' }],
  creator: 'Fiskestädarna',
  publisher: 'Fiskestädarna',
  icons: {
    icon: '/logos/fiskestadarna_logo.svg',
    apple: '/logos/fiskestadarna_logo.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fiskestädarna',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://app.fiskestadarna.se',
    title: 'Fiskestädardagen - Fiskeutrustning Återvinning',
    description: 'Rapportera återvunnen fiskeutrustning och håll Sveriges vatten rena',
    siteName: 'Fiskestädardagen',
  },
  twitter: {
    card: 'summary',
    title: 'Fiskestädardagen - Fiskeutrustning Återvinning',
    description: 'Rapportera återvunnen fiskeutrustning och håll Sveriges vatten rena',
  },
}

export const viewport: Viewport = {
  themeColor: '#ee7e30',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="apple-touch-icon" href="/logos/fiskestadarna_logo.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fiskestädarna" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ee7e30" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 pb-20 md:pb-0">
            {children}
          </div>
          <Footer />
        </div>
        <BottomNav />
        <InstallPrompt />
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 