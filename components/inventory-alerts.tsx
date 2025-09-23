"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Bell, Plus, CheckCircle, X } from "lucide-react"
import { useInventory, useInventoryMonitor } from "@/lib/inventory-store"
import { useProducts } from "@/lib/products-store"

export function InventoryAlerts() {
  const { state: inventoryState, dispatch: inventoryDispatch } = useInventory()
  const {
    state: { products },
  } = useProducts()
  const { restockProduct } = useInventoryMonitor()
  const [restockDialog, setRestockDialog] = useState<{ open: boolean; productId?: number }>({ open: false })
  const [restockQuantity, setRestockQuantity] = useState(20)
  const [restockReason, setRestockReason] = useState("")

  const unreadAlerts = inventoryState.alerts.filter((alert) => !alert.read)
  const criticalAlerts = unreadAlerts.filter((alert) => alert.type === "out_of_stock")
  const warningAlerts = unreadAlerts.filter((alert) => alert.type === "low_stock")

  const handleMarkAsRead = (alertId: string) => {
    inventoryDispatch({ type: "MARK_ALERT_READ", payload: alertId })
  }

  const handleRestock = () => {
    if (restockDialog.productId && restockQuantity > 0) {
      restockProduct(restockDialog.productId, restockQuantity, restockReason || "إعادة تخزين")
      setRestockDialog({ open: false })
      setRestockQuantity(20)
      setRestockReason("")
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "out_of_stock":
        return <X className="h-4 w-4 text-red-500" />
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "out_of_stock":
        return "destructive"
      case "low_stock":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (unreadAlerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">المخزون في حالة جيدة</h3>
            <p className="text-muted-foreground">لا توجد تحذيرات مخزون حالياً</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            تحذيرات المخزون
            {unreadAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadAlerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criticalAlerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600 flex items-center gap-2">
                <X className="h-4 w-4" />
                نفدت الكمية ({criticalAlerts.length})
              </h4>
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleDateString("ar-SA")} - {alert.timestamp.toLocaleTimeString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog
                      open={restockDialog.open && restockDialog.productId === alert.productId}
                      onOpenChange={(open) => setRestockDialog({ open, productId: open ? alert.productId : undefined })}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          إعادة تخزين
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>إعادة تخزين - {alert.productName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity">الكمية</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={restockQuantity}
                              onChange={(e) => setRestockQuantity(Number.parseInt(e.target.value) || 0)}
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reason">السبب (اختياري)</Label>
                            <Textarea
                              id="reason"
                              value={restockReason}
                              onChange={(e) => setRestockReason(e.target.value)}
                              placeholder="سبب إعادة التخزين..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setRestockDialog({ open: false })}
                              className="flex-1"
                            >
                              إلغاء
                            </Button>
                            <Button onClick={handleRestock} className="flex-1">
                              إعادة تخزين
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(alert.id)}>
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {warningAlerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                كمية قليلة ({warningAlerts.length})
              </h4>
              {warningAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleDateString("ar-SA")} - {alert.timestamp.toLocaleTimeString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog
                      open={restockDialog.open && restockDialog.productId === alert.productId}
                      onOpenChange={(open) => setRestockDialog({ open, productId: open ? alert.productId : undefined })}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          إعادة تخزين
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(alert.id)}>
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {unreadAlerts.length > 3 && (
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => inventoryDispatch({ type: "CLEAR_ALERTS" })}
            >
              مسح جميع التحذيرات
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={restockDialog.open && !restockDialog.productId} onOpenChange={(open) => setRestockDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إعادة تخزين المنتج</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number.parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">السبب (اختياري)</Label>
              <Textarea
                id="reason"
                value={restockReason}
                onChange={(e) => setRestockReason(e.target.value)}
                placeholder="سبب إعادة التخزين..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRestockDialog({ open: false })} className="flex-1">
                إلغاء
              </Button>
              <Button onClick={handleRestock} className="flex-1">
                إعادة تخزين
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
