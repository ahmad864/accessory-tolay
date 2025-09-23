"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Minus, Trash2, MessageCircle } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { CheckoutDialog } from "./checkout-dialog"
import { useState } from "react"

export function CartSidebar() {
  const { state, dispatch } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  return (
    <>
      <Sheet open={state.isOpen} onOpenChange={() => dispatch({ type: "TOGGLE_CART" })}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative bg-transparent">
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              سلة التسوق ({itemCount} منتج)
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {state.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">السلة فارغة</p>
                  <p className="text-muted-foreground">أضف بعض المنتجات لتبدأ التسوق</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                          {item.color && <p className="text-xs text-muted-foreground mb-1">اللون: {item.color}</p>}
                          {item.size && <p className="text-xs text-muted-foreground mb-1">المقاس: {item.size}</p>}
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">{item.price} ر.س</span>
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>الإجمالي:</span>
                    <span className="text-primary">{total} ر.س</span>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setCheckoutOpen(true)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      طلب عبر الواتساب
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => dispatch({ type: "CLEAR_CART" })}
                    >
                      إفراغ السلة
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  )
}
