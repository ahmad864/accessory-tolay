"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminCheck } from "@/lib/admin-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const router = useRouter()
  const { canAccessAdmin, isAuthenticated } = useAdminCheck()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin")
    } else if (!canAccessAdmin) {
      router.push("/")
    }
  }, [canAccessAdmin, isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">جاري التحقق من صلاحيات الوصول...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!canAccessAdmin) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">غير مصرح لك بالوصول</h2>
              <p className="text-muted-foreground mb-4">تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة</p>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/login")} className="flex-1">
                  تسجيل الدخول
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
                  العودة للرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
