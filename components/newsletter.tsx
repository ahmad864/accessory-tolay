import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16 lg:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">اشتركي في النشرة الإخبارية</h2>
          <p className="text-lg text-muted-foreground mb-8">
            احصلي على آخر العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="أدخلي بريدك الإلكتروني" className="flex-1" />
            <Button className="px-8">اشتراك</Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">لا نرسل رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.</p>
        </div>
      </div>
    </section>
  )
}
