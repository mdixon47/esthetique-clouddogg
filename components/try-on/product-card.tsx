"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  purchaseLink: string
  brand?: string
  category?: string
  inStock?: boolean
  discount?: number
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted)
    if (onAddToWishlist) {
      onAddToWishlist(product)
    }
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  // Calculate discounted price if applicable
  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`
          }}
        />
        {product.discount && <Badge className="absolute top-2 right-2 bg-pink-500">{product.discount}% OFF</Badge>}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 left-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${isWishlisted ? "text-pink-500" : "text-gray-400"}`}
          onClick={handleAddToWishlist}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
          </div>
          <div className="text-right">
            {product.discount ? (
              <div>
                <span className="text-sm font-bold">${finalPrice.toFixed(2)}</span>
                <span className="text-xs text-gray-500 line-through ml-1">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock === false ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
