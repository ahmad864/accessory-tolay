"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isSale: boolean
  stock: number
  description: string
  colors?: string[]
  sizes?: string[]
}

interface ProductsState {
  products: Product[]
  categories: string[]
  loading: boolean
}

type ProductsAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "UPDATE_STOCK"; payload: { id: number; stock: number } }
  | { type: "SET_LOADING"; payload: boolean }

const initialProducts: Product[] = [
  {
    id: 1,
    name: "عقد ذهبي أنيق",
    price: 1200,
    originalPrice: 1500,
    images: ["/gold-necklace-elegant.jpg", "/gold-necklace-elegant.jpg", "/gold-necklace-elegant.jpg"],
    category: "مجوهرات",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isSale: true,
    stock: 15,
    description: "عقد ذهبي أنيق مصنوع من الذهب عيار 18 قيراط مع تصميم عصري يناسب جميع المناسبات",
    colors: ["ذهبي", "ذهبي وردي"],
  },
  {
    id: 2,
    name: "حقيبة يد جلدية فاخرة",
    price: 850,
    images: ["/luxury-leather-handbag.jpg", "/luxury-leather-handbag.jpg", "/luxury-leather-handbag.jpg"],
    category: "حقائب",
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isSale: false,
    stock: 8,
    description: "حقيبة يد جلدية فاخرة مصنوعة من الجلد الطبيعي عالي الجودة مع تفاصيل أنيقة",
    colors: ["أسود", "بني", "بيج"],
    sizes: ["صغير", "متوسط", "كبير"],
  },
  {
    id: 3,
    name: "ساعة ذكية أنيقة",
    price: 2200,
    originalPrice: 2800,
    images: ["/elegant-smartwatch.jpg", "/elegant-smartwatch.jpg", "/elegant-smartwatch.jpg"],
    category: "ساعات",
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isSale: true,
    stock: 3,
    description: "ساعة ذكية متطورة مع شاشة AMOLED وميزات صحية متقدمة",
    colors: ["أسود", "فضي", "ذهبي وردي"],
  },
  {
    id: 4,
    name: "أقراط لؤلؤ طبيعي",
    price: 650,
    images: ["/pearl-earrings.jpg", "/pearl-earrings.jpg", "/pearl-earrings.jpg"],
    category: "مجوهرات",
    rating: 4.9,
    reviews: 78,
    isNew: false,
    isSale: false,
    stock: 12,
    description: "أقراط من اللؤلؤ الطبيعي عالي الجودة مع قاعدة من الفضة الخالصة",
    colors: ["أبيض", "كريمي"],
  },
  {
    id: 5,
    name: "نظارة شمسية عصرية",
    price: 320,
    originalPrice: 450,
    images: ["/modern-sunglasses.jpg", "/modern-sunglasses.jpg", "/modern-sunglasses.jpg"],
    category: "نظارات",
    rating: 4.6,
    reviews: 203,
    isNew: false,
    isSale: true,
    stock: 25,
    description: "نظارة شمسية عصرية مع حماية UV400 وإطار متين",
    colors: ["أسود", "بني", "ذهبي"],
  },
  {
    id: 6,
    name: "سوار فضي مرصع",
    price: 480,
    images: ["/silver-bracelet.jpg", "/silver-bracelet.jpg", "/silver-bracelet.jpg"],
    category: "مجوهرات",
    rating: 4.8,
    reviews: 92,
    isNew: true,
    isSale: false,
    stock: 7,
    description: "سوار فضي أنيق مرصع بالأحجار الكريمة الطبيعية",
    colors: ["فضي"],
  },
]

const initialState: ProductsState = {
  products: initialProducts,
  categories: ["مجوهرات", "حقائب", "ساعات", "نظارات"],
  loading: false,
}

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
        categories: [...new Set([...state.categories, action.payload.category])],
      }
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)),
        categories: [...new Set([...state.categories, action.payload.category])],
      }
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      }
    case "UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.payload.id ? { ...p, stock: action.payload.stock } : p)),
      }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const ProductsContext = createContext<{
  state: ProductsState
  dispatch: React.Dispatch<ProductsAction>
} | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState)

  return <ProductsContext.Provider value={{ state, dispatch }}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
