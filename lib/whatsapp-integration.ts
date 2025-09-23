export interface OrderDetails {
  customerInfo: {
    fullName: string
    phone: string
    city: string
    address: string
    currency: string
    discountCode?: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image?: string
  }>
  totals: {
    subtotal: number
    shipping: number
    discount: number
    total: number
  }
  orderDate: string
  orderId: string
}

export function formatOrderForWhatsApp(orderDetails: OrderDetails): string {
  const { customerInfo, items, totals } = orderDetails

  let message = `🛍️ *طلب جديد من متجر TOLAY*\n\n`

  // Customer Information
  message += `👤 *معلومات العميل:*\n`
  message += `الاسم: ${customerInfo.fullName}\n`
  message += `الهاتف: ${customerInfo.phone}\n`
  message += `المدينة: ${customerInfo.city}\n`
  message += `العنوان: ${customerInfo.address}\n`
  message += `العملة: ${customerInfo.currency}\n`
  if (customerInfo.discountCode) {
    message += `كود الخصم: ${customerInfo.discountCode}\n`
  }
  message += `\n`

  // Order Items
  message += `📦 *المنتجات المطلوبة:*\n`
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    message += `   الكمية: ${item.quantity}\n`
    message += `   السعر: ${item.price} ${getCurrencySymbol(customerInfo.currency)}\n\n`
  })

  // Order Summary
  message += `💰 *ملخص الطلب:*\n`
  message += `المجموع الفرعي: ${totals.subtotal} ${getCurrencySymbol(customerInfo.currency)}\n`
  message += `الشحن: ${totals.shipping} ${getCurrencySymbol(customerInfo.currency)}\n`
  if (totals.discount > 0) {
    message += `الخصم: -${totals.discount} ${getCurrencySymbol(customerInfo.currency)}\n`
  }
  message += `*المجموع الكلي: ${totals.total} ${getCurrencySymbol(customerInfo.currency)}*\n\n`

  message += `📅 تاريخ الطلب: ${orderDetails.orderDate}\n`
  message += `🔢 رقم الطلب: ${orderDetails.orderId}`

  return message
}

function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case "USD":
      return "$"
    case "SYP":
      return "ل.س"
    case "TRY":
      return "₺"
    default:
      return "$"
  }
}

export async function sendOrderToWhatsApp(orderDetails: OrderDetails): Promise<boolean> {
  try {
    const message = formatOrderForWhatsApp(orderDetails)

    // This will be implemented later with server integration
    // For now, we'll just log the formatted message
    console.log("Order to be sent to WhatsApp:", message)

    // TODO: Implement actual WhatsApp API integration
    // This could be done via WhatsApp Business API or a webhook

    return true
  } catch (error) {
    console.error("Error sending order to WhatsApp:", error)
    return false
  }
}
