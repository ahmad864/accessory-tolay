"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, isAuthenticated, isAdmin } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const redirectPath = searchParams.get("redirect") || "/"

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectPath === "/admin" && !isAdmin()) {
        router.push("/")
      } else {
        router.push(redirectPath)
      }
    }
  }, [isAuthenticated, isAdmin, redirectPath, router])

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 5000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(loginData.email, loginData.password)
      if (result.success) {
        showMessage(result.message, "success")
        // Redirect will be handled by useEffect
      } else {
        showMessage(result.message, "error")
      }
    } catch (error) {
      showMessage("حدث خطأ أثناء تسجيل الدخول", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      showMessage("كلمات المرور غير متطابقة", "error")
      return
    }

    if (registerData.password.length < 6) {
      showMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error")
      return
    }

    setLoading(true)

    try {
      const result = await register(registerData)
      if (result.success) {
        showMessage(result.message, "success")
        // Redirect will be handled by useEffect
      } else {
        showMessage(result.message, "error")
      }
    } catch (error) {
      showMessage("حدث خطأ أثناء إنشاء الحساب", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7f5c7e]/10 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#7f5c7e] font-tajawal mb-2">مرحباً بك في TOLAY</h1>
          <p className="text-gray-600 font-tajawal">سجلي دخولك أو أنشئي حساباً جديداً</p>
          {redirectPath === "/admin" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-tajawal">تسجيل دخول المدير</span>
              </div>
            </div>
          )}
        </div>

        {message && (
          <Alert
            className={`mb-6 ${messageType === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={messageType === "error" ? "text-red-800" : "text-green-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="font-tajawal">
              تسجيل الدخول
            </TabsTrigger>
            <TabsTrigger value="register" className="font-tajawal">
              إنشاء حساب
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#7f5c7e] font-tajawal">تسجيل الدخول</CardTitle>
                <CardDescription className="font-tajawal">
                  {redirectPath === "/admin"
                    ? "أدخل بيانات المدير للوصول إلى لوحة التحكم"
                    : "أدخلي بياناتك لتسجيل الدخول إلى حسابك"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {redirectPath === "/admin" && (
                  <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
                    <p className="text-sm text-gray-600 font-tajawal mb-2">بيانات المدير التجريبية:</p>
                    <p className="text-xs text-gray-500 font-tajawal">البريد: admin@tolay.com</p>
                    <p className="text-xs text-gray-500 font-tajawal">كلمة المرور: admin123</p>
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="font-tajawal">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 font-tajawal"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="font-tajawal">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 pr-10 font-tajawal"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a] font-tajawal"
                    disabled={loading}
                  >
                    {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#7f5c7e] font-tajawal">إنشاء حساب جديد</CardTitle>
                <CardDescription className="font-tajawal">
                  أنشئي حساباً جديداً للاستمتاع بتجربة تسوق مميزة (اختياري)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="font-tajawal">
                      الاسم الكامل
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        className="pl-10 font-tajawal"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="font-tajawal">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 font-tajawal"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="font-tajawal">
                      رقم الهاتف
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="أدخل رقم هاتفك"
                        className="pl-10 font-tajawal"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="font-tajawal">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                        className="pl-10 pr-10 font-tajawal"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        disabled={loading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="font-tajawal">
                      تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أعيد إدخال كلمة المرور"
                        className="pl-10 pr-10 font-tajawal"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a] font-tajawal"
                    disabled={loading}
                  >
                    {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link href="/" className="text-[#7f5c7e] hover:underline font-tajawal">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
