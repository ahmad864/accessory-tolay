"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "user" | "guest"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<{
    success: boolean
    message: string
  }>
  logout: () => void
  isAdmin: () => boolean
  isUser: () => boolean
}

// Mock admin credentials - in production, this would be handled by a backend
const ADMIN_CREDENTIALS = {
  email: "admin@tolay.com",
  password: "admin123",
}

// Mock user database - in production, this would be handled by a backend
const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "مدير المتجر",
    email: "admin@tolay.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Check admin credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const adminUser = mockUsers.find((u) => u.email === email && u.role === "admin")
          if (adminUser) {
            set({ user: adminUser, isAuthenticated: true })
            return { success: true, message: "تم تسجيل دخول المدير بنجاح" }
          }
        }

        // Check regular users (mock implementation)
        const user = mockUsers.find((u) => u.email === email)
        if (user) {
          set({ user, isAuthenticated: true })
          return { success: true, message: "تم تسجيل الدخول بنجاح" }
        }

        return { success: false, message: "بيانات الدخول غير صحيحة" }
      },

      register: async (userData) => {
        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === userData.email)
        if (existingUser) {
          return { success: false, message: "البريد الإلكتروني مستخدم بالفعل" }
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: "user",
          createdAt: new Date().toISOString(),
        }

        mockUsers.push(newUser)
        set({ user: newUser, isAuthenticated: true })
        return { success: true, message: "تم إنشاء الحساب بنجاح" }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === "admin"
      },

      isUser: () => {
        const { user } = get()
        return user?.role === "user"
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
