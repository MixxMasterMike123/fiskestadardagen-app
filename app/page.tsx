'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SubmissionForm from '@/components/SubmissionForm'
import ImpactDashboard from '@/components/ImpactDashboard'
import { getSubmissions } from '@/lib/submissions'
import { Submission } from '@/types'

export default function HomePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await getSubmissions('approved')
      setSubmissions(data)
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Rapportera återvunnen fiskeutrustning
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hjälp oss hålla våra vatten rena! Rapportera fiskeutrustning som du har återvunnit från sjöar, älvar och andra vattendrag.
            </p>
          </div>
          
          {/* Impact Dashboard */}
          <div>
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <span className="ml-3 text-gray-600">Laddar statistik...</span>
                </div>
              </div>
            ) : (
              <ImpactDashboard submissions={submissions} />
            )}
          </div>
          
          {/* Submission Form */}
          <SubmissionForm />
        </div>
      </main>
    </div>
  )
} 