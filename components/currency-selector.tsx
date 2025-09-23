"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useCurrency, type Currency } from "@/lib/currency-store"

const currencies = [
  { code: "USD" as Currency, name: "دولار أمريكي", symbol: "$" },
  { code: "SYP" as Currency, name: "ليرة سورية", symbol: "ل.س" },
  { code: "TRY" as Currency, name: "ليرة تركية", symbol: "₺" },
]

export function CurrencySelector() {
  const { currency, setCurrency, getCurrencySymbol } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          {getCurrencySymbol()}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={currency === curr.code ? "bg-purple-50" : ""}
          >
            <span className="flex items-center gap-2">
              {curr.symbol} {curr.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
