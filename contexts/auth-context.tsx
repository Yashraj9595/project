"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

export type UserRole = "user" | "mess_owner" | "project_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLogin?: string
  messId?: string // For mess owners
  subscriptionStatus?: "active" | "expired" | "none" // For users
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  updatePassword: (email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Protected routes configuration
const PROTECTED_ROUTES = {
  user: ["/user", "/user/dashboard", "/user/profile"],
  mess_owner: ["/mess-owner", "/mess-owner/dashboard"],
  project_admin: ["/admin", "/admin/dashboard"],
}

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-otp"]

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20",
    subscriptionStatus: "active",
  },
  {
    id: "2",
    name: "Sarah Kitchen",
    email: "owner@example.com",
    role: "mess_owner",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-20",
    messId: "mess_123",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "project_admin",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-20",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored user session
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Route protection
  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    if (isPublicRoute && isAuthenticated) {
      // Redirect authenticated users from public routes to their dashboard
      const dashboardRoute = user?.role === "user" 
        ? "/user/dashboard"
        : user?.role === "mess_owner"
        ? "/mess-owner/dashboard"
        : "/admin/dashboard"
      router.replace(dashboardRoute)
      return
    }

    if (!isPublicRoute && !isAuthenticated) {
      // Redirect unauthenticated users to login
      toast.error("Please login to continue")
      router.replace("/login")
      return
    }

    if (isAuthenticated && user) {
      // Check role-based access
      const userRoutes = PROTECTED_ROUTES[user.role]
      const hasAccess = userRoutes.some(route => pathname.startsWith(route))
      if (!hasAccess) {
        toast.error("Access denied")
        router.replace(`/${user.role}/dashboard`)
      }
    }
  }, [isAuthenticated, pathname, user, isLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // Mock authentication - in real app, this would call your API
      const foundUser = mockUsers.find((u) => u.email === email)

      if (foundUser && password.length >= 6) {
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString().split("T")[0] }
        setUser(updatedUser)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        localStorage.setItem("token", "mock_jwt_token")

        // Redirect to appropriate dashboard
        const dashboardRoute = 
          updatedUser.role === "user" 
            ? "/user/dashboard"
            : updatedUser.role === "mess_owner"
            ? "/mess-owner/dashboard"
            : "/admin/dashboard"
        router.replace(dashboardRoute)
        return true
      }

      toast.error("Invalid credentials")
      return false
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.replace("/login")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true)
      // Mock registration - in real app, this would call your API
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "user",
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString().split("T")[0],
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("token", "mock_jwt_token")

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // Mock password reset - in real app, this would call your API
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        toast.error("User not found")
        return false
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("Password reset failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // Mock OTP verification - in real app, this would call your API
      if (otp === "123456") {
        return true
      }
      toast.error("Invalid OTP")
      return false
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error("OTP verification failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // Mock password update - in real app, this would call your API
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        toast.error("User not found")
        return false
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("Password update error:", error)
      toast.error("Password update failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
        register,
        resetPassword,
        verifyOTP,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
