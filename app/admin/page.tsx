'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { login, isAuthenticated } from '@/lib/auth'
import Header from '@/components/Header'

interface LoginForm {
  username: string
  password: string
}

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin/dashboard')
    }
  }, [router])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    
    if (login(data.username, data.password)) {
      toast.success('Inloggning lyckades!')
      router.push('/admin/dashboard')
    } else {
      toast.error('Felaktigt användarnamn eller lösenord')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Administratörsinloggning
              </h1>
              <p className="text-gray-600 text-center mb-8">
                Logga in för att hantera rapporter
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Användarnamn
                </label>
                <input
                  {...register('username', { required: 'Användarnamn krävs' })}
                  type="text"
                  className="input-field"
                  placeholder="Ange användarnamn"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lösenord
                </label>
                <input
                  {...register('password', { required: 'Lösenord krävs' })}
                  type="password"
                  className="input-field"
                  placeholder="Ange lösenord"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loggar in...' : 'Logga in'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 