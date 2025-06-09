'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/context/AuthProvider'
import PhoneAuthDrawer from '@/components/PhoneAuthDrawer'

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <>
      {!user && <PhoneAuthDrawer open />}
      {children}
    </>
  )
}
