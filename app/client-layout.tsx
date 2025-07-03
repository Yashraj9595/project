"use client"

import { useEffect, useState } from "react"
import { LoadingScreen } from "@/components/loading-screen"

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show loading screen for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  return isLoading ? <LoadingScreen /> : <>{children}</>
}

export default ClientLayout 