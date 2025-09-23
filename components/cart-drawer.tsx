"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { CurrencySelector } from "@/components/currency-selector"
import { useCurrency } from "@/lib/currency-store"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { useState } from "react"

export function CartDrawer() {
  const { state, dispatch } = useCart()
  const { convertPrice, currency } = useCurrency()
  const [showCheckout, setShowCheckout] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getCurrencySymbol = () => {
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

  return (
    <>
      <Sheet open={state.isOpen} onOpenChange={() => dispatch({ type: "TOGGLE_CART" })}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{totalItems}</Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-right">سلة التسوق ({totalItems} منتج)</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {state.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">سلة التسوق فارغة</h3>
                  <p className="text-muted-foreground mb-4">أضيفي بعض المنتجات الرائعة إلى سلتك</p>
                  <Button onClick={() => dispatch({ type: "TOGGLE_CART" })}>تسوقي الآن</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-6">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {(item.size || item.color) && (
                            <div className="text-xs text-muted-foreground">
                              {item.size && <span>المقاس: {item.size}</span>}
                              {item.size && item.color && <span> • </span>}
                              {item.color && <span>اللون: {item.color}</span>}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-sm font-semibold">
                              {convertPrice(item.price * item.quantity)} {getCurrencySymbol()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">العملة:</span>
                    <CurrencySelector />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>المجموع الفرعي</span>
                      <span>
                        {convertPrice(totalPrice)} {getCurrencySymbol()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>الشحن</span>
                      <span className="text-accent">مجاني</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>المجموع الكلي</span>
                      <span className="text-primary">
                        {convertPrice(totalPrice)} {getCurrencySymbol()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-[#7f5c7e] hover:bg-[#6d4d6c]"
                      size="lg"
                      onClick={() => setShowCheckout(true)}
                    >
                      تأكيد الطلب
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => dispatch({ type: "TOGGLE_CART" })}
                    >
                      متابعة التسوق
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={showCheckout} onOpenChange={setShowCheckout} />
    </>
  )
}
