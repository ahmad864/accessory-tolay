"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, AlertTriangle, Plus, Minus, ArrowRight, Grid3X3 } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useCurrency } from "@/lib/currency-store"
import { useFavorites } from "@/lib/favorites-store"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductsByCategory } from "@/lib/category-products"

const categoryNames: { [key: string]: string } = {
  rings: "خواتم",
  earrings: "أحلاق",
  bracelets: "اساور",
  necklaces: "سلاسل",
  watches: "ساعات",
  glasses: "نظارات",
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [showAll, setShowAll] = useState(false)
  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()

  const categoryProducts = getProductsByCategory(slug)
  const displayedProducts = showAll ? categoryProducts : categoryProducts.slice(0, 12)

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  const addToCart = (product: (typeof categoryProducts)[0]) => {
    if (product.stock <= 0) return

    const quantity = quantities[product.id] || 1
    for (let i = 0; i < quantity; i++) {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      })
    }
    cartDispatch({ type: "TOGGLE_CART" })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-[#7f5c7e] transition-colors hover:scale-105 active:scale-95">
              الرئيسية
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-foreground">{categoryNames[slug] || slug}</span>
          </div>

          {/* Category Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-[#7f5c7e]">{categoryNames[slug] || slug}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اكتشفي أجمل مجموعة من {categoryNames[slug]} المصممة خصيصاً لك
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-sm text-muted-foreground">{categoryProducts.length} منتج متوفر</p>
            </div>
          </div>

          {categoryProducts.length > 12 && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="border-[#7f5c7e] text-[#7f5c7e] hover:bg-[#7f5c7e] hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                <Grid3X3 className="mr-2 h-4 w-4" />
                {showAll ? `عرض أقل` : `عرض جميع المنتجات (${categoryProducts.length})`}
              </Button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card hover:scale-[1.02]"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
                    <img
                      src={product.image || "/placeholder.svg"}
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
                      <span className="text-xs text-muted-foreground">متوفر: {product.stock}</span>
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

          {categoryProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">لا توجد منتجات في هذه الفئة حالياً</p>
              <Link href="/">
                <Button
                  className="mt-4 bg-transparent border-[#7f5c7e] text-[#7f5c7e] hover:bg-[#7f5c7e] hover:text-white hover:scale-105 active:scale-95 transition-all"
                  variant="outline"
                >
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
