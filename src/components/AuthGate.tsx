import type { ReactNode } from 'react'
import { useAuth } from '../context/authContext'
import { LoginForm } from './LoginForm'

interface AuthGateProps {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { user } = useAuth()
  return user ? children : <LoginForm />
}
