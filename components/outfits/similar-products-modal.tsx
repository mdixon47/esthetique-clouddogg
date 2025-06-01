"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Loader2 } from "lucide-react"
import { useToast } from "@/components/providers/toast-provider"
import { useCart } from "@/components/providers/cart-provider"
import Image from "next/image"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  salePrice?: number
  image: string
  description: string
  colors: string[]
  sizes: string[]
}

interface SimilarProductsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  itemCategory: string
}

export function SimilarProductsModal({ open, onOpenChange, itemName, itemCategory }: SimilarProductsModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()
  const { addToCart } = useCart()

  // Fetch similar products when the modal opens
  useState(() => {
    if (open) {
      setIsLoading(true)
      // In a real app, this would be an API call to fetch similar products
      // For now, we'll simulate a delay and return mock data
      setTimeout(() => {
        setProducts(getSimilarProducts(itemName, itemCategory))
        setIsLoading(false)
      }, 1000)
    }
  })

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity: 1,
      category: itemCategory,
    })

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Similar Products to {itemName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <span className="ml-2">Finding similar products...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  {product.salePrice && <Badge className="absolute top-2 right-2 bg-red-500">Sale</Badge>}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      {product.salePrice ? (
                        <>
                          <span className="text-red-500 font-medium">${product.salePrice}</span>
                          <span className="text-gray-400 line-through text-sm ml-2">${product.price}</span>
                        </>
                      ) : (
                        <span className="font-medium">${product.price}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.colors.map((color) => (
                      <Badge key={color} variant="outline" className="bg-white">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleAddToWishlist(product)}>
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button className="bg-pink-500 hover:bg-pink-600" size="sm" onClick={() => handleAddToCart(product)}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Mock function to generate similar products
function getSimilarProducts(itemName: string, category: string): Product[] {
  // In a real app, this would be an API call to fetch similar products
  // For now, we'll return mock data based on the category

  const products: Record<string, Product[]> = {
    Tops: [
      {
        id: 101,
        name: "Cotton Crew Neck Tee",
        brand: "Essentials",
        price: 24.99,
        image: "/placeholder.svg?height=300&width=300&text=Cotton+Tee",
        description: "A comfortable cotton tee perfect for everyday wear.",
        colors: ["White", "Black", "Gray"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 102,
        name: "Slim Fit Oxford Shirt",
        brand: "Modern Classics",
        price: 49.99,
        salePrice: 39.99,
        image: "/placeholder.svg?height=300&width=300&text=Oxford+Shirt",
        description: "A timeless oxford shirt with a modern slim fit.",
        colors: ["Blue", "White", "Pink"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 103,
        name: "Oversized Graphic Tee",
        brand: "Urban Style",
        price: 34.99,
        image: "/placeholder.svg?height=300&width=300&text=Graphic+Tee",
        description: "An oversized tee with trendy graphic prints.",
        colors: ["Black", "White"],
        sizes: ["S", "M", "L", "XL"],
      },
    ],
    Bottoms: [
      {
        id: 201,
        name: "Slim Fit Jeans",
        brand: "Denim Co.",
        price: 59.99,
        image: "/placeholder.svg?height=300&width=300&text=Slim+Jeans",
        description: "Classic slim fit jeans with a comfortable stretch.",
        colors: ["Blue", "Black", "Gray"],
        sizes: ["28", "30", "32", "34", "36"],
      },
      {
        id: 202,
        name: "Chino Pants",
        brand: "Modern Classics",
        price: 54.99,
        salePrice: 44.99,
        image: "/placeholder.svg?height=300&width=300&text=Chino+Pants",
        description: "Versatile chino pants that go with everything.",
        colors: ["Khaki", "Navy", "Olive"],
        sizes: ["28", "30", "32", "34", "36"],
      },
      {
        id: 203,
        name: "Cargo Joggers",
        brand: "Urban Style",
        price: 49.99,
        image: "/placeholder.svg?height=300&width=300&text=Cargo+Joggers",
        description: "Comfortable joggers with cargo pockets for a utilitarian look.",
        colors: ["Black", "Olive", "Tan"],
        sizes: ["S", "M", "L", "XL"],
      },
    ],
    Dresses: [
      {
        id: 301,
        name: "Floral Midi Dress",
        brand: "Bloom",
        price: 79.99,
        image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
        description: "A beautiful floral midi dress perfect for spring and summer.",
        colors: ["Floral Print", "Blue Floral", "Pink Floral"],
        sizes: ["XS", "S", "M", "L", "XL"],
      },
      {
        id: 302,
        name: "Wrap Dress",
        brand: "Elegance",
        price: 89.99,
        salePrice: 69.99,
        image: "/placeholder.svg?height=300&width=300&text=Wrap+Dress",
        description: "A flattering wrap dress suitable for various occasions.",
        colors: ["Black", "Navy", "Burgundy"],
        sizes: ["XS", "S", "M", "L", "XL"],
      },
      {
        id: 303,
        name: "Maxi Sundress",
        brand: "Summer Vibes",
        price: 69.99,
        image: "/placeholder.svg?height=300&width=300&text=Maxi+Dress",
        description: "A flowing maxi sundress for warm weather days.",
        colors: ["Yellow", "White", "Blue"],
        sizes: ["XS", "S", "M", "L", "XL"],
      },
    ],
    Outerwear: [
      {
        id: 401,
        name: "Denim Jacket",
        brand: "Denim Co.",
        price: 79.99,
        image: "/placeholder.svg?height=300&width=300&text=Denim+Jacket",
        description: "A classic denim jacket that never goes out of style.",
        colors: ["Blue", "Black", "Light Wash"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 402,
        name: "Leather Biker Jacket",
        brand: "Urban Edge",
        price: 149.99,
        salePrice: 129.99,
        image: "/placeholder.svg?height=300&width=300&text=Leather+Jacket",
        description: "An edgy leather biker jacket to elevate any outfit.",
        colors: ["Black", "Brown"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 403,
        name: "Oversized Blazer",
        brand: "Modern Classics",
        price: 99.99,
        image: "/placeholder.svg?height=300&width=300&text=Blazer",
        description: "A trendy oversized blazer for a sophisticated look.",
        colors: ["Black", "Beige", "Check Pattern"],
        sizes: ["XS", "S", "M", "L", "XL"],
      },
    ],
    Shoes: [
      {
        id: 501,
        name: "Classic Sneakers",
        brand: "Urban Step",
        price: 69.99,
        image: "/placeholder.svg?height=300&width=300&text=Sneakers",
        description: "Versatile sneakers that go with everything.",
        colors: ["White", "Black", "Gray"],
        sizes: ["6", "7", "8", "9", "10", "11"],
      },
      {
        id: 502,
        name: "Ankle Boots",
        brand: "Footwear Co.",
        price: 89.99,
        salePrice: 74.99,
        image: "/placeholder.svg?height=300&width=300&text=Ankle+Boots",
        description: "Stylish ankle boots for fall and winter.",
        colors: ["Black", "Brown", "Tan"],
        sizes: ["6", "7", "8", "9", "10"],
      },
      {
        id: 503,
        name: "Canvas Slip-Ons",
        brand: "Casual Steps",
        price: 49.99,
        image: "/placeholder.svg?height=300&width=300&text=Slip+Ons",
        description: "Comfortable slip-on shoes for everyday wear.",
        colors: ["Navy", "White", "Black"],
        sizes: ["6", "7", "8", "9", "10", "11"],
      },
    ],
    Accessories: [
      {
        id: 601,
        name: "Leather Tote Bag",
        brand: "Accessorize",
        price: 99.99,
        image: "/placeholder.svg?height=300&width=300&text=Tote+Bag",
        description: "A spacious leather tote for work or weekend.",
        colors: ["Black", "Brown", "Tan"],
        sizes: ["One Size"],
      },
      {
        id: 602,
        name: "Silk Scarf",
        brand: "Elegance",
        price: 39.99,
        salePrice: 29.99,
        image: "/placeholder.svg?height=300&width=300&text=Silk+Scarf",
        description: "A versatile silk scarf to add a pop of color to any outfit.",
        colors: ["Floral", "Geometric", "Solid"],
        sizes: ["One Size"],
      },
      {
        id: 603,
        name: "Statement Necklace",
        brand: "Glam",
        price: 49.99,
        image: "/placeholder.svg?height=300&width=300&text=Necklace",
        description: "A bold statement necklace to elevate your look.",
        colors: ["Gold", "Silver"],
        sizes: ["One Size"],
      },
    ],
  }

  // Return products for the given category, or default to Tops
  return products[category] || products["Tops"]
}
