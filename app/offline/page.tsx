"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 text-center space-y-4">
        <div className="flex justify-center">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
        <p className="text-muted-foreground">
          Please check your internet connection and try again.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full">
          Try Again
        </Button>
      </Card>
    </div>
  )
} 