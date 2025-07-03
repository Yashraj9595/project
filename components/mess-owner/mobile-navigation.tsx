"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { MessOwnerSection } from "./mess-owner-dashboard"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Receipt,
  Settings,
} from "lucide-react"

interface MobileNavigationProps {
  activeSection: MessOwnerSection
  onSectionChange: (section: MessOwnerSection) => void
}

export function MobileNavigation({
  activeSection,
  onSectionChange,
}: MobileNavigationProps) {
  const { logout } = useAuth()

  const navItems = [
    {
      id: "dashboard" as MessOwnerSection,
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: "meals" as MessOwnerSection,
      label: "Meal",
      icon: <UtensilsCrossed className="h-5 w-5" />,
    },
    {
      id: "users" as MessOwnerSection,
      label: "User",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "billing" as MessOwnerSection,
      label: "Billing",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      id: "settings" as MessOwnerSection,
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-1 p-2">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onSectionChange(item.id)}
          className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
            activeSection === item.id
              ? "bg-primary-blue/10 text-primary-blue min-w-[100px]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {item.icon}
          {activeSection === item.id && (
            <span className="text-xs font-medium mt-1">{item.label}</span>
          )}
        </Button>
      ))}
    </div>
  )
}
