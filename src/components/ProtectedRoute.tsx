import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token)
  return token ? children : <Navigate to="/login" replace />
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token)
  return token ? <Navigate to="/reviews" replace /> : children
}
