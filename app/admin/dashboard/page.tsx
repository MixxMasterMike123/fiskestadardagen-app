'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { isAuthenticated, logout } from '@/lib/auth'
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from '@/lib/submissions'
import { Submission } from '@/types'
import Header from '@/components/Header'
import AdminMap from '@/components/AdminMap'
import ImpactDashboard from '@/components/ImpactDashboard'
import { CheckCircle, XCircle, Trash2, Eye, Calendar, MapPin, Phone, Mail, User } from 'lucide-react'

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([])
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'all' | 'map' | 'statistics'>('pending')
  const router = useRouter()

  const getQuantityLabel = (category: string, quantity: string) => {
    // Lines - show in meters
    if (category === 'lines') {
      switch (quantity) {
        case '1-5m': return '1-5 meter'
        case '5-10m': return '5-10 meter'
        case '10-20m': return '10-20 meter'
        case '20m+': return '20+ meter'
        default: return quantity
      }
    }
    
    // Nets - show specific counts
    if (category === 'nets') {
      switch (quantity) {
        case '1': return '1 nät'
        case '2': return '2 nät'
        case '3': return '3 nät'
        case '4': return '4 nät'
        case 'more': return '5+ nät'
        default: return quantity
      }
    }
    
    // Other equipment - show ranges
    switch (quantity) {
      case 'few': return 'Några få (1-10)'
      case 'many': return 'Flera (10-50)'
      case 'lots': return 'Många (50+)'
      case 'huge_haul': return 'Extremt mycket (100+)'
      default: return quantity
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin')
      return
    }
    loadSubmissions()
  }, [router])

  const loadSubmissions = async () => {
    try {
      const [allSubs, pendingSubs, approvedSubs] = await Promise.all([
        getSubmissions(),
        getSubmissions('pending'),
        getSubmissions('approved')
      ])
      
      setSubmissions(allSubs)
      setPendingSubmissions(pendingSubs)
      setApprovedSubmissions(approvedSubs)
    } catch (error) {
      toast.error('Fel vid laddning av rapporter')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await updateSubmissionStatus(id, 'approved')
      toast.success('Rapport godkänd!')
      loadSubmissions()
    } catch (error) {
      toast.error('Fel vid godkännande')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateSubmissionStatus(id, 'rejected')
      toast.success('Rapport avvisad')
      loadSubmissions()
    } catch (error) {
      toast.error('Fel vid avvisning')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Är du säker på att du vill ta bort denna rapport permanent?')) {
      try {
        await deleteSubmission(id)
        toast.success('Rapport borttagen')
        loadSubmissions()
      } catch (error) {
        toast.error('Fel vid borttagning')
      }
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  const getCurrentSubmissions = () => {
    switch (selectedTab) {
      case 'pending':
        return pendingSubmissions
      case 'approved':
        return approvedSubmissions
      case 'all':
        return submissions
      case 'map':
        return submissions
      case 'statistics':
        return submissions
      default:
        return pendingSubmissions
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Laddar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administratörspanel</h1>
              <p className="text-gray-600">Hantera rapporter av återvunnen fiskeutrustning</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logga ut
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-accent">{pendingSubmissions.length}</div>
              <div className="text-gray-600">Väntande rapporter</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{approvedSubmissions.length}</div>
              <div className="text-gray-600">Godkända rapporter</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-gray-600">{submissions.length}</div>
              <div className="text-gray-600">Totalt rapporter</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Väntande ({pendingSubmissions.length})
              </button>
              <button
                onClick={() => setSelectedTab('approved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'approved'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Godkända ({approvedSubmissions.length})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alla ({submissions.length})
              </button>
              <button
                onClick={() => setSelectedTab('map')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'map'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Karta
              </button>
              <button
                onClick={() => setSelectedTab('statistics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'statistics'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Statistik
              </button>
            </nav>
          </div>

          {/* Content based on selected tab */}
          {selectedTab === 'map' ? (
            <div className="mb-8">
              <AdminMap submissions={submissions} />
            </div>
          ) : selectedTab === 'statistics' ? (
            <div className="mb-8">
              <ImpactDashboard submissions={submissions} />
            </div>
          ) : (
            /* Submissions List */
            <div className="space-y-6">
              {getCurrentSubmissions().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">Inga rapporter att visa</p>
                </div>
              ) : (
                getCurrentSubmissions().map((submission) => (
                  <div key={submission.id} className="card">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Images */}
                      <div className="lg:w-1/3">
                        {submission.images.length > 0 && (
                          <div className="grid gap-2">
                            <img
                              src={submission.images[0]}
                              alt="Rapport"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {submission.images.length > 1 && (
                              <div className="grid grid-cols-3 gap-1">
                                {submission.images.slice(1, 4).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Bild ${index + 2}`}
                                    className="w-full h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="lg:w-2/3">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                submission.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : submission.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {submission.status === 'pending' && 'Väntande'}
                                {submission.status === 'approved' && 'Godkänd'}
                                {submission.status === 'rejected' && 'Avvisad'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{submission.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{submission.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{submission.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{submission.location}</span>
                          </div>
                        </div>

                        {/* Equipment Info */}
                        {submission.equipment && submission.equipment.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                              🎣 Utrustningsinformation
                            </h4>
                            <div className="space-y-2">
                              {submission.equipment.map((equipment, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium text-blue-800">Typ:</span>
                                    <span className="ml-2 text-blue-700">
                                      <span className="text-sm font-medium">
                                        {equipment.category === 'hooks' && '🪝 Krokar'}
                                        {equipment.category === 'lures' && '🎣 Beten/Drag'}
                                        {equipment.category === 'lines' && '🧵 Fiskelina'}
                                        {equipment.category === 'nets' && '🕸️ Nät'}
                                        {equipment.category === 'weights' && '⚖️ Vikter/Lod'}
                                        {equipment.category === 'floats' && '🎈 Flöten'}
                                        {equipment.category === 'other' && '🔧 Övrigt'}
                                      </span>
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-blue-800">Mängd:</span>
                                    <span className="ml-2 text-blue-700">
                                      {getQuantityLabel(equipment.category, equipment.quantity)}
                                    </span>
                                  </div>
                                  {equipment.description && (
                                    <div className="md:col-span-2 mt-1">
                                      <span className="font-medium text-blue-800">Detaljer:</span>
                                      <span className="ml-2 text-blue-700">{equipment.description}</span>
                                    </div>
                                  )}
                                  {equipment.adminAdjustedCount && (
                                    <div className="md:col-span-2 mt-1">
                                      <span className="font-medium text-blue-800">Admin-justerat antal:</span>
                                      <span className="ml-2 text-blue-700">{equipment.adminAdjustedCount}</span>
                                    </div>
                                  )}
                                  {index < (submission.equipment?.length || 0) - 1 && (
                                    <div className="md:col-span-2 border-b border-blue-200 my-2"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Message */}
                        {submission.message && (
                          <div className="mb-4">
                            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                              {submission.message}
                            </p>
                          </div>
                        )}

                        {/* Date */}
                        <div className="flex items-center mb-4">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            Rapporterad: {submission.createdAt.toLocaleDateString('sv-SE')} {submission.createdAt.toLocaleTimeString('sv-SE')}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(submission.id)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Godkänn
                              </button>
                              <button
                                onClick={() => handleReject(submission.id)}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Avvisa
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(submission.id)}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Ta bort
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 