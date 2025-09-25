#!/bin/bash

# ====================================================
# سكربت Termux كامل لإعداد accessory-tolay مع Supabase
# ====================================================

echo "🚀 بدء إعداد مشروع accessory-tolay..."

# ---------- 1. تثبيت الأدوات ----------
pkg update -y && pkg upgrade -y
pkg install nodejs git curl unzip nano -y

# ---------- 2. استنساخ المشروع ----------
cd ~
if [ ! -d "accessory-tolay" ]; then
    echo "📂 استنساخ المشروع من GitHub..."
    git clone git@github.com:ahmad864/accessory-tolay.git
else
    echo "📂 المشروع موجود بالفعل، سيتم تحديثه..."
    cd accessory-tolay
    git pull
fi
cd accessory-tolay

# ---------- 3. تثبيت الحزم ----------
echo "📦 تثبيت حزم npm..."
npm install
npm install @supabase/supabase-js node-fetch

# ---------- 4. إنشاء lib/supabaseClient.ts ----------
mkdir -p lib
cat > lib/supabaseClient.ts <<EOL
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
EOL

# ---------- 5. إعداد .env.local ----------
cat > .env.local <<EOL
NEXT_PUBLIC_SUPABASE_URL=ضع_هنا_URL_لمشروعك
NEXT_PUBLIC_SUPABASE_ANON_KEY=ضع_هنا_ANON_KEY_لمشروعك
SUPABASE_SERVICE_ROLE_KEY=ضع_هنا_Service_Role_Key
EOL

# ---------- 6. إنشاء جدول products و Bucket تلقائي ----------
cat > setup_supabase.js <<'EOL'
import fetch from "node-fetch";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  console.log("🟢 إنشاء جدول products تلقائي...");
  await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: `
      CREATE TABLE IF NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text,
        price numeric,
        description text,
        image_url text,
        image_path text,
        created_at timestamp DEFAULT now()
      );
      `
    })
  }).catch(e=>console.log(e));

  console.log("🟢 إنشاء Bucket products في التخزين...");
  await fetch(`${SUPABASE_URL}/rest/v1/storage/bucket`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: "products", public: true })
  }).catch(e=>console.log("Bucket ربما موجود مسبقاً."));
  
  console.log("✅ Supabase جاهز!");
}

run();
EOL

# تشغيل سكربت إعداد Supabase
node setup_supabase.js

# ---------- 7. إنشاء مجلد components ----------
mkdir -p components

# ---------- 7a. كومبوننت AddProductForm ----------
cat > components/AddProductForm.tsx <<EOL
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddProductForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const filePath = \`\${Date.now()}-\${file.name}\`;
    await supabase.storage.from("products").upload(filePath, file);
    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    const imageUrl = data.publicUrl;
    await supabase.from("products").insert([{ name, price, image_url: imageUrl, image_path: filePath }]);
    setName(""); setPrice(""); setFile(null);
    onAdded();
  }

  return (
    <form onSubmit={addProduct} className="flex flex-col gap-2 mb-6">
      <input className="border p-2" value={name} onChange={e=>setName(e.target.value)} placeholder="اسم المنتج"/>
      <input className="border p-2" value={price} onChange={e=>setPrice(e.target.value)} placeholder="السعر"/>
      <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)}/>
      <button className="bg-green-500 text-white px-3 py-1">إضافة</button>
    </form>
  );
}
EOL

# ---------- 7b. كومبوننت ProductList ----------
cat > components/ProductList.tsx <<EOL
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProductList({ isAdmin = false }) {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(()=>{ fetchProducts(); }, []);
  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  }

  async function deleteProduct(id: string, imagePath: string) {
    await supabase.storage.from("products").remove([imagePath]);
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  async function saveEdit(product: any) {
    let imagePath = product.image_path;
    let imageUrl = product.image_url;
    if(editFile){
      await supabase.storage.from("products").remove([imagePath]);
      const filePath = \`\${Date.now()}-\${editFile.name}\`;
      await supabase.storage.from("products").upload(filePath, editFile);
      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      imagePath = filePath; imageUrl = data.publicUrl;
    }
    await supabase.from("products").update({ name: editName, price: editPrice, image_url: imageUrl, image_path: imagePath }).eq("id", product.id);
    setEditingId(null); fetchProducts();
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(p=>(
        <div key={p.id} className="border p-4 rounded">
          {editingId===p.id?(
            <div className="flex flex-col gap-2">
              <input className="border p-1" value={editName} onChange={e=>setEditName(e.target.value)}/>
              <input className="border p-1" value={editPrice} onChange={e=>setEditPrice(e.target.value)}/>
              <input type="file" onChange={e=>setEditFile(e.target.files?.[0]||null)}/>
              <div className="flex gap-2">
                <button onClick={()=>saveEdit(p)} className="bg-green-500 text-white px-2 py-1">حفظ</button>
                <button onClick={()=>setEditingId(null)} className="bg-gray-500 text-white px-2 py-1">إلغاء</button>
              </div>
            </div>
          ):(
            <>
              <img src={p.image_url} className="w-full h-40 object-cover"/>
              <h2 className="font-bold mt-2">{p.name}</h2>
              <p>{p.price} $</p>
              {isAdmin && (
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>{ setEditingId(p.id); setEditName(p.name); setEditPrice(p.price); setEditFile(null); }} className="bg-blue-500 text-white px-2">تعديل</button>
                  <button onClick={()=>deleteProduct(p.id,p.image_path)} className="bg-red-500 text-white px-2">حذف</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
EOL

# ---------- 8. صفحة الأدمن ----------
mkdir -p app/admin/products
cat > app/admin/products/page.tsx <<EOL
import AddProductForm from "@/components/AddProductForm";
import ProductList from "@/components/ProductList";

export default function AdminProductsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة المنتجات</h1>
      <AddProductForm onAdded={()=>window.location.reload()}/>
      <ProductList isAdmin={true}/>
    </div>
  );
}
EOL

# ---------- 9. تشغيل المشروع ----------
echo "✅ كل شيء جاهز!"
echo "📌 لتشغيل المشروع: npm run dev"
