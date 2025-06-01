"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera, RefreshCw, Sparkles, AlertCircle, Loader2, Info, ImageOff, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { BuyThisLook } from "@/components/try-on/buy-this-look"
import type { Product } from "@/components/try-on/product-card"
import { useToast } from "@/hooks/use-toast"
import { cacheImage, getCachedImage, generateTryOnCacheKey, generateImageHash } from "@/lib/image-cache"

export function VirtualTryOn() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userImageHash, setUserImageHash] = useState<string | null>(null)
  const [selectedClothing, setSelectedClothing] = useState<any | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [useFallbackMode, setUseFallbackMode] = useState(true) // Default to fallback mode
  const [lookProducts, setLookProducts] = useState<Product[]>([])
  const [imageLoadError, setImageLoadError] = useState(false)
  const [cacheStatus, setCacheStatus] = useState<"hit" | "miss" | null>(null)
  const { toast } = useToast()

  // Sample clothing items
  const clothingItems = [
    {
      id: 1,
      name: "Blue Denim Jacket",
      image: "/placeholder.svg?height=300&width=300&text=Denim+Jacket",
      category: "Outerwear",
      price: 89.99,
      description: "Classic blue denim jacket with button closure and multiple pockets",
      brand: "StyleDenim",
      purchaseLink: "https://example.com/denim-jacket",
    },
    {
      id: 2,
      name: "White Blouse",
      image: "/placeholder.svg?height=300&width=300&text=White+Blouse",
      category: "Tops",
      price: 49.99,
      description: "Elegant white blouse with a relaxed fit and button-up front",
      brand: "ElegantWear",
      purchaseLink: "https://example.com/white-blouse",
      discount: 15,
    },
    {
      id: 3,
      name: "Black Dress",
      image: "/placeholder.svg?height=300&width=300&text=Black+Dress",
      category: "Dresses",
      price: 79.99,
      description: "Versatile black dress perfect for any occasion",
      brand: "ChicStyle",
      purchaseLink: "https://example.com/black-dress",
    },
    {
      id: 4,
      name: "Red Sweater",
      image: "/placeholder.svg?height=300&width=300&text=Red+Sweater",
      category: "Tops",
      price: 59.99,
      description: "Cozy red sweater made from premium soft yarn",
      brand: "CozyKnits",
      purchaseLink: "https://example.com/red-sweater",
      discount: 20,
    },
  ]

  // Fallback images for demo purposes
  const fallbackResults = {
    1: "/placeholder.svg?height=800&width=600&text=Person+Wearing+Denim+Jacket",
    2: "/placeholder.svg?height=800&width=600&text=Person+Wearing+White+Blouse",
    3: "/placeholder.svg?height=800&width=600&text=Person+Wearing+Black+Dress",
    4: "/placeholder.svg?height=800&width=600&text=Person+Wearing+Red+Sweater",
  }

  // Sample complementary products for each clothing item
  const complementaryProducts = {
    1: [
      // For Denim Jacket
      {
        id: "c1-1",
        name: "White T-Shirt",
        price: 24.99,
        description: "Essential white t-shirt that pairs perfectly with your denim jacket",
        image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
        purchaseLink: "https://example.com/white-tshirt",
        brand: "BasicEssentials",
      },
      {
        id: "c1-2",
        name: "Black Jeans",
        price: 69.99,
        description: "Slim fit black jeans to complete your casual look",
        image: "/placeholder.svg?height=300&width=300&text=Black+Jeans",
        purchaseLink: "https://example.com/black-jeans",
        brand: "DenimCo",
      },
    ],
    2: [
      // For White Blouse
      {
        id: "c2-1",
        name: "Pencil Skirt",
        price: 54.99,
        description: "Elegant pencil skirt that pairs beautifully with your white blouse",
        image: "/placeholder.svg?height=300&width=300&text=Pencil+Skirt",
        purchaseLink: "https://example.com/pencil-skirt",
        brand: "OfficeFashion",
      },
    ],
    3: [
      // For Black Dress
      {
        id: "c3-1",
        name: "Pearl Necklace",
        price: 39.99,
        description: "Classic pearl necklace to elevate your black dress",
        image: "/placeholder.svg?height=300&width=300&text=Pearl+Necklace",
        purchaseLink: "https://example.com/pearl-necklace",
        brand: "ElegantJewels",
        discount: 10,
      },
      {
        id: "c3-2",
        name: "Black Heels",
        price: 89.99,
        description: "Sophisticated black heels to complete your elegant look",
        image: "/placeholder.svg?height=300&width=300&text=Black+Heels",
        purchaseLink: "https://example.com/black-heels",
        brand: "LuxurySteps",
      },
    ],
    4: [
      // For Red Sweater
      {
        id: "c4-1",
        name: "Beige Scarf",
        price: 29.99,
        description: "Soft beige scarf that complements your red sweater perfectly",
        image: "/placeholder.svg?height=300&width=300&text=Beige+Scarf",
        purchaseLink: "https://example.com/beige-scarf",
        brand: "WinterAccessories",
      },
      {
        id: "c4-2",
        name: "Blue Jeans",
        price: 69.99,
        description: "Classic blue jeans to pair with your red sweater",
        image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
        purchaseLink: "https://example.com/blue-jeans",
        brand: "DenimCo",
      },
    ],
  }

  // Generate hash when user image changes
  useEffect(() => {
    if (userImage) {
      const hash = generateImageHash(userImage)
      setUserImageHash(hash)
    } else {
      setUserImageHash(null)
    }
  }, [userImage])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size - limit to 4MB to avoid payload issues
      if (file.size > 4 * 1024 * 1024) {
        setError("Image is too large. Please select an image under 4MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setUserImage(imageData)
        setResultImage(null) // Reset result when new image is uploaded
        setError(null) // Clear any previous errors
        setImageLoadError(false) // Reset image load error state
        setCacheStatus(null) // Reset cache status
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClothingSelect = (item: any) => {
    setSelectedClothing(item)
    setResultImage(null) // Reset result when new clothing is selected
    setError(null) // Clear any previous errors
    setImageLoadError(false) // Reset image load error state
    setCacheStatus(null) // Reset cache status
  }

  const generateTryOn = async () => {
    if (!userImage || !selectedClothing) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)
    setLookProducts([]) // Reset products
    setImageLoadError(false) // Reset image load error state
    setCacheStatus(null) // Reset cache status

    // Generate cache key
    const cacheKey = generateTryOnCacheKey(selectedClothing.name, userImageHash || undefined)

    // Check cache first
    try {
      const cachedImage = await getCachedImage(cacheKey)

      if (cachedImage) {
        // Cache hit - use cached image
        setResultImage(cachedImage)
        setCacheStatus("hit")

        // Create product list for the look
        const mainProduct = {
          id: `p-${selectedClothing.id}`,
          name: selectedClothing.name,
          price: selectedClothing.price,
          description: selectedClothing.description,
          image: selectedClothing.image,
          purchaseLink: selectedClothing.purchaseLink,
          brand: selectedClothing.brand,
          category: selectedClothing.category,
        }

        // Add complementary products if available
        const complementary = complementaryProducts[selectedClothing.id] || []
        setLookProducts([mainProduct, ...complementary])

        // Simulate progress for better UX
        setProcessingProgress(100)
        setTimeout(() => {
          setIsProcessing(false)
        }, 500)

        toast({
          title: "Image loaded from cache",
          description: "Using previously generated image from cache",
        })

        return
      }

      // Cache miss - continue with generation
      setCacheStatus("miss")

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 1000)

      try {
        let resultImageUrl: string

        if (useFallbackMode) {
          // Use fallback mode with mock images
          await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay
          resultImageUrl = fallbackResults[selectedClothing.id]
        } else {
          // Call our API endpoint with more detailed data
          const response = await fetch("/api/try-on", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clothingName: selectedClothing.name,
              userImage: userImage, // Send the user image for better AI generation
              debug: true, // Enable debug mode to get more information
            }),
          })

          // Check if the response is OK before trying to parse JSON
          if (!response.ok) {
            let errorMessage = "Failed to generate try-on image"

            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorMessage
              console.error("API error details:", errorData)
            } catch (jsonError) {
              errorMessage = `Server error: ${response.status} ${response.statusText || ""}`
            }

            throw new Error(errorMessage)
          }

          // Parse the JSON response
          const data = await response.json()
          console.log("API response:", data) // Log the full response for debugging

          if (!data.imageUrl) {
            throw new Error("No image URL returned from the server")
          }

          resultImageUrl = data.imageUrl
        }

        // Store the result in cache
        if (resultImageUrl) {
          // For URLs, we need to fetch the image data first
          if (resultImageUrl.startsWith("http") || resultImageUrl.startsWith("/")) {
            try {
              // For placeholder SVGs, we can just store the URL
              if (resultImageUrl.startsWith("/placeholder")) {
                await cacheImage(cacheKey, resultImageUrl, {
                  type: "svg",
                  query: selectedClothing.name,
                })
              } else {
                // For real images, fetch and convert to base64
                const response = await fetch(resultImageUrl)
                const blob = await response.blob()

                const reader = new FileReader()
                reader.onloadend = () => {
                  const base64data = reader.result as string
                  cacheImage(cacheKey, base64data, {
                    type: blob.type,
                    size: blob.size,
                  })
                }
                reader.readAsDataURL(blob)
              }
            } catch (cacheError) {
              console.error("Failed to cache image:", cacheError)
              // Continue even if caching fails
            }
          } else {
            // For data URLs, store directly
            await cacheImage(cacheKey, resultImageUrl)
          }
        }

        setResultImage(resultImageUrl)

        // Create product list for the look
        const mainProduct = {
          id: `p-${selectedClothing.id}`,
          name: selectedClothing.name,
          price: selectedClothing.price,
          description: selectedClothing.description,
          image: selectedClothing.image,
          purchaseLink: selectedClothing.purchaseLink,
          brand: selectedClothing.brand,
          category: selectedClothing.category,
        }

        // Add complementary products if available
        const complementary = complementaryProducts[selectedClothing.id] || []
        setLookProducts([mainProduct, ...complementary])
      } catch (err) {
        console.error("Error generating try-on:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")

        // Automatically switch to fallback mode if API fails
        if (!useFallbackMode) {
          setUseFallbackMode(true)
          setError("Switched to demo mode due to API error. " + (err instanceof Error ? err.message : ""))

          // Try with fallback immediately
          const fallbackImage = fallbackResults[selectedClothing.id]
          setResultImage(fallbackImage)

          // Cache the fallback result
          try {
            await cacheImage(cacheKey, fallbackImage, {
              type: "svg",
              query: `Fallback for ${selectedClothing.name}`,
            })
          } catch (cacheError) {
            console.error("Failed to cache fallback image:", cacheError)
          }

          // Create product list for the look
          const mainProduct = {
            id: `p-${selectedClothing.id}`,
            name: selectedClothing.name,
            price: selectedClothing.price,
            description: selectedClothing.description,
            image: selectedClothing.image,
            purchaseLink: selectedClothing.purchaseLink,
            brand: selectedClothing.brand,
            category: selectedClothing.category,
          }

          // Add complementary products if available
          const complementary = complementaryProducts[selectedClothing.id] || []
          setLookProducts([mainProduct, ...complementary])
        }
      } finally {
        clearInterval(progressInterval)
        setProcessingProgress(100)

        // Small delay to show 100% progress before clearing
        setTimeout(() => {
          setIsProcessing(false)
        }, 500)
      }
    } catch (cacheError) {
      console.error("Cache error:", cacheError)
      // Continue with normal generation if cache fails
      setCacheStatus("miss")
      generateTryOnWithoutCache()
    }
  }

  // Fallback function if cache checking fails
  const generateTryOnWithoutCache = async () => {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress > 90 ? 90 : newProgress
      })
    }, 1000)

    try {
      if (useFallbackMode) {
        // Use fallback mode with mock images
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay
        setResultImage(fallbackResults[selectedClothing.id])

        // Create product list for the look
        const mainProduct = {
          id: `p-${selectedClothing.id}`,
          name: selectedClothing.name,
          price: selectedClothing.price,
          description: selectedClothing.description,
          image: selectedClothing.image,
          purchaseLink: selectedClothing.purchaseLink,
          brand: selectedClothing.brand,
          category: selectedClothing.category,
        }

        // Add complementary products if available
        const complementary = complementaryProducts[selectedClothing.id] || []
        setLookProducts([mainProduct, ...complementary])
      } else {
        // Call our API endpoint with more detailed data
        const response = await fetch("/api/try-on", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clothingName: selectedClothing.name,
            userImage: userImage, // Send the user image for better AI generation
            debug: true, // Enable debug mode to get more information
          }),
        })

        // Check if the response is OK before trying to parse JSON
        if (!response.ok) {
          let errorMessage = "Failed to generate try-on image"

          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
            console.error("API error details:", errorData)
          } catch (jsonError) {
            errorMessage = `Server error: ${response.status} ${response.statusText || ""}`
          }

          throw new Error(errorMessage)
        }

        // Parse the JSON response
        const data = await response.json()
        console.log("API response:", data) // Log the full response for debugging

        if (!data.imageUrl) {
          throw new Error("No image URL returned from the server")
        }

        setResultImage(data.imageUrl)

        // Create product list for the look
        const mainProduct = {
          id: `p-${selectedClothing.id}`,
          name: selectedClothing.name,
          price: selectedClothing.price,
          description: selectedClothing.description,
          image: selectedClothing.image,
          purchaseLink: selectedClothing.purchaseLink,
          brand: selectedClothing.brand,
          category: selectedClothing.category,
        }

        // Add complementary products if available
        const complementary = complementaryProducts[selectedClothing.id] || []
        setLookProducts([mainProduct, ...complementary])
      }
    } catch (err) {
      console.error("Error generating try-on:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")

      // Automatically switch to fallback mode if API fails
      if (!useFallbackMode) {
        setUseFallbackMode(true)
        setError("Switched to demo mode due to API error. " + (err instanceof Error ? err.message : ""))

        // Try with fallback immediately
        setResultImage(fallbackResults[selectedClothing.id])

        // Create product list for the look
        const mainProduct = {
          id: `p-${selectedClothing.id}`,
          name: selectedClothing.name,
          price: selectedClothing.price,
          description: selectedClothing.description,
          image: selectedClothing.image,
          purchaseLink: selectedClothing.purchaseLink,
          brand: selectedClothing.brand,
          category: selectedClothing.category,
        }

        // Add complementary products if available
        const complementary = complementaryProducts[selectedClothing.id] || []
        setLookProducts([mainProduct, ...complementary])
      }
    } finally {
      clearInterval(progressInterval)
      setProcessingProgress(100)

      // Small delay to show 100% progress before clearing
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  const resetAll = () => {
    setUserImage(null)
    setUserImageHash(null)
    setSelectedClothing(null)
    setResultImage(null)
    setError(null)
    setLookProducts([])
    setImageLoadError(false)
    setCacheStatus(null)
  }

  const toggleFallbackMode = () => {
    setUseFallbackMode(!useFallbackMode)
    setError(null)
    setImageLoadError(false)
    setCacheStatus(null)
  }

  const handleAddAllToCart = (products: Product[]) => {
    // In a real app, this would add all products to the cart
    toast({
      title: "Added all items to cart",
      description: `${products.length} items have been added to your cart`,
    })
  }

  const handleImageError = () => {
    console.error("Image failed to load:", resultImage)
    setImageLoadError(true)

    // Try to use fallback image
    if (!useFallbackMode && selectedClothing) {
      setResultImage(fallbackResults[selectedClothing.id])
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {imageLoadError && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <ImageOff className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Image Loading Error</AlertTitle>
          <AlertDescription className="text-amber-700">
            There was a problem loading the AI-generated image. We've switched to a placeholder image instead.
          </AlertDescription>
        </Alert>
      )}

      {cacheStatus && (
        <Alert
          variant="default"
          className={cacheStatus === "hit" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}
        >
          <Database className={`h-4 w-4 ${cacheStatus === "hit" ? "text-green-500" : "text-blue-500"}`} />
          <AlertTitle className={cacheStatus === "hit" ? "text-green-700" : "text-blue-700"}>
            {cacheStatus === "hit" ? "Image Loaded from Cache" : "Generating New Image"}
          </AlertTitle>
          <AlertDescription className={cacheStatus === "hit" ? "text-green-700" : "text-blue-700"}>
            {cacheStatus === "hit"
              ? "This image was loaded from your browser's cache for faster performance."
              : "This is a new combination. The result will be cached for future use."}
          </AlertDescription>
        </Alert>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Demo Mode {useFallbackMode ? "Enabled" : "Disabled"}</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>
            {useFallbackMode
              ? "Using placeholder images instead of real AI generation."
              : "Using AI for image generation."}
          </span>
          <Button variant="outline" size="sm" onClick={toggleFallbackMode} className="ml-2">
            {useFallbackMode ? "Use Real AI" : "Use Demo Mode"}
          </Button>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">1. Upload Your Photo</h2>

          {userImage ? (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-muted">
              <img
                src={userImage || "/placeholder.svg"}
                alt="Your photo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error("User image failed to load")
                  e.currentTarget.src = "/placeholder.svg?height=800&width=600&text=Image+Error"
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2 bg-background"
                onClick={resetAll}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                <TabsTrigger value="camera">Take Photo</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div
                      className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center cursor-pointer"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                    >
                      <Upload className="mb-4 h-8 w-8 text-pink-500" />
                      <h3 className="mb-1 text-lg font-medium">Upload your photo</h3>
                      <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">Maximum size: 4MB</p>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="camera" className="mt-4">
                <Card>
                  <CardContent className="flex aspect-[3/4] items-center justify-center p-6">
                    <div className="text-center">
                      <Camera className="mx-auto mb-4 h-8 w-8 text-pink-500" />
                      <h3 className="mb-1 text-lg font-medium">Camera access</h3>
                      <p className="mb-4 text-sm text-muted-foreground">Allow camera access to take a photo</p>
                      <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500">
                        Enable Camera
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">2. Select Clothing Item</h2>
          <div className="grid grid-cols-2 gap-3">
            {clothingItems.map((item) => (
              <div
                key={item.id}
                className={`cursor-pointer overflow-hidden rounded-lg border transition-all ${
                  selectedClothing?.id === item.id ? "ring-2 ring-pink-500 ring-offset-2" : "hover:border-pink-200"
                }`}
                onClick={() => handleClothingSelect(item)}
              >
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error("Clothing item image failed to load:", item.name)
                      e.currentTarget.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name)}`
                    }}
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                    <p className="text-xs font-medium">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {isProcessing && (
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {cacheStatus === "hit" ? "Loading from cache..." : "Generating try-on image..."}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(processingProgress)}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        )}

        <Button
          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
          size="lg"
          disabled={!userImage || !selectedClothing || isProcessing}
          onClick={generateTryOn}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {cacheStatus === "hit" ? "Loading..." : "Processing..."}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Virtual Try-On
            </>
          )}
        </Button>
      </div>

      {resultImage && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-medium">3. Your Virtual Try-On Result</h2>
          <div className="mx-auto max-w-md overflow-hidden rounded-lg border">
            <div className="aspect-[3/4] w-full bg-muted">
              {imageLoadError ? (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-4">
                  <ImageOff className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">Image could not be loaded</p>
                  <p className="text-gray-400 text-sm text-center mt-2">Try using demo mode instead</p>
                </div>
              ) : (
                <img
                  src={resultImage || "/placeholder.svg"}
                  alt="Try-on result"
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
            <div className="flex justify-between p-4">
              <Button variant="outline" onClick={() => setResultImage(null)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Another
              </Button>
              <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500">
                Save Result
              </Button>
            </div>
          </div>

          {/* Buy This Look section */}
          {lookProducts.length > 0 && <BuyThisLook products={lookProducts} onAddAllToCart={handleAddAllToCart} />}
        </div>
      )}
    </div>
  )
}
