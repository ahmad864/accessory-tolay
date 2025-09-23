import type { CartItem } from "./cart-store"

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  city: string
  notes?: string
}

export function generateOwnerWhatsAppMessage(items: CartItem[], customerInfo: CustomerInfo): string {
  let message = `🛍️ *طلب جديد من متجر الإكسسوارات الأنيقة*\n\n`
  message += `👤 *بيانات العميل:*\n`
  message += `الاسم: ${customerInfo.name}\n`
  message += `الهاتف: ${customerInfo.phone}\n`
  message += `العنوان: ${customerInfo.address}\n`
  message += `المحافظة: ${customerInfo.city}\n`
  if (customerInfo.notes) {
    message += `ملاحظات: ${customerInfo.notes}\n`
  }
  message += `\n📦 *تفاصيل الطلب:*\n`

  let total = 0
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal
    message += `${index + 1}. ${item.name}\n`
    message += `   الكمية: ${item.quantity}\n`
    message += `   السعر: ${item.price} ل.س\n`
    if (item.color) message += `   اللون: ${item.color}\n`
    if (item.size) message += `   المقاس: ${item.size}\n`
    message += `   المجموع: ${itemTotal} ل.س\n\n`
  })

  message += `💰 *إجمالي الطلب: ${total} ل.س*\n\n`
  message += `📅 تاريخ الطلب: ${new Date().toLocaleDateString("ar-SA")}\n`
  message += `⏰ وقت الطلب: ${new Date().toLocaleTimeString("ar-SA")}\n\n`
  message += `يرجى التواصل مع العميل لتأكيد الطلب وترتيب التوصيل 📞`

  return encodeURIComponent(message)
}

export function generateWhatsAppMessage(items: CartItem[], customerInfo: CustomerInfo): string {
  const storeNumber = "+966501234567" // رقم المتجر

  let message = `🛍️ *طلب جديد من متجر الإكسسوارات الأنيقة*\n\n`
  message += `👤 *بيانات العميل:*\n`
  message += `الاسم: ${customerInfo.name}\n`
  message += `الهاتف: ${customerInfo.phone}\n`
  message += `العنوان: ${customerInfo.address}\n`
  message += `المدينة: ${customerInfo.city}\n`
  if (customerInfo.notes) {
    message += `ملاحظات: ${customerInfo.notes}\n`
  }
  message += `\n📦 *تفاصيل الطلب:*\n`

  let total = 0
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal
    message += `${index + 1}. ${item.name}\n`
    message += `   الكمية: ${item.quantity}\n`
    message += `   السعر: ${item.price} ر.س\n`
    if (item.color) message += `   اللون: ${item.color}\n`
    if (item.size) message += `   المقاس: ${item.size}\n`
    message += `   المجموع: ${itemTotal} ر.س\n\n`
  })

  message += `💰 *إجمالي الطلب: ${total} ر.س*\n\n`
  message += `📅 تاريخ الطلب: ${new Date().toLocaleDateString("ar-SA")}\n`
  message += `⏰ وقت الطلب: ${new Date().toLocaleTimeString("ar-SA")}\n\n`
  message += `شكراً لك على اختيار متجرنا! 🌟`

  return encodeURIComponent(message)
}

export function sendWhatsAppOrder(items: CartItem[], customerInfo: CustomerInfo): void {
  const storeNumber = "+966501234567"
  const message = generateWhatsAppMessage(items, customerInfo)
  const whatsappUrl = `https://wa.me/${storeNumber}?text=${message}`

  window.open(whatsappUrl, "_blank")
}

export function generateCustomerWhatsAppMessage(items: CartItem[], customerInfo: CustomerInfo): string {
  let message = `السلام عليكم 👋\n\n`
  message += `أود طلب المنتجات التالية:\n\n`

  let total = 0
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal
    message += `${index + 1}. ${item.name}\n`
    message += `   الكمية: ${item.quantity}\n`
    if (item.color) message += `   اللون: ${item.color}\n`
    if (item.size) message += `   المقاس: ${item.size}\n`
    message += `   السعر: ${item.price} ر.س\n\n`
  })

  message += `إجمالي الطلب: ${total} ر.س\n\n`
  message += `بياناتي:\n`
  message += `الاسم: ${customerInfo.name}\n`
  message += `الهاتف: ${customerInfo.phone}\n`
  message += `العنوان: ${customerInfo.address}\n`
  message += `المدينة: ${customerInfo.city}\n`
  if (customerInfo.notes) {
    message += `ملاحظات: ${customerInfo.notes}\n`
  }
  message += `\nشكراً لكم 🌟`

  return encodeURIComponent(message)
}
