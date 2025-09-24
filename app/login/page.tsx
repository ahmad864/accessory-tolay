"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, user, isAdmin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin()) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [isAuthenticated, isAdmin, router])

  const showMsg = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 5000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    if (result.success) {
      showMsg(result.message, "success")
    } else {
      showMsg(result.message, "error")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            {user?.role === "admin" ? "تسجيل دخول المدير" : "أدخل بريدك وكلمة المرور"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className={messageType === "error" ? "mb-4 border-red-200 bg-red-50" : "mb-4 border-green-200 bg-green-50"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className={messageType === "error" ? "text-red-800" : "text-green-800"}>
                {message}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="pl-10 pr-10"
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
            <Button type="submit" className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a]" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
