"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { useProducts } from "./products-store"

export interface InventoryAlert {
  id: string
  productId: number
  productName: string
  type: "low_stock" | "out_of_stock" | "restock_needed"
  message: string
  timestamp: Date
  read: boolean
}

export interface StockMovement {
  id: string
  productId: number
  productName: string
  type: "sale" | "restock" | "adjustment" | "return"
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  timestamp: Date
}

interface InventoryState {
  alerts: InventoryAlert[]
  stockMovements: StockMovement[]
  lowStockThreshold: number
  autoReorderEnabled: boolean
  reorderQuantity: number
}

type InventoryAction =
  | { type: "ADD_ALERT"; payload: InventoryAlert }
  | { type: "MARK_ALERT_READ"; payload: string }
  | { type: "CLEAR_ALERTS" }
  | { type: "ADD_STOCK_MOVEMENT"; payload: StockMovement }
  | { type: "SET_LOW_STOCK_THRESHOLD"; payload: number }
  | { type: "TOGGLE_AUTO_REORDER" }
  | { type: "SET_REORDER_QUANTITY"; payload: number }
  | { type: "PROCESS_SALE"; payload: { productId: number; quantity: number; productName: string } }

const initialState: InventoryState = {
  alerts: [],
  stockMovements: [],
  lowStockThreshold: 5,
  autoReorderEnabled: false,
  reorderQuantity: 20,
}

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
      }
    case "MARK_ALERT_READ":
      return {
        ...state,
        alerts: state.alerts.map((alert) => (alert.id === action.payload ? { ...alert, read: true } : alert)),
      }
    case "CLEAR_ALERTS":
      return {
        ...state,
        alerts: [],
      }
    case "ADD_STOCK_MOVEMENT":
      return {
        ...state,
        stockMovements: [action.payload, ...state.stockMovements.slice(0, 99)], // Keep last 100 movements
      }
    case "SET_LOW_STOCK_THRESHOLD":
      return {
        ...state,
        lowStockThreshold: action.payload,
      }
    case "TOGGLE_AUTO_REORDER":
      return {
        ...state,
        autoReorderEnabled: !state.autoReorderEnabled,
      }
    case "SET_REORDER_QUANTITY":
      return {
        ...state,
        reorderQuantity: action.payload,
      }
    case "PROCESS_SALE":
      const movement: StockMovement = {
        id: Date.now().toString(),
        productId: action.payload.productId,
        productName: action.payload.productName,
        type: "sale",
        quantity: -action.payload.quantity,
        previousStock: 0, // Will be updated by the component
        newStock: 0, // Will be updated by the component
        timestamp: new Date(),
      }
      return {
        ...state,
        stockMovements: [movement, ...state.stockMovements.slice(0, 99)],
      }
    default:
      return state
  }
}

const InventoryContext = createContext<{
  state: InventoryState
  dispatch: React.Dispatch<InventoryAction>
} | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState)

  return <InventoryContext.Provider value={{ state, dispatch }}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

// Hook for inventory monitoring
export function useInventoryMonitor() {
  const { state: inventoryState, dispatch: inventoryDispatch } = useInventory()
  const {
    state: { products },
    dispatch: productsDispatch,
  } = useProducts()

  const checkStockLevels = () => {
    products.forEach((product) => {
      if (product.stock === 0) {
        const existingAlert = inventoryState.alerts.find(
          (alert) => alert.productId === product.id && alert.type === "out_of_stock" && !alert.read,
        )
        if (!existingAlert) {
          inventoryDispatch({
            type: "ADD_ALERT",
            payload: {
              id: `out_of_stock_${product.id}_${Date.now()}`,
              productId: product.id,
              productName: product.name,
              type: "out_of_stock",
              message: `نفدت كمية ${product.name} من المخزون`,
              timestamp: new Date(),
              read: false,
            },
          })
        }
      } else if (product.stock <= inventoryState.lowStockThreshold) {
        const existingAlert = inventoryState.alerts.find(
          (alert) => alert.productId === product.id && alert.type === "low_stock" && !alert.read,
        )
        if (!existingAlert) {
          inventoryDispatch({
            type: "ADD_ALERT",
            payload: {
              id: `low_stock_${product.id}_${Date.now()}`,
              productId: product.id,
              productName: product.name,
              type: "low_stock",
              message: `كمية ${product.name} منخفضة (${product.stock} قطعة متبقية)`,
              timestamp: new Date(),
              read: false,
            },
          })
        }
      }
    })
  }

  const processSale = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const newStock = Math.max(0, product.stock - quantity)

    // Update product stock
    productsDispatch({
      type: "UPDATE_STOCK",
      payload: { id: productId, stock: newStock },
    })

    // Add stock movement
    inventoryDispatch({
      type: "ADD_STOCK_MOVEMENT",
      payload: {
        id: Date.now().toString(),
        productId,
        productName: product.name,
        type: "sale",
        quantity: -quantity,
        previousStock: product.stock,
        newStock,
        timestamp: new Date(),
      },
    })

    // Check if we need to create alerts
    setTimeout(checkStockLevels, 100)
  }

  const restockProduct = (productId: number, quantity: number, reason?: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const newStock = product.stock + quantity

    // Update product stock
    productsDispatch({
      type: "UPDATE_STOCK",
      payload: { id: productId, stock: newStock },
    })

    // Add stock movement
    inventoryDispatch({
      type: "ADD_STOCK_MOVEMENT",
      payload: {
        id: Date.now().toString(),
        productId,
        productName: product.name,
        type: "restock",
        quantity,
        previousStock: product.stock,
        newStock,
        reason,
        timestamp: new Date(),
      },
    })
  }

  const adjustStock = (productId: number, newStock: number, reason: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const difference = newStock - product.stock

    // Update product stock
    productsDispatch({
      type: "UPDATE_STOCK",
      payload: { id: productId, stock: newStock },
    })

    // Add stock movement
    inventoryDispatch({
      type: "ADD_STOCK_MOVEMENT",
      payload: {
        id: Date.now().toString(),
        productId,
        productName: product.name,
        type: "adjustment",
        quantity: difference,
        previousStock: product.stock,
        newStock,
        reason,
        timestamp: new Date(),
      },
    })

    // Check stock levels after adjustment
    setTimeout(checkStockLevels, 100)
  }

  // Auto-check stock levels when products change
  useEffect(() => {
    checkStockLevels()
  }, [products])

  return {
    processSale,
    restockProduct,
    adjustStock,
    checkStockLevels,
  }
}
