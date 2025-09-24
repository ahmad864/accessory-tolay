"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabaseClient"

export type UserRole = "admin" | "user"

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
  register: (userData: { name: string; email: string; phone?: string; password: string }) => Promise<{
    success: boolean
    message: string
  }>
  logout: () => void
  isAdmin: () => boolean
  isUser: () => boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // تحقق من جدول admins أو users
        const { data, error } = await supabase
          .from<User>("admins")
          .select("*")
          .eq("email", email)
          .eq("password", password)
          .single()

        if (error || !data) {
          return { success: false, message: "بيانات الدخول غير صحيحة" }
        }

        set({ user: data, isAuthenticated: true })
        return { success: true, message: "تم تسجيل الدخول بنجاح" }
      },

      register: async (userData) => {
        // تحقق من وجود البريد مسبقاً
        const { data: existingUser } = await supabase
          .from<User>("admins")
          .select("*")
          .eq("email", userData.email)
          .single()

        if (existingUser) {
          return { success: false, message: "البريد الإلكتروني مستخدم بالفعل" }
        }

        // إنشاء مستخدم جديد
        const { data, error } = await supabase
          .from<User>("admins")
          .insert([
            {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              password: userData.password,
              role: "user",
              createdAt: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error || !data) {
          return { success: false, message: "حدث خطأ أثناء إنشاء الحساب" }
        }

        set({ user: data, isAuthenticated: true })
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
