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

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing!")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const supabase = getSupabaseClient()

        try {
          const { data, error } = await supabase
            .from("admins")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .single()

          if (error || !data) {
            return { success: false, message: "بيانات الدخول غير صحيحة" }
          }

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
      name: "auth-storage",
    }
  )
)
