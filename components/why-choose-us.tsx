import { Shield, Truck, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "جودة مضمونة",
      description: "جميع منتجاتنا مصنوعة من أجود الخامات وتأتي مع ضمان الجودة",
    },
    {
      icon: Truck,
      title: "شحن سريع",
      description: "توصيل مجاني لجميع المحافظات السورية خلال 2-3 أيام عمل",
    },
    {
      icon: Sparkles,
      title: "أناقة لا مثيل لها",
      description: "تصاميم حصرية وعصرية تضفي لمسة من الجمال والأناقة على إطلالتك",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance font-tajawal">لماذا تختارين متجرنا؟</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty font-tajawal">
            نحن نقدم لك تجربة تسوق استثنائية مع أفضل الخدمات والمنتجات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-balance font-tajawal">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed font-tajawal">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
