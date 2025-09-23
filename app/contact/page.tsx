"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Phone, Mail, MapPin, Clock, Star } from "lucide-react"

export default function ContactPage() {
  const handleWhatsAppContact = () => {
    const phoneNumber = "966123456789" // Replace with actual WhatsApp number
    const message = "مرحباً، أود التواصل معكم بخصوص منتجاتكم"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight font-amiri text-[#7f5c7e] mb-6">
              تواصل معنا
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 font-tajawal">
              نحن هنا لخدمتك ومساعدتك في اختيار أفضل المنتجات
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="h-12 w-12 text-[#7f5c7e] mx-auto mb-4" />
                <CardTitle className="font-tajawal">الهاتف</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-tajawal">+966 12 345 6789</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-[#7f5c7e] mx-auto mb-4" />
                <CardTitle className="font-tajawal">البريد الإلكتروني</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-tajawal">info@example.com</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-12 w-12 text-[#7f5c7e] mx-auto mb-4" />
                <CardTitle className="font-tajawal">العنوان</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-tajawal">الرياض، المملكة العربية السعودية</p>
              </CardContent>
            </Card>
          </div>

          {/* Working Hours */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-[#7f5c7e] mx-auto mb-4" />
              <CardTitle className="font-tajawal">ساعات العمل</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="font-tajawal">السبت - الخميس: 9:00 ص - 10:00 م</p>
              <p className="font-tajawal">الجمعة: 2:00 م - 10:00 م</p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <Star className="h-8 w-8 text-[#7f5c7e] mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-tajawal">جودة عالية</h3>
              <p className="text-sm text-muted-foreground font-tajawal">منتجات مختارة بعناية</p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-[#7f5c7e] mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-tajawal">دعم سريع</h3>
              <p className="text-sm text-muted-foreground font-tajawal">استجابة فورية لاستفساراتك</p>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 text-[#7f5c7e] mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-tajawal">تواصل مباشر</h3>
              <p className="text-sm text-muted-foreground font-tajawal">خدمة عملاء متميزة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky WhatsApp Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t shadow-lg z-50">
        <div className="container mx-auto">
          <Button
            onClick={handleWhatsAppContact}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-tajawal text-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
            size="lg"
          >
            <MessageCircle className="ml-3 h-6 w-6" />
            تواصل معنا عبر واتساب
          </Button>
        </div>
      </div>

      {/* Bottom padding to account for sticky button */}
      <div className="h-20"></div>
    </div>
  )
}
