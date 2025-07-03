"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Check, AlertCircle } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { useToast } from "@/hooks/use-toast"

interface InstallButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  text?: string
}

export function InstallButton({ 
  variant = "default", 
  size = "default", 
  className, 
  text = "Install App" 
}: InstallButtonProps) {
  const { canInstall, isInstalled, install } = usePWAInstall()
  const { toast } = useToast()
  const [isInstalling, setIsInstalling] = useState(false)

  if (isInstalled) {
    return (
      <Button variant="ghost" size={size} className={className} disabled>
        <Check className="mr-2 h-4 w-4" />
        Installed
      </Button>
    )
  }

  if (!canInstall) return null

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await install()
      if (success) {
        toast({
          title: "Installation Started",
          description: "Follow the prompts to install MessHub",
        })
      } else {
        toast({
          title: "Installation Cancelled",
          description: "You can install the app later from the menu",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[PWA] Install error:", error)
      toast({
        title: "Installation Failed",
        description: "Please try again or use a supported browser",
        variant: "destructive",
      })
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      disabled={isInstalling}
      className={className}
    >
      {isInstalling ? (
        <AlertCircle className="mr-2 h-4 w-4 animate-pulse" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isInstalling ? "Installing..." : text}
    </Button>
  )
} 