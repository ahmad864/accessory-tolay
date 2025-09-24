"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.push("/") // إعادة التوجيه للصفحة الرئيسية إذا لم يكن إدمن
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin()) {
    return null // منع عرض الصفحة أثناء إعادة التوجيه
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-3xl font-bold text-[#7f5c7e] mb-6">لوحة تحكم المدير</h1>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>مرحباً، {user?.name}</CardTitle>
          <CardDescription>هذا قسم إدارة الموقع، يمكنك إضافة وتعديل المنتجات أو الإعدادات.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="bg-[#7f5c7e] hover:bg-[#6b4c6a]"
            onClick={() => alert("هنا يمكنك إضافة المنتجات")}
          >
            إدارة المنتجات
          </Button>
          <Button
            className="bg-[#7f5c7e] hover:bg-[#6b4c6a]"
            onClick={() => alert("هنا يمكنك تعديل الإعدادات")}
          >
            إعدادات الموقع
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
