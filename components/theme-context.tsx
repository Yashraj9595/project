"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "light" | "dark"
  isDarkMode: boolean
  toggleTheme: () => void
  isMobileDevice: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_KEY = "messhub-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const isMobileDevice = useIsMobile()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme
      if (stored && ["light", "dark", "system"].includes(stored)) {
        setTheme(stored)
      }
    } catch (error) {
      console.error("Error reading theme from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)

      const updateActualTheme = () => {
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
          setActualTheme(systemTheme)
          setIsDarkMode(systemTheme === "dark")
          document.documentElement.classList.toggle("dark", systemTheme === "dark")
        } else {
          setActualTheme(theme)
          setIsDarkMode(theme === "dark")
          document.documentElement.classList.toggle("dark", theme === "dark")
        }
      }

      updateActualTheme()

      if (theme === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handler = () => updateActualTheme()
        mediaQuery.addEventListener("change", handler)
        return () => mediaQuery.removeEventListener("change", handler)
      }
    } catch (error) {
      console.error("Error updating theme:", error)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(current => {
      if (current === "dark") return "light"
      if (current === "light") return "dark"
      // If system, switch to the opposite of the actual theme
      return actualTheme === "dark" ? "light" : "dark"
    })
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        actualTheme, 
        isDarkMode, 
        toggleTheme,
        isMobileDevice
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
