import { AdminSession } from '@/types'

const ADMIN_USERNAME = 'b8shieldadmin'
const ADMIN_PASSWORD = 'B8shieldIsDop3_99'
const SESSION_KEY = 'admin_session'

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session: AdminSession = {
      isAuthenticated: true,
      username: ADMIN_USERNAME,
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
    
    return true
  }
  
  return false
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (sessionData) {
      return JSON.parse(sessionData) as AdminSession
    }
  } catch (error) {
    console.error('Error reading session:', error)
  }
  
  return null
}

export function isAuthenticated(): boolean {
  const session = getSession()
  return session?.isAuthenticated || false
} 