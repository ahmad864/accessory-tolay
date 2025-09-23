"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, AlertTriangle, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useCurrency } from "@/lib/currency-store"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"

export function FeaturedProducts() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()
  const {
    state: { products },
  } = useProducts()

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock <= 0) return

    const quantity = quantities[product.id] || 1
    for (let i = 0; i < quantity; i++) {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || "/placeholder.svg",
        },
      })
    }
    cartDispatch({ type: "TOGGLE_CART" })
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50/30 to-purple-100/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance text-[#7f5c7e]">منتجاتنا المميزة</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            اكتشفي أحدث وأجمل قطع الإكسسوارات المختارة خصيصاً لك
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {products.slice(0, 10).map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card hover:scale-[1.02]"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && <Badge className="bg-[#7f5c7e] text-white text-xs">جديد</Badge>}
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                        <AlertTriangle className="w-2 h-2 mr-1" />
                        قليل
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        نفد
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(product.id)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>

                <div className="p-3 bg-card">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold mb-2 text-balance hover:text-[#7f5c7e] transition-colors cursor-pointer line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-[#7f5c7e]">
                        {convertPrice(product.price)} {getCurrencySymbol()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 bg-transparent hover:scale-110 active:scale-95 transition-transform"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={quantities[product.id] <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[20px] text-center">
                        {quantities[product.id] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 bg-transparent hover:scale-110 active:scale-95 transition-transform"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    className={`w-full h-10 text-sm font-medium hover:scale-105 active:scale-95 transition-transform ${
                      product.stock <= 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#7f5c7e] text-white hover:bg-purple-600"
                    }`}
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {product.stock <= 0 ? "نفدت الكمية" : "أضف للسلة"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-[#7f5c7e] text-[#7f5c7e] hover:bg-[#7f5c7e] hover:text-white bg-transparent hover:scale-105 active:scale-95 transition-all"
            >
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
