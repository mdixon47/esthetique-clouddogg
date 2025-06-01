"use client"

import { Button } from "@/components/ui/button"
import { ProductCard, type Product } from "@/components/try-on/product-card"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/providers/toast-provider"

interface BuyThisLookProps {
  products: Product[]
  onAddAllToCart?: (products: Product[]) => void
}

export function BuyThisLook({ products, onAddAllToCart }: BuyThisLookProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleAddToWishlist = (product: Product) => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    })
  }

  const handleAddAllToCart = () => {
    if (onAddAllToCart) {
      onAddAllToCart(products)
    }

    toast({
      title: "Added all items to cart",
      description: `${products.length} items have been added to your cart`,
    })
  }

  // Calculate total price
  const totalPrice = products.reduce((sum, product) => {
    const price = product.discount ? product.price * (1 - product.discount / 100) : product.price
    return sum + price
  }, 0)

  return (
    <div className="mt-8 border rounded-lg overflow-hidden bg-white">
      <div
        className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5 text-pink-500" />
          Buy This Look
        </h2>
        <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {products.length} item{products.length !== 1 ? "s" : ""} in this look
            </p>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total:</p>
              <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <Button
            className="w-full mb-6 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            onClick={handleAddAllToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add All Items to Cart
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

