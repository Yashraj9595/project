"use client"

import dynamic from "next/dynamic"
import { type ReactNode } from "react"

const ClientLayout = dynamic(() => import("@/app/client-layout"), {
  ssr: false,
})

interface RootClientWrapperProps {
  children: ReactNode
}

export function RootClientWrapper({ children }: RootClientWrapperProps) {
  return <ClientLayout>{children}</ClientLayout>
} 