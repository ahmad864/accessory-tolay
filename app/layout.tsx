import type React from "react"
import type { Metadata } from "next"
import { Amiri } from "next/font/google"
import { Tajawal } from "next/font/google"
import { Cinzel_Decorative } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-store"
import { ProductsProvider } from "@/lib/products-store"
import { InventoryProvider } from "@/lib/inventory-store"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import "./globals.css"

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
})

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
})

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-decorative",
})

export const metadata: Metadata = {
  title: "TOLAY - متجر الإكسسوارات الأنيقة",
  description: "أجمل مجموعة من الإكسسوارات العصرية والأنيقة",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${tajawal.variable} ${cinzelDecorative.variable} antialiased`}
      style={{
        fontFamily: "var(--font-tajawal), system-ui, sans-serif",
      }}
    >
      <body
        className="font-tajawal"
        style={{
          fontFamily: "var(--font-tajawal), system-ui, sans-serif",
        }}
      >
        <InventoryProvider>
          <ProductsProvider>
            <CartProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                <Suspense fallback={null}>{children}</Suspense>
              </ThemeProvider>
            </CartProvider>
          </ProductsProvider>
        </InventoryProvider>
        <Analytics />
      </body>
    </html>
  )
}
