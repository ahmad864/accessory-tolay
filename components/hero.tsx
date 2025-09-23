"use client"
import { useState, useEffect } from "react"

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = ["/gold-necklace-elegant.jpg", "/luxury-leather-handbag.jpg", "/elegant-smartwatch.jpg"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight font-amiri text-white drop-shadow-2xl">
              تفاصيل صغيرة
              <span className="text-purple-200 block">تصنع أناقة</span>
              كبيرة
            </h1>
            <p className="text-lg lg:text-xl font-medium text-white/90 mt-4 drop-shadow-lg font-tajawal">
              مجموعة مختارة بعناية
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-80 lg:h-96 overflow-hidden">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image || "/placeholder.svg"}
            alt={index === 0 ? "قلادة ذهبية أنيقة" : index === 1 ? "حقيبة جلدية فاخرة" : "ساعة ذكية أنيقة"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>

        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                index === currentImage ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="space-y-8"></div>
        </div>
      </div>
    </section>
  )
}
