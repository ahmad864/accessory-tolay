"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "TOGGLE_CART" }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      }
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      const newItems = existingItem
        ? state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...state.items, { ...action.payload, quantity: 1 }]

      if (typeof window !== "undefined") {
        localStorage.setItem("cart-items", JSON.stringify(newItems))
      }

      return {
        ...state,
        items: newItems,
      }
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)

      if (typeof window !== "undefined") {
        localStorage.setItem("cart-items", JSON.stringify(newItems))
      }

      return {
        ...state,
        items: newItems,
      }
    }
    case "UPDATE_QUANTITY": {
      const newItems =
        action.payload.quantity === 0
          ? state.items.filter((item) => item.id !== action.payload.id)
          : state.items.map((item) =>
              item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
            )

      if (typeof window !== "undefined") {
        localStorage.setItem("cart-items", JSON.stringify(newItems))
      }

      return {
        ...state,
        items: newItems,
      }
    }
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    case "CLEAR_CART": {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart-items")
      }

      return {
        ...state,
        items: [],
      }
    }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-items")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    }
  }, [])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
