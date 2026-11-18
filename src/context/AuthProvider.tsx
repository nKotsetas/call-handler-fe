import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { normalizeName, toUserId } from '../utils/user'
import { AuthContext, type User } from './authContext'

const STORAGE_KEY = 'call-handler:user'

function loadStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed: unknown = JSON.parse(stored)
    if (
      parsed &&
      typeof parsed === 'object' &&
      'id' in parsed &&
      'name' in parsed &&
      typeof parsed.id === 'string' &&
      typeof parsed.name === 'string'
    ) {
      const name = normalizeName(parsed.name)
      // Anything that doesn't match the current id scheme (older build, manual edit) means signing in again.
      if (name && parsed.id === toUserId(name)) {
        return { id: parsed.id, name }
      }
    }
    return null
  } catch {
    return null
  }
}

function saveStoredUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Storage can be unavailable (private mode); the session still works in memory.
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(loadStoredUser)

  const login = useCallback((rawName: string) => {
    const name = normalizeName(rawName)
    if (!name) return
    const nextUser: User = { id: toUserId(name), name }
    setUser(nextUser)
    saveStoredUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    saveStoredUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}
