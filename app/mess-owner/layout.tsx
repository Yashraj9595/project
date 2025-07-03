"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MessOwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "mess_owner")) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || user?.role !== "mess_owner") {
    return null
  }

  return <div className="min-h-screen bg-background">{children}</div>
} 