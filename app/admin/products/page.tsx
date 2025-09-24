"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// إنشاء عميل Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

interface Product {
  id: number
  name: string
  price: number
  description: string
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // جلب المنتجات من Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*")
    if (!error && data) setProducts(data as Product[])
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // إضافة منتج جديد
  const addProduct = async () => {
    if (!name || !price) return alert("أدخل الاسم والسعر")
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price: parseFloat(price), description }])
    if (!error) {
      setName(""); setPrice(""); setDescription("")
      fetchProducts()
    } else {
      alert("حدث خطأ أثناء إضافة المنتج")
    }
    setLoading(false)
  }

  // حذف منتج
  const deleteProduct = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return
    await supabase.from("products").delete().eq("id", id)
    fetchProducts()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">إدارة المنتجات</h1>

      {/* Form لإضافة المنتجات */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>إضافة منتج جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="اسم المنتج"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="السعر"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            placeholder="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={addProduct} disabled={loading}>
            {loading ? "جاري الإضافة..." : "إضافة المنتج"}
          </Button>
        </CardContent>
      </Card>

      {/* قائمة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <h2 className="font-bold text-lg">{product.name}</h2>
              <p>السعر: {product.price}</p>
              <p>{product.description}</p>
              <Button
                className="mt-2 bg-red-500 hover:bg-red-600"
                onClick={() => deleteProduct(product.id)}
              >
                حذف المنتج
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
