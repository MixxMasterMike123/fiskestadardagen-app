import Image from 'next/image'

export default function Footer() {
  const partners = [
    {
      name: 'B8shield™',
      src: '/logos/b8shield_logo.svg',
      alt: 'B8shield'
    },
    {
      name: 'HÅLL SVERIGE RENT®',
      src: '/logos/hallSverigeRent_logo.svg', 
      alt: 'Håll Sverige Rent'
    },
    {
      name: 'iFISKE',
      src: '/logos/iFiske_Logo.webp',
      alt: 'iFISKE'
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Collaborators Section */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Fiskestädarna samarbetar med
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12">
            {partners.map((partner) => (
              <div key={partner.name} className="flex items-center">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={150}
                  height={60}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* App Info */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Tillsammans håller vi Sveriges vatten rena från fiskeutrustning
            </p>
            <p className="text-xs text-gray-500">
              © 2025 Fiskestädardagen. En del av miljöarbetet för renare vatten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 