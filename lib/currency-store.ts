"use client"

import { create } from "zustand"

export type Currency = "USD" | "SYP" | "TRY"

interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (price: number) => number
  getCurrencySymbol: () => string
}

// Exchange rates (you can update these or fetch from an API)
const exchangeRates = {
  USD: 1,
  SYP: 13000, // 1 USD = 13000 SYP (approximate)
  TRY: 30, // 1 USD = 30 TRY (approximate)
}

export const useCurrency = create<CurrencyState>((set, get) => ({
  currency: "USD",
  setCurrency: (currency) => set({ currency }),
  convertPrice: (price) => {
    const { currency } = get()
    return Math.round(price * exchangeRates[currency])
  },
  getCurrencySymbol: () => {
    const { currency } = get()
    switch (currency) {
      case "USD":
        return "$"
      case "SYP":
        return "ل.س"
      case "TRY":
        return "₺"
      default:
        return "$"
    }
  },
}))
