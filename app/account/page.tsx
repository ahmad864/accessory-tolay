"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Heart, ShoppingBag, Settings } from "lucide-react"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import Link from "next/link"

export default function AccountPage() {
  const [searchParams] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search)
    }
    return new URLSearchParams()
  })

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { favorites, getFavoritesCount } = useFavorites()
  const {
    state: { products },
  } = useProducts()

  // Get favorite products
  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  const requestedTab = searchParams.get("tab")
  const showFavoritesDirectly = requestedTab === "favorites"

  if (showFavoritesDirectly) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5c7e] mb-2 font-tajawal">المفضلة</h1>
            <p className="text-muted-foreground font-tajawal">منتجاتك المفضلة محفوظة محلياً</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-tajawal">
                <Heart className="h-5 w-5" />
                المنتجات المفضلة ({getFavoritesCount()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
                      <CardContent className="p-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 font-tajawal">{product.name}</h3>
                        <p className="text-[#7f5c7e] font-bold font-tajawal">{product.price} ر.س</p>
                        <Link href={`/product/${product.id}`}>
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-[#7f5c7e] hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all font-tajawal"
                          >
                            عرض المنتج
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-tajawal">لا توجد منتجات مفضلة حتى الآن</p>
                  <Link href="/products">
                    <Button className="mt-4 bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all font-tajawal">
                      استكشف المنتجات
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#7f5c7e] font-tajawal">حسابي</CardTitle>
              <p className="text-muted-foreground font-tajawal">سجل دخولك أو أنشئ حساب جديد</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all font-tajawal">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full border-[#7f5c7e] text-[#7f5c7e] hover:bg-[#7f5c7e] hover:text-white bg-transparent hover:scale-105 active:scale-95 transition-all font-tajawal"
                >
                  إنشاء حساب جديد
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7f5c7e] mb-2 font-tajawal">حسابي</h1>
          <p className="text-muted-foreground font-tajawal">إدارة معلوماتك الشخصية وطلباتك</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="hover:scale-105 active:scale-95 transition-transform font-tajawal">
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="orders" className="hover:scale-105 active:scale-95 transition-transform font-tajawal">
              طلباتي
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="hover:scale-105 active:scale-95 transition-transform font-tajawal"
            >
              المفضلة ({getFavoritesCount()})
            </TabsTrigger>
            <TabsTrigger value="settings" className="hover:scale-105 active:scale-95 transition-transform font-tajawal">
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-tajawal">
                  <User className="h-5 w-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="font-tajawal">
                      الاسم الأول
                    </Label>
                    <Input id="firstName" placeholder="أدخل اسمك الأول" className="font-tajawal" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-tajawal">
                      الاسم الأخير
                    </Label>
                    <Input id="lastName" placeholder="أدخل اسمك الأخير" className="font-tajawal" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="font-tajawal">
                    البريد الإلكتروني
                  </Label>
                  <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" className="font-tajawal" />
                </div>
                <div>
                  <Label htmlFor="phone" className="font-tajawal">
                    رقم الهاتف
                  </Label>
                  <Input id="phone" placeholder="+963 xxx xxx xxx" className="font-tajawal" />
                </div>
                <div>
                  <Label htmlFor="address" className="font-tajawal">
                    العنوان
                  </Label>
                  <Input id="address" placeholder="أدخل عنوانك" className="font-tajawal" />
                </div>
                <Button className="bg-[#7f5c7e] text-white hover:bg-purple-600 font-tajawal">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-tajawal">
                  <ShoppingBag className="h-5 w-5" />
                  طلباتي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-tajawal">لا توجد طلبات حتى الآن</p>
                  <Link href="/products">
                    <Button className="mt-4 bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all font-tajawal">
                      تسوق الآن
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-tajawal">
                  <Heart className="h-5 w-5" />
                  المنتجات المفضلة ({getFavoritesCount()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteProducts.map((product) => (
                      <Card key={product.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2 font-tajawal">{product.name}</h3>
                          <p className="text-[#7f5c7e] font-bold font-tajawal">{product.price} ر.س</p>
                          <Link href={`/product/${product.id}`}>
                            <Button
                              size="sm"
                              className="w-full mt-2 bg-[#7f5c7e] hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all font-tajawal"
                            >
                              عرض المنتج
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-tajawal">لا توجد منتجات مفضلة حتى الآن</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-[#7f5c7e] text-white hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all font-tajawal">
                        استكشف المنتجات
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-tajawal">
                  <Settings className="h-5 w-5" />
                  إعدادات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="font-tajawal">
                    كلمة المرور الحالية
                  </Label>
                  <Input id="currentPassword" type="password" className="font-tajawal" />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="font-tajawal">
                    كلمة المرور الجديدة
                  </Label>
                  <Input id="newPassword" type="password" className="font-tajawal" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="font-tajawal">
                    تأكيد كلمة المرور
                  </Label>
                  <Input id="confirmPassword" type="password" className="font-tajawal" />
                </div>
                <Button className="bg-[#7f5c7e] text-white hover:bg-purple-600 font-tajawal">تحديث كلمة المرور</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
