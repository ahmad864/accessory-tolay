"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Star, Search, Filter, AlertTriangle } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useProducts } from "@/lib/products-store"
import { useCurrency } from "@/lib/currency-store"
import { useFavorites } from "@/lib/favorites-store"
import { CurrencySelector } from "@/components/currency-selector"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const { dispatch: cartDispatch } = useCart()
  const { convertPrice, getCurrencySymbol } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()
  const {
    state: { products, categories },
  } = useProducts()

  const searchParams = useSearchParams()

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    if (searchQuery) {
      setSearchTerm(searchQuery)
    }
  }, [searchParams])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name, "ar")
      }
    })

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock <= 0) return

    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
      },
    })
    cartDispatch({ type: "TOGGLE_CART" })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-[#7f5c7e]">جميع المنتجات</h1>
          <p className="text-lg text-muted-foreground">اكتشفي مجموعتنا الكاملة من الإكسسوارات الأنيقة</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ابحث عن المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 hover:scale-[1.02] focus:scale-[1.02] transition-transform"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 hover:scale-105 active:scale-95 transition-transform">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 hover:scale-105 active:scale-95 transition-transform">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
              <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
            </SelectContent>
          </Select>

          <CurrencySelector />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <CardContent className="p-0">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden cursor-pointer">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-[#7f5c7e] text-white">جديد</Badge>}
                      {product.isSale && <Badge className="bg-destructive text-destructive-foreground">خصم</Badge>}
                      {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          كمية قليلة
                        </Badge>
                      )}
                      {product.stock === 0 && <Badge variant="destructive">نفدت الكمية</Badge>}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(product.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>

                    {/* Quick Add to Cart */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        className={`w-full backdrop-blur-sm hover:scale-105 active:scale-95 transition-transform ${
                          product.stock <= 0
                            ? "bg-gray-400/90 text-gray-600 cursor-not-allowed"
                            : "bg-[#7f5c7e]/90 text-white hover:bg-[#7f5c7e]"
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {product.stock <= 0 ? "نفدت الكمية" : "أضف للسلة"}
                      </Button>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-balance">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium mr-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">المتوفر: {product.stock} قطعة</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#7f5c7e]">
                        {convertPrice(product.price)} {getCurrencySymbol()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {convertPrice(product.originalPrice)} {getCurrencySymbol()}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">لم يتم العثور على منتجات مطابقة لبحثك</p>
          </div>
        )}
      </div>
    </div>
  )
}
