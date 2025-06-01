"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { Badge } from "@/components/ui/badge"

export function CartIcon() {
  const { itemCount } = useCart()

  return (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-pink-500">
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Button>
  )
}
