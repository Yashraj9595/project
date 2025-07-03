"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/components/theme-context"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
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
  const { isDarkMode } = useTheme()

  const navItems = [
    {
      id: "dashboard" as MessOwnerSection,
      label: "Dashboard",
      icon: (props: any) => <LayoutDashboard {...props} />,
      colors: {
        light: { bg: "bg-blue-100/80", text: "text-primary-blue" },
        dark: { bg: "bg-blue-900/20", text: "text-blue-200" },
      },
    },
    {
      id: "meals" as MessOwnerSection,
      label: "Meals",
      icon: (props: any) => <UtensilsCrossed {...props} />,
      colors: {
        light: { bg: "bg-green-100/80", text: "text-green-700" },
        dark: { bg: "bg-green-900/20", text: "text-green-200" },
      },
    },
    {
      id: "users" as MessOwnerSection,
      label: "Users",
      icon: (props: any) => <Users {...props} />,
      colors: {
        light: { bg: "bg-purple-100/80", text: "text-purple-700" },
        dark: { bg: "bg-purple-900/20", text: "text-purple-200" },
      },
    },
    {
      id: "billing" as MessOwnerSection,
      label: "Billing",
      icon: (props: any) => <Receipt {...props} />,
      colors: {
        light: { bg: "bg-orange-100/80", text: "text-orange-700" },
        dark: { bg: "bg-orange-900/20", text: "text-orange-200" },
      },
    },
    {
      id: "settings" as MessOwnerSection,
      label: "Settings",
      icon: (props: any) => <Settings {...props} />,
      colors: {
        light: { bg: "bg-gray-100/80", text: "text-gray-700" },
        dark: { bg: "bg-gray-800/20", text: "text-gray-200" },
      },
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <LayoutGroup>
        <nav
          className="relative flex h-16 w-full max-w-md items-center justify-around rounded-full bg-white px-2 shadow-lg dark:bg-gray-800"
          aria-label="Bottom navigation"
        >
          {navItems.map((tab) => {
            const isActive = activeSection === tab.id
            const Icon = tab.icon
            const activeBgClass = tab.colors.light.bg
            const activeTextColorClass = tab.colors.light.text
            const activeBgClassDark = tab.colors.dark.bg
            const activeTextColorClassDark = tab.colors.dark.text

            return (
              <motion.button
                key={tab.id}
                className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-full py-2 text-gray-500 transition-colors duration-200 ease-in-out focus:outline-none dark:text-gray-400 ${
                  isActive ? "text-current" : "hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => onSectionChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className={`absolute inset-0 rounded-full ${activeBgClass} dark:${activeBgClassDark}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 ${
                    isActive
                      ? `${activeTextColorClass} dark:${activeTextColorClassDark}`
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, x: -5 }}
                        animate={{ opacity: 1, width: "auto", x: 0 }}
                        exit={{ opacity: 0, width: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap text-sm font-medium"
                      >
                        {tab.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            )
          })}
        </nav>
      </LayoutGroup>
    </div>
  )
}
