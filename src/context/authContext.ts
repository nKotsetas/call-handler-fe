import { createContext, useContext } from 'react'

export interface User {
  id: string
  name: string
}

export interface AuthContextValue {
  user: User | null
  /** Normalizes the name itself; an empty or whitespace-only name is ignored. */
  login: (name: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}

/** The signed-in user. Only use it below <AuthGate>, where a user is guaranteed. */
export function useCurrentUser(): User {
  const { user } = useAuth()
  if (!user) {
    throw new Error('useCurrentUser must be used inside <AuthGate>')
  }
  return user
}
