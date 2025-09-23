"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface StoreSettings {
  storeName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  whatsappNumber: string
  description: string
  address: string
  socialMedia: {
    instagram: string
    twitter: string
    facebook: string
  }
}

interface SettingsState {
  settings: StoreSettings
  updateSettings: (newSettings: Partial<StoreSettings>) => void
  resetSettings: () => void
}

const defaultSettings: StoreSettings = {
  storeName: "TOLAY - متجر الإكسسوارات الأنيقة",
  logo: "",
  primaryColor: "#7f5c7e",
  secondaryColor: "#6b4c6a",
  whatsappNumber: "+966501234567",
  description: "أجمل مجموعة من الإكسسوارات العصرية والأنيقة",
  address: "الرياض، المملكة العربية السعودية",
  socialMedia: {
    instagram: "https://instagram.com/tolay_store",
    twitter: "https://twitter.com/tolay_store",
    facebook: "https://facebook.com/tolay_store",
  },
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      resetSettings: () => {
        set({ settings: defaultSettings })
      },
    }),
    {
      name: "store-settings",
    },
  ),
)
