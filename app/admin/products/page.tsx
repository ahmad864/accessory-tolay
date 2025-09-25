"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  low_stock: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    low_stock: false,
    imageFile: null as File | null,
  });

  // قائمة الفئات الجديدة
  const categories = ["خواتم", "أحلاق", "اساور", "سلاسل", "ساعات", "نظارات"];

  // جلب المنتجات
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,name,price,image,category,low_stock")
      .order("name");
    if (error) alert("خطأ في جلب المنتجات: " + error.message);
    else setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormData((prev) => ({ ...prev, [name]: checked }));
    else if (type === "file") setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
    else if (type === "number") setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // رفع الصورة إلى Bucket
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) { alert("خطأ في رفع الصورة: " + error.message); return null; }
    const { publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return publicUrl;
  };

  // إضافة أو تعديل المنتج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert("يرجى تعبئة كل الحقول المطلوبة");
      return;
    }

    let imageUrl = editingProduct?.image || "";
    if (formData.imageFile) {
      imageUrl = await uploadImage(formData.imageFile);
      if (!imageUrl) return;
    }

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: formData.price,
          category: formData.category,
          low_stock: formData.low_stock,
          image: imageUrl,
        })
        .eq("id", editingProduct.id);
      if (error) alert("خطأ في تعديل المنتج: " + error.message);
      else alert("تم تعديل المنتج بنجاح");
    } else {
      const { error } = await supabase.from("products").insert([
        {
          name: formData.name,
          price: formData.price,
          category: formData.category,
          low_stock: formData.low_stock,
          image: imageUrl,
        },
      ]);
      if (error) alert("خطأ في إضافة المنتج: " + error.message);
      else alert("تم إضافة المنتج بنجاح");
    }

    setFormData({ name: "", price: 0, category: "", low_stock: false, imageFile: null });
    setEditingProduct(null);
    setShowForm(false);
    fetchProducts();
  };

  // حذف المنتج
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert("خطأ في الحذف: " + error.message);
    fetchProducts();
  };

  // تعديل المنتج
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      low_stock: product.low_stock,
      imageFile: null,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة المنتجات</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "إلغاء" : editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded bg-gray-50">
          <input type="text" name="name" placeholder="اسم المنتج" value={formData.name} onChange={handleChange} required className="border p-2 w-full mb-2"/>
          <input type="number" name="price" placeholder="السعر" value={formData.price} onChange={handleChange} required className="border p-2 w-full mb-2"/>
          
          <select name="category" value={formData.category} onChange={handleChange} required className="border p-2 w-full mb-2">
            <option value="">اختر الفئة</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label className="flex items-center mb-2">
            <input type="checkbox" name="low_stock" checked={formData.low_stock} onChange={handleChange} className="mr-2"/>
            الكمية قليلة (يمكن تفعيل التنبيه في المنتج)
          </label>

          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="mb-2"/>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editingProduct ? "تحديث المنتج" : "إضافة المنتج"}
          </button>
        </form>
      )}

      {loading ? <p>جارٍ التحميل...</p> :
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border p-4 rounded shadow relative">
              {p.low_stock && (
                <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">الكمية قليلة</span>
              )}
              {p.image && <Image src={p.image} alt={p.name} width={200} height={200} className="mb-2" />}
              <h2 className="font-bold">{p.name}</h2>
              <p>السعر: {p.price}</p>
              <p>الفئة: {p.category}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">تعديل</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">حذف</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
