"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesState {
  favorites: number[]
  toggleFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean
  getFavoritesCount: () => number
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),
      isFavorite: (productId) => get().favorites.includes(productId),
      getFavoritesCount: () => get().favorites.length,
    }),
    {
      name: "favorites-storage",
    },
  ),
)
