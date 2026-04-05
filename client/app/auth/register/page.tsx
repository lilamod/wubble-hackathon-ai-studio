'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Register is handled on the login page via tab switching
export default function RegisterRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/auth/login') }, [router])
  return null
}
