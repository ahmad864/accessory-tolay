"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@supabase/supabase-js"

export type UserRole = "admin" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isAdmin: () => boolean
}

// إنشاء عميل Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // جلب الإدمن من جدول 'admins'
          const { data, error } = await supabase
            .from("admins")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .single()

          if (error || !data) {
            return { success: false, message: "بيانات الدخول غير صحيحة" }
          }

          // تعيين بيانات المستخدم
          set({
            user: {
              id: data.id,
              name: data.name || "مدير",
              email: data.email,
              role: "admin",
              createdAt: data.created_at,
            },
            isAuthenticated: true,
          })

          return { success: true, message: "تم تسجيل دخول المدير بنجاح" }
        } catch (err) {
          return { success: false, message: "حدث خطأ أثناء تسجيل الدخول" }
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === "admin"
      },
    }),
    {
      name: "auth-storage", // لتخزين حالة الجلسة
    }
  )
)
