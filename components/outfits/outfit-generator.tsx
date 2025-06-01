"use client"

import { useState, useCallback } from "react"
import { OutfitCard } from "@/components/outfits/outfit-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Filter, Sparkles, Zap, Brain, AlertTriangle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data for the wardrobe
const sampleWardrobe = [
  {
    id: 1,
    name: "White Cotton T-Shirt",
    category: "Tops",
    subcategory: "T-Shirt",
    colors: ["White"],
    seasons: ["Spring", "Summer"],
    occasions: ["Casual"],
    image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
  },
  {
    id: 2,
    name: "Blue Denim Jeans",
    category: "Bottoms",
    subcategory: "Jeans",
    colors: ["Blue"],
    seasons: ["Spring", "Fall", "Winter"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
  },
  {
    id: 3,
    name: "Black Leather Jacket",
    category: "Outerwear",
    subcategory: "Jacket",
    colors: ["Black"],
    seasons: ["Fall", "Winter"],
    occasions: ["Casual"],
    image: "/placeholder.svg?height=300&width=300&text=Black+Jacket",
  },
  {
    id: 4,
    name: "Floral Summer Dress",
    category: "Dresses",
    subcategory: "Casual Dress",
    colors: ["Multicolor", "Pink", "Green"],
    seasons: ["Spring", "Summer"],
    occasions: ["Casual", "Party"],
    image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
  },
  {
    id: 5,
    name: "White Sneakers",
    category: "Shoes",
    subcategory: "Sneakers",
    colors: ["White"],
    seasons: ["Spring", "Summer", "Fall"],
    occasions: ["Casual", "Sport"],
    image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
  },
  {
    id: 6,
    name: "Black Formal Blazer",
    category: "Outerwear",
    subcategory: "Blazer",
    colors: ["Black"],
    seasons: ["Fall", "Winter", "Spring"],
    occasions: ["Formal", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Black+Blazer",
  },
  {
    id: 7,
    name: "Red Knit Sweater",
    category: "Tops",
    subcategory: "Sweater",
    colors: ["Red"],
    seasons: ["Fall", "Winter"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Red+Sweater",
  },
  {
    id: 8,
    name: "Beige Trench Coat",
    category: "Outerwear",
    subcategory: "Coat",
    colors: ["Beige"],
    seasons: ["Fall", "Spring"],
    occasions: ["Casual", "Work"],
    image: "/placeholder.svg?height=300&width=300&text=Beige+Coat",
  },
]

interface OutfitGeneratorProps {
  outfits: any[]
  setOutfits: (outfits: any[]) => void
  isGenerating?: boolean
  useAI?: boolean
  useGrok?: boolean
  useOpenAI?: boolean
}

export function OutfitGenerator({
  outfits,
  setOutfits,
  isGenerating = false,
  useAI = true,
  useGrok = false,
  useOpenAI = false,
}: OutfitGeneratorProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isGeneratingState, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  // State for user's wardrobe - in a real app, this would come from a database
  const [userWardrobe, setUserWardrobe] = useState(sampleWardrobe)

  // Create a local fallback generator function
  const generateFallbackOutfits = useCallback(
    (count = 4) => {
      console.log("Using local fallback outfit generator")

      // Generate random outfits based on the wardrobe
      return Array(count)
        .fill(null)
        .map((_, index) => {
          // Randomly select items from different categories
          const tops = userWardrobe.filter((item) => item.category === "Tops")
          const bottoms = userWardrobe.filter((item) => item.category === "Bottoms")
          const shoes = userWardrobe.filter((item) => item.category === "Shoes")
          const outerwear = userWardrobe.filter((item) => item.category === "Outerwear")
          const dresses = userWardrobe.filter((item) => item.category === "Dresses")

          // Decide if we're creating a dress outfit or a top+bottom outfit
          const useDress = dresses.length > 0 && Math.random() > 0.7

          let items = []

          if (useDress) {
            const randomDress = dresses[Math.floor(Math.random() * dresses.length)]
            items.push(randomDress)
          } else {
            const randomTop = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null
            const randomBottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null

            if (randomTop) items.push(randomTop)
            if (randomBottom) items.push(randomBottom)
          }

          // Add shoes if available
          const randomShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null
          if (randomShoes) items.push(randomShoes)

          // Randomly decide whether to include outerwear
          const includeOuterwear = Math.random() > 0.5 && outerwear.length > 0
          const randomOuterwear = includeOuterwear ? outerwear[Math.floor(Math.random() * outerwear.length)] : null
          if (randomOuterwear) items.push(randomOuterwear)

          // If we somehow have no items, add some random ones
          if (items.length === 0 && userWardrobe.length > 0) {
            const randomItems = userWardrobe.sort(() => 0.5 - Math.random()).slice(0, 3)
            items = randomItems
          }

          // Generate a random outfit name
          const occasions = ["Casual", "Work", "Formal", "Date Night", "Weekend"]
          const styles = ["Classic", "Modern", "Trendy", "Relaxed", "Elegant"]
          const randomOccasion = occasions[Math.floor(Math.random() * occasions.length)]
          const randomStyle = styles[Math.floor(Math.random() * styles.length)]

          return {
            id: Date.now() + index,
            name: `${randomStyle} ${randomOccasion} Look`,
            occasion: activeTab === "all" ? randomOccasion.toLowerCase() : activeTab,
            style: "balanced",
            season: "current",
            items: items,
            weather: "Suitable for current weather conditions",
            description: `A ${randomStyle.toLowerCase()} outfit perfect for ${randomOccasion.toLowerCase()} occasions.`,
            score: Math.floor(Math.random() * 5) + 1,
            isAIGenerated: false,
            isLocallyGenerated: true,
          }
        })
    },
    [activeTab, userWardrobe],
  )

  const generateMoreOutfits = async () => {
    setIsGenerating(true)
    setError(null)
    setWarning(null)

    try {
      // Determine which API endpoint to use
      let apiEndpoint = "/api/outfit-generator/simple"

      if (useOpenAI) {
        apiEndpoint = "/api/outfit-generator/openai"
      } else if (useGrok) {
        apiEndpoint = "/api/outfit-generator/grok"
      }

      // Set up request timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        // Call our API endpoint
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferences: {
              occasion: activeTab === "all" ? "casual" : activeTab,
              season: "current",
              style: "balanced",
              colorfulness: 50,
              useWeather: true,
              includeAccessories: true,
              weather: {
                temperature: 75,
                condition: "Sunny",
              },
            },
            wardrobe: sampleWardrobe,
            count: 4,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle non-200 responses
        if (!response.ok) {
          console.warn(`API returned status ${response.status}`)

          // For 500 errors, immediately use local generation
          if (response.status === 500) {
            console.log("Server error (500), using local generation...")
            const localOutfits = generateFallbackOutfits(4)
            setOutfits([...outfits, ...localOutfits])
            setWarning("Server error encountered. Using local generation instead.")
            return
          }

          // If we get a 429 (Too Many Requests) or 402 (Payment Required), try the fallback endpoint
          if (response.status === 429 || response.status === 402) {
            setWarning("API request failed. Using fallback algorithm.")

            try {
              // Try the fallback API endpoint
              const fallbackResponse = await fetch("/api/outfit-generator/simple", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  preferences: {
                    occasion: activeTab === "all" ? "casual" : activeTab,
                    season: "current",
                    style: "balanced",
                    colorfulness: 50,
                    useWeather: true,
                    includeAccessories: true,
                  },
                  wardrobe: sampleWardrobe,
                  count: 4,
                }),
              })

              if (!fallbackResponse.ok) {
                throw new Error(`Fallback API also failed: ${fallbackResponse.status}`)
              }

              const fallbackData = await fallbackResponse.json()

              if (fallbackData.outfits && Array.isArray(fallbackData.outfits) && fallbackData.outfits.length > 0) {
                setOutfits([...outfits, ...(fallbackData.outfits || [])])
                return
              } else {
                throw new Error("Fallback API returned invalid data")
              }
            } catch (fallbackError) {
              console.error("Fallback API error:", fallbackError)
              // If the fallback API also fails, use our local generator
              const localOutfits = generateFallbackOutfits(4)
              setOutfits([...outfits, ...localOutfits])
              return
            }
          }

          throw new Error(`Failed to generate outfits: ${response.status}`)
        }

        // Parse the response data
        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error("Error parsing response:", jsonError)
          // Use local generation if JSON parsing fails
          const localOutfits = generateFallbackOutfits(4)
          setOutfits([...outfits, ...localOutfits])
          setWarning("Error parsing server response. Using local generation instead.")
          return
        }

        // Check if there's an error message in the response
        if (data.error) {
          console.warn("API returned an error:", data.error)
          setWarning(data.error)

          // If outfits were provided despite the error, use them
          if (data.outfits && Array.isArray(data.outfits) && data.outfits.length > 0) {
            // Make sure each outfit has items with valid images
            const validatedOutfits = data.outfits.map((outfit) => ({
              ...outfit,
              id: outfit.id || Date.now() + Math.random(),
              items: Array.isArray(outfit.items)
                ? outfit.items.map((item) => ({
                    ...item,
                    id: item.id || Date.now() + Math.random(),
                    name: item.name || "Item",
                    image:
                      item.image ||
                      `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name?.substring(0, 10) || "Item")}`,
                  }))
                : [],
            }))
            setOutfits([...outfits, ...validatedOutfits])
          } else {
            // If no outfits were provided, use the local generator
            const localOutfits = generateFallbackOutfits(4)
            setOutfits([...outfits, ...localOutfits])
          }
        } else if (Array.isArray(data.outfits) && data.outfits.length > 0) {
          // Make sure each outfit has items with valid images
          const validatedOutfits = data.outfits.map((outfit) => ({
            ...outfit,
            id: outfit.id || Date.now() + Math.random(),
            items: Array.isArray(outfit.items)
              ? outfit.items.map((item) => ({
                  ...item,
                  id: item.id || Date.now() + Math.random(),
                  name: item.name || "Item",
                  // Use a reliable placeholder for missing images
                  image:
                    item.image ||
                    `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.name?.substring(0, 10) || "Item")}`,
                }))
              : [],
          }))
          setOutfits([...outfits, ...validatedOutfits])
        } else {
          // If no valid outfits were returned, use local generation
          const localOutfits = generateFallbackOutfits(4)
          setOutfits([...outfits, ...localOutfits])
          setWarning("No valid outfits returned from server. Using local generation instead.")
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)

        // Handle timeout errors specifically
        if (fetchError.name === "AbortError") {
          console.error("Request timed out")
          setWarning("Request timed out. Using fallback algorithm.")

          // Use local generator for timeout errors
          const localOutfits = generateFallbackOutfits(4)
          setOutfits([...outfits, ...localOutfits])
          return
        }

        // For other fetch errors, also use local generation
        console.error("Fetch error:", fetchError)
        const localOutfits = generateFallbackOutfits(4)
        setOutfits([...outfits, ...localOutfits])
        setWarning("Error connecting to server. Using local generation instead.")
      }
    } catch (error) {
      console.error("Error generating more outfits:", error)

      // Check if the error is related to quota
      const errorMessage = error.message || ""
      if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
        setError(`API quota exceeded. Using fallback algorithm.`)
      } else {
        setError(`Failed to generate outfits. ${errorMessage || "Using fallback algorithm."}`)
      }

      // Always use the local fallback generator as a last resort
      const localOutfits = generateFallbackOutfits(4)
      setOutfits([...outfits, ...localOutfits])

      // Show a toast notification
      toast({
        title: "Using fallback generator",
        description: "We couldn't connect to our AI service. Using local outfit generator instead.",
        variant: "default",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOutfitClick = (outfit: any) => {
    setSelectedOutfit(outfit)
    setShowDetailsModal(true)
  }

  const filteredOutfits = activeTab === "all" ? outfits : outfits.filter((outfit) => outfit.occasion === activeTab)

  // Animation variants for the outfit cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Get the appropriate icon based on active AI mode
  const getButtonIcon = () => {
    if (useOpenAI) {
      return <Brain className="mr-2 h-4 w-4" />
    } else if (useGrok) {
      return <Zap className="mr-2 h-4 w-4" />
    } else {
      return <Sparkles className="mr-2 h-4 w-4" />
    }
  }

  // Get button style based on active AI mode
  const getButtonStyle = () => {
    if (useOpenAI) {
      return "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
    } else if (useGrok) {
      return "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
    } else {
      return "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
    }
  }

  // Handle retry
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setError(null)
    setWarning(null)
    generateMoreOutfits()
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2">
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {warning && !error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-3">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("all")}
          className={
            activeTab === "all"
              ? useOpenAI
                ? "bg-green-500 hover:bg-green-600"
                : useGrok
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-500 hover:bg-pink-600"
              : ""
          }
        >
          All
        </Button>
        <Button
          variant={activeTab === "casual" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("casual")}
          className={
            activeTab === "casual"
              ? useOpenAI
                ? "bg-green-500 hover:bg-green-600"
                : useGrok
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-500 hover:bg-pink-600"
              : ""
          }
        >
          Casual
        </Button>
        <Button
          variant={activeTab === "work" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("work")}
          className={
            activeTab === "work"
              ? useOpenAI
                ? "bg-green-500 hover:bg-green-600"
                : useGrok
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-500 hover:bg-pink-600"
              : ""
          }
        >
          Work
        </Button>
        <Button
          variant={activeTab === "formal" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("formal")}
          className={
            activeTab === "formal"
              ? useOpenAI
                ? "bg-green-500 hover:bg-green-600"
                : useGrok
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-500 hover:bg-pink-600"
              : ""
          }
        >
          Formal
        </Button>
        <Button
          variant={activeTab === "date" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("date")}
          className={
            activeTab === "date"
              ? useOpenAI
                ? "bg-green-500 hover:bg-green-600"
                : useGrok
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-500 hover:bg-pink-600"
              : ""
          }
        >
          Date
        </Button>
        <Button
          variant={activeTab === "sport" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("sport")}
          className={
            activeTab === "sport"
              ? useOpenAI
                ? "bg-green-500 hover:bg-green-600"
                : useGrok
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-500 hover:bg-pink-600"
              : ""
          }
        >
          Sport
        </Button>
        <Button variant="outline" size="sm" className="ml-auto">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {isGeneratingState ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="h-16 bg-gray-200 flex items-center justify-between px-4">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-4 bg-gray-300 rounded w-16"></div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="aspect-square bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex justify-between pt-2">
                      <div className="flex gap-2">
                        {[1, 2].map((j) => (
                          <div key={j} className="h-8 bg-gray-200 rounded w-16"></div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {[1, 2].map((j) => (
                          <div key={j} className="h-8 bg-gray-200 rounded w-16"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOutfits.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredOutfits.map((outfit) => (
            <motion.div
              key={outfit.id || Math.random()}
              onClick={() => handleOutfitClick(outfit)}
              className="cursor-pointer"
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <OutfitCard
                outfit={outfit}
                isAIGenerated={useAI && (outfit.isAIGenerated || false)}
                isGrokGenerated={useGrok && (outfit.isGrokGenerated || false)}
                isOpenAIGenerated={useOpenAI && (outfit.isOpenAIGenerated || false)}
                userWardrobe={userWardrobe}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No outfits found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your preferences to see more outfit suggestions.</p>
          <Button onClick={generateMoreOutfits} className={getButtonStyle()}>
            {getButtonIcon()}
            Generate New Outfits
          </Button>
        </div>
      )}

      {filteredOutfits.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button onClick={generateMoreOutfits} disabled={isGeneratingState} className={getButtonStyle()}>
            {getButtonIcon()}
            Generate More Outfits
          </Button>
        </div>
      )}
    </div>
  )
}
