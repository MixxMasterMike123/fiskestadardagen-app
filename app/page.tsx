import Header from '@/components/Header'
import SubmissionForm from '@/components/SubmissionForm'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Fiskestädardagen
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hjälp oss hålla våra vatten rena! Rapportera fiskeutrustning som du har återvunnit från sjöar, älvar och andra vattendrag.
            </p>
          </div>
          
          <SubmissionForm />
        </div>
      </main>
    </div>
  )
} 