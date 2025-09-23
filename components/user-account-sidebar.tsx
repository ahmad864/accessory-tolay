"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Heart, LogOut, Settings, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-store"
import { useFavorites } from "@/lib/favorites-store"
import { useProducts } from "@/lib/products-store"
import { useSettings } from "@/lib/settings-store"
import Link from "next/link"

export function UserAccountSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { favorites } = useFavorites()
  const { settings } = useSettings()
  const {
    state: { products },
  } = useProducts()

  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleWhatsAppContact = () => {
    const phoneNumber = settings.whatsappNumber || "966500000000"
    const message = "مرحباً، أود الاستفسار عن منتجاتكم"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  if (!isAuthenticated) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-95 transition-transform">
            <User className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-tajawal">الحساب الشخصي</SheetTitle>
          </SheetHeader>

          <div className="flex-1 mt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4 font-tajawal">يمكنك تصفح المتجر بدون حساب</p>
              <Link href="/contact">
                <Button className="w-full font-tajawal mb-4" onClick={() => setIsOpen(false)}>
                  تواصل معنا
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full font-tajawal bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  تسجيل الدخول / إنشاء حساب
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t">
            <Button
              onClick={handleWhatsAppContact}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-tajawal flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              اتصل بنا عبر واتساب
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:scale-110 active:scale-95 transition-transform">
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-tajawal">مرحباً، {user?.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 mt-6 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-tajawal flex items-center gap-2">
                <User className="h-4 w-4" />
                معلومات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground font-tajawal">الاسم</p>
                <p className="font-medium font-tajawal">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-tajawal">البريد الإلكتروني</p>
                <p className="font-medium font-tajawal">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-tajawal">نوع الحساب</p>
                <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="font-tajawal">
                  {user?.role === "admin" ? "مدير" : "مستخدم"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-tajawal flex items-center gap-2">
                <Heart className="h-4 w-4" />
                المفضلة ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteProducts.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {favoriteProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-2 p-2 border rounded">
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate font-tajawal">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-tajawal">{product.price} ر.س</p>
                      </div>
                    </div>
                  ))}
                  {favoriteProducts.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center font-tajawal">
                      و {favoriteProducts.length - 3} منتجات أخرى
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-tajawal">لا توجد منتجات مفضلة</p>
              )}
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-2">
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="w-full justify-start font-tajawal bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  لوحة التحكم
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="w-full justify-start font-tajawal bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t">
          <Button
            onClick={handleWhatsAppContact}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-tajawal flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            اتصل بنا عبر واتساب
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
